import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import Activity from '../models/Activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write all logs to file
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/error.log'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: path.join(__dirname, '../logs/combined.log') 
        })
    ]
});

// Middleware to log requests
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];
    let token = null;
    let tokenUserId = null;

    if (authHeader && typeof authHeader === 'string') {
        token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    }

    if (token && process.env.JWT_SECRET) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            tokenUserId = decoded.userId || decoded.user?.id || decoded.id || null;
        } catch (error) {
            tokenUserId = null;
        }
    }
    
    // Log the request
    logger.info({
        method: req.method,
        path: req.path,
        userId: tokenUserId || (req.user ? req.user.id : 'anonymous'),
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    // Log the response when it's finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const userLabel = tokenUserId || (req.user ? req.user.id : 'anonymous');

        logger.info({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            userId: userLabel
        });

        Activity.create({
            method: req.method,
            path: req.path,
            status: res.statusCode,
            durationMs: duration,
            duration: `${duration}ms`,
            ip: req.ip || '',
            userId: tokenUserId || null,
            userLabel,
            timestamp: new Date(),
        }).catch((error) => {
            logger.error('Failed to persist activity log', { error: error.message });
        });
    });

    next();
};

export { logger, requestLogger }; 
