import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import oauthRoutes from './modules/oauth/oauth.routes.js';
import smsRoutes from './modules/sms/sms.routes.js';
import { apiDocsRoutes } from './modules/api-docs/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestIdMiddleware } from './lib/request-id.js';
import accessLogger from './middleware/access-log.middleware.js';
import { setupGlobalErrorHandlers } from './server-global-error.js';

const app = express();

// Setup global error handlers (must be early to catch all errors)
setupGlobalErrorHandlers();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID middleware - must be before routes
app.use(requestIdMiddleware);

// Access log middleware - must be after requestId to capture request ID
app.use(accessLogger);

// Routes
app.use('/auth', authRoutes);
app.use('/auth/sms', smsRoutes);
app.use('/', oauthRoutes);

// API Documentation (Swagger UI)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', apiDocsRoutes);
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Only start server if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
