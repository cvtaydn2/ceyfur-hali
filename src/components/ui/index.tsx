import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Premium Button Component
 * Follows 'Antigravity' design tokens
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10",
      secondary: "bg-primary-ocean text-white hover:bg-primary-ocean/90 shadow-xl shadow-primary-ocean/20",
      outline: "bg-transparent border border-slate-200 text-slate-900 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-50",
      danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs rounded-xl",
      md: "px-6 py-3 text-sm rounded-2xl",
      lg: "px-8 py-4 text-base rounded-2xl",
      xl: "px-10 py-5 text-lg rounded-[1.5rem]",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Standardized Input Component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300",
            "focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5",
            error && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/5 bg-rose-50/30",
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn("text-[10px] font-bold px-1", error ? "text-rose-500" : "text-slate-400")}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Premium Toast Notification
 */
interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, type = "success", isVisible, onClose }: ToastProps) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={cn(
            "fixed bottom-8 right-8 px-8 py-4 rounded-[2rem] shadow-2xl z-[100] flex items-center gap-3 border border-white/20 backdrop-blur-xl",
            type === "success" ? "bg-emerald-500 text-white" : 
            type === "error" ? "bg-rose-500 text-white" : "bg-slate-900 text-white"
          )}
        >
          {type === "success" && <CheckCircle2 size={20} />}
          {type === "error" && <AlertCircle size={20} />}
          <span className="font-bold text-sm tracking-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
