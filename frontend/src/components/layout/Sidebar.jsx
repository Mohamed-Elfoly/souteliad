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
  { to: '/Students', icon: Users, label: 'الطلاب' },
  // { to: '/Community', icon: MessageSquare, label: 'المجتمع' },
  {to: '/UserReviews', icon: MessageSquare, label: 'مراجعات المستخدمين'},
  { to: '/Settings', icon: Settings, label: 'ادارة المستخدمين' },
];

const teacherBaseItems = [
  { to: '/Dashboard', icon: Layers, label: 'لوحة التعليم' },
  { to: '/StudentsTeacher', icon: Users, label:'الطلاب' },
  { to: '/AddLessonPage', icon: FilePen, label: 'الدروس و الامتحانات' },
  { to: '/Community', icon: MessageSquare, label: 'المجتمع' },
  { to: '/ManageContent', icon: LayoutList, label: 'إدارة المحتوى' },
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
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {items.map((item) => (
          <li key={item.to} className="sidebar-item">
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <item.icon className="sidebar-icon" />
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
