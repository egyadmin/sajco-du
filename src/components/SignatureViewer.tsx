import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SignatureViewerProps {
  isOpen: boolean;
  onClose: () => void;
  signature: string;
  signer: {
    name: string;
    role: string;
    signedAt?: string;
  };
}

const SignatureViewer: React.FC<SignatureViewerProps> = ({ isOpen, onClose, signature, signer }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl w-full max-w-lg mx-4"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">التوقيع الإلكتروني</h2>
              <p className="text-sm text-gray-500">{signer.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
              <img
                src={signature}
                alt={`توقيع ${signer.name}`}
                className="max-w-full max-h-48 object-contain"
              />
            </div>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>الاسم:</span>
                <span className="font-medium">{signer.name}</span>
              </div>
              <div className="flex justify-between">
                <span>المنصب:</span>
                <span className="font-medium">{signer.role}</span>
              </div>
              {signer.signedAt && (
                <div className="flex justify-between">
                  <span>تاريخ التوقيع:</span>
                  <span className="font-medium">{signer.signedAt}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SignatureViewer;