// filepath: c:\Users\Sarthak\Downloads\project\frontend\src\components\PublicForm.jsx
import React, { useState } from 'react';
import axios from '../config/axios';

function PublicForm() {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    requestType: '',
    sourceSystem: [],
    ulbCode: '',
    ulbName: '',
    userId: '',
    employeeName: '',
    employeeCode: '',
    designation: '',
    mobileNumber: '',
    email: '',
    department: '',
    tcodeList: '',
    language: 'hindi'
  });

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [ticketNumber, setTicketNumber] = useState('') // Add ticketNumber state

  const requestTypes = [
    { value: 'new', hindi: 'नई यूज़र आईडी क्रिएशन के लिए', english: 'New User ID Creation' },
    { value: 'auth', hindi: 'ऑथोराइजेशन में संशोधन के लिए', english: 'Change in Authorizations' },
    { value: 'transfer', hindi: 'स्थानांतरण के लिए', english: 'Transfer' },
    { value: 'additional', hindi: 'अतिरिक्त प्रभार दिए जाने पर कार्य करने हेतु', english: 'Additional Charge' },
    { value: 'ownership', hindi: 'विधमान यूज़र पर प्रभार दिए जाने पर आईडी में नाम/नगरपालिका में बदलाव किए जाने हेतु', english: 'Change of ownership of User ID' },
    { value: 'password', hindi: 'पासवर्ड रीसेट के लिए', english: 'Password Reset' }
  ]

  const sourceSystems = [
    { value: 'SAP_ECC', label: 'SAP ECC' },
    { value: 'SAP_TRM', label: 'SAP TRM' },
    { value: 'SAP_PORTAL', label: 'SAP PORTAL' },
    { value: 'SAP_CRM', label: 'SAP CRM' }
  ]
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    setTicketNumber('') // Reset ticket number

    try {
      const response = await axios.post('/api/requests', {
        name: form.employeeName,
        email: form.email,
        department: form.department,
        requestType: form.requestType,
        description: form.description || 'No description provided',
        ulbCode: form.ulbCode,
        ulbName: form.ulbName,
        employeeCode: form.employeeCode,
        designation: form.designation,
        mobileNumber: form.mobileNumber,
        sourceSystem: form.sourceSystem,
        tcodeList: form.tcodeList
      })
      setSuccess(true)
      setTicketNumber(response.data.data.request.ticketNumber) // Store ticket number
      setForm({
        date: new Date().toISOString().split('T')[0],
        requestType: '',
        sourceSystem: [],
        ulbCode: '',
        ulbName: '',
        userId: '',
        employeeName: '',
        employeeCode: '',
        designation: '',
        mobileNumber: '',
        email: '',
        department: '',
        tcodeList: '',
        language: form.language
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      const systems = [...form.sourceSystem]
      if (checked) {
        systems.push(value)
      } else {
        const index = systems.indexOf(value)
        if (index > -1) {
          systems.splice(index, 1)
        }
      }
      setForm(prev => ({ ...prev, sourceSystem: systems }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const labels = {
    hindi: {
      title: 'ई-नागरिकता',
      subtitle: 'फॉर्म ऑफ़ नई यूज़र आईडी क्रिएशन / ऑथोराइजेशन चेंज के लिए',
      ticketNo: 'टिकट नंबर',
      date: 'दिनांक',
      requestType: 'अनुरोध का स्वरूप',
      sourceSystem: 'स्रोत सिस्टम',
      ulbCode: 'निकाय का कोड',
      ulbName: 'निकाय का नाम',
      userId: 'यूज़र आईडी',
      employeeName: 'अधिकारी/कर्मचारी का नाम',
      employeeCode: 'अधिकारी/कर्मचारी का विशिष्ट कोड',
      designation: 'पद',
      mobileNumber: 'मोबाइल नंबर',
      email: 'अधिकारी का ईमेल आईडी',
      department: 'निकाय की शाखा / विभाग',
      tcodeList: 'टी कोड लिस्ट',
      submit: 'जमा करें'
    },
    english: {
      title: 'e-Citizenship',
      subtitle: 'Form for User ID Creation / Authorization Changes etc.',
      ticketNo: 'Ticket No.',
      date: 'Date',
      requestType: 'Nature of Request',
      sourceSystem: 'Source System',
      ulbCode: 'ULB Code',
      ulbName: 'ULB Name',
      userId: 'User ID',
      employeeName: 'Name of Employee',
      employeeCode: 'Employee Code',
      designation: 'Designation',
      mobileNumber: "Employee's Official E-Mail ID",
      email: "Employee's Official E-Mail ID",
      department: 'Section of ULB',
      tcodeList: 'Tcode List',
      submit: 'Submit'
    }
  }

  const currentLabels = labels[form.language]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{currentLabels.title}</h1>
            <p className="text-gray-600">{currentLabels.subtitle}</p>
          </div>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="w-auto form-input"
          >
            <option value="hindi">हिंदी</option>
            <option value="english">English</option>
          </select>
        </div>

        {success ? (
          <div className="p-4 text-center">
            <div className="mb-2 text-xl text-green-600">
              {form.language === 'hindi'
                ? `आपका अनुरोध सफलतापूर्वक जमा किया गया है! आपका टिकट नंबर है: ${ticketNumber}`
                : `Your request has been submitted successfully! Your ticket number is: ${ticketNumber}`}
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="btn btn-primary"
            >
              {form.language === 'hindi' ? 'नया फॉर्म भरें' : 'Submit New Form'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">{currentLabels.date}</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 form-label">{currentLabels.requestType}</label>
              <div className="space-y-2">
                {requestTypes.map(type => (
                  <div key={type.value} className="flex items-center">
                    <input
                      type="radio"
                      name="requestType"
                      value={type.value}
                      checked={form.requestType === type.value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label>
                      {form.language === 'hindi' ? type.hindi : type.english}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 form-label">{currentLabels.sourceSystem}</label>
              <div className="grid grid-cols-2 gap-4">
                {sourceSystems.map(system => (
                  <div key={system.value} className="flex items-center">
                    <input
                      type="checkbox"
                      name="sourceSystem"
                      value={system.value}
                      checked={form.sourceSystem.includes(system.value)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label>{system.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">{currentLabels.ulbCode}</label>
                <input
                  type="text"
                  name="ulbCode"
                  value={form.ulbCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{currentLabels.ulbName}</label>
                <input
                  type="text"
                  name="ulbName"
                  value={form.ulbName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">{currentLabels.userId}</label>
                <input
                  type="text"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{currentLabels.employeeName}</label>
                <input
                  type="text"
                  name="employeeName"
                  value={form.employeeName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">{currentLabels.employeeCode}</label>
                <input
                  type="text"
                  name="employeeCode"
                  value={form.employeeCode}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{currentLabels.designation}</label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">{currentLabels.mobileNumber}</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">{currentLabels.email}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">{currentLabels.department}</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{currentLabels.tcodeList}</label>
              <textarea
                name="tcodeList"
                value={form.tcodeList}
                onChange={handleChange}
                rows={3}
                className="form-input"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">
                {error}
              </div>
            )}

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
                  {form.language === 'hindi' ? 'प्रतीक्षा करें...' : 'Please wait...'}
                </span>
              ) : (
                currentLabels.submit
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default PublicForm