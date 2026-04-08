import { useState } from "react";
import "../../styles/login-page.css";
import logo from "../../assets/images/logo1.png";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import successGif from "../../assets/images/send.png";
import { loginApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import Swal from 'sweetalert2';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "من فضلك أدخل البريد الإلكتروني")
    .email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "من فضلك أدخل كلمة المرور"),
});

const BRAND_FEATURES = [
  "فيديوهات تعليمية تفاعلية لجميع الأعمار",
  "اختبارات لقياس مستواك خطوة بخطوة",
  "مجتمع داعم من المتعلمين",
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const res = await loginApi(data);
    const {
      token,
      data: { user },
    } = res.data;

    login(token, user);

    await Swal.fire({
    title: "تهانينا!",
    text: "تم تسجيل الدخول بنجاح",
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


    if (user.role === "admin") {
      navigate("/Students");
    } else if (user.role === "teacher") {
      navigate("/Dashboard");
    } else {
      navigate("/LandingpageLogin");
    }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "البريد الإلكتروني أو كلمة المرور غير صحيحة";

    Swal.fire({
      title: "خطأ في تسجيل الدخول",
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
              مرحباً بعودتك
              <br />
              🤟
            </h2>
            <p>
              تعلم لغة الإشارة العربية بطريقة ممتعة وسهلة مع مجتمعنا المتنامي
              من المتعلمين.
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
            <h2 className="login-form-title">تسجيل الدخول</h2>
            <p className="login-form-sub">أدخل بياناتك للمتابعة إلى حسابك</p>

            <form onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="أدخل كلمة المرور"
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

              {/* Options row */}
              <div className="login-options-row">
                <label className="login-remember">
                  <input type="checkbox" id="remember" />
                  تذكرني
                </label>
                <span
                  className="login-forgot"
                  onClick={() => navigate("/forgot-password")}
                >
                  نسيت كلمة المرور؟
                </span>
              </div>

              <button
                className="login-submit-btn"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </form>

            <p className="login-switch-text">
              ليس لديك حساب بعد؟{" "}
              <span onClick={() => navigate("/signup")}>إنشاء حساب جديد</span>
            </p>
          </div>

        </div>
      </div>

    </>
  );
}
