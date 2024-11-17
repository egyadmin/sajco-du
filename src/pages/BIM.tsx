import React, { useState } from 'react';
import { Plus, Box, Zap, Recycle, Building2 } from 'lucide-react';
import ModelViewer from '../components/ModelViewer';
import AddModelModal from '../components/AddModelModal';
import SustainabilityDashboard from '../components/SustainabilityDashboard';
import SiteProgress from '../components/SiteProgress';
import BIM360Modal from '../components/BIM360Modal';

const BIM = () => {
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBIM360ModalOpen, setIsBIM360ModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'models' | 'sustainability' | 'progress'>('models');

  const sustainabilityMetrics = {
    energyEfficiency: {
      current: 85,
      target: 90,
      trend: '+5%',
      details: [
        {
          label: 'استهلاك الطاقة',
          value: '85%',
          trend: '+5%'
        },
        {
          label: 'كفاءة التبريد',
          value: '78%',
          trend: '+3%'
        }
      ]
    },
    wasteReduction: {
      current: 75,
      target: 80,
      trend: '+8%',
      details: [
        {
          label: 'إعادة التدوير',
          value: '75%',
          trend: '+8%'
        },
        {
          label: 'إدارة النفايات',
          value: '82%',
          trend: '+6%'
        }
      ]
    },
    certifications: [
      {
        name: 'LEED',
        level: 'الذهبي',
        progress: 85
      },
      {
        name: 'BREEAM',
        level: 'ممتاز',
        progress: 78
      },
      {
        name: 'WELL',
        level: 'البلاتيني',
        progress: 92
      }
    ]
  };

  const siteProgress = {
    overall: 75,
    phases: [
      {
        name: 'التصميم المعماري',
        progress: 100,
        startDate: '2024-01-01',
        endDate: '2024-02-15',
        status: 'completed'
      },
      {
        name: 'التصميم الإنشائي',
        progress: 85,
        startDate: '2024-02-16',
        endDate: '2024-03-30',
        status: 'in-progress'
      },
      {
        name: 'الأنظمة الميكانيكية',
        progress: 0,
        startDate: '2024-04-01',
        endDate: '2024-05-15',
        status: 'pending'
      }
    ],
    recentUpdates: [
      {
        date: '2024-03-15',
        description: 'اكتمال مراجعة التصميم الإنشائي للطابق الأول',
        type: 'milestone'
      },
      {
        date: '2024-03-14',
        description: 'تحديث نماذج الأنظمة الميكانيكية',
        type: 'progress'
      },
      {
        date: '2024-03-13',
        description: 'مراجعة تقارير الاستدامة الشهرية',
        type: 'update'
      }
    ]
  };

  const handleModelUpload = (modelData: any) => {
    console.log('Model uploaded:', modelData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">سحابة BIM</h1>
          <p className="text-gray-600">إدارة نماذج معلومات البناء ومراقبة التقدم</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBIM360ModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0696D7] to-[#0073A5] text-white rounded-lg hover:from-[#0073A5] hover:to-[#005A87] transition-all duration-300 shadow-lg shadow-blue-900/20"
          >
            <Building2 className="w-5 h-5" />
            <span>Autodesk BIM 360</span>
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>رفع نموذج</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="border-b">
          <div className="flex p-2">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'models'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Box className="w-5 h-5" />
                <span>النماذج</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sustainability')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'sustainability'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5" />
                <span>الاستدامة</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Recycle className="w-5 h-5" />
                <span>التقدم</span>
              </div>
            </button>
          </div>
        </div>

        {activeTab === 'models' && (
          <div className="p-6">
            <ModelViewer />
          </div>
        )}

        {activeTab === 'sustainability' && (
          <SustainabilityDashboard metrics={sustainabilityMetrics} />
        )}

        {activeTab === 'progress' && (
          <div className="p-6">
            <SiteProgress progress={siteProgress} />
          </div>
        )}
      </div>

      <AddModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleModelUpload}
      />

      <BIM360Modal
        isOpen={isBIM360ModalOpen}
        onClose={() => setIsBIM360ModalOpen(false)}
      />
    </div>
  );
};

export default BIM;