/**
 * OpenAPI 文档同步工具
 *
 * 从代码注释自动提取 API 文档并更新 openapi.yaml
 *
 * 使用方式:
 *   npm run docs:sync
 *
 * 工作流程:
 *   1. 扫描 src/modules 目录下的路由文件
 *   2. 提取 JSDoc @swagger 注释
 *   3. 生成/更新 openapi.yaml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RouteInfo {
  path: string;
  method: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: any[];
  requestBody?: any;
  responses?: any;
  security?: any[];
}

interface ParsedRoutes {
  [path: string]: {
    [method: string]: RouteInfo;
  };
}

/**
 * 从路由文件提取 Swagger 注释
 */
function extractSwaggerComments(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const swaggerComments: any[] = [];

  // 匹配 @swagger 块
  const swaggerRegex = /\/\*\*\s*\n([^*]|\*[^/])*\*\/\s*(?:const|function|export|router\.(get|post|put|delete|patch))/g;
  let match;

  while ((match = swaggerRegex.exec(content)) !== null) {
    const commentBlock = match[0];
    const functionMatch = commentBlock.match(/(?:const|function|export|router\.(get|post|put|delete|patch))/);

    if (functionMatch) {
      try {
        // 提取 JSDoc 内容
        const jsdocMatch = commentBlock.match(/\/\*\*\s*\n([\s\S]*?)\*\//);
        if (jsdocMatch) {
          const jsdoc = jsdocMatch[1];
          const lines = jsdoc.split('\n').map(line => line.replace(/^\s*\*\s?/, '').trim()).filter(Boolean);

          const swagger: any = {};

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // @summary
            if (line.startsWith('@summary ')) {
              swagger.summary = line.substring(9);
            }
            // @description
            else if (line.startsWith('@description ')) {
              swagger.description = line.substring(13);
            }
            // @tags
            else if (line.startsWith('@tags ')) {
              swagger.tags = line.substring(7).split(',').map(t => t.trim());
            }
            // @param / @parameter
            else if (line.startsWith('@param ') || line.startsWith('@parameter ')) {
              if (!swagger.parameters) swagger.parameters = [];
              const param = line.substring(line.indexOf(' ') + 1);
              swagger.parameters.push(parseParameter(param));
            }
            // @requestBody
            else if (line.startsWith('@requestBody ')) {
              swagger.requestBody = parseRequestBody(line.substring(13));
            }
            // @response
            else if (line.startsWith('@response ') || line.match(/^@(\d{3})\s/)) {
              if (!swagger.responses) swagger.responses = {};
              const response = parseResponse(line);
              swagger.responses[response.code] = response.schema;
            }
            // @security
            else if (line.startsWith('@security ')) {
              if (!swagger.security) swagger.security = [];
              swagger.security.push(line.substring(10));
            }
          }

          if (Object.keys(swagger).length > 0) {
            swaggerComments.push(swagger);
          }
        }
      } catch (err) {
        console.warn(`Failed to parse swagger comment in ${filePath}:`, err);
      }
    }
  }

  return swaggerComments;
}

/**
 * 解析参数定义
 */
function parseParameter(param: string): any {
  // @param name {in} required? description
  const match = param.match(/^(\w+)\s+\{(\w+)\}\s*(\w+)?\s*(.*)$/);
  if (!match) return {};

  return {
    name: match[1],
    in: match[2],
    required: match[3] === 'required',
    description: match[4] || ''
  };
}

/**
 * 解析请求体定义
 */
function parseRequestBody(body: string): any {
  // @requestBody content-type required?
  const match = body.match(/^(\S+)\s*(required)?\s*(.*)$/);
  if (!match) return {};

  return {
    content: {
      [match[1]]: {
        schema: match[3] || {}
      }
    },
    required: match[2] === 'required'
  };
}

/**
 * 解析响应定义
 */
function parseResponse(response: string): any {
  // @response 200 {schema} description
  // or @200 {schema} description
  const match = response.match(/^@(\d{3})\s+(?:\{([^}]*)\}\s+)?(.*)$/);
  if (!match) return {};

  return {
    code: match[1],
    schema: match[2] || {},
    description: match[3] || ''
  };
}

/**
 * 扫描路由文件
 */
function scanRoutes(dir: string): ParsedRoutes {
  const routes: ParsedRoutes = {};

  function scanDirectory(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        scanDirectory(fullPath);
      } else if (entry.name.endsWith('.routes.ts')) {
        console.log(`Scanning ${fullPath}...`);
        const comments = extractSwaggerComments(fullPath);

        // 从路由文件提取路径信息
        const content = fs.readFileSync(fullPath, 'utf8');
        const routerMatches = content.matchAll(/router\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g);

        for (const routerMatch of routerMatches) {
          const method = routerMatch[1].toLowerCase();
          const path = routerMatch[2];

          if (!routes[path]) {
            routes[path] = {};
          }

          routes[path][method] = {
            path,
            method,
            // 可以尝试从 comments 匹配对应的 swagger 文档
          };
        }
      }
    }
  }

  scanDirectory(dir);
  return routes;
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 Scanning routes for API documentation...\n');

  const modulesDir = path.resolve(__dirname, '../src/modules');
  const routes = scanRoutes(modulesDir);

  console.log(`\n✅ Found ${Object.keys(routes).length} route endpoints`);

  // TODO: 合并到 openapi.yaml
  console.log('\n📝 OpenAPI specification: openapi.yaml');
  console.log('🌐 Swagger UI: http://localhost:3000/api-docs\n');

  console.log('💡 Tip: Add @swagger JSDoc comments to your route handlers for auto-documentation');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as syncOpenAPI };
