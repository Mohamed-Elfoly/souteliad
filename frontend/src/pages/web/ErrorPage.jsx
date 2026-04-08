import { useNavigate } from 'react-router-dom';
import solvenow from "../../assets/images/solvenow.png";
import '../../styles/error-page.css';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-illustration">
        <img src={solvenow} alt="حصل خطأ" />
      </div>
      <p className="error-message">حصل خطأ بسيط... بنحله حالاً.</p>
      <button className="error-home-btn" onClick={() => navigate('/landingpage')}>
        العودة للرئيسية
      </button>
    </div>
  );
}

export default ErrorPage;
