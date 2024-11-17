import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Documents from './pages/Documents';
import BIM from './pages/BIM';
import Team from './pages/Team';
import Timeline from './pages/Timeline';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Signatures from './pages/Signatures';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/documents" replace />} />
          <Route path="documents" element={<Documents />} />
          <Route path="bim" element={<BIM />} />
          <Route path="team" element={<Team />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="messages" element={<Messages />} />
          <Route path="signatures" element={<Signatures />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;