import { useState } from "react";
import "../../styles/login-page.css";
import logo from "../../assets/images/logo1.png";
import change from "../../assets/images/change.png";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signupApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import Swal from 'sweetalert2';


const signupSchema = z
  .object({
    firstName: z.string().min(1, "من فضلك أدخل الاسم الأول"),
    lastName: z.string().min(1, "من فضلك أدخل اسم العائلة"),
    email: z
      .string()
      .min(1, "من فضلك أدخل البريد الإلكتروني")
      .email("البريد الإلكتروني غير صحيح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
      .regex(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
      .regex(/[^A-Za-z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل"),
    passwordConfirm: z.string().min(1, "من فضلك أكد كلمة المرور"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirm"],
  });

const BRAND_FEATURES = [
  "دروس مرئية تفاعلية لجميع المستويات",
  "اختبارات ذكية لتتبع تقدمك",
  "مجتمع نشط من المتعلمين",
];

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const res = await signupApi(data);
    const {
      token,
      data: { user },
    } = res.data;

    login(token, user);

    // SweetAlert للنجاح
    await Swal.fire({
      title: "تهانينا!",
      text: "تم إنشاء حسابك بنجاح",
      imageUrl: change,          // الصورة اللي عندك
      imageWidth: 200,
      imageHeight: 170,
      imageAlt: "نجاح",
      timer: 1000,               // يظهر ثانية وحدة
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      customClass: {
        popup: "success-popup",
      },
    });

    // التنقل حسب دور المستخدم
    if (user.role === "admin") {
      navigate("/Students");
    } else if (user.role === "teacher") {
      navigate("/Dashboard");
    } else {
      navigate("/LandingpageLogin");
    }

  } catch (err) {
    const message =
      err.response?.data?.message || "حدث خطأ في إنشاء الحساب";

    // SweetAlert للخطأ
    Swal.fire({
      title: "خطأ",
      text: message,
      icon: "error",
      confirmButtonText: "حسناً",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <div className="login-page-wrap">
        <div className="login-page-card">

          {/* ── Brand panel ── */}
          <div className="login-brand">
            <div className="login-brand-logo-wrap">
              <img src={logo} alt="صوت اليد" className="login-brand-logo" />
            </div>
            <p className="login-brand-name">صوت اليد</p>
            <h2>
              انضم لمجتمعنا
              <br />
              🤟
            </h2>
            <p>
              ابدأ رحلتك في تعلم لغة الإشارة العربية اليوم وكن جزءاً من مجتمع
              متنامٍ من المتعلمين.
            </p>
            <div className="login-brand-features">
              {BRAND_FEATURES.map((f, i) => (
                <div className="login-brand-feature" key={i}>
                  <div className="login-brand-check">
                    <CheckCircle size={13} color="#fff" />
                  </div>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form panel ── */}
          <div className="login-form-panel">
            <h2 className="login-form-title">إنشاء حساب جديد</h2>
            <p className="login-form-sub">أدخل بياناتك لإنشاء حسابك مجاناً</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* First + Last name row */}
              <div className="login-fields-row">
                <div className="login-field">
                  <label>الاسم الأول</label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="الاسم الأول"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="login-error">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="login-field">
                  <label>اسم العائلة</label>
                  <input
                    className="login-input"
                    type="text"
                    placeholder="اسم العائلة"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <p className="login-error">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="login-field">
                <label>البريد الإلكتروني</label>
                <input
                  className="login-input"
                  type="email"
                  placeholder="أدخل البريد الإلكتروني"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="login-error">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="login-field">
                <label>كلمة المرور</label>
                <div className="login-input-wrap">
                  <input
                    className="login-input login-input--with-icon"
                    type={showPw ? "text" : "password"}
                    placeholder="8 أحرف على الأقل"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPw((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="login-error">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="login-field">
                <label>تأكيد كلمة المرور</label>
                <div className="login-input-wrap">
                  <input
                    className="login-input login-input--with-icon"
                    type={showPwConfirm ? "text" : "password"}
                    placeholder="أعد إدخال كلمة المرور"
                    {...register("passwordConfirm")}
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPwConfirm((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPwConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="login-error">{errors.passwordConfirm.message}</p>
                )}
              </div>

              <button
                className="login-submit-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
              </button>
            </form>

            <p className="login-switch-text">
              لديك حساب بالفعل؟{" "}
              <span onClick={() => navigate("/login")}>تسجيل الدخول</span>
            </p>
          </div>

        </div>
      </div>


    </>
  );
}
