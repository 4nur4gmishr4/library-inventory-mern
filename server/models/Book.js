const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title must be at most 100 characters'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      minlength: [2, 'Author must be at least 2 characters'],
      maxlength: [100, 'Author must be at most 100 characters'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      match: [/^\d{13}$/, 'ISBN must be exactly 13 digits'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: {
        values: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Other'],
        message: 'Genre must be one of: Fiction, Non-Fiction, Science, History, Technology, Other',
      },
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total Copies is required'],
      min: [1, 'Total Copies must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Total Copies must be an integer',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
