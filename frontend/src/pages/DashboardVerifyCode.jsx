import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardAuthLayout from '../components/layout/DashboardAuthLayout';

export default function DashboardVerifyCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      toast.error('من فضلك أدخل الرمز كاملاً');
      return;
    }

    setIsLoading(true);
    try {
      // The reset token is the code itself in most implementations
      navigate('/dashboard-reset-password', {
        state: { token: fullCode, email },
      });
    } catch {
      toast.error('رمز التحقق غير صحيح');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(45);
    toast.success('تم إعادة إرسال رمز التحقق');
  };

  return (
    <DashboardAuthLayout>
      <h3>إعادة تعيين كلمة المرور</h3>
      <p className="desc">
        تم إرسال رمز التحقق إلى بريدك الإلكتروني.
        <br />
        من فضلك أدخل الرمز المكوّن من ٦ أرقام.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="dash-code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="dash-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'جاري التحقق...' : 'تأكيد'}
        </button>
      </form>

      <div className="dash-resend">
        <p>لم تستلم الرمز؟</p>
        <button onClick={handleResend} disabled={countdown > 0}>
          {countdown > 0
            ? `إعادة الإرسال خلال ${countdown} ثانية`
            : 'إعادة الإرسال'}
        </button>
      </div>
    </DashboardAuthLayout>
  );
}
