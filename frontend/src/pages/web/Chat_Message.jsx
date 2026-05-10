import "../../styles/chats.css";
import { Search, Send, Plus, Image, MessageCircle, Trash2, X, Camera } from "lucide-react";
import hello from "../../assets/images/hello2.png";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getConversations,
  createConversation,
  deleteConversation,
} from "../../api/chatApi";

export default function Chat_Message() {
  const { conversationId } = useParams();
  const navigate = useNavigate();


  const [showOptions, setShowOptions] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");

  // Camera states
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [captured, setCaptured] = useState(null);

  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load sidebar conversations
  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch(() => {});
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (!conversationId) return;
    setLoadingHistory(true);
    setMessages([]);
    getChatHistory(conversationId)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [conversationId]);


  // Camera functions
  const openCamera = useCallback(async () => {
    setShowOptions(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setCameraStream(stream);
      setCameraOpen(true);
      setCaptured(null);
    } catch {
      alert("تعذّر الوصول إلى الكاميرا. تأكد من منح الإذن.");
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraOpen(false);
    setCaptured(null);
  }, [cameraStream]);

  useEffect(() => {
    if (cameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg", 0.9));
  };

  const confirmCapture = () => {
    if (!captured) return;
    // Convert base64 to File
    const arr = captured.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    const file = new File([u8arr], "camera-capture.jpg", { type: mime });
    setSelectedImage(file);
    setImagePreview(captured);
    closeCamera();
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setShowOptions(false);
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
      const data = await sendMessage(conversationId, userText, imageFile);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, _id: data.messageId },
      ]);
      // Refresh sidebar to update title/lastMessage
      getConversations().then(setConversations).catch(() => {});
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
      await clearChatHistory(conversationId);
      setMessages([]);
    } catch {
      // ignore
    }
  };

  const handleNewConversation = async () => {
    try {
      const conv = await createConversation();
      setConversations((prev) => [conv, ...prev]);
      navigate(`/Chat_Message/${conv._id}`);
    } catch {
      // ignore
    }
  };

  const handleOpenConversation = (id) => {
    if (id !== conversationId) navigate(`/Chat_Message/${id}`);
  };

  const handleDeleteConversation = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (id === conversationId) navigate("/Chats");
    } catch {
      // ignore
    }
  };

  const resolveImageSrc = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("__preview__")) return imageUrl.replace("__preview__", "");
    return imageUrl;
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const currentTitle =
    conversations.find((c) => c._id === conversationId)?.title || "صوت اليد";

  return (
    <div className="chat-layout">
      <div className="voice-container">
        <div className="voice-card">
          <div className="voice-card-header">
            <h1 className="title">{currentTitle}</h1>
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
                      <img src={imgSrc} alt="صورة مرسلة" className="chat-bubble-image" />
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
              <button className="plus-btn" onClick={() => setShowOptions(!showOptions)}>
                <Plus size={20} />
              </button>
              {showOptions && (
                <div className="plus-menu">
                  <div className="menu-item" onClick={() => imageInputRef.current.click()}>
                    <Image size={18} />
                    <span>صورة</span>
                  </div>
                  <div className="menu-item" onClick={openCamera}>
                    <Camera size={18} />
                    <span>كاميرا</span>
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
        <div className="chat-sidebar-header">
          <span className="chat-sidebar-title">المحادثات</span>
          <button className="chat-new-btn" onClick={handleNewConversation} title="محادثة جديدة">
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

        {filtered.length === 0 ? (
          <p className="chat-sidebar-empty">لا توجد محادثات</p>
        ) : (
          <div className="chat-conv-list">
            {filtered.map((conv) => (
              <div
                key={conv._id}
                className={`chat-conv-item ${conv._id === conversationId ? "chat-conv-active" : ""}`}
                onClick={() => handleOpenConversation(conv._id)}
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
                  onClick={(e) => handleDeleteConversation(e, conv._id)}
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Camera Modal */}
      {cameraOpen && (
        <div className="camera-overlay" onClick={closeCamera}>
          <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
            <div className="camera-modal-header">
              <span>التقط إشارتك</span>
              <button className="camera-close-btn" onClick={closeCamera}>
                <X size={18} />
              </button>
            </div>

            {!captured ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="camera-video" />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <button className="camera-capture-btn" onClick={capturePhoto}>
                  <Camera size={22} />
                  التقط صورة
                </button>
              </>
            ) : (
              <>
                <img src={captured} alt="الصورة الملتقطة" className="camera-preview" />
                <div className="camera-actions">
                  <button className="camera-retake-btn" onClick={() => setCaptured(null)}>
                    إعادة التقاط
                  </button>
                  <button className="camera-confirm-btn" onClick={confirmCapture}>
                    إرسال
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
