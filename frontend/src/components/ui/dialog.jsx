import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      {/* Dialog Body */}
      <div className="relative z-50 w-full max-w-lg p-4 mx-4">
        {children}
      </div>
    </div>
  );
}

function DialogContent({ className, children, onClose }) {
  return (
    <div
      className={cn(
        "relative rounded-lg border border-slate-200 bg-white p-6 shadow-xl text-slate-900 transition-all",
        className
      )}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 text-left border-b border-slate-100 pb-4 mb-4", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h3
      className={cn("text-base font-semibold leading-none tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs text-slate-500", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-end space-x-2 border-t border-slate-100 pt-4 mt-6", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
