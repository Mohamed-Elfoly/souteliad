import "../../styles/chats.css";
import { Search } from "lucide-react";
import hello from "../../assets/images/hello2.png";
import React, { useState, useRef } from "react";
import {
  Camera,
  Image,
  MessageCircle,
  Send,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chat_Message() {
  const [showOptions, setShowOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  
  const handleImageClick = () => {
    imageInputRef.current.click();
    setShowOptions(false);
  };

  const handleCameraClick = () => {
    cameraInputRef.current.click();
    setShowOptions(false);
  };

  const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    video.style.width = "100%";
    document.body.appendChild(video);

    // إضافة زر لالتقاط الصورة
    const captureBtn = document.createElement("button");
    captureBtn.innerText = "Capture";
    document.body.appendChild(captureBtn);

    captureBtn.onclick = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = canvas.toDataURL("image/png");
      console.log("Captured image:", imgData);
      alert("تم التقاط الصورة!");
      // ممكن تبعتي imgData للـ backend أو تخزنيها
    };
  } catch (err) {
    console.error("Cannot open camera:", err);
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  // إرسال رسالة
  const handleSend = () => {
    if (message.trim() === "") return;

    setMessages([...messages, message]);
    setMessage("");
  };

  return (
    <>
      {/* Layout */}
      <div className="chat-layout">
        <div className="voice-container">
          <div className="voice-card">
            <h1 className="title">صوت اليد</h1>

            <div className="avatar-wrapper">
              <img src={hello} alt="assistant" />
            </div>

            <h2 className="welcome">مرحباً بك في مساعد صوت اليد.</h2>
            <h3 className="sub-title">
              اسأل عن أي إشارة... وتعلم فوراً
            </h3>

            <p className="description">
              اكتب سؤالك أو فعل الكاميرا أو أرسل صورة،
              وسنساعدك في تفسير الإشارة، شرحها، أو التدريب عليها بطريقة بسيطة وسريعة.
            </p>
            {/* Chat Input */}
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
                    <div className="menu-item" onClick={() => { openCamera(); setShowOptions(false); }}>
  <Camera />
  <span>كاميرا</span>
</div>

                    <div className="menu-item" onClick={handleImageClick}>
                      <Image />
                      <span>صور</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Inputs مخفية */}
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={cameraInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />

              <button className="send-btn" onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="chat-sidebar">
          <div className="chat-search-box">
            <input type="text" placeholder="البحث" />
            <Search size={18} className="chat-search-icon" />
          </div>

          <div className="chat-item">
            <MessageCircle size={18}  />
            <span className="chat-msg-sender">صوت اليد</span>
          </div>
          <div className="mymessage-container">
            {messages.length === 0 ? (
              <p className="chat-msg-empty">لا توجد رسائل بعد</p>
            ) : (
              [...messages].reverse().map((msg, index) => (
                <p key={index} className="chat-msg-item">
                  {msg}
                </p>
              ))
            )}
          </div>

        </aside>
      </div>
    </>
  );
}
