import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const isBooksActive = location.pathname.startsWith('/books');
  const isMembersActive = location.pathname.startsWith('/members');

  return (
    <nav className="bg-surface w-full sticky top-0 z-50 border-b border-outline-variant transition-colors duration-150">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-md w-full max-w-7xl mx-auto gap-sm">
        <div className="flex items-center gap-xs md:gap-sm min-w-0">
          <img src={logo} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
          <div className="text-sm md:font-headline-lg md:text-headline-lg font-bold tracking-tight text-on-surface leading-tight">
            Library Inventory Management System
          </div>
        </div>
        
        <div className="hidden md:flex space-x-lg items-center">
          <Link
            to="/books"
            className={`${
              isBooksActive
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant'
            } font-body-md text-body-md hover:text-primary transition-colors duration-150 px-sm py-xs`}
          >
            Books
          </Link>
          <Link
            to="/members"
            className={`${
              isMembersActive
                ? 'text-primary border-b-2 border-primary pb-1'
                : 'text-on-surface-variant'
            } font-body-md text-body-md hover:text-primary transition-colors duration-150 px-sm py-xs`}
          >
            Members
          </Link>
          <button 
            onClick={handleLogout}
            className="font-label-sm text-label-sm text-on-surface hover:bg-surface-container-low transition-colors duration-150 px-md py-sm border border-outline-variant bg-surface-container-lowest ml-lg"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger - hidden on desktop */}
        <button onClick={handleLogout} className="md:hidden font-label-sm text-label-sm text-on-surface border border-outline-variant px-sm py-xs">
          Logout
        </button>
      </div>
      
      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around py-sm z-40">
        <Link 
          to="/books" 
          className={`flex flex-col items-center gap-1 ${isBooksActive ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isBooksActive ? "'FILL' 1" : "'FILL' 0" }}>book</span>
          <span className="font-label-sm text-[10px]">Books</span>
        </Link>
        <Link 
          to="/members" 
          className={`flex flex-col items-center gap-1 ${isMembersActive ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: isMembersActive ? "'FILL' 1" : "'FILL' 0" }}>group</span>
          <span className="font-label-sm text-[10px]">Members</span>
        </Link>
      </nav>
    </nav>
  );
};

export default Navbar;
