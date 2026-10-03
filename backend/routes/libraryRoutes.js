/**
 * CampusHub — Library Routes
 * Practical 7: REST API for Library Books & Requests
 */

const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

// Book catalogue endpoints
router.get("/books", libraryController.getAllBooks);
router.get("/books/:id", libraryController.getBookById);

// Book request endpoints
router.get("/requests", libraryController.getAllRequests);
router.post("/requests", libraryController.createRequest);

module.exports = router;
