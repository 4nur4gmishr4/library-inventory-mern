import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Client-side validation mirroring server rules
  const validate = () => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) return 'Please provide a valid email address.';
    if (!password) return 'Please provide a password.';
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

    setIsSubmitting(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', res.data.name || 'User');
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen flex flex-col items-center justify-center p-md">
      <main className="w-full max-w-[400px] border border-outline-variant bg-surface-container-lowest p-xl">
        <header className="mb-xl border-b border-outline-variant pb-md text-center">
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-sm" />
          <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">Library Inventory Management System</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Librarian Login</p>
        </header>

        {error && (
          <div className="border border-error bg-error-container text-on-error-container p-md mb-lg font-body-md text-body-md flex items-start gap-sm" role="alert">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-sm mb-lg">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="email">Email</label>
            <input 
              className="border border-outline-variant h-[40px] px-md bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none transition-colors" 
              id="email" 
              name="email" 
              required 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-sm mb-xl">
            <label className="font-label-sm text-label-sm text-on-surface" htmlFor="password">Password</label>
            <input 
              className="border border-outline-variant h-[40px] px-md bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:border-primary focus:outline-none transition-colors" 
              id="password" 
              name="password" 
              required 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            className="bg-primary text-on-primary h-[40px] font-label-sm text-label-sm flex items-center justify-center hover:bg-on-primary-fixed-variant transition-colors w-full mb-lg tracking-wider border-none cursor-pointer gap-sm disabled:opacity-60" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>}
            Login
          </button>
          
          <div className="text-center mt-md border-t border-outline-variant pt-lg">
            <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" to="/register">
              Don&apos;t have an account? Register here
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
