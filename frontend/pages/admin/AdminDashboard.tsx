import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, AlertTriangle, Shield, CheckCircle, LogOut, Edit, Trash2, Brain, User, Plus, Search } from 'lucide-react';
import { useDatabase } from '../../hooks/useDatabase';
import { MOCK_USERS } from '../../constants';
import { UserStatus } from '../../types';

interface Student {
  id: number;
  name: string;
  email: string;
  tpNumber: string;
  gender: string;
  age: number;
  course: string;
  year: number;
}

interface Counselor {
  id: number;
  name: string;
  email: string;
  gender: string;
  specialty: string;
  qualifications: string;
  experience: string;
}

interface PendingCounselor {
  id: number;
  name: string;
  gender: string;
  specialty: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { students, therapists, pendingTherapists, approveTherapist, rejectTherapist, deleteStudent, deleteTherapist, updateStudent, updateTherapist, addStudent, addPendingTherapist } = useDatabase('admin01');
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingCounselor, setEditingCounselor] = useState<Counselor | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'student' | 'counselor', id: number } | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedCounselors, setSelectedCounselors] = useState<number[]>([]);
  const [selectedPendingCounselors, setSelectedPendingCounselors] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingType, setAddingType] = useState<'student' | 'counselor'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'counselors' | 'pending'>('dashboard');

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

  const handleDeleteConfirm = async () => {
    if (deletingItem) {
      try {
        if (deletingItem.type === 'student') {
          const student = students.find(s => s.username === deletingItem.id.toString());
          if (student) {
            await deleteStudent(student.username);
            showSuccessMessage('Student deleted successfully from database');
          }
        } else {
          await deleteTherapist(deletingItem.id);
          showSuccessMessage('Counselor deleted successfully from database');
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const handleBulkDelete = async (type: 'student' | 'counselor') => {
    try {
      if (type === 'student' && selectedStudents.length > 0) {
        for (const studentIndex of selectedStudents) {
          const student = students[studentIndex];
          if (student) {
            await deleteStudent(student.username);
          }
        }
        showSuccessMessage(`${selectedStudents.length} student(s) deleted successfully from database`);
        setSelectedStudents([]);
      } else if (type === 'counselor' && selectedCounselors.length > 0) {
        for (const counselorId of selectedCounselors) {
          await deleteTherapist(counselorId);
        }
        showSuccessMessage(`${selectedCounselors.length} counselor(s) deleted successfully from database`);
        setSelectedCounselors([]);
      }
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (editingStudent) {
        const student = students.find(s => s.username === editingStudent.id.toString());
        if (student) {
          await updateStudent(student.username, { fullName: editingStudent.name });
          showSuccessMessage('Student updated successfully in database');
        }
      } else if (editingCounselor) {
        await updateTherapist(editingCounselor.id, { name: editingCounselor.name, gender: editingCounselor.gender, specialization: editingCounselor.specialty });
        showSuccessMessage('Counselor updated successfully in database');
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
    setShowEditModal(false);
    setEditingStudent(null);
    setEditingCounselor(null);
  };

  const handleAddNew = async () => {
    try {
      if (addingType === 'student' && editingStudent) {
        await addStudent({
          username: `student_${Date.now()}`,
          fullName: editingStudent.name,
          email: editingStudent.email,
          tpNumber: editingStudent.tpNumber,
          gender: editingStudent.gender,
          age: editingStudent.age,
          course: editingStudent.course,
          yearOfStudy: editingStudent.year,
          studentId: `STU${Date.now().toString().slice(-3)}`
        });
        showSuccessMessage('Student added successfully to database');
      } else if (addingType === 'counselor' && editingCounselor) {
        await addPendingTherapist({
          name: editingCounselor.name,
          email: editingCounselor.email,
          gender: editingCounselor.gender,
          specialization: editingCounselor.specialty,
          qualifications: editingCounselor.qualifications,
          experience: editingCounselor.experience,
          profileImage: '/images/therapists/default.jpg'
        });
        showSuccessMessage('Counselor added to pending list');
      }
    } catch (error) {
      console.error('Error adding:', error);
    }
    setShowAddModal(false);
    setEditingStudent(null);
    setEditingCounselor(null);
  };

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const filteredStudents = students.filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCounselors = therapists.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPendingCounselors = pendingTherapists.filter(c => c.name.toLowerCase().includes(pendingSearchQuery.toLowerCase()));

  const handleApproveCounselor = async (id: number) => {
    try {
      await approveTherapist(id);
      showSuccessMessage('Counselor approved and added to system');
    } catch (error) {
      console.error('Error approving counselor:', error);
    }
  };

  const handleRejectCounselor = async (id: number) => {
    try {
      await rejectTherapist(id);
      showErrorMessage('Counselor registration rejected');
    } catch (error) {
      console.error('Error rejecting counselor:', error);
    }
  };

  const handleBulkApproveCounselors = async () => {
    try {
      for (const id of selectedPendingCounselors) {
        await approveTherapist(id);
      }
      setSelectedPendingCounselors([]);
      showSuccessMessage(`${selectedPendingCounselors.length} counselor(s) approved`);
    } catch (error) {
      console.error('Error bulk approving counselors:', error);
    }
  };

  const handleBulkRejectCounselors = async () => {
    try {
      const count = selectedPendingCounselors.length;
      for (const id of selectedPendingCounselors) {
        await rejectTherapist(id);
      }
      setSelectedPendingCounselors([]);
      showErrorMessage(`${count} counselor(s) rejected`);
    } catch (error) {
      console.error('Error bulk rejecting counselors:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {errorMessage}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/images/mindcare-apu-logo.png" 
              alt="MindCare APU" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="h-12 w-12 bg-orange-100 rounded-lg items-center justify-center hidden">
              <span className="text-lg font-bold text-orange-900">MC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-orange-900">MindCare APU</h1>
              <p className="text-sm text-orange-700">Admin Dashboard</p>
            </div>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
              <h1 className="text-2xl font-bold text-orange-900">Admin Dashboard</h1>
              <p className="text-orange-700">System overview and user management.</p>
            </div>

            {/* Navigation Widgets */}
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveView('students')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 hover:shadow-md hover:border-orange-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900">Student Management</h3>
                    <p className="text-orange-700">View and manage student accounts</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveView('counselors')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 hover:shadow-md hover:border-orange-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <Brain className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900">Counselor Management</h3>
                    <p className="text-orange-700">View and manage counselor accounts</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('pending')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-orange-200 hover:shadow-md hover:border-orange-300 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                    <UserPlus className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-900">Pending Counselors</h3>
                    <p className="text-orange-700">Review pending registrations</p>
                  </div>
                </div>
              </button>
            </div>


          </div>
        )}

        {activeView === 'students' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-orange-900">Student Management</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAddingType('student');
                    setEditingStudent({ id: 0, name: '', email: '', tpNumber: '', gender: 'Male', age: 18, course: '', year: 1 });
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              {selectedStudents.length > 0 && (
                <button
                  onClick={() => handleBulkDelete('student')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedStudents.length})
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
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
                        className="rounded border-orange-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">TP Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-orange-50">
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
                          className="rounded border-orange-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-orange-900">{student.fullName}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{student.tpNumber}</td>
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
                          className="text-orange-600 hover:text-orange-800"
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
              <h1 className="text-2xl font-bold text-orange-900">Counselor Management</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAddingType('counselor');
                    setEditingCounselor({ id: 0, name: '', email: '', gender: 'Male', specialty: '', qualifications: '', experience: '' });
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              {selectedCounselors.length > 0 && (
                <button
                  onClick={() => handleBulkDelete('counselor')}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedCounselors.length})
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
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
                        className="rounded border-orange-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Edit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {filteredCounselors.map(counselor => (
                    <tr key={counselor.id} className="hover:bg-orange-50">
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
                          className="rounded border-orange-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-orange-900">{counselor.name}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{counselor.gender}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{counselor.specialization}</td>
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
                          className="text-orange-600 hover:text-orange-800"
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

        {activeView === 'pending' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-orange-900">Pending Counselor Registrations</h1>
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-orange-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              {selectedPendingCounselors.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkApproveCounselors}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Selected ({selectedPendingCounselors.length})
                  </button>
                  <button
                    onClick={handleBulkRejectCounselors}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reject Selected ({selectedPendingCounselors.length})
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPendingCounselors.length === filteredPendingCounselors.length && filteredPendingCounselors.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPendingCounselors(filteredPendingCounselors.map(c => c.id));
                          } else {
                            setSelectedPendingCounselors([]);
                          }
                        }}
                        className="rounded border-orange-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Specialty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {filteredPendingCounselors.map(counselor => (
                    <tr key={counselor.id} className="hover:bg-orange-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPendingCounselors.includes(counselor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPendingCounselors([...selectedPendingCounselors, counselor.id]);
                            } else {
                              setSelectedPendingCounselors(selectedPendingCounselors.filter(id => id !== counselor.id));
                            }
                          }}
                          className="rounded border-orange-300"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-orange-900">{counselor.name}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{counselor.gender}</td>
                      <td className="px-6 py-4 text-sm text-orange-700">{counselor.specialization}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectCounselor(counselor.id)}
                            className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveCounselor(counselor.id)}
                            className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </button>
                        </div>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">TP Number</label>
                    <input
                      type="text"
                      value={editingStudent.tpNumber}
                      onChange={(e) => setEditingStudent({...editingStudent, tpNumber: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                      placeholder="e.g., 032244"
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
                      <option value="Other">Other</option>
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
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editingCounselor.name}
                      onChange={(e) => setEditingCounselor({...editingCounselor, name: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                      placeholder="e.g., Dr. John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingCounselor.email}
                      onChange={(e) => setEditingCounselor({...editingCounselor, email: e.target.value})}
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
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                    <input
                      type="text"
                      value={editingCounselor.specialty}
                      onChange={(e) => setEditingCounselor({...editingCounselor, specialty: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                      placeholder="e.g., Anxiety & Stress"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Qualifications</label>
                    <input
                      type="text"
                      value={editingCounselor.qualifications}
                      onChange={(e) => setEditingCounselor({...editingCounselor, qualifications: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                      placeholder="e.g., PhD in Psychology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                    <input
                      type="text"
                      value={editingCounselor.experience}
                      onChange={(e) => setEditingCounselor({...editingCounselor, experience: e.target.value})}
                      className="w-full p-2 border border-red-300 rounded-lg"
                      placeholder="e.g., 5 years clinical experience"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="p-6 bg-orange-50 flex justify-end gap-3">
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
            <div className="p-6 bg-orange-50 flex justify-end gap-3">
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
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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