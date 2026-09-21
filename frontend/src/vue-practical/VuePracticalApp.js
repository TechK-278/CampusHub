import { ref, computed } from "vue/dist/vue.esm-bundler.js";

const INITIAL_COURSES = [
  { id: 1, code: "CS501", title: "Full Stack Web Development", credits: 4, faculty: "Prof. Sanjay Patel" },
  { id: 2, code: "CS502", title: "Database Management Systems", credits: 4, faculty: "Dr. Ananya Roy" },
  { id: 3, code: "CS503", title: "Computer Networks", credits: 4, faculty: "Prof. Vikram Joshi" },
  { id: 4, code: "CS504", title: "Operating Systems", credits: 3, faculty: "Dr. Neha Verma" },
  { id: 5, code: "CS505", title: "Design & Analysis of Algorithms", credits: 4, faculty: "Prof. Harish Nair" },
];

const INITIAL_TEXT_SAMPLES = {
  notice: "mid-semester laboratory practical examination schedule announced",
  mentor: "dr. rajesh sharma (department of computer science)",
  subject: "full stack web development — practical 7 vue.js directives",
  inputVal: "enter student enrollment or note to transform..."
};

export const VuePracticalApp = {
  setup() {
    // Tab Filter: 'all', 'uppercase', 'dynamic-list', 'date-format'
    const activeSection = ref("all");

    // --- DEMO 1: Uppercase on Click State ---
    const textSamples = ref({ ...INITIAL_TEXT_SAMPLES });
    const resetTextSamples = () => {
      textSamples.value = { ...INITIAL_TEXT_SAMPLES };
    };

    // --- DEMO 2: Dynamic List State ---
    const courses = ref([...INITIAL_COURSES]);
    const newCourseCode = ref("");
    const newCourseTitle = ref("");
    const newCredits = ref(4);
    const newFaculty = ref("Prof. Academic Member");
    const listError = ref("");

    const totalCredits = computed(() => {
      return courses.value.reduce((sum, item) => sum + Number(item.credits || 0), 0);
    });

    const addCourse = () => {
      if (!newCourseCode.value.trim()) {
        listError.value = "Course Code is required (e.g., CS506).";
        return;
      }
      if (!newCourseTitle.value.trim()) {
        listError.value = "Course Title is required.";
        return;
      }

      courses.value.push({
        id: Date.now(),
        code: newCourseCode.value.trim().toUpperCase(),
        title: newCourseTitle.value.trim(),
        credits: Number(newCredits.value) || 3,
        faculty: newFaculty.value.trim() || "Faculty Assigned"
      });

      // Clear inputs
      newCourseCode.value = "";
      newCourseTitle.value = "";
      listError.value = "";
    };

    const removeCourse = (id) => {
      courses.value = courses.value.filter((item) => item.id !== id);
    };

    const resetCourses = () => {
      courses.value = [...INITIAL_COURSES];
      listError.value = "";
    };

    // --- DEMO 3: Human-Readable Date State ---
    const selectedDate = ref("2026-09-25T14:30:00");
    const datePresets = [
      { label: "FSD Practical Evaluation", value: "2026-09-25T14:30:00" },
      { label: "Mid-Semester Examinations", value: "2026-10-05T09:30:00" },
      { label: "Project Milestone 1 Due", value: "2026-10-15T17:00:00" },
      { label: "Campus Tech Symposium", value: "2026-11-01T10:00:00" }
    ];

    return {
      activeSection,
      textSamples,
      resetTextSamples,
      courses,
      newCourseCode,
      newCourseTitle,
      newCredits,
      newFaculty,
      listError,
      totalCredits,
      addCourse,
      removeCourse,
      resetCourses,
      selectedDate,
      datePresets
    };
  },

  template: `
    <div class="space-y-6">
      
      <!-- Module Header Banner -->
      <div class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between shadow-2xs">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              Practical 7
            </span>
            <span class="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
              Vue.js v3.5 Directives
            </span>
            <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
              Isolated Vue in React Shell
            </span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Vue.js Custom Directives & Reactivity Module
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Practical 7 demonstrates Vue 3 custom directives (<code>v-uppercase-click</code>, <code>v-human-date</code>) and Vue reactive dynamic lists mounted cleanly within CampusHub's React application shell.
          </p>
        </div>

        <div class="shrink-0 pt-2 sm:pt-0">
          <div class="flex items-center gap-2 rounded-md bg-slate-50 border border-slate-200 p-2 text-xs text-slate-600">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-medium">Vue 3 Engine Active</span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          @click="activeSection = 'all'"
          :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', activeSection === 'all' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']"
        >
          All Demonstrations
        </button>
        <button
          @click="activeSection = 'uppercase'"
          :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', activeSection === 'uppercase' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']"
        >
          1. Uppercase on Click Directive
        </button>
        <button
          @click="activeSection = 'dynamic-list'"
          :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', activeSection === 'dynamic-list' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']"
        >
          2. Dynamic Course List
        </button>
        <button
          @click="activeSection = 'date-format'"
          :class="['rounded-md px-3 py-1.5 text-xs font-medium transition-colors', activeSection === 'date-format' ? 'bg-blue-600 text-white font-semibold shadow-2xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50']"
        >
          3. Human-Readable Date
        </button>
      </div>

      <!-- ============================================================
       * DEMONSTRATION 1: CUSTOM DIRECTIVE — UPPERCASE ON CLICK
       * ============================================================ -->
      <div v-if="activeSection === 'all' || activeSection === 'uppercase'" class="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div class="border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span class="rounded bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs font-mono">v-uppercase-click</span>
              1. Custom Directive — Uppercase on Click
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Click any sample element below to trigger the custom Vue directive handler and transform its text to uppercase.
            </p>
          </div>
          <button
            type="button"
            @click="resetTextSamples"
            class="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Reset Sample Text
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Sample 1: Notice Text -->
            <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Notice Heading</span>
                <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Click to convert</span>
              </div>
              <div
                v-uppercase-click
                class="rounded-md border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 transition-all hover:border-blue-300"
              >
                {{ textSamples.notice }}
              </div>
              <span class="text-[10px] text-slate-400 block">* Registered via Vue Directive hook: mounted(el, binding)</span>
            </div>

            <!-- Sample 2: Faculty / Subject Text -->
            <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Faculty & Subject</span>
                <span class="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Click to convert</span>
              </div>
              <div
                v-uppercase-click
                class="rounded-md border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 transition-all hover:border-blue-300"
              >
                {{ textSamples.mentor }}
              </div>
              <div
                v-uppercase-click
                class="rounded-md border border-slate-200 bg-white p-3 text-xs font-medium text-slate-900 transition-all hover:border-blue-300"
              >
                {{ textSamples.subject }}
              </div>
            </div>

            <!-- Sample 3: Form Input with v-uppercase-click -->
            <div class="col-span-1 md:col-span-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Interactive Input Field with Directive</span>
                <span class="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Input Tag Binding</span>
              </div>
              <input
                v-uppercase-click
                type="text"
                v-model="textSamples.inputVal"
                class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
              />
              <p class="text-[11px] text-slate-500">
                Click inside the input box to trigger <code>v-uppercase-click</code> on the input element.
              </p>
            </div>

          </div>

          <!-- Code Concept Card for Viva Evaluation -->
          <div class="rounded-md border border-slate-200 bg-slate-900 text-slate-200 p-3.5 font-mono text-xs overflow-x-auto">
            <span class="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Directive Implementation Architecture
            </span>
            <code>
app.directive('uppercase-click', {<br/>
&nbsp;&nbsp;mounted(el) {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;el.addEventListener('click', () => {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;el.innerText = el.innerText.toUpperCase();<br/>
&nbsp;&nbsp;&nbsp;&nbsp;});<br/>
&nbsp;&nbsp;}<br/>
});
            </code>
          </div>

        </div>
      </div>

      <!-- ============================================================
       * DEMONSTRATION 2: DYNAMIC ACADEMIC COURSE LIST
       * ============================================================ -->
      <div v-if="activeSection === 'all' || activeSection === 'dynamic-list'" class="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div class="border-b border-slate-100 p-4 sm:px-6 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span class="rounded bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-xs font-mono">v-for / Reactivity</span>
              2. Dynamic Academic Course Catalog
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              Demonstrates reactive list rendering (<code>v-for</code>), adding new courses, deleting entries, and computed credit counters.
            </p>
          </div>
          <button
            type="button"
            @click="resetCourses"
            class="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Reset Course List
          </button>
        </div>

        <div class="p-4 sm:p-6 space-y-6">
          
          <!-- Summary Metrics Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div class="rounded-md border border-slate-200 bg-slate-50 p-3">
              <span class="text-[11px] text-slate-500 font-medium">Enrolled Courses</span>
              <div class="mt-1 text-lg font-bold text-slate-900">{{ courses.length }} Courses</div>
            </div>
            <div class="rounded-md border border-slate-200 bg-slate-50 p-3">
              <span class="text-[11px] text-slate-500 font-medium">Total Semester Credits</span>
              <div class="mt-1 text-lg font-bold text-blue-700">{{ totalCredits }} Credits</div>
            </div>
            <div class="col-span-2 sm:col-span-1 rounded-md border border-slate-200 bg-slate-50 p-3">
              <span class="text-[11px] text-slate-500 font-medium">Reactivity Engine</span>
              <div class="mt-1 text-xs font-bold text-emerald-700 font-mono">Vue ref() & computed()</div>
            </div>
          </div>

          <!-- Add Course Form -->
          <form @submit.prevent="addCourse" class="rounded-lg border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div class="text-xs font-semibold text-slate-800">Add New Academic Course</div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Course Code *</label>
                <input
                  type="text"
                  v-model="newCourseCode"
                  placeholder="e.g., CS506"
                  class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div class="lg:col-span-2">
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Course Title *</label>
                <input
                  type="text"
                  v-model="newCourseTitle"
                  placeholder="e.g., Cloud Computing & DevOps"
                  class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label class="block text-[11px] font-medium text-slate-600 mb-1">Credits</label>
                <select
                  v-model="newCredits"
                  class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option :value="1">1 Credit</option>
                  <option :value="2">2 Credits</option>
                  <option :value="3">3 Credits</option>
                  <option :value="4">4 Credits</option>
                </select>
              </div>
            </div>

            <div v-if="listError" class="text-xs text-rose-600 font-medium">
              {{ listError }}
            </div>

            <div class="flex justify-end pt-1">
              <button
                type="submit"
                class="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors"
              >
                Add to Course Catalog
              </button>
            </div>
          </form>

          <!-- Render Course List -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Enrolled Course Records ({{ courses.length }})
            </div>

            <div v-if="courses.length === 0" class="rounded-lg border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
              No courses in catalog. Click "Reset Course List" or add a new course above.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(course, index) in courses"
                :key="course.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center font-mono shrink-0 border border-blue-100">
                    {{ course.code }}
                  </div>
                  <div>
                    <span class="text-xs font-semibold text-slate-900 block">{{ course.title }}</span>
                    <span class="text-[11px] text-slate-500">{{ course.faculty }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span class="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {{ course.credits }} Credits
                  </span>
                  <button
                    type="button"
                    @click="removeCourse(course.id)"
                    class="rounded px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                    title="Remove from list"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ============================================================
       * DEMONSTRATION 3: HUMAN-READABLE DATE DIRECTIVE
       * ============================================================ -->
      <div v-if="activeSection === 'all' || activeSection === 'date-format'" class="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div class="border-b border-slate-100 p-4 sm:px-6">
          <h2 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span class="rounded bg-purple-100 text-purple-700 px-1.5 py-0.5 text-xs font-mono">v-human-date</span>
            3. Human-Readable Date Custom Directive
          </h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Demonstrates formatting raw ISO timestamp strings into localized, human-friendly academic dates using Vue custom directives with modifiers.
          </p>
        </div>

        <div class="p-4 sm:p-6 space-y-6">
          
          <!-- Date Selector / Presets -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-3">
              <span class="text-xs font-semibold text-slate-800 block">Select Academic Milestone Date</span>
              
              <div class="space-y-1">
                <label class="text-[11px] font-medium text-slate-600">Custom ISO Date & Time Picker</label>
                <input
                  type="datetime-local"
                  v-model="selectedDate"
                  class="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div class="space-y-1 pt-1">
                <span class="text-[11px] font-medium text-slate-600 block">Quick Presets:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="preset in datePresets"
                    :key="preset.value"
                    type="button"
                    @click="selectedDate = preset.value"
                    class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {{ preset.label }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Formatted Output Comparison Card -->
            <div class="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
              <span class="text-xs font-semibold text-slate-800 block">Directive Formatting Output</span>
              
              <div class="space-y-2 text-xs">
                <div class="rounded bg-slate-50 p-2.5 border border-slate-200">
                  <span class="text-[10px] font-mono text-slate-400 block uppercase">Raw ISO Timestamp:</span>
                  <code class="text-xs font-mono font-semibold text-slate-800">{{ selectedDate }}</code>
                </div>

                <div class="rounded bg-purple-50/70 p-2.5 border border-purple-200">
                  <span class="text-[10px] font-mono text-purple-700 block uppercase">v-human-date (Full Format):</span>
                  <span v-human-date="selectedDate" class="text-sm font-bold text-purple-900"></span>
                </div>

                <div class="rounded bg-blue-50/70 p-2.5 border border-blue-200">
                  <span class="text-[10px] font-mono text-blue-700 block uppercase">v-human-date.short (Short Format):</span>
                  <span v-human-date.short="selectedDate" class="text-xs font-semibold text-blue-900"></span>
                </div>
              </div>
            </div>

          </div>

          <!-- Directive Implementation Reference -->
          <div class="rounded-md border border-slate-200 bg-slate-900 text-slate-200 p-3.5 font-mono text-xs overflow-x-auto">
            <span class="text-[10px] font-sans font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              v-human-date Directive Code Pattern
            </span>
            <code>
app.directive('human-date', {<br/>
&nbsp;&nbsp;mounted(el, binding) {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;const isShort = binding.modifiers.short;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;el.innerText = new Intl.DateTimeFormat('en-IN', {<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;day: 'numeric',<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;month: isShort ? 'short' : 'long',<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;year: 'numeric',<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hour: '2-digit',<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;minute: '2-digit'<br/>
&nbsp;&nbsp;&nbsp;&nbsp;}).format(new Date(binding.value));<br/>
&nbsp;&nbsp;}<br/>
});
            </code>
          </div>

        </div>
      </div>

    </div>
  `
};
