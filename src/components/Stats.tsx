import React from 'react';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    {
      id: 1,
      icon: FileText,
      label: 'إجمالي المستندات',
      value: '2,451',
      color: 'blue',
      trend: '+12%',
      trendUp: true,
      details: {
        categories: [
          { name: 'مخططات معمارية', count: 856 },
          { name: 'مخططات إنشائية', count: 654 },
          { name: 'أنظمة ميكانيكية', count: 421 },
          { name: 'تقارير فنية', count: 520 }
        ],
        lastWeek: 48,
        lastMonth: 245
      }
    },
    {
      id: 2,
      icon: Users,
      label: 'أعضاء الفريق',
      value: '49',
      color: 'green',
      trend: '+4',
      trendUp: true,
      details: {
        departments: [
          { name: 'الهندسة', count: 18 },
          { name: 'تقنية المعلومات', count: 12 },
          { name: 'الإدارة', count: 8 },
          { name: 'العمليات', count: 11 }
        ],
        active: 45,
        onLeave: 4
      }
    },
    {
      id: 3,
      icon: Clock,
      label: 'المستندات المعلقة',
      value: '13',
      color: 'yellow',
      trend: '-2',
      trendUp: false,
      details: {
        stages: [
          { name: 'بانتظار المدير المباشر', count: 5 },
          { name: 'بانتظار مدير الإدارة', count: 4 },
          { name: 'بانتظار مدير المنطقة', count: 3 },
          { name: 'بانتظار المراجعة النهائية', count: 1 }
        ],
        urgent: 3,
        delayed: 2
      }
    },
    {
      id: 4,
      icon: CheckCircle,
      label: 'المستندات المعتمدة',
      value: '1,842',
      color: 'indigo',
      trend: '+8%',
      trendUp: true,
      details: {
        timeline: [
          { period: 'هذا الأسبوع', count: 42 },
          { period: 'الأسبوع الماضي', count: 38 },
          { period: 'هذا الشهر', count: 156 },
          { period: 'الشهر الماضي', count: 144 }
        ],
        withComments: 1245,
        withoutRevisions: 986
      }
    }
  ];

  const [expandedCard, setExpandedCard] = React.useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <motion.div
          key={stat.id}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer
            ${expandedCard === stat.id ? 'lg:col-span-2 lg:row-span-2' : ''}`}
          onClick={() => setExpandedCard(expandedCard === stat.id ? null : stat.id)}
          layout
          transition={{ duration: 0.3 }}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <motion.div
                className={`text-sm font-medium ${
                  stat.trendUp ? 'text-green-600' : 'text-red-600'
                } bg-opacity-10 px-2 py-1 rounded-full flex items-center gap-1`}
                whileHover={{ scale: 1.05 }}
              >
                {stat.trend}
                <motion.div
                  animate={{ rotate: stat.trendUp ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  ↑
                </motion.div>
              </motion.div>
            </div>

            <motion.div layout="position">
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <h3 className="text-gray-500 text-sm">{stat.label}</h3>
            </motion.div>

            {expandedCard === stat.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t"
              >
                {stat.id === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">التصنيفات</h4>
                    <div className="space-y-2">
                      {stat.details.categories.map((category, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{category.name}</span>
                          <span className="text-sm font-medium">{category.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">آخر أسبوع</p>
                        <p className="text-lg font-medium text-blue-600">+{stat.details.lastWeek}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">آخر شهر</p>
                        <p className="text-lg font-medium text-blue-600">+{stat.details.lastMonth}</p>
                      </div>
                    </div>
                  </div>
                )}

                {stat.id === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">التوزيع حسب الأقسام</h4>
                    <div className="space-y-2">
                      {stat.details.departments.map((dept, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{dept.name}</span>
                          <span className="text-sm font-medium">{dept.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">نشط</p>
                        <p className="text-lg font-medium text-green-600">{stat.details.active}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">في إجازة</p>
                        <p className="text-lg font-medium text-gray-600">{stat.details.onLeave}</p>
                      </div>
                    </div>
                  </div>
                )}

                {stat.id === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">حالة المراجعة</h4>
                    <div className="space-y-2">
                      {stat.details.stages.map((stage, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{stage.name}</span>
                          <span className="text-sm font-medium">{stage.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">عاجل</p>
                        <p className="text-lg font-medium text-red-600">{stat.details.urgent}</p>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-600">متأخر</p>
                        <p className="text-lg font-medium text-yellow-600">{stat.details.delayed}</p>
                      </div>
                    </div>
                  </div>
                )}

                {stat.id === 4 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">التوزيع الزمني</h4>
                    <div className="space-y-2">
                      {stat.details.timeline.map((period, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{period.period}</span>
                          <span className="text-sm font-medium">{period.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-600">مع تعليقات</p>
                        <p className="text-lg font-medium text-indigo-600">{stat.details.withComments}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">بدون مراجعات</p>
                        <p className="text-lg font-medium text-green-600">{stat.details.withoutRevisions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;