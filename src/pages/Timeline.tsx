import React, { useState } from 'react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import AddEventModal from '../components/AddEventModal';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'site-visit' | 'milestone';
  description?: string;
  location?: string;
  participants?: string[];
  status: 'upcoming' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
}

const events: Event[] = [
  {
    id: 1,
    title: 'اجتماع مراجعة التصميم',
    date: '2024-03-15',
    time: '10:00',
    type: 'meeting',
    participants: ['أحمد محمد', 'سارة أحمد', 'محمد علي'],
    status: 'upcoming',
    priority: 'high',
    location: 'قاعة الاجتماعات الرئيسية',
    description: 'مراجعة التصاميم النهائية للمشروع مع الفريق والعميل'
  },
  {
    id: 2,
    title: 'تسليم المخططات النهائية',
    date: '2024-03-20',
    time: '14:00',
    type: 'deadline',
    description: 'تسليم جميع المخططات المعمارية والإنشائية',
    status: 'upcoming',
    priority: 'high'
  },
  {
    id: 3,
    title: 'زيارة الموقع',
    date: '2024-03-25',
    time: '09:00',
    type: 'site-visit',
    location: 'موقع المشروع - الرياض',
    participants: ['أحمد محمد', 'محمد علي'],
    status: 'upcoming',
    priority: 'medium'
  },
  {
    id: 4,
    title: 'اكتمال المرحلة الأولى',
    date: '2024-03-30',
    time: '00:00',
    type: 'milestone',
    description: 'إنجاز جميع متطلبات المرحلة الأولى من المشروع',
    status: 'upcoming',
    priority: 'high'
  }
];

const typeColors = {
  meeting: 'blue',
  deadline: 'red',
  'site-visit': 'green',
  milestone: 'purple'
};

const priorityLabels = {
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة'
};

const Timeline = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'timeline' | 'calendar'>('timeline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string[]>([]);

  const filteredEvents = events.filter(event => {
    if (filter.length === 0) return true;
    return filter.includes(event.type);
  });

  const toggleFilter = (type: string) => {
    setFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(selectedDate, i);
      const dayEvents = events.filter(event => 
        isSameDay(parseISO(event.date), date)
      );

      days.push(
        <div 
          key={i} 
          className={`border-r last:border-r-0 p-4 ${
            isSameDay(date, new Date()) ? 'bg-blue-50' : ''
          }`}
        >
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              {format(date, 'EEEE', { locale: ar })}
            </p>
            <p className="text-lg font-semibold">
              {format(date, 'd', { locale: ar })}
            </p>
          </div>

          <div className="space-y-2">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`p-2 rounded-lg text-sm bg-${typeColors[event.type]}-100 text-${typeColors[event.type]}-800`}
              >
                <p className="font-medium">{event.time}</p>
                <p>{event.title}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">الجدول الزمني</h1>
            <p className="text-gray-600">إدارة المواعيد والأحداث</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setView('timeline')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'timeline' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600'
                }`}
              >
                خط زمني
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'calendar' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600'
                }`}
              >
                تقويم
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة حدث</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {format(selectedDate, 'MMMM yyyy', { locale: ar })}
              </h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <div className="flex gap-2">
                {['meeting', 'deadline', 'site-visit', 'milestone'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filter.includes(type)
                        ? `bg-${typeColors[type]}-100 text-${typeColors[type]}-800`
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {type === 'meeting' && 'اجتماعات'}
                    {type === 'deadline' && 'مواعيد نهائية'}
                    {type === 'site-visit' && 'زيارات ميدانية'}
                    {type === 'milestone' && 'مراحل رئيسية'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {view === 'calendar' ? (
            <div className="grid grid-cols-7 min-h-[600px]">
              {renderCalendarDays()}
            </div>
          ) : (
            <div className="divide-y">
              {filteredEvents.map(event => (
                <div key={event.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-blue-600 mb-1" />
                      <span className="text-sm font-medium text-blue-600">
                        {format(parseISO(event.date), 'd', { locale: ar })}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm bg-${typeColors[event.type]}-100 text-${typeColors[event.type]}-800`}>
                          {event.type === 'meeting' && 'اجتماع'}
                          {event.type === 'deadline' && 'موعد نهائي'}
                          {event.type === 'site-visit' && 'زيارة ميدانية'}
                          {event.type === 'milestone' && 'مرحلة رئيسية'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}

                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.priority === 'high' 
                            ? 'bg-red-100 text-red-700'
                            : event.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {priorityLabels[event.priority]}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-sm text-gray-600 mb-4">
                          {event.description}
                        </p>
                      )}

                      {event.participants && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div className="flex -space-x-2 space-x-reverse">
                            {event.participants.map((participant, index) => (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                              >
                                <span className="text-xs font-medium">
                                  {participant.charAt(0)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {event.participants.length} مشاركين
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Timeline;