import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    language: 'hindi'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from || `/dashboard/${user.role.toLowerCase()}`;
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(form.username, form.password);
      const redirectTo = location.state?.from || `/dashboard/${user.role.toLowerCase()}`;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-end mb-4">
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="form-input w-auto"
          >
            <option value="hindi">हिंदी</option>
            <option value="english">English</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              {form.language === 'hindi' ? 'यूजरनेम' : 'Username'}
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">
              {form.language === 'hindi' ? 'पासवर्ड' : 'Password'}
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {form.language === 'hindi' ? 'लॉग इन हो रहा है...' : 'Logging in...'}
              </span>
            ) : (
              form.language === 'hindi' ? 'लॉग इन करें' : 'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;