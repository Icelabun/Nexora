import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';

const AdminDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [errors, setErrors] = useState([]);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        userType: '',
        isAdmin: false,
    });
    const [messageForm, setMessageForm] = useState({
        subject: '',
        message: '',
    });
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        userId: '',
        method: ''
    });
    const { user } = useAuth();
    const hasPasswordBypassAccess =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('adminAccess') === 'granted';
    const canAccessAdminDashboard = Boolean(user?.isAdmin) || hasPasswordBypassAccess;
    const fetchData = useCallback(async () => {
        setFetchError(null);
        try {
            const [activitiesRes, errorsRes, statsRes, usersRes] = await Promise.all([
                axiosInstance.get('/api/admin/activities', {
                    params: filters
                }),
                axiosInstance.get('/api/admin/errors'),
                axiosInstance.get('/api/admin/statistics'),
                axiosInstance.get('/api/admin/users'),
            ]);
            setActivities(Array.isArray(activitiesRes.data) ? activitiesRes.data : []);
            setErrors(Array.isArray(errorsRes.data) ? errorsRes.data : []);
            setStats(statsRes.data || null);
            setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
            setFetchError(null);
            if (process.env.NODE_ENV !== 'production') {
                console.debug('[AdminDashboard] Fetched:', { users: usersRes.data?.length ?? 0, activities: activitiesRes.data?.length ?? 0 });
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
            const message = error.response?.data?.message || error.message || 'Failed to load dashboard data.';
            setFetchError(message);
            setUsers([]);
            setActivities([]);
            setErrors([]);
            setStats(null);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExport = async (type) => {
        try {
            const response = await axiosInstance.get('/api/admin/export', {
                params: {
                    type,
                    ...filters
                },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}-logs-${moment().format('YYYY-MM-DD')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting logs:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!userId) return;
        const confirmed = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
        if (!confirmed) return;

        try {
            setActionLoading(true);
            setAlert(null);
            await axiosInstance.delete(`/api/admin/users/${userId}`);
            setAlert({ type: 'success', message: 'User deleted successfully.' });
            await fetchData();
        } catch (error) {
            console.error('Error deleting user:', error);
            const message = error.response?.data?.message || 'Failed to delete user.';
            setAlert({ type: 'error', message });
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (userToEdit) => {
        if (!userToEdit) return;
        setSelectedUser(userToEdit);
        setEditForm({
            username: userToEdit.username || '',
            email: userToEdit.email || '',
            userType: userToEdit.userType || '',
            isAdmin: Boolean(userToEdit.isAdmin),
        });
        setShowEditModal(true);
    };

    const openDetailsModal = (userToView) => {
        if (!userToView) return;
        setSelectedUser(userToView);
        setShowDetailsModal(true);
    };

    const handleEditChange = (e) => {
        const { name, type, checked, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser?._id) return;

        try {
            setActionLoading(true);
            setAlert(null);
            await axiosInstance.put(`/api/admin/users/${selectedUser._id}`, editForm);
            setAlert({ type: 'success', message: 'User updated successfully.' });
            setShowEditModal(false);
            setSelectedUser(null);
            await fetchData();
        } catch (error) {
            console.error('Error updating user:', error);
            const message = error.response?.data?.message || 'Failed to update user.';
            setAlert({ type: 'error', message });
        } finally {
            setActionLoading(false);
        }
    };

    const openMessageModal = (userToMessage) => {
        if (!userToMessage) return;
        setSelectedUser(userToMessage);
        setMessageForm({
            subject: '',
            message: '',
        });
        setShowMessageModal(true);
    };

    const handleMessageChange = (e) => {
        const { name, value } = e.target;
        setMessageForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!selectedUser?._id || !messageForm.message.trim()) return;

        try {
            setActionLoading(true);
            setAlert(null);
            await axiosInstance.post('/api/admin/messages', {
                userId: selectedUser._id,
                subject: messageForm.subject,
                message: messageForm.message,
            });
            setAlert({ type: 'success', message: 'Message sent successfully.' });
            setShowMessageModal(false);
            setSelectedUser(null);
            setMessageForm({ subject: '', message: '' });
            await fetchData();
        } catch (error) {
            console.error('Error sending message:', error);
            const message = error.response?.data?.message || 'Failed to send message.';
            setAlert({ type: 'error', message });
        } finally {
            setActionLoading(false);
        }
    };

    if (!canAccessAdminDashboard) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="mt-2">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {fetchError && (
                    <div className="mb-6 rounded-md px-4 py-4 text-sm bg-amber-100 text-amber-800 space-y-2">
                        <p className="font-medium">Could not load data: {fetchError}</p>
                        <p className="text-amber-900">
                            To see all registered users, do one of the following:
                        </p>
                        <ul className="list-disc list-inside text-amber-900 ml-2 space-y-1">
                            <li><strong>Log in as an admin:</strong> Use the Login button and sign in with an account that has admin rights, or</li>
                            <li><strong>Use the admin password:</strong> Set <code className="bg-amber-200 px-1 rounded">REACT_APP_ADMIN_PANEL_PASSWORD</code> in the frontend <code className="bg-amber-200 px-1 rounded">StudySphere/.env</code> to the same value as <code className="bg-amber-200 px-1 rounded">ADMIN_PANEL_PASSWORD</code> in the backend <code className="bg-amber-200 px-1 rounded">StudySphere-backend/.env</code>, then click below to re-enter the password.
                        </li>
                        </ul>
                        <p className="text-amber-900">Ensure the backend server is running and MongoDB is connected. If you just changed .env, restart the frontend (npm start) and use the button below.</p>
                        <button
                            type="button"
                            onClick={() => {
                                sessionStorage.removeItem('adminAccess');
                                window.location.reload();
                            }}
                            className="mt-2 rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                        >
                            Re-verify admin (show password screen again)
                        </button>
                    </div>
                )}

                {alert && alert.message && (
                    <div
                        className={`mb-6 rounded-md px-4 py-3 text-sm ${
                            alert.type === 'error'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                        }`}
                    >
                        {alert.message}
                    </div>
                )}

                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-600">Users</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                                <p className="text-sm text-gray-500">Total Users</p>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xl font-bold">{stats.activeUsers}</p>
                                    <p className="text-sm text-gray-500">Active Today</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">{stats.newUsers}</p>
                                    <p className="text-sm text-gray-500">New This Week</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-600">Activity</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold">{stats.todayActivityCount}</p>
                                <p className="text-sm text-gray-500">Today&apos;s Activities</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-xl font-bold">{Number(stats.averageResponseTime).toFixed(2)}ms</p>
                                <p className="text-sm text-gray-500">Avg Response Time</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-600">System Health</h3>
                            <div className="mt-2">
                                <p className="text-3xl font-bold">{Number(stats.errorRate).toFixed(1)}%</p>
                                <p className="text-sm text-gray-500">Error Rate</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-xl font-bold">{errors.length}</p>
                                <p className="text-sm text-gray-500">Total Errors</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                                type="text"
                                name="userId"
                                value={filters.userId}
                                onChange={handleFilterChange}
                                placeholder="Filter by user ID"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Method</label>
                            <select
                                name="method"
                                value={filters.method}
                                onChange={handleFilterChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">All Methods</option>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="mb-8 flex space-x-4">
                    <button
                        onClick={() => handleExport('combined')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Export Activity Logs
                    </button>
                    <button
                        onClick={() => handleExport('error')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Export Error Logs
                    </button>
                </div>

                {/* Users Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">All Registered Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualifications</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expertise</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Messages</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                                            {fetchError ? 'Users could not be loaded. Check the message above.' : 'No registered users yet.'}
                                        </td>
                                    </tr>
                                )}
                                {users.map((u) => (
                                    <tr key={u._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.username || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.userType || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {typeof u.isVerified === 'boolean' ? (u.isVerified ? 'Yes' : 'No') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.isAdmin ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.grade || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={(Array.isArray(u.subjects) ? u.subjects.join(', ') : '')}>
                                            {Array.isArray(u.subjects) && u.subjects.length ? u.subjects.join(', ') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={u.qualifications || ''}>
                                            {u.qualifications || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={(Array.isArray(u.expertise) ? u.expertise.join(', ') : '')}>
                                            {Array.isArray(u.expertise) && u.expertise.length ? u.expertise.join(', ') : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.messagesCount ?? (Array.isArray(u.messages) ? u.messages.length : 0)} (unread: {u.unreadMessagesCount ?? 0})
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-2">
                                            <button
                                                onClick={() => openDetailsModal(u)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center rounded bg-gray-700 px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => openEditModal(u)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => openMessageModal(u)}
                                                disabled={actionLoading}
                                                className="inline-flex items-center rounded bg-indigo-500 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-600 disabled:opacity-50"
                                            >
                                                Message
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Activities Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">User Activities</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {activities.map((activity, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.user
                                                ? `${activity.user.username || 'Unknown'} (${activity.user.email || 'no-email'})`
                                                : activity.userId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.path}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.status}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {activity.duration}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Errors Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-4">Error Logs</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {errors.map((error, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(error.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            {error.message}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {JSON.stringify(error.details || error)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Details Modal */}
                {showDetailsModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                        <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold">User Details</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedUser(null);
                                    }}
                                    className="rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="text-sm text-gray-700 mb-3">
                                <div><span className="font-medium">Username:</span> {selectedUser.username || '-'}</div>
                                <div><span className="font-medium">Email:</span> {selectedUser.email || '-'}</div>
                                <div><span className="font-medium">User ID:</span> {selectedUser._id}</div>
                                <div>
                                    <span className="font-medium">Messages:</span>{' '}
                                    {selectedUser.messagesCount ?? (selectedUser.messages ? selectedUser.messages.length : 0)}{' '}
                                    (unread: {selectedUser.unreadMessagesCount ?? 0})
                                </div>
                            </div>
                            <pre className="max-h-[60vh] overflow-auto rounded bg-gray-50 p-4 text-xs text-gray-800">{JSON.stringify(selectedUser, null, 2)}</pre>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-xl font-semibold">Edit User</h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={editForm.username}
                                        onChange={handleEditChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">User Type</label>
                                    <select
                                        name="userType"
                                        value={editForm.userType}
                                        onChange={handleEditChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    >
                                        <option value="">Select type</option>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="isAdmin"
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={editForm.isAdmin}
                                        onChange={handleEditChange}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isAdmin" className="ml-2 text-sm text-gray-700">
                                        Admin
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                        }}
                                        className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Send Message Modal */}
                {showMessageModal && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                            <h3 className="mb-4 text-xl font-semibold">
                                Send Message to {selectedUser.username || selectedUser.email}
                            </h3>
                            <form onSubmit={handleSendMessage} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={messageForm.subject}
                                        onChange={handleMessageChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        name="message"
                                        value={messageForm.message}
                                        onChange={handleMessageChange}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowMessageModal(false);
                                            setSelectedUser(null);
                                        }}
                                        className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard; 

