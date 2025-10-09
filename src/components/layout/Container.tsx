import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'max-w-[1440px] mx-auto',
        'px-4 sm:px-6 md:px-8 lg:px-12',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
