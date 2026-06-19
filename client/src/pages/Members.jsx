import { useState, useEffect, useContext, useRef } from 'react';
import { DataContext } from '../context/DataContext';
import api from '../api/axios';

const Members = () => {
  const { members, isMembersLoading, fetchMembers, membersFetched } = useContext(DataContext);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipType: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      if (!membersFetched) {
        fetchMembers();
      } else {
        fetchMembers(true);
      }
    }
  }, [fetchMembers, membersFetched]);

  // Client-side validation mirroring server rules exactly
  const validate = () => {
    if (!formData.fullName || formData.fullName.length < 2 || formData.fullName.length > 100) return 'Full Name must be between 2 and 100 characters.';
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email || !emailRegex.test(formData.email)) return 'Please provide a valid email address.';
    const phoneNum = Number(formData.phone);
    if (!Number.isInteger(phoneNum) || phoneNum < 1000000000 || phoneNum > 9999999999) return 'Phone Number must be exactly 10 digits.';
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
        await api.put(`/members/${editId}`, formData);
        setSuccess('Member updated successfully.');
      } else {
        await api.post('/members', formData);
        setSuccess('Member added successfully.');
      }
      setShowForm(false);
      setEditId(null);
      setFormData({ fullName: '', email: '', phone: '', membershipType: 'Student' });
      fetchMembers(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member) => {
    setEditId(member._id);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone || '',
      membershipType: member.membershipType
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        setSuccess('Member deleted successfully.');
        setError('');
        fetchMembers(true);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete member.');
        setSuccess('');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setFormData({ fullName: '', email: '', phone: '', membershipType: 'Student' });
    setError('');
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
      <div className="flex justify-between items-end border-b border-outline-variant pb-md mb-xl">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Member Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage library member records.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(true);
            setEditId(null);
            setFormData({ fullName: '', email: '', phone: '', membershipType: 'Student' });
            setError('');
            setSuccess('');
          }}
          className="bg-primary-container text-on-primary border-none px-lg py-sm font-label-sm text-label-sm hover:bg-[#00327d] transition-colors h-[40px] flex items-center"
        >
          <span className="material-symbols-outlined mr-sm text-[18px]">add</span>
          Add Member
        </button>
      </div>

      {success && (
        <div className="mb-md p-sm border border-primary text-on-surface font-body-md text-body-md flex items-start gap-sm" style={{ backgroundColor: '#dae2ff' }}>
          <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          {success}
        </div>
      )}

      {showForm && (
        <div className="border border-outline-variant bg-surface-container-lowest p-lg mb-xl">
          <h2 className="font-label-sm text-label-sm text-on-surface mb-md">
            {editId ? 'Edit Member Details' : 'New Member Details'}
          </h2>

          {error && (
            <div className="mb-md p-sm border border-error bg-error-container text-on-error-container font-body-md text-body-md flex items-start gap-sm">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter items-end">
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="fullName">Full Name</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="fullName" 
                required 
                type="text"
                minLength={2}
                maxLength={100}
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="email">Email</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="email" 
                required 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="phone">Phone Number</label>
              <input 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="phone" 
                required 
                type="number"
                min="1000000000"
                max="9999999999"
                title="Phone number must be exactly 10 digits"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface mb-xs" htmlFor="membershipType">Membership Type</label>
              <select 
                className="h-[40px] border border-outline-variant bg-surface-container-lowest px-sm focus:border-primary focus:outline-none font-body-md text-body-md text-on-surface" 
                id="membershipType"
                value={formData.membershipType}
                onChange={e => setFormData({...formData, membershipType: e.target.value})}
              >
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="Public">Public</option>
              </select>
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
                {isSubmitting && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>}
                {editId ? 'Update Member' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border border-outline-variant bg-surface-container-lowest">
        <table className="w-full text-left border-collapse">
          <thead className="hidden md:table-header-group">
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Full Name</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Email</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Phone Number</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap">Membership Type</th>
              <th className="font-label-sm text-label-sm text-on-surface-variant py-md px-md whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y md:divide-outline-variant block md:table-row-group">
            {isMembersLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse block md:table-row border-b border-outline-variant md:border-none p-sm md:p-0">
                  <td data-label="Full Name" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-1/2 md:w-3/4"></div>
                  </td>
                  <td data-label="Email" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-1/3 md:w-1/2"></div>
                  </td>
                  <td data-label="Phone Number" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-5 bg-surface-container-high w-2/3 md:w-full"></div>
                  </td>
                  <td data-label="Membership Type" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="h-6 bg-surface-container-high w-20"></div>
                  </td>
                  <td data-label="Actions" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="flex justify-end space-x-sm w-full md:w-auto"><div className="h-6 w-6 bg-surface-container-high"></div><div className="h-6 w-6 bg-surface-container-high"></div></div>
                  </td>
                </tr>
              ))
            ) : members.length > 0 ? (
              members.map(member => (
                <tr key={member._id} className="hover:bg-[#F2F2F2] transition-colors group block md:table-row border-b border-outline-variant md:border-none p-sm md:p-0">
                  <td data-label="Full Name" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface w-2/3 truncate md:w-auto">{member.fullName}</span>
                  </td>
                  <td data-label="Email" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface">{member.email}</span>
                  </td>
                  <td data-label="Phone Number" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="text-right md:text-left text-on-surface">{member.phone}</span>
                  </td>
                  <td data-label="Membership Type" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <span className="inline-flex items-center px-sm py-[2px] text-label-sm font-label-sm border border-outline-variant text-on-surface-variant bg-white">
                      {member.membershipType}
                    </span>
                  </td>
                  <td data-label="Actions" className="py-xs md:py-md px-sm md:px-md flex justify-between md:table-cell border-b border-outline-variant md:border-none last:border-b-0 before:content-[attr(data-label)] md:before:content-none before:font-bold before:text-on-surface-variant before:mr-4 items-center">
                    <div className="flex justify-end space-x-sm w-full md:w-auto">
                      <button onClick={() => handleEdit(member)} className="text-on-surface-variant hover:text-primary transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="text-on-surface-variant hover:text-error transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-xl px-md text-center text-on-surface-variant font-body-md">
                  No members found. Click &quot;Add Member&quot; to create a new record.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Members;
