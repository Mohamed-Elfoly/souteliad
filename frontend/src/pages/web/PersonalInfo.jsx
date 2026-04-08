import { Mail, CircleUser, Edit2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import useAuth from '../../hooks/useAuth';
import '../../styles/profile.css';

export default function PersonalInfo() {
  const { user } = useAuth();

  // نفترض إن الـ user عنده خاصية level أو currentLevel
  // لو مش موجودة، ممكن تجيبها من API منفصل أو من الـ levels

  return (
    <div className="profile-section-card">
      <h2 className="profile-section-title">بيانات حسابي</h2>
      <p className="profile-section-sub">معلومات حسابك الشخصي</p>

      {/* Avatar مع المستوى */}
      <div className="profile-avatar-row">
        <Avatar
          src={user?.profilePicture}
          name={`${user?.firstName || ''} ${user?.lastName || ''}`}
          iconSize={44}
          level={user?.currentLevel || 0}           // ← أهم سطر جديد
        />
        <div>
          <p className="profile-avatar-name">{user?.firstName} {user?.lastName}</p>
          <p className="profile-avatar-email">{user?.email}</p>
        </div>
      </div>

      <hr className="profile-section-divider" />

      {/* Full name */}
      <div className="profile-field">
        <label>الاسم الكامل</label>
        <div className="profile-input-row profile-input-row--readonly">
          <CircleUser size={18} color="#9ca3af" />
          <span className="profile-info-value">{user?.firstName} {user?.lastName}</span>
        </div>
      </div>

      {/* Email */}
      <div className="profile-field">
        <label>البريد الإلكتروني</label>
        <div className="profile-input-row profile-input-row--readonly">
          <Mail size={18} color="#9ca3af" />
          <span className="profile-info-value">{user?.email}</span>
        </div>
      </div>

      <Link to="/Personal/edit" className="profile-save-btn">
        <Edit2 size={16} style={{ display: 'inline', marginLeft: 6, verticalAlign: 'middle' }} />
        تعديل البيانات
      </Link>
    </div>
  );
}