import "../../styles/chats.css";
import { Search, Flag, MessageCircle, Lock, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getConversations, createConversation, deleteConversation } from "../../api/chatApi";

export default function Chats() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    try {
      const conv = await createConversation();
      navigate(`/Chat_Message/${conv._id}`);
    } catch {
      // ignore
    }
  };

  const handleOpen = (id) => navigate(`/Chat_Message/${id}`);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
    } catch {
      // ignore
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

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
          <button className="chat-start-btn" onClick={handleStart}>
            ابدأ دردشة جديدة
          </button>
        </div>
      </main>

      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <span className="chat-sidebar-title">المحادثات</span>
          <button className="chat-new-btn" onClick={handleStart} title="محادثة جديدة">
            <Plus size={16} />
          </button>
        </div>

        <div className="chat-search-box">
          <Search size={18} className="chat-search-icon" />
          <input
            type="text"
            placeholder="البحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="chat-sidebar-empty">جاري التحميل...</p>
        ) : filtered.length === 0 ? (
          <p className="chat-sidebar-empty">لا توجد محادثات</p>
        ) : (
          <div className="chat-conv-list">
            {filtered.map((conv) => (
              <div
                key={conv._id}
                className="chat-conv-item"
                onClick={() => handleOpen(conv._id)}
              >
                <MessageCircle size={16} className="chat-conv-icon" />
                <div className="chat-conv-info">
                  <span className="chat-conv-title">{conv.title}</span>
                  {conv.lastMessage && (
                    <span className="chat-conv-last">{conv.lastMessage}</span>
                  )}
                </div>
                <button
                  className="chat-conv-delete"
                  onClick={(e) => handleDelete(e, conv._id)}
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
