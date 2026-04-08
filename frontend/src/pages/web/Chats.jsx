import "../../styles/chats.css";
import { Search, Flag, MessageCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chats() {
  const navigate = useNavigate();

  return (
    <div className="chat-layout">
      <main className="chat-main">
        <div className="chat-welcome-card">

          <div className="chat-welcome-icon">
            <MessageCircle size={36} color="#EB6837" />
          </div>

          <h1>مرحباً بك في دردشة صوت اليد</h1>

          <p className="chat-description">
            المساعد الذكي اللي هيساعدك تتعلم لغة الإشارة خطوة بخطوة،
            وتسأل عن أي إشارة أو درس بسهولة.
          </p>

          <div className="chat-info-box">
            <div className="chat-info-icon">
              <Flag size={18} color="#EB6837" />
            </div>
            <div>
              <h4>قد تكون الردود غير دقيقة أحياناً</h4>
              <p>
                المساعد يحاول يقدم أفضل تفسير، لكن بعض الإشارات أو التفاصيل قد تحتاج مراجعة من مدرب متخصص.
              </p>
            </div>
          </div>

          <div className="chat-info-box">
            <div className="chat-info-icon">
              <Lock size={18} color="#EB6837" />
            </div>
            <div>
              <h4>احفظ خصوصيتك</h4>
              <p>
                تجنب مشاركة بيانات شخصية أو معلومات حساسة. هدفنا إن تجربتك تكون آمنة وواضحة.
              </p>
            </div>
          </div>

          <button className="chat-start-btn" onClick={() => navigate("/Chat_Message")}>
            ابدأ الدردشة
          </button>

        </div>
      </main>

      <aside className="chat-sidebar">
        <div className="chat-search-box">
          <Search size={18} className="chat-search-icon" />
          <input type="text" placeholder="البحث" />
        </div>

        <div className="chat-item">
          <MessageCircle size={18} />
          <span>صوت اليد</span>
        </div>
      </aside>
    </div>
  );
}
