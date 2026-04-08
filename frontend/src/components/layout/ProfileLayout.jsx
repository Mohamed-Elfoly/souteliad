import { Outlet, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import Avatar from '../ui/Avatar';
import '../../styles/profile.css';

const allMenuItems = [
  { to: '/Personal', label: 'بيانات حسابي الشخصي', end: true, staffOnly: false },
  { to: '/Personal/password', label: 'تغيير كلمة المرور' },
  { to: '/Personal/grades', label: 'درجاتي', end: false, staffOnly: true },  
  { to: '/Personal/personalstandard', label: 'المستويات', end: true, staffOnly: false },
  { to: '/Personal/support', label: 'الدعم', end: true, staffOnly: false },
];

export default function ProfileLayout() {
  const { user } = useAuth();
  const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
  const menuItems = allMenuItems.filter((item) => !isStaff || !item.staffOnly);

  return (
    <div className="profile-page" dir="rtl">
      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-sidebar-card">
          <div className="profile-avatar-section">
            <Avatar
              src={user?.profilePicture}
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              iconSize={65}
            />
            <h3 className="profile-name">{user?.firstName} {user?.lastName}</h3>
            <p className="profile-email">{user?.email}</p>
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `profile-nav-btn ${isActive ? 'active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
}
