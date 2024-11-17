import React, { useRef, useState } from 'react';
import { X, Upload, Download, Trash2 } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureBoxProps {
  onSave: (signature: string) => void;
  onClose: () => void;
}

const SignatureBox: React.FC<SignatureBoxProps> = ({ onSave, onClose }) => {
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'upload'>('draw');
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);

  const handleClear = () => {
    if (signatureType === 'draw') {
      signatureRef.current?.clear();
    } else {
      setUploadedSignature(null);
    }
  };

  const handleSave = () => {
    if (signatureType === 'draw' && signatureRef.current) {
      if (!signatureRef.current.isEmpty()) {
        onSave(signatureRef.current.toDataURL());
      }
    } else if (uploadedSignature) {
      onSave(uploadedSignature);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">إضافة التوقيع</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Signature Type Selection */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSignatureType('draw')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                signatureType === 'draw'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              رسم التوقيع
            </button>
            <button
              onClick={() => setSignatureType('upload')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                signatureType === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              رفع صورة التوقيع
            </button>
          </div>

          {/* Signature Area */}
          <div className="border-2 border-dashed rounded-lg p-4 mb-6">
            {signatureType === 'draw' ? (
              <div className="bg-gray-50 rounded-lg">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: 'w-full h-64 rounded-lg',
                    style: { background: 'rgb(249 250 251)' }
                  }}
                  minWidth={2}
                  maxWidth={4}
                  dotSize={4}
                  throttle={16}
                  backgroundColor="transparent"
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                {uploadedSignature ? (
                  <div className="relative w-full h-full">
                    <img
                      src={uploadedSignature}
                      alt="التوقيع المرفوع"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => setUploadedSignature(null)}
                      className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-600">اختر صورة التوقيع</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-500 mb-6">
            {signatureType === 'draw' ? (
              <p>قم برسم توقيعك داخل المربع باستخدام الماوس أو شاشة اللمس</p>
            ) : (
              <p>قم برفع صورة توقيعك بصيغة JPG أو PNG</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              مسح
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ التوقيع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureBox;