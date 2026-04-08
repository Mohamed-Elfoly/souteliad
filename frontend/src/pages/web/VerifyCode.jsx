import { useState, useRef, useEffect } from "react";
import "../../styles/web.css";
import logo from "../../assets/images/logo1.png";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyCode() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const [countdown, setCountdown] = useState(58);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("من فضلك أدخل الرمز كاملاً");
      return;
    }
    navigate("/reset-password", { state: { resetToken: code, email } });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo-container">
          <img src={logo} alt="صوت اليد" className="logo-image" />
          <p className="logo-subtitle">تأكيد الرمز</p>
        </div>

        <div className="otp-wrapper">
          <div className="otp-card">
            <p className="otp-desc">
              تم إرسال رمز التحقق إلى بريدك الإلكتروني من فضلك أدخل الرمز المكون من ٦ أرقام.
            </p>

            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button className="otp-btn" onClick={handleSubmit}>تأكيد</button>

            <p className="otp-resend">
              لم تستلم الرمز؟
              {countdown > 0 ? (
                <span> إعادة الإرسال خلال {countdown} ثانية</span>
              ) : (
                <span className="otp-resend-link" onClick={() => { setCountdown(58); toast.success("تم إعادة إرسال الرمز"); }}>
                  {" "}إعادة الإرسال
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
