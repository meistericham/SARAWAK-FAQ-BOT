import React, { useState, useEffect } from 'react';
import { Users, Search, Crown, User, Mail, Calendar, Plus, Edit, Trash2, Key, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase, UserProfile } from '../../lib/supabase';

interface NewUserData {
  email: string;
  full_name: string;
  role: 'USER' | 'ADMIN';
  password: string;
}

interface EditUserData {
  full_name: string;
  role: 'USER' | 'ADMIN';
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
  const [resettingPassword, setResettingPassword] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [newUser, setNewUser] = useState<NewUserData>({
    email: '',
    full_name: '',
    role: 'USER',
    password: ''
  });

  const [editUser, setEditUser] = useState<EditUserData>({
    full_name: '',
    role: 'USER'
  });

  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const validateNewUser = (): string | null => {
    if (!newUser.email.trim()) {
      return 'Email is required';
    }
    if (!validateEmail(newUser.email)) {
      return 'Please enter a valid email address';
    }
    if (!newUser.full_name.trim()) {
      return 'Full name is required';
    }
    if (newUser.full_name.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    if (!newUser.password) {
      return 'Password is required';
    }
    const passwordError = validatePassword(newUser.password);
    if (passwordError) {
      return passwordError;
    }
    return null;
  };

  const validateEditUser = (): string | null => {
    if (!editUser.full_name.trim()) {
      return 'Full name is required';
    }
    if (editUser.full_name.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    return null;
  };

  const handleAddUser = async () => {
    const validationError = validateNewUser();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', newUser.email.toLowerCase())
        .single();

      if (existingUser) {
        throw new Error('A user with this email already exists');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email.toLowerCase(),
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.full_name.trim()
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: newUser.email.toLowerCase(),
            full_name: newUser.full_name.trim(),
            role: newUser.role
          });

        if (profileError) throw profileError;
      }

      await fetchUsers();
      setNewUser({ email: '', full_name: '', role: 'USER', password: '' });
      setShowAddModal(false);
      setSuccess(`User "${newUser.full_name}" created successfully!`);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Failed to add user:', err);
      setError(err.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    const validationError = validateEditUser();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editUser.full_name.trim(),
          role: editUser.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      await fetchUsers();
      setEditingUser(null);
      setSuccess(`User "${editUser.full_name}" updated successfully!`);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Delete from auth (this will cascade to profiles due to foreign key)
      const { error: authError } = await supabase.auth.admin.deleteUser(deletingUser.id);
      if (authError) throw authError;

      await fetchUsers();
      setDeletingUser(null);
      setSuccess(`User "${deletingUser.full_name}" deleted successfully!`);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(err.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resettingPassword) return;

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        resettingPassword.id,
        { password: newPassword }
      );

      if (error) throw error;

      setResettingPassword(null);
      setNewPassword('');
      setSuccess(`Password reset successfully for "${resettingPassword.full_name}"!`);
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      console.error('Failed to reset password:', err);
      setError(err.message || 'Failed to reset password');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Users size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">User Management</h2>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">User Management</h2>
          </div>
          <button
            onClick={() => {
              setShowAddModal(true);
              clearMessages();
            }}
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <CheckCircle size={16} />
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="ml-auto text-green-500 hover:text-green-700">
              ×
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
            <AlertCircle size={16} />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        )}

        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role === 'ADMIN' ? <Crown size={16} /> : <User size={16} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.full_name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={12} className="mr-1" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setEditUser({
                            full_name: user.full_name,
                            role: user.role
                          });
                          clearMessages();
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setResettingPassword(user);
                          setNewPassword('');
                          clearMessages();
                        }}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
                        title="Reset password"
                      >
                        <Key size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeletingUser(user);
                          clearMessages();
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No users found matching your search' : 'No users found'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Add Your First User
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'USER' | 'ADMIN' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({ email: '', full_name: '', role: 'USER', password: '' });
                    clearMessages();
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={saving || !newUser.email || !newUser.full_name || !newUser.password}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create User</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editUser.full_name}
                  onChange={(e) => setEditUser(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value as 'USER' | 'ADMIN' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    clearMessages();
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  disabled={saving || !editUser.full_name.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update User</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deletingUser.full_name}</strong>? 
              This action cannot be undone and will permanently remove the user and all associated data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setDeletingUser(null);
                  clearMessages();
                }}
                disabled={saving}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete User</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resettingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-4">
              Reset password for <strong>{resettingPassword.full_name}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setResettingPassword(null);
                    setNewPassword('');
                    clearMessages();
                  }}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={saving || !newPassword}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <span>Reset Password</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}