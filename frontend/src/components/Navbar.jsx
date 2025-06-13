import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <div>
              <h1 className="text-lg font-semibold hindi">ई-Nagarpalika</h1>
              <p className="text-xs english">User ID Creation Portal</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200">
              <span className="hindi">नया आवेदन</span>
              <span className="english ml-1">(New Request)</span>
            </Link>
            <Link to="/status" className="hover:text-blue-200">
              <span className="hindi">स्थिति जाँचें</span>
              <span className="english ml-1">(Check Status)</span>
            </Link>
            
            {user ? (
              <>
                <Link to={`/dashboard/${user.role.toLowerCase()}`} className="hover:text-blue-200">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="hover:text-blue-200">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-200">
                <span className="hindi">लॉग इन</span>
                <span className="english ml-1">(Login)</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar