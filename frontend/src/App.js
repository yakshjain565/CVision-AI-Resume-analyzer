import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import AppliedJobs from './pages/AppliedJobs';
import Applicants from './pages/Applicants';
import MyPostedJobs from './pages/MyPostedJobs';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/applicants" element={
          <ProtectedRoute><Applicants /></ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute><PostJob /></ProtectedRoute>
        } />
        <Route path="/applied-jobs" element={
          <ProtectedRoute><AppliedJobs /></ProtectedRoute>
        } />
        <Route path="/my-jobs" element={
          <ProtectedRoute><MyPostedJobs /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;