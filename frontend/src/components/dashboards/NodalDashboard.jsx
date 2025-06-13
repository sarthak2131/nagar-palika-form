import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import { useAuth } from '../../hooks/useAuth'

function NodalDashboard() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchRequests()
    // eslint-disable-next-line
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests')
      if (response.data?.data?.requests && Array.isArray(response.data.data.requests)) {
        setRequests(response.data.data.requests)
      } else {
        setRequests([])
      }
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
        <div className="w-8 h-8 border-b-2 border-blue-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nodal Officer Dashboard</h1>
        <div className="text-gray-600">
          Welcome, {user?.name}
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-600 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ticket</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request._id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{request.ticketNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{request.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{request.department}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{request.requestType}</td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => handleUpdateRequest(request._id, 'pending_commissioner', 'Forwarded to Commissioner')}
                    className="btn btn-primary"
                  >
                    Forward to Commissioner
                  </button>
                  <button
                    onClick={() => handleUpdateRequest(request._id, 'rejected', 'Rejected by Nodal Officer')}
                    className="text-white bg-red-600 btn hover:bg-red-700"
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

export default NodalDashboard