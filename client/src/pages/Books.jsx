import { useState, useEffect, useContext, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import api from '../api/axios';

const Books = () => {
  const { books, isBooksLoading, fetchBooks, booksFetched } = useContext(DataContext);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Fiction',
    totalCopies: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      if (!booksFetched) {
        fetchBooks();
      } else {
        fetchBooks(true);
      }
    }
  }, [fetchBooks, booksFetched]);

  // Client-side validation mirroring server rules
  const validate = () => {
    if (!formData.title || formData.title.length < 2 || formData.title.length > 100) return 'Title must be between 2 and 100 characters.';
    if (!formData.author || formData.author.length < 2 || formData.author.length > 100) return 'Author must be between 2 and 100 characters.';
    if (!/^\d{13}$/.test(formData.isbn)) return 'ISBN must be exactly 13 digits.';
    if (!formData.totalCopies || !Number.isInteger(Number(formData.totalCopies)) || Number(formData.totalCopies) < 1) return 'Total copies must be a whole number of at least 1.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        await api.put(`/books/${editId}`, formData);
        setSuccess('Book updated successfully.');
      } else {
        await api.post('/books', formData);
        setSuccess('Book added successfully.');
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ title: '', author: '', isbn: '', genre: 'Fiction', totalCopies: '' });
      fetchBooks(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (book) => {
    setEditId(book._id);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      totalCopies: book.totalCopies
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${id}`);
        setSuccess('Book deleted successfully.');
        setError('');
        fetchBooks(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book.');
        setSuccess('');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ title: '', author: '', isbn: '', genre: 'Fiction', totalCopies: '' });
    setError('');
  };

  return (
    <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop pt-xl pb-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Book Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage library book records.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({ title: '', author: '', isbn: '', genre: 'Fiction', totalCopies: '' });
            setError('');
            setSuccess('');
          }}
          className="bg-primary-container text-on-primary border-none px-lg py-sm font-label-sm text-label-sm hover:bg-[#00327d] transition-colors h-[40px] flex items-center mt-sm md:mt-0"
        >
          <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
          Add Book
        </button>
      </div>

      {success && (
        <div className="mb-md p-sm border border-primary bg-secondary-fixed-dim text-on-surface font-body-md text-body-md flex items-start gap-sm" style={{ backgroundColor: '#dae2ff' }}>
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {success}
        </div>
      )}

      {showForm && (
        <div className="border border-outline-variant bg-surface-container-lowest p-lg mb-xl">
          <h2 className="font-label-sm text-label-sm text-on-surface mb-md">
            {editId ? 'Edit Book Details' : 'New Book Details'}
          </h2>
          
          {error && (
            <div className="mb-md p-sm border border-error bg-error-container text-on-error-container font-body-md text-body-md flex items-start gap-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter items-end">
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="title">Title</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="title" 
                required 
                type="text"
                minLength={2}
                maxLength={100}
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="author">Author</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="author" 
                required 
                type="text"
                minLength={2}
                maxLength={100}
                value={formData.author}
                onChange={e => setFormData({...formData, author: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="isbn">ISBN (13 digits)</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="isbn" 
                required 
                type="text"
                pattern="\d{13}"
                title="ISBN must be exactly 13 digits"
                value={formData.isbn}
                onChange={e => setFormData({...formData, isbn: e.target.value})}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="genre">Genre</label>
              <select 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="genre"
                value={formData.genre}
                onChange={e => setFormData({...formData, genre: e.target.value})}
              >
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="totalCopies">Total Copies</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="totalCopies" 
                required 
                type="number"
                min="1"
                value={formData.totalCopies}
                onChange={e => setFormData({...formData, totalCopies: e.target.value})}
              />
            </div>

            <div className="col-span-full flex justify-end space-x-md mt-md">
              <button 
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="bg-surface-container-lowest text-on-surface border border-outline-variant px-lg py-sm font-label-sm text-label-sm hover:bg-surface-container-low transition-colors h-[40px]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-container text-on-primary border-none px-lg py-sm font-label-sm text-label-sm hover:bg-[#00327d] transition-colors h-[40px] flex items-center gap-sm disabled:opacity-60"
              >
                {isSubmitting && <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>}
                {editId ? 'Update Book' : 'Save Book'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-outline-variant bg-surface-container-lowest">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Title</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Author</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">ISBN</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Genre</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Total Copies</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y md:divide-outline-variant block md:table-row-group">
            {isBooksLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse block md:table-row border-b border-outline-variant md:border-none p-sm md:p-0">
                  <td data-label="Title" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-1/2 md:w-3/4"></div>
                  </td>
                  <td data-label="Author" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-1/3 md:w-1/2"></div>
                  </td>
                  <td data-label="ISBN" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-2/3 md:w-full"></div>
                  </td>
                  <td data-label="Genre" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-6 bg-surface-container-high w-20"></div>
                  </td>
                  <td data-label="Total Copies" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-1/4"></div>
                  </td>
                  <td data-label="Actions" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="flex justify-end space-x-sm w-full md:w-auto"><div className="h-6 w-6 bg-surface-container-high"></div><div className="h-6 w-6 bg-surface-container-high"></div></div>
                  </td>
                </tr>
              ))
            ) : books.length > 0 ? (
              books.map(book => (
                <tr key={book._id} className="hover:bg-[#F2F2F2] transition-colors group block md:table-row border-b border-outline-variant md:border-none p-sm md:p-0">
                  <td data-label="Title" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface w-2/3 truncate md:w-auto">{book.title}</span>
                  </td>
                  <td data-label="Author" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface">{book.author}</span>
                  </td>
                  <td data-label="ISBN" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface">{book.isbn}</span>
                  </td>
                  <td data-label="Genre" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="inline-flex items-center px-sm py-[2px] border border-outline-variant text-label-sm font-label-sm bg-white">
                      {book.genre}
                    </span>
                  </td>
                  <td data-label="Total Copies" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface">{book.totalCopies}</span>
                  </td>
                  <td data-label="Actions" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="flex justify-end space-x-sm w-full md:w-auto">
                      <button onClick={() => handleEdit(book)} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-xl px-md text-center text-on-surface-variant font-body-md">
                  No books found. Click &quot;Add Book&quot; to create a new record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Books;
