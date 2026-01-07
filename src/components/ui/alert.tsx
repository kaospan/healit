import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Alert Component - For displaying important messages
 * Used in emergency situations and critical notifications
 */

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'emergency';
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        {
          'bg-background text-foreground': variant === 'default',
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive':
            variant === 'destructive',
          'border-yellow-500/50 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400':
            variant === 'warning',
          'border-green-500/50 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-400':
            variant === 'success',
          'border-red-600 bg-red-50 text-red-900 dark:bg-red-900/30 dark:text-red-200 font-semibold':
            variant === 'emergency',
        },
        className
      )}
      {...props}
    />
  )
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
