import React, { useState } from 'react';
import { FileSignature, Plus, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import SignatureModal from '../components/SignatureModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';

interface SignatureDocument {
  id: string;
  title: string;
  file: string | { data: ArrayBuffer | Uint8Array };
  type: 'project' | 'contract' | 'purchase' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  createdAt: Date | string;
  creator: {
    name: string;
    role: string;
  };
  signers: Array<{
    id: string; // Added id for unique key prop
    name: string;
    role: string;
    signature?: string;
    signedAt?: Date;
    position?: {
      x: number;
      y: number;
      page: number;
    };
    status: 'pending' | 'signed' | 'rejected';
  }>;
  currentSignerIndex: number;
}

const Signatures: React.FC = () => {
  const { signatureDocuments } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SignatureDocument | null>(null);

  const formatDate = (date: Date | string) => {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return isValid(parsedDate) ? format(parsedDate, 'dd/MM/yyyy', { locale: ar }) : '';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'rejected':
        return 'مرفوض';
      case 'in_progress':
        return 'قيد التوقيع';
      default:
        return 'قيد الانتظار';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getWorkflowLabel = (type: string) => {
    switch (type) {
      case 'project':
        return 'مستندات المشاريع';
      case 'contract':
        return 'العقود';
      case 'purchase':
        return 'المشتريات';
      default:
        return 'أخرى';
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">التوقيع الإلكتروني</h1>
            <p className="text-gray-600">إدارة وتوقيع المستندات إلكترونياً</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مستند</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">المستندات المطلوب توقيعها</h2>
        </div>

        <div className="divide-y">
          {signatureDocuments.length > 0 ? (
            signatureDocuments.map((doc) => (
              <div key={doc.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileSignature className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-1">{doc.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{doc.creator.name}</span>
                        <span>•</span>
                        <span>{formatDate(doc.createdAt)}</span>
                        <span>•</span>
                        <span>{getWorkflowLabel(doc.type)}</span>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {getStatusIcon(doc.status)}
                          <span>{getStatusLabel(doc.status)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Signature Progress */}
                <div className="mt-6 flex items-center gap-2">
                  {doc.signers.map((signer, index) => (
                    <React.Fragment key={signer.id || `${doc.id}-signer-${index}`}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                        signer.status === 'signed'
                          ? 'bg-green-100 text-green-700'
                          : index === doc.currentSignerIndex
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="text-sm">{signer.role}</span>
                        <span className="text-xs">({signer.name})</span>
                      </div>
                      {index < doc.signers.length - 1 && (
                        <div className="w-8 h-px bg-gray-300" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileSignature className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستندات للتوقيع</h3>
              <p className="text-gray-500 mb-6">ابدأ بإضافة مستند جديد للتوقيع</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة مستند</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {selectedDocument && (
        <DocumentPreviewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
};

export default Signatures;