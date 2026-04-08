import logo from '../../assets/images/logo1.png';
import illustrationImg from '../../assets/images/illustration.png';
import '../../styles/dashboard-auth.css';

export default function DashboardAuthLayout({ children }) {
  return (
    <div className="dash-auth">
      <div className="dash-auth-form">
        <div className="dash-auth-logo">
          <img src={logo} alt="صوت اليد" />
          <h2>صوت اليد</h2>
        </div>
        <div className="dash-auth-content">
          {children}
        </div>
      </div>
      <div className="dash-auth-illustration">
        <img src={illustrationImg} alt="صوت اليد" />
      </div>
    </div>
  );
}
