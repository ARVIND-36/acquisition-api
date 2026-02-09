import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-production'
const JWT_EXPRIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPRIRES_IN });
        } catch (e) {
            logger.error('Failed to authenticate user', { error: e });
            throw new Error('Failed to authenticate user');
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            logger.error('Invalid token', { error: e });
            throw new Error('Invalid token');
        }
    }
};

export default jwttoken;