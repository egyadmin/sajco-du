import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (modelData: any) => void;
}

const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    discipline: '',
    description: '',
    version: '1.0',
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/octet-stream': ['.rvt', '.ifc', '.nwd', '.nwc'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.name) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const modelData = {
        ...formData,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        status: 'review',
        conflicts: 0,
      };

      onUpload(modelData);
      onClose();
    } catch (error) {
      console.error('Error uploading model:', error);
      alert('حدث خطأ أثناء رفع النموذج');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-2xl mx-4"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">رفع نموذج BIM جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div {...getRootProps()} className={`
            border-2 border-dashed rounded-xl p-8 text-center mb-6
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}>
            <input {...getInputProps()} />
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <File className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  إزالة الملف
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-lg font-medium mb-2">
                  اسحب وأفلت ملف النموذج هنا
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  يدعم النظام ملفات Revit (.rvt)، IFC (.ifc)، و Navisworks (.nwd, .nwc)
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  اختيار ملف
                </button>
              </>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم النموذج <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل اسم النموذج"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التخصص <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discipline}
                onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر التخصص</option>
                <option value="architectural">معماري</option>
                <option value="structural">إنشائي</option>
                <option value="mechanical">ميكانيكي</option>
                <option value="electrical">كهربائي</option>
                <option value="plumbing">صحي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رقم الإصدار
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الوصف
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="أدخل وصف النموذج"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">ملاحظات هامة:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>الحد الأقصى لحجم الملف هو 500 ميجابايت</li>
                <li>سيتم فحص النموذج تلقائياً للتأكد من توافقه مع معايير BIM</li>
                <li>يمكن للمستخدمين المصرح لهم فقط الوصول إلى النموذج</li>
              </ul>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            إلغاء
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!file || !formData.name || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              'رفع النموذج'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddModelModal;