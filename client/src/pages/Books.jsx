import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const GENRES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Other'];

const emptyForm = { title: '', author: '', isbn: '', genre: '', totalCopies: '' };

const Books = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all books
  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/books');
      setBooks(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Client-side validation
  const validate = () => {
    if (!formData.title || !formData.author || !formData.isbn || !formData.genre || !formData.totalCopies) {
      setFormError('Please fill in all fields');
      return false;
    }
    if (formData.title.length < 2 || formData.title.length > 100) {
      setFormError('Title must be between 2 and 100 characters');
      return false;
    }
    if (formData.author.length < 2 || formData.author.length > 100) {
      setFormError('Author must be between 2 and 100 characters');
      return false;
    }
    if (!/^\d{13}$/.test(formData.isbn)) {
      setFormError('ISBN must be exactly 13 digits');
      return false;
    }
    if (!GENRES.includes(formData.genre)) {
      setFormError('Please select a valid genre');
      return false;
    }
    const copies = Number(formData.totalCopies);
    if (!Number.isInteger(copies) || copies < 1) {
      setFormError('Total Copies must be a whole number of at least 1');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validate()) return;

    try {
      if (editingId) {
        await API.put(`/books/${editingId}`, {
          ...formData,
          totalCopies: Number(formData.totalCopies),
        });
      } else {
        await API.post('/books', {
          ...formData,
          totalCopies: Number(formData.totalCopies),
        });
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchBooks();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      totalCopies: String(book.totalCopies),
    });
    setEditingId(book._id);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await API.delete(`/books/${id}`);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setFormError('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Books</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Book
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Book' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit}>
            {formError && <div className="error-message">{formError}</div>}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Book title (2-100 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name (2-100 characters)"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="13-digit ISBN"
                  maxLength="13"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="genre">Genre</label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Genre</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalCopies">Total Copies</label>
                <input
                  type="number"
                  id="totalCopies"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  placeholder="Minimum 1"
                  min="1"
                  required
                />
              </div>
              <div className="form-group form-actions-inline">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Book' : 'Add Book'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="empty-text">No books found. Add your first book!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>Total Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td><code>{book.isbn}</code></td>
                  <td><span className="badge">{book.genre}</span></td>
                  <td>{book.totalCopies}</td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(book)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(book._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Books;
