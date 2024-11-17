import React, { useState } from 'react';
import { Bell, Lock, Globe, Moon, User, Check, X, AlertCircle, Save, UserPlus, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const Settings = () => {
  const { pendingRegistrations, approvePendingRegistration, rejectPendingRegistration } = useStore();
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
  });
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
  });

  const handleProfileSave = async () => {
    setIsProfileSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Show success message
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      alert('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Reset form
      setNewUserData({
        name: '',
        email: '',
        phone: '',
        role: '',
        department: '',
      });
      setShowAddUser(false);
      alert('تم إضافة المستخدم بنجاح');
    } catch (error) {
      alert('حدث خطأ أثناء إضافة المستخدم');
    }
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'الملف الشخصي',
      icon: User,
      settings: [
        {
          id: 'name',
          label: 'الاسم',
          value: profileData.name,
          type: 'text',
          onChange: (value: string) => setProfileData(prev => ({ ...prev, name: value })),
        },
        {
          id: 'email',
          label: 'البريد الإلكتروني',
          value: profileData.email,
          type: 'email',
          onChange: (value: string) => setProfileData(prev => ({ ...prev, email: value })),
        },
        {
          id: 'phone',
          label: 'رقم الهاتف',
          value: profileData.phone,
          type: 'tel',
          onChange: (value: string) => setProfileData(prev => ({ ...prev, phone: value })),
        },
      ],
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: Bell,
      settings: [
        {
          id: 'email_notifications',
          label: 'إشعارات البريد الإلكتروني',
          value: true,
          type: 'toggle',
        },
        {
          id: 'push_notifications',
          label: 'الإشعارات المنبثقة',
          value: true,
          type: 'toggle',
        },
      ],
    },
    {
      id: 'appearance',
      title: 'المظهر',
      icon: Moon,
      settings: [
        {
          id: 'theme',
          label: 'السمة',
          value: 'light',
          type: 'select',
          options: [
            { label: 'فاتح', value: 'light' },
            { label: 'داكن', value: 'dark' },
            { label: 'تلقائي', value: 'auto' },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">الإعدادات</h1>
            <p className="text-gray-600">تخصيص إعدادات حسابك</p>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>إضافة مستخدم جديد</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Section with Save Button */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">الملف الشخصي</h2>
            </div>
            <button
              onClick={handleProfileSave}
              disabled={isProfileSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProfileSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {settingSections[0].settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <label htmlFor={setting.id} className="text-gray-700">
                  {setting.label}
                </label>
                <input
                  id={setting.id}
                  type={setting.type}
                  value={setting.value}
                  onChange={(e) => setting.onChange?.(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings */}
        {settingSections.slice(1).map((section) => (
          <div key={section.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <section.icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-gray-700">
                    {setting.label}
                  </label>

                  {setting.type === 'toggle' ? (
                    <button
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        setting.value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          setting.value ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  ) : setting.type === 'select' ? (
                    <select
                      id={setting.id}
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue={setting.value}
                    >
                      {setting.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl w-full max-w-2xl mx-4"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">إضافة مستخدم جديد</h2>
              <button
                onClick={() => setShowAddUser(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الدور الوظيفي <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserData.role}
                    onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر الدور الوظيفي</option>
                    <option value="admin">مدير النظام</option>
                    <option value="manager">مدير</option>
                    <option value="user">مستخدم</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    القسم <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserData.department}
                    onChange={(e) => setNewUserData({ ...newUserData, department: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر القسم</option>
                    <option value="it">تقنية المعلومات</option>
                    <option value="engineering">الهندسة</option>
                    <option value="operations">العمليات</option>
                    <option value="management">الإدارة</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
                <AlertCircle className="w-5 h-5" />
                <p>
                  سيتم إرسال بريد إلكتروني للمستخدم لتفعيل حسابه وتعيين كلمة المرور
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة المستخدم
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Settings;