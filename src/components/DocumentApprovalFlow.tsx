import React from 'react';
import { CheckCircle, Clock, AlertCircle, User, ChevronLeft } from 'lucide-react';

interface ApprovalStage {
  id: number;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'current';
  approver: {
    name: string;
    role: string;
    avatar?: string;
  };
  date?: string;
  comments?: string;
}

interface DocumentApprovalFlowProps {
  stages: ApprovalStage[];
}

const DocumentApprovalFlow: React.FC<DocumentApprovalFlowProps> = ({ stages }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'current':
        return <Clock className="w-6 h-6 text-blue-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">مسار الموافقات</h3>
      
      <div className="relative">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-start gap-4 relative">
            {index !== stages.length - 1 && (
              <div className="absolute top-8 right-4 bottom-0 w-0.5 bg-gray-200" />
            )}
            
            <div className="relative z-10 mt-2">
              {getStatusIcon(stage.status)}
            </div>
            
            <div className="flex-1 pb-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{stage.title}</h4>
                {stage.date && (
                  <span className="text-sm text-gray-500">{stage.date}</span>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  {stage.approver.avatar ? (
                    <img
                      src={stage.approver.avatar}
                      alt={stage.approver.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{stage.approver.name}</p>
                    <p className="text-sm text-gray-500">{stage.approver.role}</p>
                  </div>
                </div>
                
                {stage.comments && (
                  <p className="text-sm text-gray-600 mt-2">{stage.comments}</p>
                )}
                
                {stage.status === 'current' && (
                  <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      موافقة
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      رفض
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      طلب تعديلات
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentApprovalFlow;