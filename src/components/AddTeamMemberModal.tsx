import React, { useState } from 'react';
import { X, Upload, User, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: any) => void;
}

const roles = [
  {
    id: 'project_manager',
    title: 'مدير المشروع',
    permissions: ['إدارة كاملة', 'إدارة الفريق', 'إدارة المستندات', 'الموافقات'],
  },
  {
    id: 'area_manager',
    title: 'مدير المنطقة',
    permissions: ['إدارة المنطقة', 'مراجعة المستندات', 'الموافقات'],
  },
  {
    id: 'department_manager',
    title: 'مدير الإدارة',
    permissions: ['إدارة القسم', 'مراجعة المستندات', 'الموافقات'],
  },
  {
    id: 'direct_manager',
    title: 'المدير المباشر',
    permissions: ['إدارة الفريق المباشر', 'مراجعة المستندات', 'الموافقات الأولية'],
  },
  {
    id: 'team_member',
    title: 'عضو فريق',
    permissions: ['عرض المستندات', 'رفع المستندات', 'المشاركة في المناقشات'],
  },
];

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
  });

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newMember = {
        ...formData,
        id: Date.now().toString(),
        avatar: avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      };

      onAdd(newMember);
      onClose();
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('حدث خطأ أثناء إضافة عضو الفريق');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-2xl mx-4"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">إضافة عضو جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg cursor-pointer">
                <Upload className="w-4 h-4 text-gray-600" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="الاسم الكامل"
                required
                disabled={isSubmitting}
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@company.com"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+966 5X XXX XXXX"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الدور الوظيفي <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSubmitting}
              >
                <option value="">اختر الدور الوظيفي</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                القسم
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">اختر القسم</option>
                <option value="it">تقنية المعلومات</option>
                <option value="engineering">الهندسة</option>
                <option value="operations">العمليات</option>
                <option value="management">الإدارة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الموقع
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                <option value="">اختر الموقع</option>
                <option value="riyadh">الرياض</option>
                <option value="jeddah">جدة</option>
                <option value="dammam">الدمام</option>
                <option value="makkah">مكة المكرمة</option>
              </select>
            </div>
          </div>

          {formData.role && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">الصلاحيات:</h4>
              <ul className="space-y-2">
                {roles.find(r => r.id === formData.role)?.permissions.map((permission, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-2 mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
              سيتم إرسال دعوة تلقائية إلى البريد الإلكتروني المدخل لإكمال عملية التسجيل
            </p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || !formData.role || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              'إضافة العضو'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTeamMemberModal;