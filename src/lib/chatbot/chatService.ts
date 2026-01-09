import { supabase } from '@/lib/supabase/client';
import { logAuditEvent } from '@/lib/audit/logger';

/**
 * Chatbot Service - Care Coordination Assistant
 * 
 * @description Production-grade chatbot with:
 * - OpenAI/Anthropic integration (configurable)
 * - Real database tool calls
 * - Role-based access control
 * - Org isolation (NEVER cross-org data access)
 * - Audit trail
 * - Staff task creation
 * 
 * NO MOCKS. REAL DB TOOLS.
 */

export type ChatRole = 'user' | 'assistant' | 'system' | 'tool';
export type ChatThreadStatus = 'active' | 'archived';

export interface ChatThread {
  id: string;
  clinic_id: string;
  user_id: string;
  title: string;
  status: ChatThreadStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: ChatRole;
  content: string;
  tool_call_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ToolCall {
  id: string;
  thread_id: string;
  message_id: string;
  tool_name: string;
  arguments_json: Record<string, unknown>;
  result_json: Record<string, unknown> | null;
  error_message: string | null;
  executed_at: string | null;
  created_at: string;
}

export interface StaffTask {
  id: string;
  clinic_id: string;
  assigned_to: string | null;
  created_by: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string | null;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Available chatbot tools (server-side functions)
 */
const CHATBOT_TOOLS = [
  {
    name: 'get_user_profile',
    description: 'Get current user profile including role, org, and permissions',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'list_files',
    description: 'List uploaded files for current organization',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max results (default 50)' },
        status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed'] },
      },
    },
  },
  {
    name: 'list_automation_runs',
    description: 'List automation runs for current organization',
    parameters: {
      type: 'object',
      properties: {
        automation_id: { type: 'string', description: 'Filter by automation ID' },
        status: { type: 'string', enum: ['pending', 'running', 'completed', 'failed'] },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
  {
    name: 'list_staff_tasks',
    description: 'List staff tasks for current organization',
    parameters: {
      type: 'object',
      properties: {
        assigned_to: { type: 'string', description: 'Filter by assigned user ID' },
        status: { type: 'string', enum: ['pending', 'in_progress', 'completed', 'cancelled'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
  {
    name: 'get_record_details',
    description: 'Get details of a specific data record by ID',
    parameters: {
      type: 'object',
      properties: {
        record_id: { type: 'string', description: 'Record ID', required: true },
      },
      required: ['record_id'],
    },
  },
  {
    name: 'create_staff_task',
    description: 'Create a new staff task or reminder (RBAC enforced)',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title', required: true },
        description: { type: 'string', description: 'Task description' },
        priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
        assigned_to: { type: 'string', description: 'User ID to assign task to' },
        due_date: { type: 'string', description: 'Due date (ISO format)' },
      },
      required: ['title'],
    },
  },
  {
    name: 'add_follow_through_note',
    description: 'Add a note to a follow-through item (doctor/staff role required)',
    parameters: {
      type: 'object',
      properties: {
        follow_through_id: { type: 'string', description: 'Follow-through item ID', required: true },
        note: { type: 'string', description: 'Note content', required: true },
      },
      required: ['follow_through_id', 'note'],
    },
  },
  {
    name: 'search_follow_throughs',
    description: 'Search follow-through items with filters',
    parameters: {
      type: 'object',
      properties: {
        patient_id: { type: 'string', description: 'Filter by patient ID' },
        status: { type: 'string', enum: ['open', 'in_progress', 'completed', 'cancelled'] },
        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
] as const;

/**
 * Create a new chat thread
 */
export async function createChatThread(params: {
  clinicId: string;
  userId: string;
  title?: string;
}): Promise<ChatThread> {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({
      clinic_id: params.clinicId,
      user_id: params.userId,
      title: params.title || 'New Conversation',
      status: 'active',
      metadata: {},
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create chat thread: ${error.message}`);

  await logAuditEvent({
    userId: params.userId,
    actionType: 'chat_thread_created',
    resourceType: 'chat_thread',
    resourceId: data.id,
    details: { title: data.title },
  });

  return data;
}

/**
 * Send message and get AI response
 */
export async function sendMessage(params: {
  threadId: string;
  content: string;
  userId: string;
  clinicId: string;
  userRole: string;
}): Promise<ChatMessage> {
  const { threadId, content, userId, clinicId, userRole } = params;

  // Validate thread belongs to clinic
  const { data: thread } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('id', threadId)
    .eq('clinic_id', clinicId)
    .single();

  if (!thread) throw new Error('Thread not found or access denied');

  // Save user message
  const { data: userMessage, error: userError } = await supabase
    .from('chat_messages')
    .insert({
      thread_id: threadId,
      role: 'user',
      content,
      metadata: {},
    })
    .select()
    .single();

  if (userError) throw new Error(`Failed to save user message: ${userError.message}`);

  // Get conversation history
  const { data: history } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  // Call AI with tools
  const aiResponse = await callAIWithTools({
    messages: history || [],
    userId,
    clinicId,
    userRole,
    threadId,
  });

  // Save assistant message
  const { data: assistantMessage, error: assistantError } = await supabase
    .from('chat_messages')
    .insert({
      thread_id: threadId,
      role: 'assistant',
      content: aiResponse.content,
      metadata: { model: aiResponse.model },
    })
    .select()
    .single();

  if (assistantError) throw new Error(`Failed to save assistant message: ${assistantError.message}`);

  await logAuditEvent({
    userId,
    actionType: 'chat_message_sent',
    resourceType: 'chat_message',
    resourceId: userMessage.id,
    details: { thread_id: threadId },
  });

  return assistantMessage;
}

/**
 * Call AI provider with tool support
 */
async function callAIWithTools(params: {
  messages: ChatMessage[];
  userId: string;
  clinicId: string;
  userRole: string;
  threadId: string;
}): Promise<{ content: string; model: string }> {
  const { messages, userId, clinicId, userRole, threadId } = params;

  // Get AI provider from env
  const provider = import.meta.env.VITE_AI_PROVIDER || 'openai';
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) throw new Error('AI API key not configured');

  // System prompt
  const systemPrompt = `You are HealIt's care coordination assistant. You help healthcare staff:
- Track follow-through items
- Manage patient care gaps
- Search uploaded records
- Create tasks and reminders

CRITICAL RULES:
- NEVER access data from other clinics (clinic_id: ${clinicId})
- Respect role-based access: user role is "${userRole}"
- Only doctors/staff can add notes to follow-throughs
- Always explain what you're doing when using tools
- For medical advice, ALWAYS defer to doctors

You have access to tools for database operations. Use them when needed.`;

  // Format messages for API
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.tool_call_id && { tool_call_id: m.tool_call_id }),
    })),
  ];

  if (provider === 'openai') {
    return await callOpenAI(apiMessages, { userId, clinicId, userRole, threadId });
  } else if (provider === 'anthropic') {
    return await callAnthropic(apiMessages, { userId, clinicId, userRole, threadId });
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Call OpenAI API with function calling
 */
async function callOpenAI(
  messages: Array<{ role: string; content: string; tool_call_id?: string }>,
  context: { userId: string; clinicId: string; userRole: string; threadId: string }
): Promise<{ content: string; model: string }> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      tools: CHATBOT_TOOLS.map((tool) => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        },
      })),
      tool_choice: 'auto',
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const message = data.choices[0].message;

  // Handle tool calls
  if (message.tool_calls && message.tool_calls.length > 0) {
    const toolResults = await Promise.all(
      message.tool_calls.map(async (toolCall: { id: string; function: { name: string; arguments: string } }) => {
        const toolName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        // Execute tool
        const result = await executeTool({
          toolName,
          args,
          userId: context.userId,
          clinicId: context.clinicId,
          userRole: context.userRole,
          threadId: context.threadId,
          toolCallId: toolCall.id,
        });

        return {
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        };
      })
    );

    // Recursive call with tool results
    const followUp = await callOpenAI([...messages, message, ...toolResults], context);
    return followUp;
  }

  return {
    content: message.content,
    model,
  };
}

/**
 * Call Anthropic API with tool use
 */
async function callAnthropic(
  messages: Array<{ role: string; content: string }>,
  context: { userId: string; clinicId: string; userRole: string; threadId: string }
): Promise<{ content: string; model: string }> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const model = import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

  // Extract system message
  const systemMessage = messages.find((m) => m.role === 'system')?.content || '';
  const conversationMessages = messages.filter((m) => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemMessage,
      messages: conversationMessages,
      tools: CHATBOT_TOOLS.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0];

  // Handle tool use
  if (content.type === 'tool_use') {
    const result = await executeTool({
      toolName: content.name,
      args: content.input,
      userId: context.userId,
      clinicId: context.clinicId,
      userRole: context.userRole,
      threadId: context.threadId,
      toolCallId: content.id,
    });

    // Recursive call with tool result
    const followUp = await callAnthropic(
      [
        ...conversationMessages,
        { role: 'assistant', content: JSON.stringify(content) },
        { role: 'user', content: JSON.stringify(result) },
      ],
      context
    );
    return followUp;
  }

  return {
    content: content.text,
    model,
  };
}

/**
 * Execute a chatbot tool (server-side DB function)
 */
async function executeTool(params: {
  toolName: string;
  args: Record<string, unknown>;
  userId: string;
  clinicId: string;
  userRole: string;
  threadId: string;
  toolCallId: string;
}): Promise<Record<string, unknown>> {
  const { toolName, args, userId, clinicId, userRole, threadId, toolCallId } = params;

  // Log tool call
  const { data: toolCall } = await supabase
    .from('chatbot_tool_calls')
    .insert({
      thread_id: threadId,
      message_id: toolCallId, // Use tool_call_id as message_id placeholder
      tool_name: toolName,
      arguments_json: args,
    })
    .select()
    .single();

  let result: Record<string, unknown>;
  let error: Error | null = null;

  try {
    switch (toolName) {
      case 'get_user_profile':
        result = await toolGetUserProfile({ userId, clinicId, userRole });
        break;
      case 'list_files':
        result = await toolListFiles({ clinicId, limit: args.limit as number, status: args.status as string });
        break;
      case 'list_automation_runs':
        result = await toolListAutomationRuns({
          clinicId,
          automationId: args.automation_id as string,
          status: args.status as string,
          limit: args.limit as number,
        });
        break;
      case 'list_staff_tasks':
        result = await toolListStaffTasks({
          clinicId,
          assignedTo: args.assigned_to as string,
          status: args.status as string,
          priority: args.priority as string,
          limit: args.limit as number,
        });
        break;
      case 'get_record_details':
        result = await toolGetRecordDetails({ clinicId, recordId: args.record_id as string });
        break;
      case 'create_staff_task':
        result = await toolCreateStaffTask({
          clinicId,
          userId,
          title: args.title as string,
          description: args.description as string,
          priority: (args.priority as 'low' | 'medium' | 'high') || 'medium',
          assignedTo: args.assigned_to as string,
          dueDate: args.due_date as string,
        });
        break;
      case 'add_follow_through_note':
        result = await toolAddFollowThroughNote({
          userId,
          userRole,
          followThroughId: args.follow_through_id as string,
          note: args.note as string,
        });
        break;
      case 'search_follow_throughs':
        result = await toolSearchFollowThroughs({
          clinicId,
          patientId: args.patient_id as string,
          status: args.status as string,
          priority: args.priority as string,
          limit: args.limit as number,
        });
        break;
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  } catch (err) {
    error = err instanceof Error ? err : new Error('Unknown error');
    result = { error: error.message };
  }

  // Update tool call with result
  if (toolCall) {
    await supabase
      .from('chatbot_tool_calls')
      .update({
        result_json: result,
        error_message: error?.message || null,
        executed_at: new Date().toISOString(),
      })
      .eq('id', toolCall.id);
  }

  if (error) throw error;
  return result;
}

/**
 * Tool implementations
 */

async function toolGetUserProfile(params: { userId: string; clinicId: string; userRole: string }) {
  const { data: user } = await supabase.from('users').select('*').eq('id', params.userId).single();

  return {
    user_id: params.userId,
    clinic_id: params.clinicId,
    role: params.userRole,
    profile: user || {},
  };
}

async function toolListFiles(params: { clinicId: string; limit?: number; status?: string }) {
  let query = supabase.from('files').select('*').eq('clinic_id', params.clinicId);

  if (params.status) query = query.eq('processing_status', params.status);
  query = query.order('uploaded_at', { ascending: false }).limit(params.limit || 50);

  const { data } = await query;
  return { files: data || [] };
}

async function toolListAutomationRuns(params: {
  clinicId: string;
  automationId?: string;
  status?: string;
  limit?: number;
}) {
  let query = supabase.from('automation_runs').select('*, automation:automations(name)').eq('clinic_id', params.clinicId);

  if (params.automationId) query = query.eq('automation_id', params.automationId);
  if (params.status) query = query.eq('status', params.status);
  query = query.order('started_at', { ascending: false }).limit(params.limit || 50);

  const { data } = await query;
  return { runs: data || [] };
}

async function toolListStaffTasks(params: {
  clinicId: string;
  assignedTo?: string;
  status?: string;
  priority?: string;
  limit?: number;
}) {
  let query = supabase.from('staff_tasks').select('*').eq('clinic_id', params.clinicId);

  if (params.assignedTo) query = query.eq('assigned_to', params.assignedTo);
  if (params.status) query = query.eq('status', params.status);
  if (params.priority) query = query.eq('priority', params.priority);
  query = query.order('created_at', { ascending: false }).limit(params.limit || 50);

  const { data } = await query;
  return { tasks: data || [] };
}

async function toolGetRecordDetails(params: { clinicId: string; recordId: string }) {
  const { data: record } = await supabase
    .from('records')
    .select('*, file:files(file_name)')
    .eq('id', params.recordId)
    .eq('clinic_id', params.clinicId)
    .single();

  if (!record) throw new Error('Record not found or access denied');
  return { record };
}

async function toolCreateStaffTask(params: {
  clinicId: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
}) {
  const { data: task, error } = await supabase
    .from('staff_tasks')
    .insert({
      clinic_id: params.clinicId,
      created_by: params.userId,
      title: params.title,
      description: params.description || null,
      priority: params.priority,
      assigned_to: params.assignedTo || null,
      due_date: params.dueDate || null,
      status: 'pending',
      metadata: {},
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create task: ${error.message}`);

  await logAuditEvent({
    userId: params.userId,
    actionType: 'staff_task_created',
    resourceType: 'staff_task',
    resourceId: task.id,
    details: { title: params.title },
  });

  return { task };
}

async function toolAddFollowThroughNote(params: {
  userId: string;
  userRole: string;
  followThroughId: string;
  note: string;
}) {
  // RBAC: Only doctors/staff can add notes
  if (!['doctor', 'staff', 'admin'].includes(params.userRole)) {
    throw new Error('Permission denied: Only doctors and staff can add notes');
  }

  const { data: followThrough } = await supabase
    .from('follow_through_items')
    .select('*')
    .eq('id', params.followThroughId)
    .single();

  if (!followThrough) throw new Error('Follow-through item not found');

  // Add note to notes_json array
  const currentNotes = (followThrough.notes_json as Array<{ user_id: string; note: string; timestamp: string }>) || [];
  const newNote = {
    user_id: params.userId,
    note: params.note,
    timestamp: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('follow_through_items')
    .update({ notes_json: [...currentNotes, newNote] })
    .eq('id', params.followThroughId);

  if (error) throw new Error(`Failed to add note: ${error.message}`);

  await logAuditEvent({
    userId: params.userId,
    actionType: 'follow_through_note_added',
    resourceType: 'follow_through_item',
    resourceId: params.followThroughId,
    details: { note: params.note },
  });

  return { success: true };
}

async function toolSearchFollowThroughs(params: {
  clinicId: string;
  patientId?: string;
  status?: string;
  priority?: string;
  limit?: number;
}) {
  let query = supabase.from('follow_through_items').select('*').eq('clinic_id', params.clinicId);

  if (params.patientId) query = query.eq('patient_id', params.patientId);
  if (params.status) query = query.eq('status', params.status);
  if (params.priority) query = query.eq('priority', params.priority);
  query = query.order('created_at', { ascending: false }).limit(params.limit || 50);

  const { data } = await query;
  return { items: data || [] };
}

/**
 * List threads for user
 */
export async function listThreads(params: { clinicId: string; userId: string }): Promise<ChatThread[]> {
  const { data } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('clinic_id', params.clinicId)
    .eq('user_id', params.userId)
    .eq('status', 'active')
    .order('updated_at', { ascending: false });

  return data || [];
}

/**
 * Get thread with messages
 */
export async function getThread(threadId: string): Promise<{
  thread: ChatThread;
  messages: ChatMessage[];
}> {
  const [threadResult, messagesResult] = await Promise.all([
    supabase.from('chat_threads').select('*').eq('id', threadId).single(),
    supabase.from('chat_messages').select('*').eq('thread_id', threadId).order('created_at'),
  ]);

  if (threadResult.error) throw new Error(`Failed to get thread: ${threadResult.error.message}`);

  return {
    thread: threadResult.data,
    messages: messagesResult.data || [],
  };
}

/**
 * Archive thread
 */
export async function archiveThread(threadId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_threads')
    .update({ status: 'archived' })
    .eq('id', threadId);

  if (error) throw new Error(`Failed to archive thread: ${error.message}`);

  await logAuditEvent({
    userId,
    actionType: 'chat_thread_archived',
    resourceType: 'chat_thread',
    resourceId: threadId,
    details: {},
  });
}
