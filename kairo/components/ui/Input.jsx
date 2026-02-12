'use client';

import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  placeholder,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            // Base styles
            "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm transition-all duration-200 placeholder:text-slate-400",
            
            // Focus styles
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
            
            // Error styles
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            
            className
          )}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-slate-400" />
            ) : (
              <Eye className="h-4 w-4 text-slate-400" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };