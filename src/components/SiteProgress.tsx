import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface SiteProgressProps {
  progress: {
    overall: number;
    phases: Array<{
      name: string;
      progress: number;
      startDate: string;
      endDate: string;
      status: 'completed' | 'in-progress' | 'pending';
    }>;
    recentUpdates: Array<{
      date: string;
      description: string;
      type: 'milestone' | 'progress' | 'update';
    }>;
  };
}

const SiteProgress: React.FC<SiteProgressProps> = ({ progress }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in-progress':
        return 'قيد التنفيذ';
      default:
        return 'قيد الانتظار';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Progress */}
      <div className="lg:col-span-2 bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-6">مراحل المشروع</h2>
        <div className="space-y-6">
          {progress.phases.map((phase, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(phase.status)}
                  <div>
                    <h3 className="font-medium">{phase.name}</h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(phase.startDate), 'dd MMM yyyy', { locale: ar })} - 
                      {format(new Date(phase.endDate), 'dd MMM yyyy', { locale: ar })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  phase.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : phase.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {getStatusLabel(phase.status)}
                </span>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {phase.progress}%
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: `${phase.progress}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      phase.status === 'completed'
                        ? 'bg-green-600'
                        : 'bg-blue-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-6">آخر التحديثات</h2>
        <div className="space-y-4">
          {progress.recentUpdates.map((update, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
            >
              {getUpdateIcon(update.type)}
              <div>
                <p className="text-sm">{update.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(update.date), 'dd MMM yyyy', { locale: ar })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteProgress;