import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LogoutModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <div className="logout-icon">
          <LogOut size={26} color="#fff" />
        </div>
        <h3>تسجيل الخروج ؟</h3>
        <p>هل انت متأكد من تسجيل الخروج ؟</p>
        <div className="logout-actions">
          <button className="btn-yes" onClick={handleLogout}>
            نعم
          </button>
          <button className="btn-no" onClick={onClose}>
            لا
          </button>
        </div>
      </div>
    </div>
  );
}
