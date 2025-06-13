// filepath: c:\Users\Sarthak\Downloads\project\frontend\src\components\StatusChecker.jsx
import React, { useState } from 'react'
import axios from 'axios'

function StatusChecker() {
  const [searchType, setSearchType] = useState('ticket')
  const [searchValue, setSearchValue] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('hindi')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.get(`/api/status?type=${searchType}&value=${searchValue}`)
      const data = response.data

      // Normalize response
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setError(language === 'hindi' ? 'कोई परिणाम नहीं मिला' : 'No results found')
          setResult(null) // Clear any previous result
        } else {
          setResult(data[0]) // Display the first result
        }
      } else if (data) {
        setResult(data)
      } else {
        setError(language === 'hindi' ? 'कोई परिणाम नहीं मिला' : 'No results found')
        setResult(null) // Clear any previous result
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setResult(null) // Clear any previous result
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      hindi: {
        pending_cmo: 'सीएमओ के पास लंबित',
        pending_nodal: 'नोडल अधिकारी के पास लंबित',
        pending_commissioner: 'आयुक्त के पास लंबित',
        approved: 'स्वीकृत',
        rejected: 'अस्वीकृत'
      },
      english: {
        pending_cmo: 'Pending with CMO',
        pending_nodal: 'Pending with Nodal Officer',
        pending_commissioner: 'Pending with Commissioner',
        approved: 'Approved',
        rejected: 'Rejected'
      }
    }

    return statusLabels[language][status] || status || (language === 'hindi' ? 'स्थिति उपलब्ध नहीं' : 'Status unavailable')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-auto form-input"
          >
            <option value="hindi">हिंदी</option>
            <option value="english">English</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">
              {language === 'hindi' ? 'खोज का प्रकार' : 'Search Type'}
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="form-input"
            >
              <option value="ticket">
                {language === 'hindi' ? 'टिकट नंबर' : 'Ticket Number'}
              </option>
              <option value="email">
                {language === 'hindi' ? 'ईमेल' : 'Email'}
              </option>
            </select>
          </div>

          <div>
            <label className="form-label">
              {language === 'hindi' ? 'खोज मूल्य' : 'Search Value'}
            </label>
            <input
              type={searchType === 'email' ? 'email' : 'text'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              required
              className="form-input"
              placeholder={searchType === 'email' ? 'example@domain.com' : 'SAP-ULB-0001'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {language === 'hindi' ? 'खोज रहे हैं...' : 'Searching...'}
              </span>
            ) : (
              language === 'hindi' ? 'खोजें' : 'Search'
            )}
          </button>
        </form>

        {error && (
          <div className="p-4 mt-4 text-red-600 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center mt-6">
            <div className="w-8 h-8 border-b-2 border-blue-800 rounded-full animate-spin"></div>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {language === 'hindi' ? 'आवेदन की स्थिति' : 'Application Status'}
            </h3>

            <div className="p-4 space-y-2 border rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-600">
                  {language === 'hindi' ? 'टिकट नंबर' : 'Ticket Number'}:
                </div>
                <div>{result.ticketNumber}</div>

                <div className="text-gray-600">
                  {language === 'hindi' ? 'नाम' : 'Name'}:
                </div>
                <div>{result.name || '-'}</div>

                <div className="text-gray-600">
                  {language === 'hindi' ? 'विभाग' : 'Department'}:
                </div>
                <div>{result.department || '-'}</div>

                <div className="text-gray-600">
                  {language === 'hindi' ? 'वर्तमान स्थिति' : 'Current Status'}:
                </div>
                <div className="font-medium">
                  {getStatusLabel(result.status)}
                </div>

                {result.currentHandler?.name && (
                  <>
                    <div className="text-gray-600">
                      {language === 'hindi' ? 'वर्तमान हैंडलर' : 'Current Handler'}:
                    </div>
                    <div>{result.currentHandler.name}</div>
                  </>
                )}
              </div>

              {result.remarks?.length > 0 && (
                <div className="mt-4">
                  <div className="mb-1 text-gray-600">
                    {language === 'hindi' ? 'टिप्पणियाँ' : 'Remarks'}:
                  </div>
                  <div className="p-3 space-y-2 rounded bg-gray-50">
                    {result.remarks.map((remark, idx) => (
                      <div key={idx}>
                        <strong>{remark.user?.name || 'User'}:</strong> {remark.comment}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusChecker