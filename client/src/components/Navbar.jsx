import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const userName = localStorage.getItem('userName') || 'Librarian';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">📚</span>
        <span className="navbar-title">Library IMS</span>
      </div>
      <div className="navbar-links">
        <Link to="/books" className="navbar-link">Books</Link>
        <Link to="/members" className="navbar-link">Members</Link>
      </div>
      <div className="navbar-right">
        <span className="navbar-user">Hello, {userName}</span>
        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
