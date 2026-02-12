'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  isLoading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-md hover:shadow-lg",
    secondary: "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 hover:text-slate-900",
    outline: "bg-transparent hover:bg-slate-50 active:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300",
    accent: "bg-accent-purple hover:bg-purple-600 active:bg-purple-700 text-white shadow-md hover:shadow-lg",
    success: "bg-accent-emerald hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-md hover:shadow-lg",
    danger: "bg-accent-rose hover:bg-red-600 active:bg-red-700 text-white shadow-md hover:shadow-lg",
    glass: "bg-glass-white backdrop-blur-sm hover:bg-white/90 text-slate-700 border border-white/20 shadow-glass hover:shadow-md",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm font-medium",
    default: "h-10 px-4 text-sm font-medium", 
    lg: "h-12 px-6 text-base font-medium",
    xl: "h-14 px-8 text-lg font-semibold",
    icon: "h-10 w-10 p-0",
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        
        // Variant styles
        variantClass,
        
        // Size styles
        sizeClass,
        
        // Loading state
        isLoading && "cursor-wait",
        
        className
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };