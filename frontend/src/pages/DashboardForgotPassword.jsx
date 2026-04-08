import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPasswordApi } from '../api/authApi';
import DashboardAuthLayout from '../components/layout/DashboardAuthLayout';

const schema = z.object({
  email: z
    .string()
    .min(1, 'من فضلك أدخل البريد الإلكتروني')
    .email('البريد الإلكتروني غير صحيح'),
});

export default function DashboardForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordApi(data);
      toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      navigate('/dashboard-verify-code', { state: { email: data.email } });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'حدث خطأ في إرسال رمز التحقق'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardAuthLayout>
      <h3>إعادة تعيين كلمة المرور</h3>
      <p className="desc">
        أدخل بريدك الإلكتروني لإرسال تعليمات استرجاع كلمة المرور.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dash-input-group">
          <label>البريد الإلكتروني</label>
          <div className="dash-input-wrapper">
            <Mail size={18} />
            <input
              type="email"
              placeholder="أدخل البريد الإلكتروني"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="dash-input-error">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="dash-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>

      <button
        className="dash-btn-outline"
        onClick={() => navigate('/dashboard-login')}
      >
        الرجوع لصفحة تسجيل الدخول
        <ChevronLeft size={18} />
      </button>
    </DashboardAuthLayout>
  );
}
