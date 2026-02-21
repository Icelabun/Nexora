import express from 'express';
import { logger } from '../middleware/logger.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];
    if (!authHeader) return null;

    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    }

    return authHeader;
};

// Default admin password for development when env is not set (do not use in production)
const DEV_ADMIN_PASSWORD = 'Admin2024#';

// Middleware to verify token, load user and check admin privileges.
// Checks x-admin-password FIRST so password bypass works when header is sent.
const isAdmin = async (req, res, next) => {
    const allowPasswordBypass = () => {
        let configuredAdminPassword = (
            process.env.ADMIN_PANEL_PASSWORD ||
            process.env.ADMIN_PASSWORD ||
            ''
        ).trim();
        if (!configuredAdminPassword && process.env.NODE_ENV !== 'production') {
            configuredAdminPassword = DEV_ADMIN_PASSWORD;
        }
        const providedAdminPassword = (req.headers['x-admin-password'] || '').toString().trim();

        if (!configuredAdminPassword || !providedAdminPassword) {
            return false;
        }

        if (providedAdminPassword !== configuredAdminPassword) {
            return false;
        }

        req.user = {
            _id: null,
            username: 'admin-panel',
            isAdmin: true,
        };
        req.isPasswordBypassAdmin = true;
        return true;
    };

    try {
        // Check password bypass FIRST so admin panel password always works when sent
        if (allowPasswordBypass()) {
            return next();
        }

        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.user?.id || decoded.id;

        if (!userId) {
            return res.status(401).json({ message: 'Invalid token payload.' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        req.user = user;
        if (user.isAdmin) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    } catch (error) {
        if (allowPasswordBypass()) {
            return next();
        }

        logger.error('Admin auth error:', error);
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};

// Get all user activities
router.get('/activities', isAdmin, async (req, res) => {
    try {
        const { startDate, endDate, userId, method } = req.query;
        const query = {};

        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                const d = new Date(startDate);
                if (!Number.isNaN(d.getTime())) query.timestamp.$gte = d;
            }
            if (endDate) {
                const d = new Date(endDate);
                if (!Number.isNaN(d.getTime())) query.timestamp.$lte = d;
            }
        }
        if (userId && mongoose.Types.ObjectId.isValid(userId)) query.userId = userId;
        if (method && typeof method === 'string') query.method = method.toUpperCase();

        const activities = await Activity.find(query)
            .sort({ timestamp: -1 })
            .limit(2000)
            .populate('userId', 'username email userType isAdmin');

        const normalized = activities.map((activity) => ({
            _id: activity._id,
            method: activity.method,
            path: activity.path,
            status: activity.status,
            duration: activity.duration,
            durationMs: activity.durationMs,
            ip: activity.ip,
            timestamp: activity.timestamp,
            user: activity.userId || null,
            userId: activity.userId?._id?.toString() || activity.userLabel || 'anonymous',
        }));

        res.status(200).json(normalized);
    } catch (error) {
        logger.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Error fetching activities' });
    }
});

// Get error logs
router.get('/errors', isAdmin, async (req, res) => {
    try {
        const errors = await Activity.find({ status: { $gte: 400 } })
            .sort({ timestamp: -1 })
            .limit(2000)
            .populate('userId', 'username email userType isAdmin');

        const normalized = errors.map((entry) => ({
            _id: entry._id,
            timestamp: entry.timestamp,
            message: `${entry.method} ${entry.path} returned ${entry.status}`,
            details: {
                method: entry.method,
                path: entry.path,
                status: entry.status,
                duration: entry.duration,
                ip: entry.ip,
                userId: entry.userId?._id?.toString() || entry.userLabel || 'anonymous',
                user: entry.userId || null,
            },
        }));

        res.status(200).json(normalized);
    } catch (error) {
        logger.error('Error fetching error logs:', error);
        res.status(500).json({ message: 'Error fetching error logs' });
    }
});

// Get user statistics
router.get('/statistics', isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
        const newUsers = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } });
        const totalActivities = await Activity.countDocuments();
        const errorActivities = await Activity.countDocuments({ status: { $gte: 400 } });
        const todayActivities = await Activity.countDocuments({
            timestamp: { $gte: moment().startOf('day').toDate() },
        });

        const avgResult = await Activity.aggregate([
            {
                $group: {
                    _id: null,
                    averageResponseTime: { $avg: '$durationMs' },
                },
            },
        ]);
        const averageResponseTime = avgResult[0]?.averageResponseTime || 0;

        const stats = {
            totalUsers,
            activeUsers,
            newUsers,
            todayActivityCount: todayActivities,
            averageResponseTime: Number(averageResponseTime) || 0,
            errorRate: totalActivities > 0 ? (errorActivities / totalActivities) * 100 : 0,
        };

        res.status(200).json(stats);
    } catch (error) {
        logger.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

// Get all users (full profile fields; password omitted)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password -__v')
            .populate('messages.sender', 'username email userType isAdmin')
            .sort({ createdAt: -1 });

        const enriched = users.map((u) => {
            const obj = u.toObject();
            const messages = Array.isArray(obj.messages) ? obj.messages : [];
            return {
                ...obj,
                name: obj.username,
                role: obj.role || (obj.isAdmin ? 'admin' : 'user'),
                messagesCount: messages.length,
                unreadMessagesCount: messages.filter((m) => m && m.read === false).length,
            };
        });

        res.status(200).json(enriched);
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Export logs
router.get('/export', isAdmin, async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        const query = {};

        if (type === 'error') {
            query.status = { $gte: 400 };
        }
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                const d = new Date(startDate);
                if (!Number.isNaN(d.getTime())) query.timestamp.$gte = d;
            }
            if (endDate) {
                const d = new Date(endDate);
                if (!Number.isNaN(d.getTime())) query.timestamp.$lte = d;
            }
        }

        const logs = await Activity.find(query)
            .sort({ timestamp: -1 })
            .populate('userId', 'username email userType isAdmin');

        const headers = ['timestamp', 'method', 'path', 'status', 'durationMs', 'ip', 'userId', 'username', 'email'];
        const csvRows = logs.map((log) => ([
            log.timestamp?.toISOString() || '',
            log.method || '',
            log.path || '',
            log.status ?? '',
            log.durationMs ?? '',
            log.ip || '',
            log.userId?._id?.toString() || log.userLabel || 'anonymous',
            log.userId?.username || '',
            log.userId?.email || '',
        ].join(',')));

        const csv = [headers.join(','), ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-logs-${moment().format('YYYY-MM-DD')}.csv`);
        res.send(csv);
    } catch (error) {
        logger.error('Error exporting logs:', error);
        res.status(500).json({ message: 'Error exporting logs' });
    }
});

// Delete a user by ID
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (userToDelete.isAdmin) {
            const adminCount = await User.countDocuments({ isAdmin: true });
            if (adminCount <= 1) {
                return res.status(400).json({ message: 'Cannot delete the last admin user.' });
            }
        }

        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        logger.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Error deleting user' });
    }
});

// Update a user by ID
router.put('/users/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const allowedUpdates = [
            'username',
            'email',
            'userType',
            'grade',
            'subjects',
            'qualifications',
            'expertise',
            'isVerified',
            'isAdmin',
            'bio',
            'profilePicture',
        ];

        allowedUpdates.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                user[field] = req.body[field];
            }
        });

        if (typeof user.isAdmin === 'boolean') {
            user.role = user.isAdmin ? 'admin' : 'user';
        }

        user.updatedAt = new Date();
        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            message: 'User updated successfully.',
            user: userWithoutPassword,
        });
    } catch (error) {
        logger.error('Error updating user:', error);
        return res.status(500).json({ message: 'Error updating user' });
    }
});

// Send a message from admin to a user
router.post('/messages', isAdmin, async (req, res) => {
    try {
        const { userId, subject, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ message: 'userId and message are required.' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const adminMessage = {
            subject: subject || '',
            content: message,
            read: false,
            createdAt: new Date(),
        };

        if (req.user?._id && mongoose.Types.ObjectId.isValid(req.user._id)) {
            adminMessage.sender = req.user._id;
        }

        if (!Array.isArray(user.messages)) {
            user.messages = [];
        }

        user.messages.push(adminMessage);
        await user.save();

        return res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
        logger.error('Error sending message:', error);
        return res.status(500).json({ message: 'Error sending message' });
    }
});

export default router;

