import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, AlertTriangle, Shield, CheckCircle, LogOut, Edit, Trash2, Brain, User } from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { UserStatus } from '../../types';

interface Student {
  id: number;
  name: string;
  gender: string;
  age: number;
  course: string;
  year: number;
}

interface Counselor {
  id: number;
  name: string;
  gender: string;
  specialty: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'counselors'>('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'student' | 'counselor', id: number } | null>(null);
  
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Wong Yi Ren', gender: 'Male', age: 21, course: 'Computer Science', year: 3 },
    { id: 2, name: 'John Doe', gender: 'Male', age: 22, course: 'Software Engineering', year: 3 },
    { id: 3, name: 'Sarah Lee', gender: 'Female', age: 20, course: 'Cyber Security', year: 2 },
    { id: 4, name: 'Tester 123', gender: 'Male', age: 21, course: 'SE, CYB', year: 3 },
    { id: 5, name: 'Tester 246', gender: 'Female', age: 21, course: 'SE, CYB', year: 2 }
  ]);
  
  const [counselors, setCounselors] = useState<Counselor[]>([
    { id: 1, name: 'Dr John Smith', gender: 'Male', specialty: 'Anxiety & Stress' },
    { id: 2, name: 'Dr Mei Lee', gender: 'Female', specialty: 'Academic Pressure' },
    { id: 3, name: 'Dr Wilson House', gender: 'Male', specialty: 'Anxiety and Depression' }
  ]);

  const pendingCounselors = MOCK_USERS.filter(u => u.status === UserStatus.PENDING);
  const totalUsers = MOCK_USERS.length;
  const suspendedUsers = MOCK_USERS.filter(u => u.status === UserStatus.SUSPENDED).length;

  const handleLogout = () => {
    navigate('/login');
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleEditCounselor = (counselor: Counselor) => {
    setEditingCounselor(counselor);
    setShowEditModal(true);
  };

  const handleDeleteClick = (type: 'student' | 'counselor', id: number) => {
    setDeletingItem({ type, id });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingItem) {
      if (deletingItem.type === 'student') {
        setStudents(prev => prev.filter(s => s.id !== deletingItem.id));
      } else {
        setCounselors(prev => prev.filter(c => c.id !== deletingItem.id));
      }
    }
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const handleSaveEdit = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
    } else if (editingCounselor) {
      setCounselors(prev => prev.map(c => c.id === editingCounselor.id ? editingCounselor : c));
    }
    setShowEditModal(false);
    setEditingStudent(null);
    setEditingCounselor(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/images/mindcare-apu-logo.png" 
              alt="MindCare APU" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="h-12 w-12 bg-blue-100 rounded-lg items-center justify-center hidden">
              <span className="text-lg font-bold text-blue-900">MC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">MindCare APU</h1>
              <p className="text-sm text-slate-600">Admin Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500">System overview and user management.</p>
            </div>

            {/* Navigation Widgets */}
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setActiveView('students')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Student Management</h3>
                    <p className="text-slate-600">View and manage student accounts</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveView('counselors')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-xl text-green-600">
                    <Brain className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Counselor Management</h3>
                    <p className="text-slate-600">View and manage counselor accounts</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Pending Approvals Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Pending Counselor Registrations</h3>
              </div>
              <div className="divide-y divide-slate-100">
                  {pendingCounselors.length > 0 ? (
                      pendingCounselors.map(user => (
                          <div key={user.id} className="p-6 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                      {user.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900">{user.name}</p>
                                      <p className="text-sm text-slate-500">{user.email}</p>
                                  </div>
                              </div>
                              <div className="flex gap-3">
                                  <button className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors">Reject</button>
                                  <button className="px-4 py-2 text-sm bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition-colors flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                  </button>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="p-8 text-center text-slate-500">No pending registrations.</div>
                  )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Year of Study</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map(student => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.course}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Year {student.year}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteClick('student', student.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'counselors' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-900">Counselor Management</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {counselors.map(counselor => (
                    <tr key={counselor.id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{counselor.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{counselor.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{counselor.specialty}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditCounselor(counselor)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteClick('counselor', counselor.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Edit {editingStudent ? 'Student' : 'Counselor'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {editingStudent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={editingStudent.age}
                      onChange={(e) => setEditingStudent({...editingStudent, age: parseInt(e.target.value)})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                    <input
                      type="text"
                      value={editingStudent.course}
                      onChange={(e) => setEditingStudent({...editingStudent, course: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study</label>
                    <select
                      value={editingStudent.year}
                      onChange={(e) => setEditingStudent({...editingStudent, year: parseInt(e.target.value)})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                  </div>
                </>
              )}
              {editingCounselor && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingCounselor.name}
                      onChange={(e) => setEditingCounselor({...editingCounselor, name: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={editingCounselor.gender}
                      onChange={(e) => setEditingCounselor({...editingCounselor, gender: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialty</label>
                    <input
                      type="text"
                      value={editingCounselor.specialty}
                      onChange={(e) => setEditingCounselor({...editingCounselor, specialty: e.target.value})}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingStudent(null);
                  setEditingCounselor(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Confirm Delete</h3>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                Are you sure you want to delete this {deletingItem?.type}? This action cannot be undone.
              </p>
            </div>
            <div className="p-6 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingItem(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;