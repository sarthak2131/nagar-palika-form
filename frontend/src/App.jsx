import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PublicForm from './components/PublicForm'
import StatusChecker from './components/StatusChecker'
import Login from './components/Login'
import CMODashboard from './components/dashboards/CMODashboard'
import NodalDashboard from './components/dashboards/NodalDashboard'
import CommissionerDashboard from './components/dashboards/CommissionerDashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PublicForm />} />
          <Route path="/status" element={<StatusChecker />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/cmo" element={
            <PrivateRoute role="CMO">
              <CMODashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard/nodal" element={
            <PrivateRoute role="Nodal">
              <NodalDashboard />
            </PrivateRoute>
          } />
          <Route path="/dashboard/commissioner" element={
            <PrivateRoute role="Commissioner">
              <CommissionerDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App