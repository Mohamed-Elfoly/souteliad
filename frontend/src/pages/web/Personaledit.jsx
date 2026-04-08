import "../../styles/profile.css";
import { Mail, CircleUser, Camera, ImagePlus, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateMeApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import Swal from 'sweetalert2';
import successGif from "../../assets/images/send.png";
export default function Personaledit() {
  const { user, updateUser } = useAuth();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [name, setName] = useState(`${user?.firstName || ""} ${user?.lastName || ""}`);
  const [email, setEmail] = useState(user?.email || "");
  const inputRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleImageChange = (file) => {
    if (!file) return;
    setImageFile(file);
    setRemovePhoto(false);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    setRemovePhoto(true);
    if (inputRef.current) inputRef.current.value = "";
  };

const mutation = useMutation({
  mutationFn: (formData) => updateMeApi(formData),
 onSuccess: (res) => {
  const updatedUser = res.data.data.user || res.data.data.data;
  if (updatedUser) updateUser(updatedUser);

  Swal.fire({
    title: "تهانينا!",
    text: "تم تحديث بياناتك بنجاح",
    imageUrl: successGif,                // لو عندك gif أو صورة نجاح في assets
    imageWidth: 200,
    imageHeight: 170,
    imageAlt: "نجاح",
    confirmButtonText: "تمام",
    confirmButtonColor: "#EB6837",
    timerProgressBar: true,
    showConfirmButton: false,            // اختياري: لو مش عايزة زرار "تمام" يفضل يختفي لوحده
    allowOutsideClick: true,            // عشان المستخدم ما يقدرش يقفلها بالضغط بره
    customClass: {
      popup: 'success-popup',            
    }
  });
},

onError: (err) => {
  Swal.fire({
    title: "في مشكلة",
    text: err.response?.data?.message || "حدث خطأ أثناء حفظ التغييرات، حاولي مرة تانية",
    icon: "error",
    confirmButtonText: "حسناً",
    confirmButtonColor: "#ef4444",
  });
},
});

  const handleSave = () => {
    const nameParts = name.trim().split(" ");
    const formData = new FormData();
    formData.append("firstName", nameParts[0] || "");
    formData.append("lastName", nameParts.slice(1).join(" ") || "");
    formData.append("email", email);
    if (imageFile) {
      formData.append("profilePicture", imageFile);
    } else if (removePhoto) {
      formData.append("profilePicture", "default.jpg");
    }
    mutation.mutate(formData);
  };

  // /uploads/* is proxied by Vite to the backend — use path directly
  const currentPicture = user?.profilePicture && user.profilePicture !== 'default.jpg'
    ? user.profilePicture
    : null;

  const displaySrc = removePhoto ? null : (imagePreview || currentPicture);
  const hasPhoto = !!displaySrc;

  return (
    <div className="profile-standalone-wrap">
      <div className="profile-standalone-card">
        <h2 className="profile-standalone-title">تعديل بيانات حسابي</h2>
        <p className="profile-standalone-sub">قم بتحديث معلومات حسابك الشخصي</p>

        {/* Avatar upload area */}
        <div className="avatar-upload-section">
          <div className="avatar-upload-wrapper" ref={menuRef}>
            <div
              className="avatar-upload-circle"
              onClick={() => setShowMenu((v) => !v)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleImageChange(e.dataTransfer.files[0]); setShowMenu(false); }}
            >
              {hasPhoto ? (
                <img src={displaySrc} alt="profile" className="avatar-upload-img" />
              ) : (
                <div className="avatar-upload-placeholder">
                  <span className="avatar-upload-initials">
                    {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                  </span>
                </div>
              )}
              <div className="avatar-upload-overlay">
                <Camera size={20} color="#fff" />
                <span>تغيير الصورة</span>
              </div>
            </div>
            {/* Dropdown menu */}
            {showMenu && (
              <div className="avatar-upload-menu">
                <button
                  type="button"
                  className="avatar-menu-item"
                  onClick={() => { inputRef.current?.click(); setShowMenu(false); }}
                >
                  <ImagePlus size={15} />
                  <span>{hasPhoto ? "تغيير الصورة" : "إضافة صورة"}</span>
                </button>
                {hasPhoto && (
                  <button
                    type="button"
                    className="avatar-menu-item avatar-menu-item--danger"
                    onClick={(e) => { handleRemovePhoto(e); setShowMenu(false); }}
                  >
                    <Trash2 size={15} />
                    <span>حذف الصورة</span>
                  </button>
                )}
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
          </div>
        </div>

        {/* Name */}
        <div className="profile-field">
          <label>الاسم الكامل</label>
          <div className="profile-input-row">
            <CircleUser size={18} color="#9ca3af" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
            />
          </div>
        </div>

        {/* Email */}
        <div className="profile-field">
          <label>البريد الإلكتروني</label>
          <div className="profile-input-row">
            <Mail size={18} color="#9ca3af" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
            />
          </div>
        </div>

        <button
          className="profile-save-btn"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </div>
  );
}
