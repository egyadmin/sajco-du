import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, Users, Calendar, MessageSquare, Settings, Box, FileSignature } from 'lucide-react';

const navigation = [
  { icon: FolderOpen, text: 'المستندات', path: '/documents' },
  { icon: Box, text: 'سحابة BIM', path: '/bim' },
  { icon: Users, text: 'الفريق', path: '/team' },
  { icon: Calendar, text: 'الجدول الزمني', path: '/timeline' },
  { icon: MessageSquare, text: 'المراسلات', path: '/messages' },
  { icon: FileSignature, text: 'التوقيع الإلكتروني', path: '/signatures' },
  { icon: Settings, text: 'الإعدادات', path: '/settings' },
];

const Sidebar = () => {
  return (
    <div className="h-screen w-64 fixed right-0 top-0 bg-gradient-to-b from-[#1a4d7c] to-[#0f2b47] text-white p-4">
      <div className="flex flex-col items-center mb-8">
        <img 
          src="https://e.top4top.io/p_3231azaak1.png" 
          alt="شعار شركة شبه الجزيرة للمراسلات"
          className="w-32 h-32 object-contain mb-4"
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">شركة شبه الجزيرة</h1>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-blue-100 text-transparent bg-clip-text">للمراسلات</p>
        </div>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;