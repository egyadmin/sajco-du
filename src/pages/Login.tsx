import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        // Handle registration
        addNotification({
          title: 'طلب تسجيل جديد',
          message: 'تم إرسال طلب التسجيل بنجاح. سيتم مراجعته من قبل الإدارة.',
          type: 'info'
        });
        setIsRegistering(false);
      } else {
        // Handle login
        const success = await login({
          username: formData.username,
          password: formData.password
        });

        if (success) {
          navigate('/documents');
        } else {
          setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg shadow-blue-900/5 w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-white rounded-2xl shadow-inner p-4 mb-4">
            <img
              src="https://e.top4top.io/p_3231azaak1.png"
              alt="شعار شركة شبه الجزيرة للمراسلات"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isRegistering ? 'تسجيل حساب جديد' : 'تسجيل الدخول'}
          </h1>
          <p className="text-gray-600 text-sm">شركة شبه الجزيرة للمراسلات</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  القسم <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">اختر القسم</option>
                  <option value="it">تقنية المعلومات</option>
                  <option value="engineering">الهندسة</option>
                  <option value="operations">العمليات</option>
                  <option value="management">الإدارة</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              اسم المستخدم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isRegistering && (
            <div className="flex items-center gap-2 text-yellow-800 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">
                سيتم مراجعة طلب التسجيل من قبل الإدارة قبل تفعيل الحساب
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isRegistering ? 'جاري إرسال الطلب...' : 'جاري تسجيل الدخول...'}
              </>
            ) : (
              isRegistering ? 'إرسال طلب التسجيل' : 'تسجيل الدخول'
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-blue-600 hover:text-blue-700 text-sm"
          >
            {isRegistering
              ? 'لديك حساب بالفعل؟ تسجيل الدخول'
              : 'ليس لديك حساب؟ تسجيل جديد'}
          </button>
        </form>

        <div className="mt-8 text-center footer-line">
          <p className="text-sm text-gray-500">
            برمجة وتطوير{' '}
            <a
              href="https://www.linkedin.com/in/tamer-el-gohary-3a516570/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              م. تامر الجوهري
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-1 pb-4">مدير تقنية المعلومات بالمنطقة الشمالية</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;