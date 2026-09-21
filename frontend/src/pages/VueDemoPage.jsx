import React, { useEffect, useRef } from "react";
import { createApp } from "vue/dist/vue.esm-bundler.js";
import { VuePracticalApp } from "@/vue-practical/VuePracticalApp";
import { uppercaseClickDirective } from "@/vue-practical/directives/uppercaseClick";
import { humanDateDirective } from "@/vue-practical/directives/humanDate";

/**
 * VueDemoPage — React Container for Practical 7 (Vue.js Custom Directives)
 * 
 * Mounts the isolated Vue 3 application into a DOM ref using createApp()
 * and guarantees clean unmounting when navigating between CampusHub portal tabs.
 */
export function VueDemoPage() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize isolated Vue 3 Application
    const app = createApp(VuePracticalApp);

    // Register Vue 3 Custom Directives (Practical 7)
    app.directive("uppercase-click", uppercaseClickDirective);
    app.directive("human-date", humanDateDirective);

    // Mount to React container DOM node
    app.mount(mountRef.current);

    // Cleanup on unmount (zero memory leaks, strict framework isolation)
    return () => {
      app.unmount();
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={mountRef} />
    </div>
  );
}
