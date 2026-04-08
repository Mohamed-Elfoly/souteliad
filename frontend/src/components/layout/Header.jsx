import { useState, useRef, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import useModal from '../../hooks/useModal';
import LogoutModal from '../ui/LogoutModal';
import Avatar from '../ui/Avatar';
import logo1 from '../../assets/images/logo1.png';

const settingsItems = [
  { to: '/Personal/edit', label: 'تعديل بيانات حسابي الشخصي' },
  { to: '/Personal/password', label: 'تغيير كلمة المرور' },
  { to: '/Personal/support', label: 'الدعم' },
];

export default function Header() {
  const { user } = useAuth();
  const logoutModal = useModal();
  const homeLink = user?.role === ROLES.ADMIN ? '/Students' : '/Dashboard';
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-user">
            <Link to={homeLink}>
              <img src={logo1} alt="logo" className="logo1" />
            </Link>
          </div>
          <div className="header-left">
            <Link to="/Personal" className="user-pill">
              <Avatar
                src={user?.profilePicture}
                name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                iconSize={16}
                iconColor="#fff"
                className="user-pill-avatar"
              />
              <span>{user?.firstName || 'المستخدم'}</span>
              <span className="online-dot" />
            </Link>

            {/* Settings dropdown */}
            <div className="settings-dropdown" ref={settingsRef}>
              <button
                className={`icon-btn ${settingsOpen ? 'icon-btn--active' : ''}`}
                onClick={() => setSettingsOpen((o) => !o)}
              >
                <Settings size={20} />
              </button>
              {settingsOpen && (
                <div className="settings-menu" dir="rtl">
                  {settingsItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="settings-menu-item"
                      onClick={() => setSettingsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button className="logout-btn" onClick={logoutModal.open}>
              <LogOut size={18} />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>
      </header>

      <LogoutModal isOpen={logoutModal.isOpen} onClose={logoutModal.close} />
    </>
  );
}
