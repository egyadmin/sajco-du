import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FileText, Users, Clock, CheckCircle } from 'lucide-react';

const documentActivity = [
  { month: 'يناير', uploads: 45, approvals: 38, reviews: 28 },
  { month: 'فبراير', uploads: 52, approvals: 43, reviews: 35 },
  { month: 'مارس', uploads: 48, approvals: 41, reviews: 30 },
  { month: 'أبريل', uploads: 61, approvals: 52, reviews: 41 },
  { month: 'مايو', uploads: 55, approvals: 45, reviews: 37 },
  { month: 'يونيو', uploads: 67, approvals: 58, reviews: 45 },
];

const approvalDistribution = [
  { name: 'معتمد', value: 63, color: '#16a34a' },
  { name: 'قيد المراجعة', value: 27, color: '#ca8a04' },
  { name: 'مرفوض', value: 10, color: '#dc2626' },
];

const teamActivity = [
  { day: 'السبت', tasks: 12, messages: 25, documents: 8 },
  { day: 'الأحد', tasks: 15, messages: 30, documents: 10 },
  { day: 'الاثنين', tasks: 18, messages: 35, documents: 15 },
  { day: 'الثلاثاء', tasks: 16, messages: 28, documents: 12 },
  { day: 'الأربعاء', tasks: 20, messages: 40, documents: 18 },
  { day: 'الخميس', tasks: 22, messages: 45, documents: 20 },
  { day: 'الجمعة', tasks: 10, messages: 20, documents: 5 },
];

const projectProgress = [
  { name: 'التصميم المعماري', completed: 85 },
  { name: 'التصميم الإنشائي', completed: 70 },
  { name: 'الأنظمة الميكانيكية', completed: 60 },
  { name: 'الأنظمة الكهربائية', completed: 55 },
  { name: 'التشطيبات', completed: 40 },
];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Document Activity Chart */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">نشاط المستندات</h3>
              <p className="text-sm text-gray-500">آخر 6 أشهر</p>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={documentActivity}>
              <defs>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorApprovals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="uploads"
                name="رفع مستندات"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorUploads)"
              />
              <Area
                type="monotone"
                dataKey="approvals"
                name="موافقات"
                stroke="#16a34a"
                fillOpacity={1}
                fill="url(#colorApprovals)"
              />
              <Area
                type="monotone"
                dataKey="reviews"
                name="مراجعات"
                stroke="#ca8a04"
                fillOpacity={1}
                fill="url(#colorReviews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Approval Distribution Chart */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">توزيع حالات الموافقات</h3>
              <p className="text-sm text-gray-500">النسب الحالية</p>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={approvalDistribution}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {approvalDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Activity Chart */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">نشاط الفريق</h3>
              <p className="text-sm text-gray-500">آخر أسبوع</p>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={teamActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tasks"
                name="المهام"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="messages"
                name="الرسائل"
                stroke="#0891b2"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="documents"
                name="المستندات"
                stroke="#ca8a04"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Progress Chart */}
      <div className="bg-white p-6 rounded-xl border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">تقدم المشروع</h3>
              <p className="text-sm text-gray-500">نسب الإنجاز</p>
            </div>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={projectProgress}
              layout="vertical"
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completed"
                name="نسبة الإنجاز"
                fill="#3b82f6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;