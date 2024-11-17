import React from 'react';
import { Zap, Recycle, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface SustainabilityMetrics {
  energyEfficiency: {
    current: number;
    target: number;
    trend: string;
    details: Array<{
      label: string;
      value: string;
      trend: string;
    }>;
  };
  wasteReduction: {
    current: number;
    target: number;
    trend: string;
    details: Array<{
      label: string;
      value: string;
      trend: string;
    }>;
  };
  certifications: Array<{
    name: string;
    level: string;
    progress: number;
  }>;
}

interface Props {
  metrics: SustainabilityMetrics;
}

const SustainabilityDashboard: React.FC<Props> = ({ metrics }) => {
  const renderProgressBar = (current: number, target: number) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-green-600 h-2 rounded-full"
        style={{ width: `${current}%` }}
      />
    </div>
  );

  const renderTrendIndicator = (trend: string) => {
    const isPositive = trend.startsWith('+');
    return (
      <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <TrendingUp className="w-4 h-4 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">{trend}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Efficiency Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">كفاءة الطاقة</h3>
                <p className="text-sm text-gray-500">تحليل وتحسين استهلاك الطاقة</p>
              </div>
            </div>
            {renderTrendIndicator(metrics.energyEfficiency.trend)}
          </div>

          <div className="space-y-6">
            {metrics.energyEfficiency.details.map((detail, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{detail.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{detail.value}</span>
                    {renderTrendIndicator(detail.trend)}
                  </div>
                </div>
                {renderProgressBar(
                  parseInt(detail.value),
                  parseInt(detail.value) * 1.2
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Waste Reduction Section */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Recycle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">تقليل الهدر</h3>
                <p className="text-sm text-gray-500">إدارة المواد وإعادة التدوير</p>
              </div>
            </div>
            {renderTrendIndicator(metrics.wasteReduction.trend)}
          </div>

          <div className="space-y-6">
            {metrics.wasteReduction.details.map((detail, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{detail.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{detail.value}</span>
                    {renderTrendIndicator(detail.trend)}
                  </div>
                </div>
                {renderProgressBar(
                  parseInt(detail.value),
                  parseInt(detail.value) * 1.2
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">شهادات الاستدامة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.certifications.map((cert, index) => (
            <div key={index} className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-500">{cert.level}</p>
                  </div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      {cert.progress}%
                    </span>
                  </div>
                </div>
                {renderProgressBar(cert.progress, 100)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;