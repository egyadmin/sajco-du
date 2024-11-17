import React from 'react';
import { NavLink } from 'react-router-dom';
import { FolderOpen, Users, Calendar, MessageSquare, Settings, Box, FileSignature } from 'lucide-react';
import { useStore } from '../store/useStore';

const MobileNavigation = () => {
  const { translations } = useStore();

  const navigation = [
    { icon: FolderOpen, text: translations.nav.documents, path: '/documents' },
    { icon: Box, text: translations.nav.bimCloud, path: '/bim' },
    { icon: FileSignature, text: 'التوقيع الإلكتروني', path: '/signatures' },
    { icon: Users, text: translations.nav.team, path: '/team' },
    { icon: Calendar, text: translations.nav.timeline, path: '/timeline' },
    { icon: MessageSquare, text: translations.nav.messages, path: '/messages' },
  ];

  return (
    <nav className="mobile-nav grid grid-cols-6">
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-xs mt-1">{item.text}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNavigation;