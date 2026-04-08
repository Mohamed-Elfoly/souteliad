import "../../styles/chats.css";
import solvenow from "../../assets/images/solvenow.png";
import { useNavigate } from "react-router-dom";

export default function Solvenow() {
  const navigate = useNavigate();

  return (
    <div className="probem-modal">
      <img src={solvenow} alt="" />
      <h3>حصل خطأ بسيط… بنحله حالاً.</h3>
      <button className="btnnn-no" onClick={() => navigate("/Landingpage")}>العودة للرئيسية</button>
    </div>
  );
}
