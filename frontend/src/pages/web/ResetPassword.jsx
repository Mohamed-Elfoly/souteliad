import { useState } from "react";
import "../../styles/login-page.css";
import logo from "../../assets/images/logo1.png";
import change from "../../assets/images/change.png";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { resetPasswordApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const schema = z
  .object({
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

export default function ResetPassword() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showPwConfirm, setShowPwConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const resetToken = location.state?.resetToken || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    if (!resetToken) {
      toast.error("رمز إعادة التعيين غير موجود");
      navigate("/forgot-password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordApi(resetToken, data);
      const {
        token,
        data: { user },
      } = res.data;
      login(token, user);
      setShowModal(true);

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/Students");
        } else if (user.role === "teacher") {
          navigate("/Dashboard");
        } else {
          navigate("/LandingpageLogin");
        }
      }, 1500);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "حدث خطأ في إعادة تعيين كلمة المرور"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth-simple-wrap">
        <div className="auth-simple-card">
          {/* Icon */}
          <div className="auth-simple-icon">
            <Lock size={28} color="#EB6837" />
          </div>

          {/* Logo */}
          <img
            src={logo}
            alt="صوت اليد"
            style={{ width: 72, height: "auto", margin: "0 auto 16px", display: "block" }}
          />

          <h2 className="auth-simple-title">كلمة مرور جديدة</h2>
          <p className="auth-simple-sub">
            أنشئ كلمة مرور جديدة قوية لتأمين حسابك.
          </p>

          <form className="auth-simple-form" onSubmit={handleSubmit(onSubmit)}>
            {/* Password */}
            <div className="login-field">
              <label>كلمة المرور الجديدة</label>
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
              {isLoading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
            </button>
          </form>

          <p className="auth-simple-back">
            تذكرت كلمة المرور؟{" "}
            <span onClick={() => navigate("/login")}>تسجيل الدخول</span>
          </p>
        </div>
      </div>

      {showModal && (
        <div className="overlay">
          <div className="auth-success-modal">
            <img src={change} alt="success" />
            <h3>تهانينا!</h3>
            <p>تم تحديث كلمة المرور بنجاح.</p>
            <p>احرص على حفظها واستمتع بتجربة آمنة.</p>
          </div>
        </div>
      )}
    </>
  );
}
