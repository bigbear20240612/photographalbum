import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-warm-gray mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 text-base text-charcoal bg-white',
            'border-[1.5px] border-border-light rounded-lg',
            'placeholder:text-disabled-gray',
            'focus:outline-none focus:border-terra-cotta focus:ring-3 focus:ring-terra-cotta/10',
            'disabled:bg-warm-beige disabled:text-disabled-gray disabled:cursor-not-allowed',
            'transition-all duration-300',
            error && 'border-[#D4573C] focus:border-[#D4573C] focus:ring-[#D4573C]/10',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-light-gray">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-[#D4573C]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-warm-gray mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 text-base text-charcoal bg-white',
            'border-[1.5px] border-border-light rounded-lg',
            'placeholder:text-disabled-gray',
            'focus:outline-none focus:border-terra-cotta focus:ring-3 focus:ring-terra-cotta/10',
            'disabled:bg-warm-beige disabled:text-disabled-gray disabled:cursor-not-allowed',
            'transition-all duration-300',
            'resize-vertical',
            'leading-relaxed',
            error && 'border-[#D4573C] focus:border-[#D4573C] focus:ring-[#D4573C]/10',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="mt-1 text-xs text-light-gray">{helperText}</p>
        )}
        {error && (
          <p className="mt-1 text-xs text-[#D4573C]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
