import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, LogOut, X, Menu } from 'lucide-react';
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
  { to: '/Personal/edit',     label: 'تعديل بيانات حسابي الشخصي' },
  { to: '/Personal/password', label: 'تغيير كلمة المرور' },
  { to: '/Personal/support',  label: 'الدعم' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
  const dashboardLink = user?.role === ROLES.ADMIN ? '/Students' : '/Dashboard';

  const [menuOpen,    setMenuOpen]    = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bellOpen,    setBellOpen]    = useState(false);
  const [searchTerm,  setSearchTerm]  = useState('');
  const [searchOpen,  setSearchOpen]  = useState(false);

  const logoutModal  = useModal();
  const settingsRef  = useRef(null);
  const bellRef      = useRef(null);
  const searchRef    = useRef(null);

  /* close mobile menu on resize */
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
      if (bellRef.current     && !bellRef.current.contains(e.target))     setBellOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* unread notifications */
  const { data: unreadData } = useQuery({
    queryKey: ['unread-count'],
    queryFn: getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
  const unreadCount = unreadData?.data?.data?.unreadCount || 0;

  /* lesson search pool (students only) */
  const { data: lessonsData } = useQuery({
    queryKey: ['lessons-search-pool'],
    queryFn: () => getAllLessons({ limit: 200 }),
    enabled: isAuthenticated && !isStaff,
    staleTime: 5 * 60_000,
  });
  const allLessons = lessonsData?.data?.data?.data || [];

  const searchResults = searchTerm.trim().length >= 2
    ? allLessons
        .filter((l) =>
          l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          l.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <>
      {/*
        KEY FIX for overflow:
        - w-full instead of any fixed width
        - overflow-x-hidden prevents the header from ever being wider than viewport
        - z-40 keeps it above sidebar (sidebar is sticky, not fixed)
      */}
      <header
        className="
          w-full min-w-0 overflow-x-hidden
          sticky top-0 z-40
          flex items-center justify-between
          bg-white border-b border-gray-200
          px-4 h-[64px]
          shadow-[0_1px_2px_rgba(0,0,0,0.05)]
        "
        dir="rtl"
      >
        {/* ── Logo ── */}
        <div className="flex items-center shrink-0">
          <Link to={isStaff ? dashboardLink : '/LandingpageLogin'}>
            <img src={logo} alt="logo" className="w-[56px] h-[53px] object-contain" />
          </Link>
        </div>

        {/* ── Search box (students only, hidden on mobile) ── */}
        {!isStaff && (
          <div className="hidden md:block relative flex-1 max-w-sm mx-4" ref={searchRef}>
            <div className="relative">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="البحث عن درس..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="
                  w-full h-10 rounded-full border border-gray-200 bg-gray-50
                  pr-10 pl-4 text-sm text-gray-700 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837]
                  transition-all
                "
              />
            </div>

            {/* Search dropdown */}
            {searchOpen && (searchResults.length > 0 || searchTerm.trim().length >= 2) && (
              <div className="
                absolute top-full mt-2 right-0 w-full
                bg-white border border-gray-200 rounded-xl shadow-lg
                z-50 overflow-hidden
              ">
                {searchResults.length > 0 ? (
                  searchResults.map((lesson) => (
                    <button
                      key={lesson._id}
                      className="w-full text-right flex flex-col px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-50 last:border-0"
                      onClick={() => {
                        navigate(`/Learnnow/${lesson._id}`);
                        setSearchTerm('');
                        setSearchOpen(false);
                      }}
                    >
                      <span className="text-sm font-medium text-gray-800">{lesson.title}</span>
                      {lesson.description && (
                        <span className="text-xs text-gray-400 mt-0.5 truncate">{lesson.description}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-400 text-center">لا توجد نتائج</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Nav links (desktop, non-staff) ── */}
        {!isStaff && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/LandingpageLogin"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-lg md:text-sm lg:text-lg font-medium transition-colors ${
                  isActive ? 'text-[#EB6837]' : 'text-gray-600 hover:text-[#EB6837]'
                }`
              }
            >
              الصفحة الرئيسية
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/Community"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-lg md:text-sm lg:text-lg font-medium transition-colors ${
                      isActive ? 'text-[#EB6837]' : 'text-gray-600 hover:text-[#EB6837]'
                    }`
                  }
                >
                  المجتمع
                </NavLink>
                <NavLink
                  to="/Lessons"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-lg md:text-sm lg:text-lg font-medium transition-colors ${
                      isActive ? 'text-[#EB6837]' : 'text-gray-600 hover:text-[#EB6837]'
                    }`
                  }
                >
                  الدروس
                </NavLink>
              </>
            )}
          </nav>
        )}

        {/* ── Right cluster (authenticated actions) ── */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              {/* User pill */}
              <Link
                to="/Personal"
                className="
                  flex items-center gap-2
                  bg-[#EB6837] text-white
                  px-3 py-1.5 rounded-full
                  text-sm font-bold
                  hover:bg-[#d55a2b] transition-colors
                  whitespace-nowrap relative
                "
              >
                <Avatar
                  src={user?.profilePicture}
                  name={`${user?.firstName || ''} ${user?.lastName || ''}`}
                  iconSize={16}
                  iconColor="#fff"
                  className="w-7 h-7 rounded-full shrink-0"
                />
                <span className="hidden sm:inline">{user?.firstName || 'المستخدم'}</span>
                <span className="w-2 h-2 bg-green-400 rounded-full border-[1.5px] border-white shrink-0 inline-block" />
              </Link>

              {/* Bell (students only) */}
              {!isStaff && (
                <div className="relative" ref={bellRef}>
                  <button
                    className={`
                      p-2 rounded-lg transition-colors relative
                      ${bellOpen ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-500 hover:bg-gray-100'}
                    `}
                    onClick={() => { setBellOpen((o) => !o); setSettingsOpen(false); }}
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="
                        absolute top-0.5 right-0.5
                        min-w-[17px] h-[17px] px-1
                        bg-red-500 text-white text-[10px] font-bold
                        rounded-full flex items-center justify-center
                        pointer-events-none
                      ">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown isOpen={bellOpen} onClose={() => setBellOpen(false)} />
                </div>
              )}

              {/* Settings dropdown */}
              {/* <div className="relative" ref={settingsRef}>
                <button
                  className={`
                    p-2 rounded-lg transition-colors
                    ${settingsOpen ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-500 hover:bg-gray-100'}
                  `}
                  onClick={() => { setSettingsOpen((o) => !o); setBellOpen(false); }}
                >
                  <Settings size={20} />
                </button>
                {settingsOpen && (
                  <div
                    className="
                      absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2
                      bg-white border border-gray-200 rounded-xl shadow-lg
                      min-w-[220px] z-50 overflow-hidden
                      animate-[dropdown-in_0.18s_ease]
                    "
                    dir="rtl"
                  >
                    {settingsItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="
                          block px-5 py-3.5
                          text-sm font-medium text-gray-700
                          hover:bg-orange-50 hover:text-[#EB6837]
                          border-b border-gray-50 last:border-0
                          transition-colors
                        "
                        onClick={() => setSettingsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Settings dropdown */}
<div className="relative" ref={settingsRef}>
  <button
    className={`p-2 rounded-lg transition-colors ${settingsOpen ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-500 hover:bg-gray-100'}`}
    onClick={() => { setSettingsOpen((o) => !o); setBellOpen(false); }}
  >
    <Settings size={20} />
  </button>
  
  {settingsOpen && (
    <>
      {/* Overlay to close when clicking outside */}
      <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setSettingsOpen(false)} />
      
      {/* Settings Menu - NOW FIXED ABOVE COMPONENTS */}
      <div
        className="
          fixed top-[75px] left-4 md:left-[110px] 
          bg-white border border-gray-200 rounded-xl shadow-2xl
          min-w-[240px] z-[9999] overflow-hidden
          animate-in fade-in slide-in-from-top-2 duration-200
        "
        dir="rtl"
      >
        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/30">
          <span className="text-xs font-bold text-gray-400">إعدادات الحساب</span>
        </div>
        {settingsItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#EB6837] border-b border-gray-50 last:border-0 transition-colors"
            onClick={() => setSettingsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  )}
</div>

              {/* Logout button (desktop) */}
              <button
                className="
                  hidden sm:flex items-center gap-1.5
                  text-red-500 hover:text-red-600
                  text-sm font-medium transition-colors
                  px-2 py-2 rounded-lg hover:bg-red-50
                "
                onClick={logoutModal.open}
              >
                <LogOut size={18} />
                <span>تسجيل خروج</span>
              </button>

              {/* Hamburger (mobile only) */}
              <button
                className="
                  flex md:hidden items-center justify-center
                  p-2 rounded-lg text-gray-500 hover:bg-gray-100
                  transition-colors
                "
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="القائمة"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <>
              <button
                className="
                  px-4 py-2 rounded-full border-2 border-gray-200
                  text-gray-700 text-sm font-semibold
                  hover:border-[#EB6837] hover:text-[#EB6837]
                  transition-all cursor-pointer
                "
                onClick={() => navigate('/login')}
              >
                تسجيل الدخول
              </button>
              <button
                className="
                  px-4 py-2 rounded-full
                  bg-[#EB6837] text-white text-sm font-semibold
                  hover:bg-[#d55a2b] transition-colors cursor-pointer
                "
                onClick={() => navigate('/signup')}
              >
                انشاء حساب
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── Mobile slide-down menu ── */}
      {menuOpen && isAuthenticated && (
        <div
          className="
            fixed inset-0 z-30 bg-black/30 backdrop-blur-sm
            md:hidden
          "
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`
          fixed top-[64px] right-0 left-0 z-30
          bg-white border-b border-gray-200 shadow-lg
          md:hidden
          transition-all duration-200 overflow-hidden
          ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
        `}
        dir="rtl"
      >
        <nav className="flex flex-col p-3 gap-1">
          {isStaff ? (
            <NavLink
              to={dashboardLink}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              لوحة التعليم
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/LandingpageLogin"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                الصفحة الرئيسية
              </NavLink>
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/Community"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    المجتمع
                  </NavLink>
                  <NavLink
                    to="/Lessons"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive ? 'bg-orange-50 text-[#EB6837]' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    الدروس
                  </NavLink>
                </>
              )}
            </>
          )}

          {/* Mobile search (students only) */}
          {!isStaff && isAuthenticated && (
            <div className="relative mt-1 mx-1">
              <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="البحث عن درس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full h-10 rounded-xl border border-gray-200 bg-gray-50
                  pr-9 pl-4 text-sm text-gray-700 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#EB6837]/25 focus:border-[#EB6837]
                "
              />
            </div>
          )}

          {/* Logout mobile */}
          {isAuthenticated && (
            <button
              className="
                flex items-center gap-2 px-4 py-3 mt-1 rounded-xl
                text-sm font-medium text-red-500 hover:bg-red-50
                transition-colors
              "
              onClick={() => { logoutModal.open(); setMenuOpen(false); }}
            >
              <LogOut size={18} />
              <span>تسجيل خروج</span>
            </button>
          )}
        </nav>
      </div>

      <style>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>

      <LogoutModal isOpen={logoutModal.isOpen} onClose={logoutModal.close} />
    </>
  );
}