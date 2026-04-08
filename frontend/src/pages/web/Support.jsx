import "../../styles/profile.css";
import { Mail, CircleUser, Phone, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import successGif from "../../assets/images/send.png";
import Swal from "sweetalert2";
export default function Support() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: user?.email || "",
    reason: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
  if (!formData.message.trim()) {
    Swal.fire({
      icon: "warning",
      title: "من فضلك اكتبي الرسالة",
      timerProgressBar: true,
      showConfirmButton: false,            
      allowOutsideClick: true, 
    });
    return;
  }

  Swal.fire({
      text: "تم أرسال الرسالة بنجاح",
      imageUrl: successGif,                
      imageWidth: 200,
      imageHeight: 170,
      imageAlt: "نجاح",
      timer: 1000,
      confirmButtonText: "تمام",
      confirmButtonColor: "#EB6837",
      timerProgressBar: true,
      showConfirmButton: false,            
      allowOutsideClick: true,            
      customClass: {
        popup: 'success-popup',            
      }
      });
};

  return (
    <>
      <div className="profile-section-card">
        <div className="container">
          <h2 className="profile-standalone-title">الدعم والمساعدة</h2>
          <p className="profile-standalone-sub" style={{ textAlign: "right" }}>
           نحن هنا لمساعدتك💛<br /> إذا كان لديك أي أسئلة، ملاحظات، أو تحتاجين إلى مساعدة， يسعد فريقنا التواصل معك. من فضلك املأ نموذج التواصل بالأسفل وسنرد عليك في أقرب وقت ممكن. يمكنك أيضًا التواصل معنا عبر وسائل الاتصال المتاحة.
          </p>

          {/* Contact cards */}
          <p className="profile-field-label">طرق التواصل معنا</p>
          <div className="profile-contact-grid">
            <div className="profile-contact-card">
              <div className="profile-contact-icon">
                <Phone size={18} color="#fff" />
              </div>
              <div className="profile-contact-info">
                <p>الهاتف</p>
                <span>01150809001</span>
              </div>
            </div>
            <div className="profile-contact-card">
              <div className="profile-contact-icon">
                <Mail size={18} color="#fff" />
              </div>
              <div className="profile-contact-info">
                <p>البريد الإلكتروني</p>
                <span>sawt.Elyad@gmail.com</span>
              </div>
            </div>
          </div>

          <hr className="profile-divider" />

          {/* Message form */}
          <p className="profile-field-label">ترك رسالة</p>

          <div className="profile-field">
            <label>الاسم الكامل</label>
            <div className="profile-input-row">
              <CircleUser size={18} color="#9ca3af" />
              <input
                type="text"
                name="name"
                placeholder="أدخل الاسم بالكامل"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>البريد الإلكتروني</label>
            <div className="profile-input-row">
              <Mail size={18} color="#9ca3af" />
              <input
                type="email"
                name="email"
                placeholder="أدخل البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>سبب التواصل</label>
            <div className="profile-input-row">
              <MessageCircle size={18} color="#9ca3af" />
              <input
                type="text"
                name="reason"
                placeholder="اكتب سبب التواصل"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="profile-field">
            <label>الرسالة</label>
            <textarea
              className="profile-textarea"
              name="message"
              placeholder="اكتب رسالتك هنا..."
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button className="profile-save-btn" onClick={handleSubmit}>
            <Send size={16} style={{ display: "inline", marginLeft: 8, verticalAlign: "middle" }} />
            إرسال الرسالة
          </button>
        </div>
      </div>

    </>
  );
}
