import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { X } from "lucide-react";

export function PortalLayout({ children, student, activeTab, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isMobile={false}
      />

      {/* Mobile / Tablet Slide-in Navigation Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-2xl z-50">
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Sidebar
              activeTab={activeTab}
              onSelectTab={onSelectTab}
              isMobile={true}
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0 w-full">
        <Header
          student={student}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        {/* Practical 3: Width & Max-width constrained main container */}
        <main className="flex-1 px-3 py-4 sm:px-6 sm:py-6 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
