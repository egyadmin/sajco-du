import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Filter, FileText, Users, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationTypes = {
    document: {
      icon: FileText,
      color: 'blue',
      label: 'مستندات'
    },
    team: {
      icon: Users,
      color: 'green',
      label: 'فريق العمل'
    },
    approval: {
      icon: Clock,
      color: 'yellow',
      label: 'موافقات'
    },
    message: {
      icon: MessageSquare,
      color: 'purple',
      label: 'رسائل'
    },
    alert: {
      icon: AlertCircle,
      color: 'red',
      label: 'تنبيهات'
    }
  };

  const filteredNotifications = selectedFilter
    ? notifications.filter(n => n.type === selectedFilter)
    : notifications;

  const getNotificationIcon = (type: string) => {
    const TypeIcon = notificationTypes[type as keyof typeof notificationTypes]?.icon || Bell;
    const color = notificationTypes[type as keyof typeof notificationTypes]?.color || 'gray';
    return (
      <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
        <TypeIcon className={`w-5 h-5 text-${color}-600`} />
      </div>
    );
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">الإشعارات</h2>
                    <p className="text-sm text-gray-500">{unreadCount} غير مقروءة</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      تحديد الكل كمقروء
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <button
                    onClick={() => setSelectedFilter(null)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      !selectedFilter
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    الكل
                  </button>
                  {Object.entries(notificationTypes).map(([type, { label, color }]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFilter(type)}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                        selectedFilter === type
                          ? `bg-${color}-100 text-${color}-600`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Bell className="w-12 h-12 mb-2 text-gray-400" />
                    <p>لا توجد إشعارات {selectedFilter && 'من هذا النوع'}</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    <AnimatePresence>
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`p-4 rounded-lg border ${
                            notification.read ? 'bg-white' : 'bg-blue-50'
                          }`}
                        >
                          <div className="flex gap-4">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium mb-1">{notification.title}</h3>
                                  <p className="text-sm text-gray-600">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {format(notification.createdAt, 'dd MMMM yyyy, HH:mm', { locale: ar })}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className="p-1 hover:bg-blue-100 rounded-full"
                                  >
                                    <Check className="w-4 h-4 text-blue-600" />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;