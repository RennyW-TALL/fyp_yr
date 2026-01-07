import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, AlertTriangle, Shield, CheckCircle, LogOut, Edit, Trash2, Brain, User, Plus, Search } from 'lucide-react';
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
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedCounselors, setSelectedCounselors] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingType, setAddingType] = useState<'student' | 'counselor'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
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
        showSuccessMessage('Student deleted successfully from database');
      } else {
        setCounselors(prev => prev.filter(c => c.id !== deletingItem.id));
        showSuccessMessage('Counselor deleted successfully from database');
      }
    }
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const handleBulkDelete = (type: 'student' | 'counselor') => {
    if (type === 'student' && selectedStudents.length > 0) {
      setStudents(prev => prev.filter(s => !selectedStudents.includes(s.id)));
      showSuccessMessage(`${selectedStudents.length} student(s) deleted successfully from database`);
      setSelectedStudents([]);
    } else if (type === 'counselor' && selectedCounselors.length > 0) {
      setCounselors(prev => prev.filter(c => !selectedCounselors.includes(c.id)));
      showSuccessMessage(`${selectedCounselors.length} counselor(s) deleted successfully from database`);
      setSelectedCounselors([]);
    }
  };

  const handleSaveEdit = () => {
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      showSuccessMessage('Student updated successfully in database');
    } else if (editingCounselor) {
      setCounselors(prev => prev.map(c => c.id === editingCounselor.id ? editingCounselor : c));
      showSuccessMessage('Counselor updated successfully in database');
    }
    setShowEditModal(false);
    setEditingStudent(null);
    setEditingCounselor(null);
  };

  const handleAddNew = () => {
    if (addingType === 'student' && editingStudent) {
      setStudents(prev => [...prev, { ...editingStudent, id: Math.max(...prev.map(s => s.id)) + 1 }]);
      showSuccessMessage('Student added successfully to database');
    } else if (addingType === 'counselor' && editingCounselor) {
      setCounselors(prev => [...prev, { ...editingCounselor, id: Math.max(...prev.map(c => c.id)) + 1 }]);
      showSuccessMessage('Counselor added successfully to database');
    }
    setShowAddModal(false);
    setEditingStudent(null);
    setEditingCounselor(null);
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCounselors = counselors.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-red-200 shadow-sm">
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
                className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 hover:shadow-md hover:border-red-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-xl text-red-600">
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
                className="bg-white p-6 rounded-2xl shadow-sm border border-red-200 hover:shadow-md hover:border-red-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
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
                                  <button className="px-4 py-2 text-sm bg-red-600 text-white font-medium hover:bg-red-700 rounded-lg transition-colors flex items-center">
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
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAddingType('student');
                    setEditingStudent({ id: 0, name: '', gender: 'Male', age: 18, course: '', year: 1 });
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>
              {selectedStudents.length > 0 && (
                <button
                  onClick={() => handleBulkDelete('student')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedStudents.length})
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents(filteredStudents.map(s => s.id));
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                        className="rounded border-red-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Year of Study</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-red-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudents([...selectedStudents, student.id]);
                            } else {
                              setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                            }
                          }}
                          className="rounded border-red-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.age}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{student.course}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">Year {student.year}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-red-600 hover:text-red-800"
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
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAddingType('counselor');
                    setEditingCounselor({ id: 0, name: '', gender: 'Male', specialty: '' });
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Counselor
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>
              {selectedCounselors.length > 0 && (
                <button
                  onClick={() => handleBulkDelete('counselor')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCounselors.length})
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCounselors.length === filteredCounselors.length && filteredCounselors.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCounselors(filteredCounselors.map(c => c.id));
                          } else {
                            setSelectedCounselors([]);
                          }
                        }}
                        className="rounded border-red-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {filteredCounselors.map(counselor => (
                    <tr key={counselor.id} className="hover:bg-red-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCounselors.includes(counselor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCounselors([...selectedCounselors, counselor.id]);
                            } else {
                              setSelectedCounselors(selectedCounselors.filter(id => id !== counselor.id));
                            }
                          }}
                          className="rounded border-red-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{counselor.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{counselor.gender}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{counselor.specialty}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditCounselor(counselor)}
                          className="text-red-600 hover:text-red-800"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Add New {addingType === 'student' ? 'Student' : 'Counselor'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {addingType === 'student' && editingStudent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={editingStudent.gender}
                      onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
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
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                    <input
                      type="text"
                      value={editingStudent.course}
                      onChange={(e) => setEditingStudent({...editingStudent, course: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Year of Study</label>
                    <select
                      value={editingStudent.year}
                      onChange={(e) => setEditingStudent({...editingStudent, year: parseInt(e.target.value)})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    >
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                  </div>
                </>
              )}
              {addingType === 'counselor' && editingCounselor && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingCounselor.name}
                      onChange={(e) => setEditingCounselor({...editingCounselor, name: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <select
                      value={editingCounselor.gender}
                      onChange={(e) => setEditingCounselor({...editingCounselor, gender: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
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
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-6 bg-red-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStudent(null);
                  setEditingCounselor(null);
                }}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add {addingType === 'student' ? 'Student' : 'Counselor'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="p-6 bg-red-50 flex justify-end gap-3">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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