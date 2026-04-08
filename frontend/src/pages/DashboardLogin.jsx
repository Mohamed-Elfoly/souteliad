import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginApi } from '../api/authApi';
import useAuth from '../hooks/useAuth';
import DashboardAuthLayout from '../components/layout/DashboardAuthLayout';

const schema = z.object({
  email: z
    .string()
    .min(1, 'من فضلك أدخل البريد الإلكتروني')
    .email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(1, 'من فضلك أدخل كلمة المرور'),
});

export default function DashboardLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'admin';
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginApi(data);
      const { token, data: { user } } = res.data;

      if (role === 'admin' && user.role !== 'admin') {
        toast.error('هذا الحساب ليس حساب إدارة');
        return;
      }
      if (role === 'teacher' && user.role !== 'teacher') {
        toast.error('هذا الحساب ليس حساب معلم');
        return;
      }

      login(token, user);
      toast.success('تم تسجيل الدخول بنجاح');

      if (user.role === 'admin') {
        navigate('/Students');
      } else {
        navigate('/Dashboard');
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardAuthLayout>
      <h3>تسجيل الدخول</h3>

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

        <div className="dash-login-options">
          <button
            type="button"
            className="forgot"
            onClick={() => navigate('/dashboard-forgot-password')}
          >
            نسيت كلمة المرور؟
          </button>
          <label className="remember">
            <input type="checkbox" />
            ذكرني
          </label>
        </div>

        <button
          type="submit"
          className="dash-btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </DashboardAuthLayout>
  );
}
