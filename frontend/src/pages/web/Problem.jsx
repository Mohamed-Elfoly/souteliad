import "../../styles/profile.css";
import problem from "../../assets/images/problem.png";
import { useNavigate } from "react-router-dom";

export default function Problem() {
  const navigate = useNavigate();

  return (
    <div className="problem-page">
      <img src={problem} alt="connection problem" className="problem-image" />
      <h3 className="problem-title">مشكلة بسيطة في الاتصال… حاول بعد لحظة.</h3>
      <button className="problem-btn" onClick={() => navigate("/LandingpageLogin")}>
        العودة للرئيسية
      </button>
    </div>
  );
}
