import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const router = Router();

// Load OpenAPI specification (with error handling)
let openApiSpec: object = {};
let openApiPath = '';
try {
  openApiPath = path.resolve(process.cwd(), 'openapi.yaml');
  const fileContents = fs.readFileSync(openApiPath, 'utf8');
  openApiSpec = yaml.load(fileContents) as object;
} catch (error) {
  console.warn('Failed to load openapi.yaml, API docs will be disabled:', error instanceof Error ? error.message : error);
}

/**
 * Serve Swagger UI documentation
 */
router.use('/', swaggerUi.serve);

/**
 * Get OpenAPI spec as JSON
 */
router.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});

/**
 * Get OpenAPI spec as YAML
 */
router.get('/swagger.yaml', (_req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(fs.readFileSync(openApiPath, 'utf8'));
});

// Setup Swagger UI
router.use('/', swaggerUi.setup(openApiSpec, {
  explorer: true,
  customSiteTitle: 'Nova API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    tryItOutEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
}));

export default router;
