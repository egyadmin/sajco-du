import React, { useState } from 'react';
import { X, Building2, Link2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BIM360ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BIM360Modal: React.FC<BIM360ModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [formData, setFormData] = useState({
    accountId: '',
    projectId: '',
    clientId: '',
    clientSecret: '',
  });

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      onClose();
    } catch (error) {
      console.error('Error connecting to BIM 360:', error);
    } finally {
      setIsConnecting(false);
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0696D7] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">ربط مع Autodesk BIM 360</h2>
              <p className="text-sm text-gray-500">إدارة وتنسيق نماذج BIM عبر السحابة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isConnecting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConnect} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                معرف الحساب (Account ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0696D7]"
                placeholder="أدخل معرف حساب BIM 360"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                معرف المشروع (Project ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0696D7]"
                placeholder="أدخل معرف المشروع"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                معرف العميل (Client ID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0696D7]"
                placeholder="أدخل معرف العميل من Forge"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السر الخاص (Client Secret) <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.clientSecret}
                onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0696D7]"
                placeholder="أدخل السر الخاص من Forge"
                required
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <Link2 className="w-5 h-5" />
              <h3 className="font-medium">مميزات الربط مع BIM 360:</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• مزامنة النماذج والمستندات تلقائياً</li>
              <li>• إدارة الصلاحيات والوصول للمستخدمين</li>
              <li>• تتبع التغييرات والإصدارات</li>
              <li>• التعاون في الوقت الفعلي</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
              تأكد من إدخال بيانات الاعتماد الصحيحة من لوحة تحكم Autodesk Forge
            </p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isConnecting}
          >
            إلغاء
          </button>
          <button
            onClick={handleConnect}
            disabled={!formData.accountId || !formData.projectId || !formData.clientId || !formData.clientSecret || isConnecting}
            className="px-4 py-2 bg-gradient-to-r from-[#0696D7] to-[#0073A5] text-white rounded-lg hover:from-[#0073A5] hover:to-[#005A87] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الربط...
              </>
            ) : (
              'ربط الحساب'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BIM360Modal;