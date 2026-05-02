import "../../styles/chats.css";
import { Search, Send, Plus, Image, MessageCircle, Trash2, X } from "lucide-react";
import hello from "../../assets/images/hello2.png";
import React, { useState, useRef, useEffect } from "react";
import { sendMessage, getChatHistory, clearChatHistory } from "../../api/chatApi";

export default function Chat_Message() {
  const [showOptions, setShowOptions] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(null);   // Object URL

  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();
        setMessages(history);
      } catch {
        // no history yet
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowOptions(false);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSend = async () => {
    if ((input.trim() === "" && !selectedImage) || loading) return;

    const userText = input.trim();
    const imageFile = selectedImage;
    const previewUrl = imagePreview;

    setInput("");
    setSelectedImage(null);
    setImagePreview(null);
    setLoading(true);

    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userText,
        imageUrl: previewUrl ? `__preview__${previewUrl}` : null,
        _id: Date.now(),
      },
    ]);

    try {
      const data = await sendMessage(userText, imageFile);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, _id: data.messageId },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
          _id: Date.now() + 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await clearChatHistory();
      setMessages([]);
    } catch {
      // ignore
    }
  };

  const resolveImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    // Optimistic preview uses object URL
    if (imageUrl.startsWith("__preview__")) return imageUrl.replace("__preview__", "");
    // Saved image from server
    return imageUrl;
  };

  return (
    <div className="chat-layout">
      <div className="voice-container">
        <div className="voice-card">
          <div className="voice-card-header">
            <h1 className="title">صوت اليد</h1>
            {messages.length > 0 && (
              <button className="clear-btn" onClick={handleClear} title="مسح المحادثة">
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {messages.length === 0 && !loadingHistory && (
            <>
              <div className="avatar-wrapper">
                <img src={hello} alt="assistant" />
              </div>
              <h2 className="welcome">مرحباً بك في مساعد صوت اليد.</h2>
              <h3 className="sub-title">اسأل عن أي إشارة... وتعلم فوراً</h3>
              <p className="description">
                اكتب سؤالك أو أرسل صورة لإشارة، وسنساعدك في تحليلها وشرحها بطريقة بسيطة وسريعة.
              </p>
            </>
          )}

          {loadingHistory && (
            <div className="chat-loading-history">جاري تحميل المحادثة...</div>
          )}

          {messages.length > 0 && (
            <div className="chat-messages">
              {messages.map((msg) => {
                const imgSrc = resolveImageSrc(msg.imageUrl);
                return (
                  <div
                    key={msg._id}
                    className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}
                  >
                    {imgSrc && (
                      <img
                        src={imgSrc}
                        alt="صورة مرسلة"
                        className="chat-bubble-image"
                      />
                    )}
                    {msg.content && <p>{msg.content}</p>}
                  </div>
                );
              })}
              {loading && (
                <div className="chat-bubble chat-bubble-ai chat-bubble-typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Image preview strip above input */}
          {imagePreview && (
            <div className="chat-image-preview">
              <img src={imagePreview} alt="معاينة" />
              <button className="chat-image-remove" onClick={clearSelectedImage}>
                <X size={14} />
              </button>
            </div>
          )}

          <div className="chat-input">
            <div className="plus-wrapper">
              <button
                className="plus-btn"
                onClick={() => setShowOptions(!showOptions)}
              >
                <Plus size={20} />
              </button>
              {showOptions && (
                <div className="plus-menu">
                  <div className="menu-item" onClick={() => imageInputRef.current.click()}>
                    <Image />
                    <span>صورة</span>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك عن إشارة..."
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              disabled={loading}
            />

            <button className="send-btn" onClick={handleSend} disabled={loading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      <aside className="chat-sidebar">
        <div className="chat-search-box">
          <input type="text" placeholder="البحث" />
          <Search size={18} className="chat-search-icon" />
        </div>
        <div className="chat-item">
          <MessageCircle size={18} />
          <span className="chat-msg-sender">صوت اليد</span>
        </div>
      </aside>
    </div>
  );
}
