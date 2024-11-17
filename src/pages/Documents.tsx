import React from 'react';
import Stats from '../components/Stats';
import DocumentList from '../components/DocumentList';
import DashboardCharts from '../components/DashboardCharts';

const Documents = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p className="text-gray-600">مرحباً بك في نظام شبه الجزيرة لإدارة المستندات</p>
      </div>
      <Stats />
      <DashboardCharts />
      <DocumentList />
    </>
  );
};

export default Documents;