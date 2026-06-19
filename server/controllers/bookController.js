const Book = require('../models/Book');

// Grab all books, sorted newest first
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

// Add a new book to the inventory
const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, totalCopies } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !genre || totalCopies === undefined || totalCopies === null || totalCopies === '') {
      res.status(400);
      throw new Error('Please provide all required fields: title, author, isbn, genre, totalCopies');
    }

    // Validate title
    if (typeof title !== 'string' || title.length < 2 || title.length > 100) {
      res.status(400);
      throw new Error('Title must be between 2 and 100 characters');
    }

    // Validate author
    if (typeof author !== 'string' || author.length < 2 || author.length > 100) {
      res.status(400);
      throw new Error('Author must be between 2 and 100 characters');
    }

    // Validate ISBN (exactly 13 digits, numeric only)
    if (typeof isbn !== 'string' || !/^\d{13}$/.test(isbn)) {
      res.status(400);
      throw new Error('ISBN must be exactly 13 digits');
    }

    // Validate genre
    const validGenres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Other'];
    if (!validGenres.includes(genre)) {
      res.status(400);
      throw new Error('Genre must be one of: Fiction, Non-Fiction, Science, History, Technology, Other');
    }

    // Validate totalCopies
    if (!Number.isInteger(Number(totalCopies)) || Number(totalCopies) < 1) {
      res.status(400);
      throw new Error('Total Copies must be an integer of at least 1');
    }

    // Check for duplicate ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      res.status(400);
      throw new Error('A book with this ISBN already exists');
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      totalCopies: Number(totalCopies),
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// Update existing book record by its mongo ID
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    const { title, author, isbn, genre, totalCopies } = req.body;

    // Validate title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 2 || title.length > 100) {
        res.status(400);
        throw new Error('Title must be between 2 and 100 characters');
      }
    }

    // Validate author if provided
    if (author !== undefined) {
      if (typeof author !== 'string' || author.length < 2 || author.length > 100) {
        res.status(400);
        throw new Error('Author must be between 2 and 100 characters');
      }
    }

    // Validate ISBN if provided (exactly 13 digits, numeric only)
    if (isbn !== undefined) {
      if (typeof isbn !== 'string' || !/^\d{13}$/.test(isbn)) {
        res.status(400);
        throw new Error('ISBN must be exactly 13 digits');
      }
    }

    // Check ISBN uniqueness if changed
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        res.status(400);
        throw new Error('A book with this ISBN already exists');
      }
    }

    // Validate genre if provided
    if (genre !== undefined) {
      const validGenres = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Other'];
      if (!validGenres.includes(genre)) {
        res.status(400);
        throw new Error('Genre must be one of: Fiction, Non-Fiction, Science, History, Technology, Other');
      }
    }

    // Validate totalCopies if provided
    if (totalCopies !== undefined) {
      if (!Number.isInteger(Number(totalCopies)) || Number(totalCopies) < 1) {
        res.status(400);
        throw new Error('Total Copies must be an integer of at least 1');
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, isbn, genre, totalCopies: totalCopies !== undefined ? Number(totalCopies) : undefined },
      { new: true, runValidators: true }
    );

    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// Delete a book from the db
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBooks, createBook, updateBook, deleteBook };
