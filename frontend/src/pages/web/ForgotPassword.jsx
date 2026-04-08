import "../../styles/login-page.css";
import logo from "../../assets/images/logo1.png";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../../api/authApi";

const schema = z.object({
  email: z
    .string()
    .min(1, "من فضلك أدخل البريد الإلكتروني")
    .email("البريد الإلكتروني غير صحيح"),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordApi(data);
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      navigate("/verify-code", { state: { email: data.email } });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "حدث خطأ في إرسال رمز التحقق"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-simple-wrap">
      <div className="auth-simple-card">
        {/* Icon */}
        <div className="auth-simple-icon">
          <Mail size={28} color="#EB6837" />
        </div>

        {/* Logo */}
        <img
          src={logo}
          alt="صوت اليد"
          style={{ width: 72, height: "auto", margin: "0 auto 16px", display: "block" }}
        />

        <h2 className="auth-simple-title">إعادة تعيين كلمة المرور</h2>
        <p className="auth-simple-sub">
          أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور.
        </p>

        <form className="auth-simple-form" onSubmit={handleSubmit(onSubmit)}>
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

          <button
            className="login-submit-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>

        <p className="auth-simple-back">
          تذكرت كلمة المرور؟{" "}
          <span onClick={() => navigate("/login")}>تسجيل الدخول</span>
        </p>
      </div>
    </div>
  );
}
