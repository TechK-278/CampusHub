/**
 * CampusHub — Library Controller
 * Practical 7: JSON File-Based CRUD for Library Books & Requests
 * Follows the same pattern as taskController.js
 */

const fs = require("fs");
const path = require("path");

const booksFilePath = path.join(__dirname, "..", "data", "books.json");
const requestsFilePath = path.join(__dirname, "..", "data", "bookRequests.json");

// ── Helpers ──

function readBooksFile() {
  if (!fs.existsSync(booksFilePath)) {
    const initial = { books: [] };
    fs.writeFileSync(booksFilePath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(booksFilePath, "utf8"));
  } catch {
    return { books: [] };
  }
}

function readRequestsFile() {
  if (!fs.existsSync(requestsFilePath)) {
    const initial = { requests: [] };
    fs.writeFileSync(requestsFilePath, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(requestsFilePath, "utf8"));
  } catch {
    return { requests: [] };
  }
}

function writeRequestsFile(data) {
  fs.writeFileSync(requestsFilePath, JSON.stringify(data, null, 2), "utf8");
}

// ── Book Endpoints ──

/**
 * GET /api/library/books
 * Optional query: ?search=, ?category=, ?available=true
 */
exports.getAllBooks = (req, res) => {
  try {
    const data = readBooksFile();
    let books = data.books || [];

    const { search, category, available } = req.query;

    if (search) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.authors.some((a) => a.toLowerCase().includes(q)) ||
          b.isbn.includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== "all") {
      books = books.filter((b) => b.category === category);
    }

    if (available === "true") {
      books = books.filter((b) => b.availableCopies > 0);
    }

    res.json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to read book catalogue.",
      error: error.message,
    });
  }
};

/**
 * GET /api/library/books/:id
 */
exports.getBookById = (req, res) => {
  try {
    const bookId = parseInt(req.params.id, 10);
    if (isNaN(bookId)) {
      return res.status(400).json({ success: false, message: "Invalid book ID." });
    }

    const data = readBooksFile();
    const book = (data.books || []).find((b) => b.id === bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: `Book with ID ${bookId} not found.` });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching book.", error: error.message });
  }
};

// ── Request Endpoints ──

/**
 * GET /api/library/requests
 */
exports.getAllRequests = (req, res) => {
  try {
    const data = readRequestsFile();
    res.json({
      success: true,
      count: (data.requests || []).length,
      requests: data.requests || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to read book requests.",
      error: error.message,
    });
  }
};

/**
 * POST /api/library/requests
 * Body: { bookId, bookTitle, studentId, studentName, notes? }
 */
exports.createRequest = (req, res) => {
  try {
    const { bookId, bookTitle, studentId, studentName, notes } = req.body;

    if (!bookId || !studentId) {
      return res.status(400).json({
        success: false,
        message: "bookId and studentId are required.",
      });
    }

    const data = readRequestsFile();
    const maxId = data.requests.reduce((max, r) => (r.id > max ? r.id : max), 0);

    const newRequest = {
      id: maxId + 1,
      bookId: parseInt(bookId, 10),
      bookTitle: bookTitle || "",
      studentId: studentId.trim(),
      studentName: studentName || "",
      status: "pending",
      requestDate: new Date().toISOString(),
      dueDate: null,
      notes: notes || "",
    };

    data.requests.push(newRequest);
    writeRequestsFile(data);

    res.status(201).json({
      success: true,
      message: "Book request submitted successfully.",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create book request.",
      error: error.message,
    });
  }
};
