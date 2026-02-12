'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    primary: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    outline: "border border-slate-300 text-slate-600 hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-1 text-xs", 
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full font-medium transition-colors",
        
        // Variant styles
        variants[variant],
        
        // Size styles
        sizes[size],
        
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge };