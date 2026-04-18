import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

// Route imports
import authRoutes from './routes/auth.js';
import albumRoutes from './routes/albums.js';
import testimonialRoutes from './routes/testimonials.js';
import contactRoutes from './routes/contacts.js';
import uploadRoutes from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Validate environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CLIENT_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName] || process.env[varName].includes('CHANGE_ME'));

if (missingEnvVars.length > 0) {
  console.error('\nMISSING ENVIRONMENT VARIABLES:');
  missingEnvVars.forEach(v => console.error(`   - ${v}`));
  console.error('\nPlease update your .env file to continue.\n');
  process.exit(1);
}

connectDB();

const app = express();

// Security Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allows serving images to frontend

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
  credentials: true,
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Payload Limits & Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Workaround for express-mongo-sanitize in Express 5 where req.query and req.params are getters
app.use((req, res, next) => {
  ['query'].forEach(prop => {
    if (req[prop]) {
      Object.defineProperty(req, prop, {
        value: { ...req[prop] },
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  });
  next();
});

// Sanitize Data
app.use(mongoSanitize());

// Static folders
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes placeholders
app.get('/', (req, res) => {
  res.send('PB Photography API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
