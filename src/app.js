import express, { urlencoded } from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { timestamp } from 'drizzle-orm/gel-core';
const app = express();

app.use(helmet());
app.use(cors()); // Enable CORS for all routes, allowing cross-origin requests
app.use(cookieParser());
//built in middleware to set security-related HTTP headers
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(morgan('combined',{stream: {write: message => logger.info(message.trim())}}));
// Use morgan to log HTTP requests in 'combined' format, directing logs to the winston logger

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  logger.info("hello acquisitions api");
  res.status(200).send('Hello, World!');
});
app.use('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp :new Date().toISOString() , uptime: process.uptime() });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Acquisitions API' });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
