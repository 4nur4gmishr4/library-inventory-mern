import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const MEMBERSHIP_TYPES = ['Student', 'Faculty', 'Public'];

const emptyForm = { fullName: '', email: '', phone: '', membershipType: '' };

const Members = () => {
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const { data } = await API.get('/members');
      setMembers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Client-side validation
  const validate = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.membershipType) {
      setFormError('Please fill in all fields');
      return false;
    }
    if (formData.fullName.length < 2 || formData.fullName.length > 100) {
      setFormError('Full Name must be between 2 and 100 characters');
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormError('Phone Number must be exactly 10 digits');
      return false;
    }
    if (!MEMBERSHIP_TYPES.includes(formData.membershipType)) {
      setFormError('Please select a valid membership type');
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
        await API.put(`/members/${editingId}`, formData);
      } else {
        await API.post('/members', formData);
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchMembers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (member) => {
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
    });
    setEditingId(member._id);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await API.delete(`/members/${id}`);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete member');
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
        <h1>Members</h1>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Member
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-card">
          <h2>{editingId ? 'Edit Member' : 'Add New Member'}</h2>
          <form onSubmit={handleSubmit}>
            {formError && <div className="error-message">{formError}</div>}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full name (2-100 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="member@example.com"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="membershipType">Membership Type</label>
                <select
                  id="membershipType"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {MEMBERSHIP_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Member' : 'Add Member'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading members...</p>
      ) : members.length === 0 ? (
        <p className="empty-text">No members found. Add your first member!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Membership Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id}>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td><span className="badge">{member.membershipType}</span></td>
                  <td className="actions-cell">
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(member)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(member._id)}>
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

export default Members;
