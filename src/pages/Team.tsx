import React, { useState } from 'react';
import { Mail, Phone, MapPin, Plus, Building2, UserPlus } from 'lucide-react';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

const initialTeamMembers = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'مدير المشروع',
    email: 'ahmed@example.com',
    phone: '+966 50 123 4567',
    location: 'الرياض',
    department: 'الإدارة',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'سارة أحمد',
    role: 'مهندسة معمارية',
    email: 'sara@example.com',
    phone: '+966 50 234 5678',
    location: 'جدة',
    department: 'الهندسة',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'محمد علي',
    role: 'مهندس مدني',
    email: 'mohammed@example.com',
    phone: '+966 50 345 6789',
    location: 'الدمام',
    department: 'الهندسة',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'تامر الجوهري',
    role: 'مدير تقنية المعلومات',
    email: 'tamer@example.com',
    phone: '+966 50 456 7890',
    location: 'الرياض',
    department: 'تقنية المعلومات',
    avatar: 'https://www.gulfupp.com/do.php?img=77482',
  }
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMember = (newMember: any) => {
    setTeamMembers(prev => [...prev, { ...newMember, id: prev.length + 1 }]);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">فريق العمل</h1>
            <p className="text-gray-600">إدارة أعضاء فريق المشروع</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>إضافة عضو</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-blue-600 text-sm mb-4">{member.role}</p>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{member.department}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMember}
      />
    </>
  );
};

export default Team;