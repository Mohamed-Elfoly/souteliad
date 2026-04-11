// import { Outlet, NavLink } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
// import { ROLES } from '../../utils/constants';
// import Avatar from '../ui/Avatar';
// import '../../styles/profile.css';

// const allMenuItems = [
//   { to: '/Personal', label: 'بيانات حسابي الشخصي', end: true, staffOnly: false },
//   { to: '/Personal/password', label: 'تغيير كلمة المرور' },
//   { to: '/Personal/grades', label: 'درجاتي', end: false, staffOnly: true },  
//   { to: '/Personal/personalstandard', label: 'المستويات', end: true, staffOnly: false },
//   { to: '/Personal/support', label: 'الدعم', end: true, staffOnly: false },
// ];

// export default function ProfileLayout() {
//   const { user } = useAuth();
//   const isStaff = user?.role === ROLES.ADMIN || user?.role === ROLES.TEACHER;
//   const menuItems = allMenuItems.filter((item) => !isStaff || !item.staffOnly);

//   return (
//     <div className="profile-page" dir="rtl">
//       {/* Sidebar */}
//       <div className="profile-sidebar">
//         <div className="profile-sidebar-card">
//           <div className="profile-avatar-section">
//             <Avatar
//               src={user?.profilePicture}
//               name={`${user?.firstName || ''} ${user?.lastName || ''}`}
//               iconSize={65}
//             />
//             <h3 className="profile-name">{user?.firstName} {user?.lastName}</h3>
//             <p className="profile-email">{user?.email}</p>
//           </div>

//           {menuItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               end={item.end}
//               className={({ isActive }) =>
//                 `profile-nav-btn ${isActive ? 'active' : ''}`
//               }
//             >
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//       </div>

//       <div className="profile-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { Outlet, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import Avatar from '../ui/Avatar';

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
    <div
      dir="rtl"
      className="flex min-h-[calc(100vh-80px)] bg-[#f7f8fa] gap-6 px-20 py-8 max-[1200px]:px-10 max-[860px]:flex-col max-[860px]:px-4 max-[860px]:py-5"
    >
      {/* Sidebar */}
      <div className="w-[350px] shrink-0 max-[860px]:w-full">
        <div className="bg-white rounded-[20px] px-5 py-7 shadow-[0_2px_12px_rgba(0,0,0,0.07)] sticky top-6 max-[860px]:static">

          {/* Avatar section */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-[#f0f2f5] mb-4">
            <Avatar
              src={user?.profilePicture}
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              iconSize={65}
            />
            <h3 className="text-[17px] font-bold text-[#252c32] mt-3 mb-1 w-full break-words px-2">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-[13px] text-[#868687] m-0 w-full break-all px-2">
              {user?.email}
            </p>
          </div>

          {/* Nav links */}
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center w-full px-[18px] py-[15px] mb-3 last:mb-0 rounded-[9px] text-[15px] font-semibold no-underline transition-colors duration-200 font-[Rubik,sans-serif] text-right truncate ${
                  isActive
                    ? 'bg-[#EB6837] text-[#fff8f5]'
                    : 'bg-[#fff2e7] text-[#555] hover:bg-[#fff8f5] hover:text-[#EB6837]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}