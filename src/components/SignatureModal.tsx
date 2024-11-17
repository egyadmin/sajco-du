import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, Save, Eye, Printer, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import SignatureBox from './SignatureBox';
import DocumentPreview from './DocumentPreview';
import { useStore } from '../store/useStore';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose }) => {
  const { addSignatureDocument } = useStore();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [workflowType, setWorkflowType] = useState<'project' | 'contract' | 'purchase' | 'other'>('project');
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [showSignatureBox, setShowSignatureBox] = useState(false);
  const [currentSignerIndex, setCurrentSignerIndex] = useState(0);
  const [selectedSigners, setSelectedSigners] = useState<Array<{
    name: string;
    role: string;
    signature?: string;
    position?: { x: number; y: number; page: number };
  }>>([]);

  const workflowTypes = {
    project: [
      { role: 'المساح', name: 'علاء عتيلي' },
      { role: 'المكتب الفني', name: 'حسام صايمة' },
      { role: 'مدير المشروع', name: 'م محمد صلاح' },
      { role: 'المدير التنفيذي للعمليات', name: 'م محمد الحربي' }
    ],
    contract: [
      { role: 'إدارة العقود', name: 'م عبد السلام صبري' },
      { role: 'الإدارة القانونية', name: 'م محمد صلاح' },
      { role: 'المدير التنفيذي', name: 'م احمد عماد' }
    ],
    purchase: [
      { role: 'مندوب المشتريات', name: 'علاء عتيلي' },
      { role: 'المستلم', name: 'حسام صايمة' },
      { role: 'المستودع', name: 'م محمد صلاح' }
    ],
    other: []
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('يرجى اختيار ملف PDF فقط');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('يرجى اختيار ملف PDF فقط');
        return;
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleWorkflowTypeChange = (type: keyof typeof workflowTypes) => {
    setWorkflowType(type);
    setSelectedSigners(
      type === 'other'
        ? []
        : workflowTypes[type].map(signer => ({
            name: signer.name,
            role: signer.role
          }))
    );
  };

  const handleSignaturePlaced = (position: { x: number; y: number; page: number }) => {
    setSelectedSigners(prev => 
      prev.map((signer, index) => 
        index === currentSignerIndex
          ? { ...signer, position }
          : signer
      )
    );
    setCurrentSignerIndex(prev => Math.min(prev + 1, selectedSigners.length - 1));
  };

  const handleSubmit = () => {
    if (!file || !selectedSigners.length) return;

    const documentData = {
      title: file.name.replace('.pdf', ''),
      file,
      type: workflowType,
      status: 'pending',
      creator: {
        name: 'أحمد محمد',
        role: 'مدير المشروع'
      },
      signers: selectedSigners.map(signer => ({
        ...signer,
        status: 'pending'
      })),
      currentSignerIndex: 0
    };

    addSignatureDocument(documentData);
    onClose();
    setStep(1);
    setFile(null);
    setSelectedSigners([]);
    setWorkflowType('project');
  };

  if (!isOpen) return null;

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
            <h2 className="text-xl font-bold">
              {step === 1 ? 'إضافة مستند للتوقيع' : 'تحديد أماكن التوقيع'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1 ? 'اختر المستند ونوع سير العمل' : 'حدد مواقع التوقيع على المستند'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 ? (
            <div className="space-y-6">
              {/* File Upload Section */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`border-2 border-dashed rounded-xl p-8 text-center ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {file ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
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
                      اسحب وأفلت ملف PDF هنا
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      أو انقر لاختيار ملف (الحد الأقصى: 5 ميجابايت)
                    </p>
                    <label className="inline-block">
                      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        اختيار ملف
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Workflow Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع سير العمل
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(workflowTypes).map(([type, signers]) => (
                    <button
                      key={type}
                      onClick={() => handleWorkflowTypeChange(type as keyof typeof workflowTypes)}
                      className={`p-4 rounded-lg border-2 text-center ${
                        workflowType === type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-600'
                      }`}
                    >
                      <p className="font-medium mb-1">
                        {type === 'project' && 'مستندات المشاريع'}
                        {type === 'contract' && 'العقود'}
                        {type === 'purchase' && 'المشتريات'}
                        {type === 'other' && 'أخرى'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {type === 'other'
                          ? 'تحديد الموقعين'
                          : `${signers.length} موقعين`}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Workflow Preview */}
              {workflowType !== 'other' && (
                <div>
                  <h3 className="font-medium mb-4">ترتيب التوقيعات</h3>
                  <div className="space-y-3">
                    {workflowTypes[workflowType].map((signer, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{signer.role}</p>
                          <p className="text-sm text-gray-500">{signer.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-6">
              <div className="w-64 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-4">الموقعون</h3>
                <div className="space-y-3">
                  {selectedSigners.map((signer, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        currentSignerIndex === index
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{signer.role}</p>
                          <p className="text-sm text-gray-500">{signer.name}</p>
                        </div>
                        {!signer.signature && (
                          <button
                            onClick={() => setShowSignatureBox(true)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            إضافة توقيع
                          </button>
                        )}
                      </div>
                      {signer.signature && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <img
                            src={signer.signature}
                            alt={`توقيع ${signer.name}`}
                            className="h-12 object-contain mx-auto"
                          />
                        </div>
                      )}
                      {signer.position && (
                        <p className="text-xs text-green-600 mt-2">
                          تم تحديد موقع التوقيع
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <DocumentPreview
                  file={file!}
                  currentPage={currentPage}
                  numPages={numPages}
                  onPageChange={setCurrentPage}
                  signatures={selectedSigners
                    .filter(s => s.position)
                    .map(s => ({
                      ...s.position!,
                      signer: {
                        name: s.name,
                        role: s.role,
                        signature: s.signature
                      }
                    }))}
                  isPlacingSignature={true}
                  selectedSigner={selectedSigners[currentSignerIndex]}
                  onSignaturePlaced={handleSignaturePlaced}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            إلغاء
          </button>
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!file || (workflowType === 'other' ? !selectedSigners.length : false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              تحديد أماكن التوقيع
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!selectedSigners.every(s => s.position)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              حفظ وبدء دورة التوقيع
            </button>
          )}
        </div>

        {showSignatureBox && (
          <SignatureBox
            onSave={(signature) => {
              setSelectedSigners(prev =>
                prev.map((signer, idx) =>
                  idx === currentSignerIndex
                    ? { ...signer, signature }
                    : signer
                )
              );
              setShowSignatureBox(false);
            }}
            onClose={() => setShowSignatureBox(false)}
          />
        )}
      </motion.div>
    </div>
  );
};

export default SignatureModal;