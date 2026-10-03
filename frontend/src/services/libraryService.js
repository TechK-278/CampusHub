/**
 * CampusHub — Library Service
 * Practical 7: Vue Library Module API Client
 */

const BOOKS_URL = "/api/library/books";
const REQUESTS_URL = "/api/library/requests";

export const libraryService = {
  /**
   * Fetch all books with optional filters
   */
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search.trim());
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.available) query.append("available", "true");

    const url = query.toString() ? `${BOOKS_URL}?${query}` : BOOKS_URL;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch books");
    return data.books || [];
  },

  /**
   * Fetch single book by ID
   */
  async getBookById(id) {
    const res = await fetch(`${BOOKS_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch book");
    return data.book;
  },

  /**
   * Fetch all book requests
   */
  async getRequests() {
    const res = await fetch(REQUESTS_URL);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch requests");
    return data.requests || [];
  },

  /**
   * Create a new book request/reservation
   */
  async createRequest(requestData) {
    const res = await fetch(REQUESTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit request");
    return data.request;
  },
};
