import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    children: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        primary: 'bg-primary text-primary-content hover:bg-primary-hover',
        secondary: 'bg-surface-muted text-base-content hover:bg-border',
        outline: 'border border-border bg-base hover:bg-surface-muted text-base-content',
        ghost: 'hover:bg-surface-muted hover:text-base-content text-surface-content',
    };

    const sizes = {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
}
