import { ref, computed, onMounted } from "vue/dist/vue.esm-bundler.js";

/**
 * LibraryApp — Vue 3 Library Catalogue & Book Requests
 * Practical 7: Vue Custom Directives
 *
 * Mounted inside a React container via createApp().
 * Uses Tailwind classes for styling consistency with the portal.
 *
 * Custom directives used:
 *   v-debounce  — search input
 *   v-click-outside — filter dropdown, detail drawer
 *   v-focus — search input autofocus
 *   v-tooltip — availability badges
 *   v-permission — librarian-only actions
 */

const CATEGORIES = ["all", "Computer Science", "Electronics", "Mathematics", "Mechanical"];

export const LibraryApp = {
  setup() {
    // ── State ──
    const books = ref([]);
    const requests = ref([]);
    const loading = ref(true);
    const error = ref("");

    const searchQuery = ref("");
    const categoryFilter = ref("all");
    const showAvailableOnly = ref(false);
    const showFilterDropdown = ref(false);

    const selectedBook = ref(null);
    const showDetailDrawer = ref(false);

    const activeTab = ref("catalogue"); // "catalogue" | "my-requests"
    const requestSubmitting = ref(false);
    const requestSuccess = ref("");

    // ── Fetch data ──
    const fetchBooks = async () => {
      loading.value = true;
      error.value = "";
      try {
        const params = new URLSearchParams();
        if (searchQuery.value) params.append("search", searchQuery.value);
        if (categoryFilter.value !== "all") params.append("category", categoryFilter.value);
        if (showAvailableOnly.value) params.append("available", "true");
        const url = params.toString() ? `/api/library/books?${params}` : "/api/library/books";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) books.value = data.books || [];
        else error.value = data.message || "Failed to load books";
      } catch (e) {
        error.value = "Could not connect to library API.";
      } finally {
        loading.value = false;
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/library/requests");
        const data = await res.json();
        if (data.success) requests.value = data.requests || [];
      } catch {
        // Non-blocking
      }
    };

    onMounted(() => {
      fetchBooks();
      fetchRequests();
    });

    // ── Search (via v-debounce) ──
    const handleSearch = (val) => {
      searchQuery.value = val;
      fetchBooks();
    };

    // ── Filters ──
    const setCategory = (cat) => {
      categoryFilter.value = cat;
      showFilterDropdown.value = false;
      fetchBooks();
    };

    const toggleAvailable = () => {
      showAvailableOnly.value = !showAvailableOnly.value;
      fetchBooks();
    };

    const closeFilterDropdown = () => {
      showFilterDropdown.value = false;
    };

    // ── Book detail ──
    const openDetail = (book) => {
      selectedBook.value = book;
      showDetailDrawer.value = true;
    };

    const closeDetail = () => {
      showDetailDrawer.value = false;
      selectedBook.value = null;
    };

    // ── Request book ──
    const requestBook = async (book) => {
      requestSubmitting.value = true;
      requestSuccess.value = "";
      try {
        const res = await fetch("/api/library/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: book.id,
            bookTitle: book.title,
            studentId: "CS2026001",
            studentName: "Aarav Mehta",
          }),
        });
        const data = await res.json();
        if (data.success) {
          requestSuccess.value = `Request submitted for "${book.title}"`;
          fetchRequests();
          setTimeout(() => { requestSuccess.value = ""; }, 3000);
        }
      } catch {
        // handled
      } finally {
        requestSubmitting.value = false;
      }
    };

    // ── Computed ──
    const myRequests = computed(() => {
      return requests.value.filter((r) => r.studentId === "CS2026001");
    });

    const availabilityTooltip = (book) => {
      if (book.availableCopies === 0) return "All copies currently issued";
      return `${book.availableCopies} of ${book.totalCopies} copies available`;
    };

    return {
      books, requests, loading, error,
      searchQuery, categoryFilter, showAvailableOnly,
      showFilterDropdown, selectedBook, showDetailDrawer,
      activeTab, requestSubmitting, requestSuccess,
      handleSearch, setCategory, toggleAvailable,
      closeFilterDropdown, openDetail, closeDetail,
      requestBook, myRequests, availabilityTooltip,
      CATEGORIES,
    };
  },

  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            <h1 class="text-lg font-bold text-slate-900">Library</h1>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Book catalogue and reservations
          </p>
        </div>
      </div>

      <!-- Success toast -->
      <div v-if="requestSuccess" class="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
        {{ requestSuccess }}
      </div>

      <!-- Tab navigation -->
      <div class="flex gap-1 rounded-lg bg-slate-100 p-1">
        <button @click="activeTab = 'catalogue'"
          :class="[activeTab === 'catalogue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
          class="rounded-md px-4 py-2 text-xs font-medium transition-all">
          Catalogue
        </button>
        <button @click="activeTab = 'my-requests'"
          :class="[activeTab === 'my-requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700']"
          class="rounded-md px-4 py-2 text-xs font-medium transition-all">
          My Requests
          <span v-if="myRequests.length" class="ml-1 rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-semibold">{{ myRequests.length }}</span>
        </button>
      </div>

      <!-- CATALOGUE TAB -->
      <div v-if="activeTab === 'catalogue'" class="space-y-4">
        <!-- Search + Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 relative">
            <input
              v-focus
              v-debounce:300="handleSearch"
              type="text"
              placeholder="Search books by title, author, ISBN, or category..."
              class="w-full rounded-md border border-slate-200 bg-white px-4 py-2 pl-9 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg class="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
          </div>

          <div class="flex gap-2 items-center">
            <!-- Category dropdown -->
            <div class="relative" v-click-outside="closeFilterDropdown">
              <button @click="showFilterDropdown = !showFilterDropdown"
                class="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                {{ categoryFilter === 'all' ? 'All Categories' : categoryFilter }}
                <svg class="inline-block h-3 w-3 ml-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div v-if="showFilterDropdown" class="absolute right-0 mt-1 w-48 rounded-md border border-slate-200 bg-white py-1 shadow-lg z-20">
                <button v-for="cat in CATEGORIES" :key="cat" @click="setCategory(cat)"
                  :class="[categoryFilter === cat ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50']"
                  class="block w-full px-4 py-2 text-left text-xs transition-colors capitalize">
                  {{ cat === 'all' ? 'All Categories' : cat }}
                </button>
              </div>
            </div>

            <!-- Available only toggle -->
            <button @click="toggleAvailable"
              :class="[showAvailableOnly ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
              class="rounded-md px-3 py-2 text-xs font-medium transition-colors">
              Available Only
            </button>
          </div>
        </div>

        <!-- Loading / Error / Empty -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <p class="text-xs text-slate-500 mt-2">Loading catalogue...</p>
        </div>

        <div v-else-if="error" class="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
          {{ error }}
        </div>

        <div v-else-if="books.length === 0" class="text-center py-12 rounded-lg border border-slate-200 bg-white">
          <p class="text-xs text-slate-400">No books match your search or filters.</p>
        </div>

        <!-- Book grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="book in books" :key="book.id"
            @click="openDetail(book)"
            class="rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer group">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-xs font-semibold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                {{ book.title }}
              </h3>
              <span v-tooltip="availabilityTooltip(book)"
                :class="[book.availableCopies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']"
                class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold cursor-help">
                {{ book.availableCopies > 0 ? 'Available' : 'Issued' }}
              </span>
            </div>
            <p class="text-[10px] text-slate-500 mb-1">{{ book.authors.join(', ') }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{{ book.category }}</span>
              <span class="text-[10px] text-slate-400">Shelf {{ book.shelf }}</span>
            </div>
          </div>
        </div>

        <p v-if="!loading && books.length > 0" class="text-[10px] text-slate-400 text-right">{{ books.length }} book(s) found</p>
      </div>

      <!-- MY REQUESTS TAB -->
      <div v-if="activeTab === 'my-requests'" class="space-y-4">
        <div v-if="myRequests.length === 0" class="text-center py-12 rounded-lg border border-slate-200 bg-white">
          <p class="text-xs text-slate-400 mb-2">You have no book requests yet.</p>
          <button @click="activeTab = 'catalogue'" class="text-xs text-blue-600 hover:text-blue-700 font-medium">Browse Catalogue</button>
        </div>

        <div v-else class="overflow-x-auto rounded-lg border border-slate-200">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Book</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Date</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                <th class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Due</th>
                <th v-permission="'librarian'" class="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="req in myRequests" :key="req.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-xs text-slate-800">{{ req.bookTitle }}</td>
                <td class="px-4 py-3 text-xs text-slate-500 hidden sm:table-cell">
                  {{ new Date(req.requestDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) }}
                </td>
                <td class="px-4 py-3">
                  <span v-tooltip="req.notes || req.status"
                    :class="{
                      'bg-amber-100 text-amber-700': req.status === 'pending',
                      'bg-emerald-100 text-emerald-700': req.status === 'approved',
                      'bg-red-100 text-red-700': req.status === 'rejected',
                    }"
                    class="rounded px-2 py-0.5 text-[10px] font-semibold capitalize cursor-help">
                    {{ req.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500 hidden md:table-cell">
                  {{ req.dueDate ? new Date(req.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—' }}
                </td>
                <td v-permission="'librarian'" class="px-4 py-3">
                  <button class="text-xs text-blue-600 hover:text-blue-700 font-medium mr-2">Approve</button>
                  <button class="text-xs text-red-600 hover:text-red-700 font-medium">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Book Detail Drawer (overlay) -->
      <div v-if="showDetailDrawer && selectedBook" class="fixed inset-0 z-50 flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40" @click="closeDetail"></div>

        <!-- Drawer panel -->
        <div v-click-outside="closeDetail"
          class="relative w-full max-w-md bg-white shadow-2xl z-10 overflow-y-auto">
          <div class="p-6 space-y-5">
            <!-- Close button -->
            <div class="flex items-center justify-between">
              <h2 class="text-sm font-bold text-slate-900">Book Details</h2>
              <button @click="closeDetail" class="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Book info -->
            <div class="space-y-3">
              <h3 class="text-base font-bold text-slate-900 leading-tight">{{ selectedBook.title }}</h3>
              <p class="text-xs text-slate-500">{{ selectedBook.authors.join(', ') }}</p>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">ISBN</div>
                  <div class="text-xs font-medium text-slate-800">{{ selectedBook.isbn }}</div>
                </div>
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">Publisher</div>
                  <div class="text-xs font-medium text-slate-800">{{ selectedBook.publisher }}</div>
                </div>
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">Category</div>
                  <div class="text-xs font-medium text-slate-800">{{ selectedBook.category }}</div>
                </div>
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">Year</div>
                  <div class="text-xs font-medium text-slate-800">{{ selectedBook.year }}</div>
                </div>
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">Shelf Location</div>
                  <div class="text-xs font-medium text-slate-800">{{ selectedBook.shelf }}</div>
                </div>
                <div class="rounded-md bg-slate-50 p-3">
                  <div class="text-[10px] text-slate-500 mb-1">Availability</div>
                  <div class="text-xs font-medium"
                    :class="selectedBook.availableCopies > 0 ? 'text-emerald-700' : 'text-red-600'">
                    {{ selectedBook.availableCopies }} / {{ selectedBook.totalCopies }} copies
                  </div>
                </div>
              </div>
            </div>

            <!-- Request button -->
            <div class="border-t border-slate-200 pt-4">
              <button
                @click="requestBook(selectedBook)"
                :disabled="selectedBook.availableCopies === 0 || requestSubmitting"
                :class="[selectedBook.availableCopies === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800']"
                class="w-full rounded-md py-2.5 text-xs font-semibold transition-colors disabled:opacity-60">
                <span v-if="requestSubmitting">Submitting...</span>
                <span v-else-if="selectedBook.availableCopies === 0">Not Available</span>
                <span v-else>Request This Book</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
};
