import React, { useState } from 'react';

function CompanyDetailsModal({ company, onClose }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState('');

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      setScheduleStatus('Interview scheduled successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setScheduleStatus('Please select both date and time');
    }
  };

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00`;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
                <p className="text-xl text-gray-600">{company.position}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Company Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {company.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Type:</span> {company.type}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Salary:</span> {company.salary}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Experience:</span> {company.experience}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {company.skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interview Scheduling */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Interview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a time slot</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {scheduleStatus && (
                <p className={`mt-4 text-sm ${scheduleStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {scheduleStatus}
                </p>
              )}
              <button
                onClick={handleSchedule}
                className="mt-4 w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailsModal; 