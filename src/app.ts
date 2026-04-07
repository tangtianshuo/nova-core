import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import oauthRoutes from './modules/oauth/oauth.routes.js';
import { apiDocsRoutes } from './modules/api-docs/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
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
