import React, { useEffect, useRef } from "react";
import { createApp } from "vue/dist/vue.esm-bundler.js";
import { LibraryApp } from "@/vue-practical/LibraryApp";
import { debounceDirective } from "@/vue-practical/directives/debounce";
import { clickOutsideDirective } from "@/vue-practical/directives/clickOutside";
import { focusDirective } from "@/vue-practical/directives/focus";
import { tooltipDirective } from "@/vue-practical/directives/tooltip";
import { permissionDirective } from "@/vue-practical/directives/permission";

/**
 * LibraryPage — React Container for Practical 7 (Vue.js Custom Directives)
 *
 * Mounts the isolated Vue 3 Library application into a DOM ref using createApp()
 * and registers all custom directives. Clean unmount on navigation.
 */
export function LibraryPage() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize isolated Vue 3 Application
    const app = createApp(LibraryApp);

    // Register custom directives (Practical 7)
    app.directive("debounce", debounceDirective);
    app.directive("click-outside", clickOutsideDirective);
    app.directive("focus", focusDirective);
    app.directive("tooltip", tooltipDirective);
    app.directive("permission", permissionDirective);

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
