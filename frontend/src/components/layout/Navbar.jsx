import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut } from 'lucide-react';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import LogoutModal from '../ui/LogoutModal';
import Avatar from '../ui/Avatar';
import NotificationDropdown from '../ui/NotificationDropdown';
import { getUnreadCount } from '../../api/notificationApi';
import { getAllLessons } from '../../api/lessonApi';
import { ROLES } from '../../utils/constants';
import logo from '../../assets/images/logo1.png';

const settingsItems = [
  { to: '/Personal/edit', label: 'تعديل بيانات حسابي الشخصي' },
  { to: '/Personal/password', label: 'تغيير كلمة المرور' },
  { to: '/Personal/support', label: 'الدعم' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
  const dashboardLink = user?.role === ROLES.ADMIN ? '/Students' : '/Dashboard';
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const logoutModal = useModal();
  const settingsRef = useRef(null);
  const bellRef = useRef(null);
  const searchRef = useRef(null);

  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const unreadCount = unreadData?.data?.data?.unreadCount || 0;
  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setMenuOpen(false);
    }
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  const { data: lessonsData } = useQuery({
    queryKey: ['lessons-search-pool'],
    queryFn: () => getAllLessons({ limit: 200 }),
    enabled: isAuthenticated && !isStaff,
    staleTime: 5 * 60_000,
  });
  const allLessons = lessonsData?.data?.data?.data || [];

  const searchResults = searchTerm.trim().length >= 2
    ? allLessons.filter((l) =>
        l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="navbar">
        <div className="nav-right">
          <Link to={isStaff ? dashboardLink : '/LandingpageLogin'}><img src={logo} alt="logo" className="logo" /></Link>
        </div>

        {!isStaff && (
          <div className="search-box" ref={searchRef}>
            <Search />
            <input
              type="text"
              placeholder="البحث عن درس..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((lesson) => (
                  <button
                    key={lesson._id}
                    className="search-dropdown-item"
                    onClick={() => {
                      navigate(`/Learnnow/${lesson._id}`);
                      setSearchTerm('');
                      setSearchOpen(false);
                    }}
                  >
                    <span className="search-item-title">{lesson.title}</span>
                    {lesson.description && (
                      <span className="search-item-desc">{lesson.description}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {searchOpen && searchTerm.trim().length >= 2 && searchResults.length === 0 && (
              <div className="search-dropdown">
                <p className="search-no-results">لا توجد نتائج</p>
              </div>
            )}
          </div>
        )}

<ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
  {isAuthenticated && isStaff ? (
    <li>
      <NavLink to={dashboardLink} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>
        لوحة التعليم
      </NavLink>
    </li>
  ) : (
    <>
      <li>
        <NavLink to="/LandingpageLogin" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>
          الصفحة الرئيسية
        </NavLink>
      </li>
      {isAuthenticated && (
        <>
          <li>
            <NavLink to="/Community" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>
              المجتمع
            </NavLink>
          </li>
          <li>
            <NavLink to="/Lessons" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>
              الدروس
            </NavLink>
          </li>
        </>
      )}
      {/* 🔥 زر تسجيل الخروج للـ mobile menu */}
      {isAuthenticated && (
        <li className="logout-mobile">
          <button className="logout-btn" onClick={() => { logoutModal.open(); setMenuOpen(false); }}>
            <LogOut size={18} />
            <span>تسجيل خروج</span>
          </button>
        </li>
      )}
    </>
  )}
</ul>

        <div className={`nav-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)}/>

        <div className={isAuthenticated ? 'header-left' : 'nav-left'}>
          {isAuthenticated ? (
            <>
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

              {/* Bell with dropdown — hidden for staff */}
              {!isStaff && (
                <div className="notif-wrapper" ref={bellRef}>
                  <button
                    className={`icon-btn ${bellOpen ? 'icon-btn--active' : ''}`}
                    onClick={() => { setBellOpen((o) => !o); setSettingsOpen(false); }}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={bellOpen}
                    onClose={() => setBellOpen(false)}
                  />
                </div>
              )}

              {/* Settings dropdown */}
              <div className="settings-dropdown" ref={settingsRef}>
                <button
                  className={`icon-btn ${settingsOpen ? 'icon-btn--active' : ''}`}
                  onClick={() => { setSettingsOpen((o) => !o); setBellOpen(false); }}
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
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate('/login')}>
                تسجيل الدخول
              </button>
              <button className="signupp-btn" onClick={() => navigate('/signup')}>
                انشاء حساب
              </button>
            </>
          )}
          <div
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>
      </header>

      <LogoutModal isOpen={logoutModal.isOpen} onClose={logoutModal.close} />
    </>
  );
}
