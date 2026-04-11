// import { Mail, CircleUser, Phone, MessageCircle, Send, Loader2 } from "lucide-react";
// import { useState } from "react";
// import useAuth from "../../hooks/useAuth";
// import successGif from "../../assets/images/send.png";
// import Swal from "sweetalert2";
// import { createTicket } from "../../api/supportApi";

// export default function Support() {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
//     email: user?.email || "",
//     reason: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.message.trim()) {
//       Swal.fire({
//         icon: "warning",
//         title: "من فضلك اكتب الرسالة",
//         timerProgressBar: true,
//         showConfirmButton: false,
//         allowOutsideClick: true,
//       });
//       return;
//     }

//     if (!formData.reason.trim()) {
//       Swal.fire({
//         icon: "warning",
//         title: "من فضلك اكتب سبب التواصل",
//         timerProgressBar: true,
//         showConfirmButton: false,
//         allowOutsideClick: true,
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       await createTicket(formData);

//       Swal.fire({
//         text: "تم إرسال الرسالة بنجاح",
//         imageUrl: successGif,
//         imageWidth: 200,
//         imageHeight: 170,
//         imageAlt: "نجاح",
//         timer: 2000,
//         confirmButtonText: "تمام",
//         confirmButtonColor: "#EB6837",
//         timerProgressBar: true,
//         showConfirmButton: false,
//         allowOutsideClick: true,
//         customClass: { popup: "success-popup" },
//       });

//       // Reset message and reason after successful submission
//       setFormData((prev) => ({ ...prev, reason: "", message: "" }));
//     } catch (err) {
//       Swal.fire({
//         icon: "error",
//         title: "حدث خطأ",
//         text: err?.response?.data?.message || "يرجى المحاولة مرة أخرى",
//         confirmButtonColor: "#EB6837",
//         confirmButtonText: "حسناً",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)] mx-auto" dir="rtl">
//       <div className="max-w-2xl mx-auto">

//         {/* Title */}
//         <h2 className="text-center text-[22px] font-extrabold text-[#666667] pb-5 mb-1">
//           الدعم والمساعدة
//         </h2>
//         <p className="text-sm text-[#868687] text-right mb-8 leading-relaxed">
//           نحن هنا لمساعدتك 💛<br />
//           إذا كان لديك أي أسئلة، ملاحظات، أو تحتاج إلى مساعدة، يسعد فريقنا التواصل معك.
//           من فضلك املأ نموذج التواصل بالأسفل وسنرد عليك في أقرب وقت ممكن.
//           يمكنك أيضًا التواصل معنا عبر وسائل الاتصال المتاحة.
//         </p>

//         {/* Contact cards */}
//         <p className="text-sm font-semibold text-[#373d41] mb-3">طرق التواصل معنا</p>
//         <div className="grid grid-cols-2 gap-3 mb-7 max-sm:grid-cols-1">
//           <div className="flex items-center gap-3 p-[14px_16px] bg-[#fff8f5] border-[1.5px] border-[#fde8de] rounded-2xl">
//             <div className="w-10 h-10 rounded-[10px] bg-[#EB6837] flex items-center justify-center shrink-0">
//               <Phone size={18} color="#fff" />
//             </div>
//             <div>
//               <p className="text-[11px] text-[#868687] mb-0.5">الهاتف</p>
//               <span className="text-[13px] font-bold text-[#252c32] block" dir="ltr">01150809001</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 p-[14px_16px] bg-[#fff8f5] border-[1.5px] border-[#fde8de] rounded-2xl">
//             <div className="w-10 h-10 rounded-[10px] bg-[#EB6837] flex items-center justify-center shrink-0">
//               <Mail size={18} color="#fff" />
//             </div>
//             <div>
//               <p className="text-[11px] text-[#868687] mb-0.5">البريد الإلكتروني</p>
//               <span className="text-[13px] font-bold text-[#252c32] block" dir="ltr">sawt.Elyad@gmail.com</span>
//             </div>
//           </div>
//         </div>

//         <hr className="border-none border-t border-[#f0f2f5] my-6" />

//         {/* Form */}
//         <p className="text-sm font-semibold text-[#373d41] mb-3">ترك رسالة</p>

//         {/* Full Name */}
//         <div className="mb-5">
//           <label className="block text-sm font-semibold text-[#373d41] mb-2">الاسم الكامل</label>
//           <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
//             <CircleUser size={18} color="#9ca3af" className="shrink-0" />
//             <input
//               type="text"
//               name="fullName"
//               placeholder="أدخل الاسم بالكامل"
//               value={formData.fullName}
//               onChange={handleChange}
//               className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
//               style={{ outline: "none" }}
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div className="mb-5">
//           <label className="block text-sm font-semibold text-[#373d41] mb-2">البريد الإلكتروني</label>
//           <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
//             <Mail size={18} color="#9ca3af" className="shrink-0" />
//             <input
//               type="email"
//               name="email"
//               placeholder="أدخل البريد الإلكتروني"
//               value={formData.email}
//               onChange={handleChange}
//               className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
//               dir="ltr"
//               style={{ outline: "none" }}
//             />
//           </div>
//         </div>

//         {/* Reason */}
//         <div className="mb-5">
//           <label className="block text-sm font-semibold text-[#373d41] mb-2">سبب التواصل</label>
//           <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
//             <MessageCircle size={18} color="#9ca3af" className="shrink-0" />
//             <input
//               type="text"
//               name="reason"
//               placeholder="اكتب سبب التواصل"
//               value={formData.reason}
//               onChange={handleChange}
//               className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
//               style={{ outline: "none" }}
//             />
//           </div>
//         </div>

//         {/* Message */}
//         <div className="mb-5">
//           <label className="block text-sm font-semibold text-[#373d41] mb-2">الرسالة</label>
//           <textarea
//             name="message"
//             placeholder="اكتب رسالتك هنا..."
//             value={formData.message}
//             onChange={handleChange}
//             className="w-full px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl outline-none text-[15px] font-[Rubik,sans-serif] text-[#373d41] resize-none min-h-[120px] text-right transition-all focus:border-[#EB6837] focus:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]"
//             style={{ outline: "none" }}
//           />
//         </div>

//         {/* Submit button */}
//         <button
//           onClick={handleSubmit}
//           disabled={loading}
//           className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#EB6837] hover:bg-[#d45a2b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-xl transition-colors font-[Rubik,sans-serif] cursor-pointer"
//         >
//           {loading ? (
//             <Loader2 size={18} className="animate-spin" />
//           ) : (
//             <Send size={16} />
//           )}
//           {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
//         </button>

//       </div>
//     </div>
//   );
// }

// import "../../styles/profile.css";
// import { Mail, CircleUser, Phone, MessageCircle, Send } from "lucide-react";
// import { useState } from "react";
// import useAuth from "../../hooks/useAuth";
// import successGif from "../../assets/images/send.png";
// import Swal from "sweetalert2";
// export default function Support() {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     name: `${user?.firstName || ""} ${user?.lastName || ""}`,
//     email: user?.email || "",
//     reason: "",
//     message: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = () => {
//   if (!formData.message.trim()) {
//     Swal.fire({
//       icon: "warning",
//       title: "من فضلك اكتبي الرسالة",
//       timerProgressBar: true,
//       showConfirmButton: false,            
//       allowOutsideClick: true, 
//     });
//     return;
//   }

//   Swal.fire({
//       text: "تم أرسال الرسالة بنجاح",
//       imageUrl: successGif,                
//       imageWidth: 200,
//       imageHeight: 170,
//       imageAlt: "نجاح",
//       timer: 1000,
//       confirmButtonText: "تمام",
//       confirmButtonColor: "#EB6837",
//       timerProgressBar: true,
//       showConfirmButton: false,            
//       allowOutsideClick: true,            
//       customClass: {
//         popup: 'success-popup',            
//       }
//       });
// };

//   return (
//     <>
//       <div className="profile-section-card">
//         <div className="container">
//           <h2 className="profile-standalone-title">الدعم والمساعدة</h2>
//           <p className="profile-standalone-sub" style={{ textAlign: "right" }}>
//            نحن هنا لمساعدتك💛<br /> إذا كان لديك أي أسئلة، ملاحظات، أو تحتاجين إلى مساعدة， يسعد فريقنا التواصل معك. من فضلك املأ نموذج التواصل بالأسفل وسنرد عليك في أقرب وقت ممكن. يمكنك أيضًا التواصل معنا عبر وسائل الاتصال المتاحة.
//           </p>

//           {/* Contact cards */}
//           <p className="profile-field-label">طرق التواصل معنا</p>
//           <div className="profile-contact-grid">
//             <div className="profile-contact-card">
//               <div className="profile-contact-icon">
//                 <Phone size={18} color="#fff" />
//               </div>
//               <div className="profile-contact-info">
//                 <p>الهاتف</p>
//                 <span>01150809001</span>
//               </div>
//             </div>
//             <div className="profile-contact-card">
//               <div className="profile-contact-icon">
//                 <Mail size={18} color="#fff" />
//               </div>
//               <div className="profile-contact-info">
//                 <p>البريد الإلكتروني</p>
//                 <span>sawt.Elyad@gmail.com</span>
//               </div>
//             </div>
//           </div>

//           <hr className="profile-divider" />

//           {/* Message form */}
//           <p className="profile-field-label">ترك رسالة</p>

//           <div className="profile-field">
//             <label>الاسم الكامل</label>
//             <div className="profile-input-row">
//               <CircleUser size={18} color="#9ca3af" />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="أدخل الاسم بالكامل"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="profile-field">
//             <label>البريد الإلكتروني</label>
//             <div className="profile-input-row">
//               <Mail size={18} color="#9ca3af" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="أدخل البريد الإلكتروني"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="profile-field">
//             <label>سبب التواصل</label>
//             <div className="profile-input-row">
//               <MessageCircle size={18} color="#9ca3af" />
//               <input
//                 type="text"
//                 name="reason"
//                 placeholder="اكتب سبب التواصل"
//                 value={formData.reason}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="profile-field">
//             <label>الرسالة</label>
//             <textarea
//               className="profile-textarea"
//               name="message"
//               placeholder="اكتب رسالتك هنا..."
//               value={formData.message}
//               onChange={handleChange}
//             />
//           </div>

//           <button className="profile-save-btn" onClick={handleSubmit}>
//             <Send size={16} style={{ display: "inline", marginLeft: 8, verticalAlign: "middle" }} />
//             إرسال الرسالة
//           </button>
//         </div>
//       </div>

//     </>
//   );
// }


import { Mail, CircleUser, Phone, MessageCircle, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import successGif from "../../assets/images/send.png";
import Swal from "sweetalert2";
import { createTicket } from "../../api/supportApi";

export default function Support() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
    reason: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "من فضلك اكتب الرسالة",
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: true,
      });
      return;
    }

    if (!formData.reason.trim()) {
      Swal.fire({
        icon: "warning",
        title: "من فضلك اكتب سبب التواصل",
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: true,
      });
      return;
    }

    try {
      setLoading(true);
      await createTicket(formData);

      Swal.fire({
        text: "تم إرسال الرسالة بنجاح",
        imageUrl: successGif,
        imageWidth: 200,
        imageHeight: 170,
        imageAlt: "نجاح",
        timer: 2000,
        confirmButtonText: "تمام",
        confirmButtonColor: "#EB6837",
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: true,
        customClass: { popup: "success-popup" },
      });

      // Reset message and reason after successful submission
      setFormData((prev) => ({ ...prev, reason: "", message: "" }));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "حدث خطأ",
        text: err?.response?.data?.message || "يرجى المحاولة مرة أخرى",
        confirmButtonColor: "#EB6837",
        confirmButtonText: "حسناً",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.07)] mx-auto" dir="rtl">
      <div className="p-7">

        {/* Title */}
        <h2 className="text-center text-[22px] font-extrabold text-[#666667] pb-5 mb-1">
          الدعم والمساعدة
        </h2>
        <p className="text-sm text-[#868687] text-right mb-8 leading-relaxed">
          نحن هنا لمساعدتك 💛<br />
          إذا كان لديك أي أسئلة، ملاحظات، أو تحتاج إلى مساعدة، يسعد فريقنا التواصل معك.
          من فضلك املأ نموذج التواصل بالأسفل وسنرد عليك في أقرب وقت ممكن.
          يمكنك أيضًا التواصل معنا عبر وسائل الاتصال المتاحة.
        </p>

        {/* Contact cards */}
        <p className="text-sm font-semibold text-[#373d41] mb-3">طرق التواصل معنا</p>
        <div className="flex flex-col gap-3 mb-7 min-[1000px]:flex-row">
          <div className="flex-1 flex items-center justify-start gap-3 p-[14px_16px] bg-[#fff8f5] border-[1.5px] border-[#fde8de] rounded-2xl">
             <div className="w-10 h-10 rounded-[10px] bg-[#EB6837] flex items-center justify-center shrink-0">
              <Phone size={18} color="#fff" />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#868687] mb-0.5">الهاتف</p>
              <span className="text-[13px] font-bold text-[#252c32] block" dir="ltr">01150809001</span>
            </div>
            
          </div>

          <div className="flex-1 flex items-center justify-start gap-3 p-[14px_16px] bg-[#fff8f5] border-[1.5px] border-[#fde8de] rounded-2xl">
            <div className="w-10 h-10 rounded-[10px] bg-[#EB6837] flex items-center justify-center shrink-0">
              <Mail size={18} color="#fff" />
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#868687] mb-0.5">البريد الإلكتروني</p>
              <span className="text-[13px] font-bold text-[#252c32] block" dir="ltr">sawt.Elyad@gmail.com</span>
            </div>
            
          </div>
        </div>

        <hr className="border-none border-t border-[#f0f2f5] my-6" />

        {/* Form */}
        <p className="text-sm font-semibold text-[#373d41] mb-3">ترك رسالة</p>

        {/* Full Name */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#373d41] mb-2">الاسم الكامل</label>
          <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
            <CircleUser size={18} color="#9ca3af" className="shrink-0" />
            <input
              type="text"
              name="fullName"
              placeholder="أدخل الاسم بالكامل"
              value={formData.fullName}
              onChange={handleChange}
              className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#373d41] mb-2">البريد الإلكتروني</label>
          <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
            <Mail size={18} color="#9ca3af" className="shrink-0" />
            <input
              type="email"
              name="email"
              placeholder="أدخل البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
              dir="ltr"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#373d41] mb-2">سبب التواصل</label>
          <div className="flex items-center gap-2.5 px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl transition-all focus-within:border-[#EB6837] focus-within:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]">
            <MessageCircle size={18} color="#9ca3af" className="shrink-0" />
            <input
              type="text"
              name="reason"
              placeholder="اكتب سبب التواصل"
              value={formData.reason}
              onChange={handleChange}
              className="flex-1 border-none bg-transparent outline-none text-[15px] text-[#373d41] font-[Rubik,sans-serif] text-right"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        {/* Message */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#373d41] mb-2">الرسالة</label>
          <textarea
            name="message"
            placeholder="اكتب رسالتك هنا..."
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-[13px] bg-[#f7f8fa] border-[1.5px] border-[#e0e4e8] rounded-xl outline-none text-[15px] font-[Rubik,sans-serif] text-[#373d41] resize-none min-h-[120px] text-right transition-all focus:border-[#EB6837] focus:shadow-[0_0_0_3px_rgba(235,104,55,0.1)]"
            style={{ outline: "none" }}
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 px-6 bg-[#EB6837] hover:bg-[#d45a2b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-xl transition-colors font-[Rubik,sans-serif] cursor-pointer"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
        </button>

      </div>
    </div>
  );
}