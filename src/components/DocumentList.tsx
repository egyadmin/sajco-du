import React, { useState } from 'react';
import { File, MoreVertical, Download, Share2, FileText, FileSpreadsheet, FileCheck, Clock, CheckCircle, XCircle, Search, Plus } from 'lucide-react';
import { format } from 'date-fns';
import AddDocumentModal from './AddDocumentModal';
import DocumentApprovalFlow from './DocumentApprovalFlow';

const DocumentList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'مخطط الطابق الأول',
      fileName: 'floor-plan-1.pdf',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadDate: new Date('2024-03-10'),
      category: 'architectural',
      author: 'سارة أحمد',
      status: 'pending_approval',
      statusColor: 'yellow',
      icon: FileText,
      approvalFlow: [
        {
          id: 1,
          role: 'رافع الطلب',
          status: 'approved',
          approver: {
            name: 'سارة أحمد',
            role: 'مهندس معماري',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
          },
          date: '2024-03-10',
          comments: 'تم رفع المخططات النهائية للمراجعة',
        },
        {
          id: 2,
          role: 'المدير المباشر',
          status: 'approved',
          approver: {
            name: 'محمد علي',
            role: 'مدير القسم المعماري',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          },
          date: '2024-03-11',
          comments: 'تمت المراجعة والموافقة على المخططات',
        },
        {
          id: 3,
          role: 'مدير الإدارة',
          status: 'current',
          approver: {
            name: 'أحمد محمد',
            role: 'مدير إدارة المشاريع',
          },
        },
        {
          id: 4,
          role: 'مدير المنطقة',
          status: 'pending',
          approver: {
            name: 'خالد عبدالله',
            role: 'مدير المنطقة الغربية',
          },
        },
      ],
    },
  ]);

  const filteredDocuments = documents
    .filter(doc => 
      doc.title.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      doc.author.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      doc.category.toLowerCase().includes((searchQuery || '').toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const handleUpload = (documentData: any) => {
    const newDocument = {
      id: documents.length + 1,
      ...documentData,
      uploadDate: new Date(),
      author: 'أحمد محمد',
      status: 'pending_approval',
      statusColor: 'yellow',
      icon: FileText,
      approvalFlow: [
        {
          id: 1,
          role: 'رافع الطلب',
          status: 'approved',
          approver: {
            name: 'أحمد محمد',
            role: 'مدير المشروع',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          },
          date: format(new Date(), 'yyyy-MM-dd'),
          comments: 'تم رفع المستند',
        },
        ...documentData.approvalFlow.map((approver: any) => ({
          id: approver.order + 1,
          role: approver.role,
          status: 'pending',
          approver: {
            name: approver.name,
            role: approver.role,
          },
        })),
      ],
    };

    setDocuments(prev => [newDocument, ...prev]);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return 'قيد الموافقة';
      case 'approved':
        return 'معتمد';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">المستندات</h2>
            <p className="text-sm text-gray-500">إدارة وتنظيم مستندات المشروع</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة مستند</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المستندات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                sortBy === 'date'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              تاريخ الرفع
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                sortBy === 'name'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              اسم المستند
            </button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="divide-y">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <doc.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-1">{doc.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{doc.fileType}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>{format(doc.uploadDate, 'dd/MM/yyyy')}</span>
                      <span>•</span>
                      <span>{doc.author}</span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-${doc.statusColor}-100 text-${doc.statusColor}-700`}>
                        {getStatusIcon(doc.status)}
                        <span>{getStatusLabel(doc.status)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setSelectedDocument(doc)}
                  >
                    عرض مسار الموافقات
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {selectedDocument?.id === doc.id && (
                <div className="mt-6 pt-6 border-t">
                  <DocumentApprovalFlow stages={doc.approvalFlow} />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مستندات</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'لم يتم العثور على أي مستندات تطابق معايير البحث'
                : 'ابدأ بإضافة مستندات جديدة للمشروع'}
            </p>
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

      <AddDocumentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
};

export default DocumentList;