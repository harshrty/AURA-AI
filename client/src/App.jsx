import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';


import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard'; // Import the Dashboard you built
import Chat from './pages/Chat';           // Fix: Import the Chat component
import Breathing from './pages/Breathing'; // Import the Zen Zone component

function App() {
  const { token, loading } = useAuth();


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse text-indigo-600 font-medium">Loading Sanctuary...</div>
      </div>
    );
  }

  return (
    <Routes>
      {}
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />

      {}
      <Route path="/" element={token ? <MainLayout /> : <Navigate to="/login" />}>
        {/* Redirect base URL to dashboard */}
        <Route index element={<Navigate to="/dashboard" />} />
        
        {}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="mood" element={<Breathing />} /> 
      </Route>

      {}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

