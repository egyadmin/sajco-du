import React, { useState } from 'react';
import { X, Upload, File, AlertCircle, Users, Loader2 } from 'lucide-react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (document: any) => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [approvers, setApprovers] = useState([
    {
      role: 'المدير المباشر',
      name: 'محمد علي',
      selected: true,
      email: 'mohamed@example.com',
      order: 1,
    },
    {
      role: 'مدير الإدارة',
      name: 'أحمد محمد',
      selected: true,
      email: 'ahmed@example.com',
      order: 2,
    },
    {
      role: 'مدير المنطقة',
      name: 'خالد عبدالله',
      selected: true,
      email: 'khaled@example.com',
      order: 3,
    },
    {
      role: 'مدير المراسلات والمتابعة',
      name: 'فيصل العمري',
      selected: true,
      email: 'faisal@example.com',
      order: 4,
    },
  ]);
  
  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleApprover = (index: number) => {
    setApprovers(prev => prev.map((approver, i) => 
      i === index ? { ...approver, selected: !approver.selected } : approver
    ));
  };

  const handleSubmit = async () => {
    if (!file || !formData.title) return;

    setIsUploading(true);
    try {
      // Create document metadata
      const documentData = {
        ...formData,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        status: 'pending_approval',
        approvalFlow: approvers
          .filter(a => a.selected)
          .sort((a, b) => a.order - b.order)
          .map(approver => ({
            role: approver.role,
            name: approver.name,
            email: approver.email,
            status: 'pending',
            order: approver.order,
          })),
      };

      // Simulate file upload and workflow initiation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onUpload(documentData);
      onClose();
      
      // Show success notification (you'll need to implement this)
      alert('تم رفع المستند بنجاح وبدء مسار الموافقات');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('حدث خطأ أثناء رفع المستند');
    } finally {
      setIsUploading(false);
    }
  };

  const isValid = file && formData.title && approvers.some(a => a.selected);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">إضافة مستند جديد</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <File className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-700"
                  disabled={isUploading}
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
                  اسحب وأفلت الملف هنا أو
                </p>
                <label className="inline-block">
                  <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                    اختر ملف
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    disabled={isUploading}
                  />
                </label>
              </>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان المستند <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل عنوان المستند"
                disabled={isUploading}
                required
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
                placeholder="أدخل وصف المستند"
                disabled={isUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                <option value="">اختر التصنيف</option>
                <option value="architectural">مخططات معمارية</option>
                <option value="structural">مخططات إنشائية</option>
                <option value="mep">أنظمة ميكانيكية وكهربائية</option>
                <option value="reports">تقارير</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                مسار الموافقات <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {approvers.map((approver, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {approver.order}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{approver.role}</p>
                        <p className="text-sm text-gray-500">{approver.name}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={approver.selected}
                        onChange={() => toggleApprover(index)}
                        disabled={isUploading}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6 p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">ملاحظات هامة:</p>
              <ul className="mt-1 space-y-1 list-disc list-inside">
                <li>سيتم إرسال إشعارات للموافقة تلقائياً حسب المسار المحدد</li>
                <li>يمكن للمعتمدين طلب تعديلات أو رفض المستند</li>
                <li>سيتم حفظ سجل كامل لجميع الإجراءات والتعليقات</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              'رفع المستند'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;