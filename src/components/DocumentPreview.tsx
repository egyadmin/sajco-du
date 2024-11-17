import React, { useState, useRef, useEffect } from 'react';
import { Printer, Download, Share2, Eye, FileText, AlertCircle, Move } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPreviewProps {
  file: string | { data: ArrayBuffer | Uint8Array };
  signatures?: Array<{
    x: number;
    y: number;
    page: number;
    signer: {
      name: string;
      role: string;
      signature?: string;
      signedAt?: string;
    };
  }>;
  currentPage: number;
  numPages: number;
  onPageChange: (pageNumber: number) => void;
  showControls?: boolean;
  isPlacingSignature?: boolean;
  selectedSigner?: {
    name: string;
    role: string;
  };
  onSignaturePlaced?: (position: { x: number; y: number; page: number }) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  file,
  signatures = [],
  currentPage,
  numPages,
  onPageChange,
  showControls = true,
  isPlacingSignature = false,
  selectedSigner,
  onSignaturePlaced
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!file) return;
    
    try {
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(url);
          };
        }
      } else {
        const blob = new Blob([file.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(url);
          };
        }
      }
    } catch (err) {
      console.error('Print error:', err);
      setError('حدث خطأ أثناء الطباعة');
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    
    try {
      if (typeof file === 'string') {
        const response = await fetch(file);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([file.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('حدث خطأ أثناء التحميل');
    }
  };

  const handleDocumentLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setIsLoading(false);
    setError(null);
    if (typeof onPageChange === 'function') {
      onPageChange(1);
    }
  };

  const handleDocumentLoadError = (err: Error) => {
    setIsLoading(false);
    setError('حدث خطأ أثناء تحميل المستند. يرجى التأكد من صحة الملف وإعادة المحاولة.');
    console.error('PDF Load Error:', err);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPlacingSignature || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPreviewPosition({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isPlacingSignature || !containerRef.current || !onSignaturePlaced) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onSignaturePlaced({ x, y, page: currentPage });
    setPreviewPosition(null);
  };

  return (
    <div className="bg-white rounded-xl border">
      {showControls && (
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1 || isLoading || error}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              السابق
            </button>
            <span className="text-sm">
              صفحة {currentPage} من {numPages}
            </span>
            <button
              onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
              disabled={currentPage >= numPages || isLoading || error}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              التالي
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={isLoading || error}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              title="طباعة"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || error}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="تحميل"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              disabled={isLoading || error}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="مشاركة"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="relative cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <Document
          file={file}
          onLoadSuccess={handleDocumentLoadSuccess}
          onLoadError={handleDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse flex items-center gap-3">
                <FileText className="w-6 h-6 text-gray-400" />
                <span className="text-gray-500">جاري تحميل المستند...</span>
              </div>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل المستند</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={800}
          />
          
          {signatures
            .filter(sig => sig.page === currentPage)
            .map((sig, index) => (
              <div
                key={`signature-${index}`}
                className="absolute"
                style={{
                  left: `${sig.x}%`,
                  top: `${sig.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {sig.signer.signature ? (
                  <div className="w-32 h-16 flex items-center justify-center">
                    <img
                      src={sig.signer.signature}
                      alt={`توقيع ${sig.signer.name}`}
                      className="max-w-full max-h-full"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-16 border-2 border-blue-600 bg-blue-50 bg-opacity-30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">
                        {sig.signer.name}
                      </div>
                      <div className="text-xs text-blue-500">
                        {sig.signer.role}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {isPlacingSignature && previewPosition && selectedSigner && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${previewPosition.x}%`,
                top: `${previewPosition.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-32 h-16 border-2 border-blue-600 bg-blue-50 bg-opacity-30 rounded-lg flex items-center justify-center animate-pulse">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600">
                    {selectedSigner.name}
                  </div>
                  <div className="text-xs text-blue-500">
                    {selectedSigner.role}
                  </div>
                  <Move className="w-4 h-4 text-blue-600 mx-auto mt-1" />
                </div>
              </div>
            </div>
          )}

          {isPlacingSignature && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
              انقر لتحديد موقع التوقيع
            </div>
          )}
        </Document>
      </div>
    </div>
  );
};

export default DocumentPreview;