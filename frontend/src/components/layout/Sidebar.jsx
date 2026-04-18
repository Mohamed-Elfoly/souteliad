// import {
//   Layers,
//   Users,
//   FileText,
//   Settings,
//   FilePen,
//   LayoutList,
//   MessageSquare,
// } from 'lucide-react';

// import { NavLink } from 'react-router-dom';
// import useAuth from '../../hooks/useAuth';
// import { ROLES } from '../../utils/constants';

// const adminItems = [
//   { to: '/Students', icon: Users, label: 'الطلاب' },
//   // { to: '/Community', icon: MessageSquare, label: 'المجتمع' },
//   {to: '/UserReviews', icon: MessageSquare, label: 'مراجعات المستخدمين'},
//   { to: '/Settings', icon: Settings, label: 'ادارة المستخدمين' },
// ];

// const teacherBaseItems = [
//   { to: '/Dashboard', icon: Layers, label: 'لوحة التعليم' },
//   { to: '/StudentsTeacher', icon: Users, label:'الطلاب' },
//   { to: '/AddLessonPage', icon: FilePen, label: 'الدروس و الامتحانات' },
//   { to: '/Community', icon: MessageSquare, label: 'المجتمع' },
//   { to: '/ManageContent', icon: LayoutList, label: 'إدارة المحتوى' },
// ];

// export default function Sidebar() {
//   const { user } = useAuth();

//   const teacherItems = [
//     ...teacherBaseItems,
//     ...(user?.permissions?.canViewReports
//       ? [{ to: '/Reports', icon: FileText, label: 'تقارير' }]
//       : []),
//   ];

//   const items = user?.role === ROLES.TEACHER ? teacherItems : adminItems;

//   return (
//     <aside className="sidebar">
//       <ul className="sidebar-menu">
//         {items.map((item) => (
//           <li key={item.to} className="sidebar-item">
//             <NavLink
//               to={item.to}
//               className={({ isActive }) => (isActive ? 'active' : '')}
//             >
//               <item.icon className="sidebar-icon" />
//               <span>{item.label}</span>
//             </NavLink>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }


import {
  Layers,
  Users,
  FileText,
  Settings,
  FilePen,
  LayoutList,
  MessageSquare,
} from 'lucide-react';

import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';

const adminItems = [
  { to: '/Students',     icon: Users,          label: 'الطلاب' },
  { to: '/UserReviews',  icon: MessageSquare,  label: 'مراجعات المستخدمين' },
  { to: '/Settings',     icon: Settings,       label: 'ادارة المستخدمين' },
];

const teacherBaseItems = [
  { to: '/Dashboard',     icon: Layers,        label: 'لوحة التعليم' },
  { to: '/StudentsTeacher', icon: Users,       label: 'الطلاب' },
  { to: '/AddLessonPage', icon: FilePen,       label: 'الدروس و الامتحانات' },
  { to: '/Community',     icon: MessageSquare, label: 'المجتمع' },
  { to: '/ManageContent', icon: LayoutList,    label: 'إدارة المحتوى' },
];

export default function Sidebar() {
  const { user } = useAuth();

  const teacherItems = [
    ...teacherBaseItems,
    ...(user?.permissions?.canViewReports
      ? [{ to: '/Reports', icon: FileText, label: 'تقارير' }]
      : []),
  ];

  const items = user?.role === ROLES.TEACHER ? teacherItems : adminItems;

  return (
    /*
      Two widths controlled by CSS custom property set on :root equivalent:
        ≥ md (825px+)  → 240px  (show icon + label)
        < md           → 72px   (icon only)

      We use a real <style> tag once to inject the CSS var so AdminLayout
      can read it too via var(--sidebar-width).
    */
    <>
      <style>{`
        :root {
          --sidebar-width: 240px;
        }
        @media (max-width: 825px) {
          :root { --sidebar-width: 72px; }
        }
      `}</style>

      <aside
        className="
          sticky top-0 h-screen
          bg-white border-l border-gray-200
          transition-all duration-200

          /* full width on desktop, icon-only on mobile */
          w-[240px] max-[825px]:w-[72px]
        "
      >
        <ul className="list-none p-0 m-0 pt-3 flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => [
                  /* base */
                  'flex items-center gap-3 px-5 py-3 mx-2 rounded-xl',
                  'text-gray-500 text-[15px] font-medium no-underline',
                  'transition-all duration-150',
                  /* collapsed (icon-only) */
                  'max-[825px]:justify-center max-[825px]:px-3 max-[825px]:mx-1',
                  /* hover */
                  !isActive && 'hover:bg-gray-50 hover:text-[#EB6837]',
                  /* active */
                  isActive && 'bg-[#fff5f2] text-[#EB6837] font-semibold border-r-[3px] border-[#EB6837]',
                ].join(' ')}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={[
                        'shrink-0',
                        'w-5 h-5 max-[825px]:w-[22px] max-[825px]:h-[22px]',
                        isActive ? 'text-[#EB6837]' : 'text-gray-400',
                      ].join(' ')}
                    />
                    {/* Label hidden when sidebar is collapsed */}
                    <span className="max-[825px]:hidden">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}