import React, { useEffect, useState } from 'react'
import axios from '../../config/axios'
import { useAuth } from '../../hooks/useAuth'

function CMODashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [actionInProgress, setActionInProgress] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/requests');
      console.log('Fetched requests:', response.data);
      if (response.data?.data?.requests) {
        setRequests(response.data.data.requests);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    try {
      setActionInProgress(true);
      console.log('Approving request:', request._id);
      
      const response = await axios.patch(`/api/requests/${request._id}`, {
        status: 'pending_nodal',
        remarks: [{
          comment: 'Approved by CMO and forwarded to Nodal Officer',
          status: 'pending_nodal'
        }]
      });

      console.log('Approve response:', response.data);
      
      if (response.data.status === 'success') {
        await fetchRequests();
        setError('');
      }
    } catch (err) {
      console.error('Approve error:', err);
      setError(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
    setRejectRemark('');
  };

  const submitReject = async () => {
    if (!rejectRemark.trim()) {
      setError('Please enter rejection remarks');
      return;
    }

    try {
      setActionInProgress(true);
      console.log('Rejecting request:', selectedRequest._id);
      
      const response = await axios.patch(`/api/requests/${selectedRequest._id}`, {
        status: 'rejected',
        remarks: [{
          comment: rejectRemark,
          status: 'rejected'
        }]
      });

      console.log('Reject response:', response.data);

      if (response.data.status === 'success') {
        await fetchRequests();
        setShowRejectModal(false);
        setRejectRemark('');
        setError('');
      }
    } catch (err) {
      console.error('Reject error:', err);
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionInProgress(false);
    }
  };
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
        <h1 className="text-2xl font-semibold">CMO Dashboard</h1>
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
                    onClick={() => handleView(request)}
                    className="px-4 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    View
                  </button>
              <button
      onClick={() => handleApprove(request)}
      disabled={actionInProgress}
      className="px-4 py-1 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {actionInProgress ? 'Processing...' : 'Approve'}
    </button>
                  <button
                    onClick={() => handleReject(request)}
                    className="px-4 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing request details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Request Details</h2>
            <div className="space-y-2">
              <div><strong>Ticket Number:</strong> {selectedRequest.ticketNumber}</div>
              <div><strong>Name:</strong> {selectedRequest.name}</div>
              <div><strong>Email:</strong> {selectedRequest.email}</div>
              <div><strong>Department:</strong> {selectedRequest.department}</div>
              <div><strong>Request Type:</strong> {selectedRequest.requestType}</div>
              <div><strong>Description:</strong> {selectedRequest.description}</div>
              <div><strong>Status:</strong> {selectedRequest.status}</div>
              <div><strong>ULB Code:</strong> {selectedRequest.ulbCode}</div>
              <div><strong>ULB Name:</strong> {selectedRequest.ulbName}</div>
              <div><strong>Employee Code:</strong> {selectedRequest.employeeCode}</div>
              <div><strong>Designation:</strong> {selectedRequest.designation}</div>
              <div><strong>Mobile Number:</strong> {selectedRequest.mobileNumber}</div>
              <div><strong>Source System:</strong> {selectedRequest.sourceSystem?.join(', ')}</div>
              <div><strong>Tcode List:</strong> {selectedRequest.tcodeList}</div>
              <div><strong>Created At:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for reject remark */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Reject Request</h2>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              placeholder="Enter rejection remark"
              value={rejectRemark}
              onChange={e => setRejectRemark(e.target.value)}
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitReject}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CMODashboard