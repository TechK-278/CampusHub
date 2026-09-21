import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { X } from "lucide-react";

export function PortalLayout({ children, student, activeTab, onSelectTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        isMobile={false}
      />

      {/* Mobile / Tablet Drawer Backdrop & Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white shadow-xl">
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800"
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
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          student={student}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
