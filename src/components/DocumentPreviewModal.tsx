import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import DocumentPreview from './DocumentPreview';

interface DocumentPreviewModalProps {
  document: {
    id: string;
    title: string;
    file: string | { data: ArrayBuffer | Uint8Array };
    signers: Array<{
      id: string;
      name: string;
      role: string;
      signature?: string;
      position?: {
        x: number;
        y: number;
        page: number;
      };
    }>;
  };
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [numPages, setNumPages] = React.useState(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{document.title}</h2>
            <p className="text-sm text-gray-500">معاينة المستند والتوقيعات</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <DocumentPreview
            file={document.file}
            currentPage={currentPage}
            numPages={numPages}
            onPageChange={setCurrentPage}
            signatures={document.signers
              .filter(s => s.position)
              .map(s => ({
                ...s.position!,
                signer: {
                  name: s.name,
                  role: s.role,
                  signature: s.signature,
                }
              }))}
          />
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentPreviewModal;