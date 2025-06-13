import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../hooks/useAuth'

function CommissionerDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests')
      setRequests(response.data)
    } catch (err) {
      setError('Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRequest = async (id, status, remarks) => {
    try {
      await axios.patch(`/api/requests/${id}`, { status, remarks })
      fetchRequests()
    } catch (err) {
      setError('Failed to update request')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Commissioner Dashboard</h1>
        <div className="text-gray-600">
          Welcome, {user?.name}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.ticketNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleUpdateRequest(request._id, 'approved', 'Approved by Commissioner')}
                    className="btn btn-secondary"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(request._id, 'rejected', 'Rejected by Commissioner')}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No pending requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CommissionerDashboard
