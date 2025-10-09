import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'medium', className, children, ...props }, ref) => {
    const baseStyles = 'btn focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: `
        bg-gradient-to-br from-terra-cotta to-amber-gold
        text-white border border-white/30
        shadow-brand
        hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(212,119,60,0.4)]
        active:translate-y-0 active:shadow-brand
        backdrop-blur-lg
      `,
      secondary: `
        bg-soft-white/90 text-earth-brown
        border-[1.5px] border-border-light
        shadow-glass-sm backdrop-blur-lg
        hover:bg-warm-beige hover:border-terra-cotta hover:text-terra-cotta hover:shadow-glass-md
      `,
      text: `
        bg-transparent text-terra-cotta
        border-none
        hover:bg-terra-cotta/8 hover:text-amber-gold
      `,
      danger: `
        bg-gradient-to-br from-[#D4573C] to-sunset-orange
        text-white border border-white/30
        shadow-[0_4px_12px_rgba(212,87,60,0.3)]
        hover:translate-y-[-2px] hover:shadow-[0_6px_16px_rgba(212,87,60,0.4)]
        active:translate-y-0
      `,
    };

    const sizes = {
      small: 'px-4 py-2 text-sm rounded-lg',
      medium: 'px-6 py-3 text-base rounded-xl',
      large: 'px-8 py-4 text-lg rounded-[14px]',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
