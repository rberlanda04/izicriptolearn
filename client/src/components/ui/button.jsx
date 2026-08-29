import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold font-[var(--font-display)] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-ink hover:bg-accent/90',
        outline: 'border border-border-soft text-text-strong hover:border-accent hover:text-accent-deep',
        ghost: 'text-muted hover:text-text-strong',
        danger: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-7 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
);

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
