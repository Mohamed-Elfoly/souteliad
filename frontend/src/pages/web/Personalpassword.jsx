import "../../styles/profile.css";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { updatePasswordApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const schema = z
  .object({
    passwordCurrent: z.string().min(1, "من فضلك أدخل كلمة المرور القديمة"),
    password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
    passwordConfirm: z.string().min(1, "من فضلك أكد كلمة المرور"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirm"],
  });

export default function Personalpassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await updatePasswordApi(data);
      toast.success("تم تغيير كلمة المرور بنجاح. سيتم تسجيل خروجك الآن");
      reset();
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      const serverMsg = err.response?.data?.message || '';
      if (serverMsg.toLowerCase().includes('wrong') || serverMsg.toLowerCase().includes('incorrect')) {
        toast.error("كلمة المرور الحالية غير صحيحة");
      } else {
        toast.error(serverMsg || "حدث خطأ في تغيير كلمة المرور");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-section-card">
      <div className="">
        <h2 className="profile-standalone-title">تغيير كلمة المرور</h2>
        <p className="profile-standalone-sub">أدخل كلمة مرورك الحالية ثم اختر كلمة مرور جديدة</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current password */}
          <div className="profile-field">
            <label>كلمة المرور الحالية</label>
            <div className="profile-input-row">
              <Lock size={18} color="#9ca3af" />
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="أدخل كلمة المرور الحالية"
                {...register("passwordCurrent")}
              />
              <button
                type="button"
                className="profile-eye-btn"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.passwordCurrent && (
              <p className="profile-error">{errors.passwordCurrent.message}</p>
            )}
          </div>

          {/* New password */}
          <div className="profile-field">
            <label>كلمة المرور الجديدة</label>
            <div className="profile-input-row">
              <Lock size={18} color="#9ca3af" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="8 أحرف على الأقل"
                {...register("password")}
              />
              <button
                type="button"
                className="profile-eye-btn"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="profile-error">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="profile-field">
            <label>تأكيد كلمة المرور الجديدة</label>
            <div className="profile-input-row">
              <Lock size={18} color="#9ca3af" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                {...register("passwordConfirm")}
              />
              <button
                type="button"
                className="profile-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="profile-error">{errors.passwordConfirm.message}</p>
            )}
          </div>

          <button type="submit" className="profile-save-btn" disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </form>
      </div>
    </div>
  );
}
