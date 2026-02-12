'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  className, 
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-slate-200 shadow-card hover:shadow-card-hover",
    glass: "bg-glass-white backdrop-blur-md border border-white/20 shadow-glass",
    gradient: "bg-gradient-to-br from-white via-primary-50 to-slate-50 border border-slate-200 shadow-card",
    elevated: "bg-white border-0 shadow-lg hover:shadow-xl",
  };

  return (
    <div
      className={cn(
        // Base styles
        "rounded-xl transition-all duration-300",
        
        // Variant styles
        variants[variant],
        
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-slate-900", className)}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-600", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };