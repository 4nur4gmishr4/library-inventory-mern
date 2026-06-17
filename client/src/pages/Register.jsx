import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!name || name.length < 2 || name.length > 100) return 'Name must be between 2 and 100 characters.';
    if (!email || !/\S+@\S+\.\S+/.test(email)) return 'Please provide a valid email address.';
    if (!password || password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter.';
    if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number.';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least 1 special character.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="font-body-md text-body-md text-on-surface bg-surface flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop min-h-screen">
      <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant">
        <div className="px-lg py-lg border-b border-outline-variant bg-surface-container-lowest text-center">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-sm" />
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">Library Inventory Management System</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Librarian Registration</p>
        </div>
        
        <div className="px-lg py-xl">
          {error && (
            <div className="mb-lg p-sm border border-error bg-error-container text-on-error-container font-body-md text-body-md flex items-start gap-sm" id="error-message">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="name">Name</label>
              <input 
                className="h-[40px] px-sm border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none transition-colors duration-150 font-body-md text-body-md" 
                id="name" 
                name="name" 
                required 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">Email</label>
              <input 
                className="h-[40px] px-sm border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none transition-colors duration-150 font-body-md text-body-md" 
                id="email" 
                name="email" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">Password</label>
              <input 
                className="h-[40px] px-sm border border-outline-variant bg-surface-container-lowest focus:border-primary focus:outline-none transition-colors duration-150 font-body-md text-body-md" 
                id="password" 
                name="password" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-on-surface-variant font-label-sm text-label-sm mt-xs">
                Minimum 8 characters, 1 uppercase, 1 number, 1 special character
              </span>
            </div>
            
            <button 
              className="mt-sm h-[40px] w-full bg-primary text-on-primary font-label-sm text-label-sm hover:bg-on-primary-fixed-variant transition-all duration-150 flex justify-center items-center border-none cursor-pointer" 
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
        
        <div className="px-lg py-md border-t border-outline-variant bg-surface-container-low flex justify-center">
          <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors duration-150" to="/login">
            Already have an account? Login here
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Register;
