import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { resetPasswordApi } from '../api/authApi';
import DashboardAuthLayout from '../components/layout/DashboardAuthLayout';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    passwordConfirm: z.string().min(1, 'من فضلك أكد كلمة المرور'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['passwordConfirm'],
  });

export default function DashboardResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || '';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resetPasswordApi(token, data);
      toast.success('تم تغيير كلمة المرور بنجاح');
      navigate('/dashboard-login');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'حدث خطأ في تغيير كلمة المرور'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardAuthLayout>
      <h3>إعادة تعيين كلمة المرور</h3>
      <p className="desc">أنشئ كلمة مرور جديدة لتأمين حسابك.</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="dash-input-group">
          <label>كلمة المرور</label>
          <div className="dash-input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              placeholder="أدخل كلمة المرور"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="dash-input-error">{errors.password.message}</p>
          )}
        </div>

        <div className="dash-input-group">
          <label>تأكيد كلمة المرور</label>
          <div className="dash-input-wrapper">
            <Lock size={18} />
            <input
              type="password"
              placeholder="أدخل تأكيد كلمة المرور"
              {...register('passwordConfirm')}
            />
          </div>
          {errors.passwordConfirm && (
            <p className="dash-input-error">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="dash-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'جاري الحفظ...' : 'إعادة التعيين'}
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
