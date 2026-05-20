import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/"><i className="fas fa-store"></i> Products</Link>
        {user && <Link to="/cart"><i className="fas fa-shopping-cart"></i> Cart</Link>}
        {user?.role === 'admin' && <Link to="/admin"><i className="fas fa-user-shield"></i> Admin</Link>}
      </div>
      <div className="nav-auth">
        {!user ? (
          <>
            <Link to="/login"><i className="fas fa-sign-in-alt"></i> Login</Link>
            <Link to="/register"><i className="fas fa-user-plus"></i> Register</Link>
          </>
        ) : (
          <>
            <span><i className="fas fa-user-circle"></i> {user.username}</span>
            <button onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}