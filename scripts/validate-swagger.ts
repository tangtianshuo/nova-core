#!/usr/bin/env node

/**
 * Swagger/OpenAPI 文档验证脚本
 *
 * 使用方法：
 *   node scripts/validate-swagger.ts
 *   npm run validate:swagger
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import yaml from 'js-yaml';

const SWAGGER_FILE = resolve(process.cwd(), 'openapi.yaml');

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 验证 OpenAPI 文档
 */
function validateSwagger(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // 检查文件是否存在
  if (!existsSync(SWAGGER_FILE)) {
    result.valid = false;
    result.errors.push(`Swagger 文件不存在: ${SWAGGER_FILE}`);
    return result;
  }

  try {
    // 读取并解析 YAML 文件
    const fileContent = readFileSync(SWAGGER_FILE, 'utf-8');
    const spec = yaml.load(fileContent) as any;

    // 基本结构验证
    if (!spec.openapi) {
      result.valid = false;
      result.errors.push('缺少 openapi 版本字段');
    }

    if (!spec.info) {
      result.valid = false;
      result.errors.push('缺少 info 字段');
    } else {
      if (!spec.info.title) {
        result.warnings.push('建议添加 API 标题');
      }
      if (!spec.info.version) {
        result.warnings.push('建议添加 API 版本');
      }
    }

    if (!spec.paths) {
      result.warnings.push('没有定义任何 API 路径');
    } else {
      // 检查每个路径定义
      const paths = Object.keys(spec.paths);
      console.log(`📋 发现 ${paths.length} 个 API 路径`);

      paths.forEach(path => {
        const pathSpec = spec.paths[path];
        const methods = Object.keys(pathSpec).filter(k => ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].includes(k));

        methods.forEach(method => {
          const operation = pathSpec[method];

          // 检查操作 ID
          if (!operation.operationId) {
            result.warnings.push(`${method.toUpperCase()} ${path}: 缺少 operationId`);
          }

          // 检查响应定义
          if (!operation.responses || Object.keys(operation.responses).length === 0) {
            result.warnings.push(`${method.toUpperCase()} ${path}: 没有定义响应`);
          }
        });
      });
    }

    // 检查组件定义
    if (spec.components) {
      if (spec.components.schemas) {
        const schemaCount = Object.keys(spec.components.schemas).length;
        console.log(`📦 发现 ${schemaCount} 个 Schema 定义`);
      }
    }

    console.log('✅ Swagger 文档基本结构验证通过');
  } catch (error: any) {
    result.valid = false;
    if (error.message.includes('YAML')) {
      result.errors.push(`YAML 语法错误: ${error.message}`);
    } else {
      result.errors.push(`解析错误: ${error.message}`);
    }
  }

  return result;
}

/**
 * 检查版本号一致性
 */
function checkVersionConsistency(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const swaggerContent = readFileSync(SWAGGER_FILE, 'utf-8');
    const versionMatch = swaggerContent.match(/version:\s*(['"]?)([\d.]+)\1/);

    if (versionMatch) {
      const swaggerVersion = versionMatch[2];
      console.log(`📋 当前 API 版本: ${swaggerVersion}`);

      // 读取 package.json 版本
      const packagePath = resolve(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));

      if (packageJson.version !== swaggerVersion) {
        result.warnings.push(`API 版本 (${swaggerVersion}) 与 package.json 版本 (${packageJson.version}) 不一致`);
      }
    }
  } catch (error) {
    result.warnings.push('无法检查版本号一致性');
  }

  return result;
}

/**
 * 主函数
 */
function main(): void {
  console.log('🔍 开始验证 Swagger 文档...\n');

  const validation = validateSwagger();

  if (!validation.valid) {
    console.error('\n❌ 验证失败:\n');
    validation.errors.forEach((error) => console.error(`  ❌ ${error}`));
    process.exit(1);
  }

  if (validation.warnings.length > 0) {
    console.warn('\n⚠️  警告:\n');
    validation.warnings.forEach((warning) => console.warn(`  ⚠️  ${warning}`));
  }

  const versionCheck = checkVersionConsistency();
  if (versionCheck.warnings.length > 0) {
    console.warn('\n⚠️  版本检查:\n');
    versionCheck.warnings.forEach((warning) => console.warn(`  ⚠️  ${warning}`));
  }

  console.log('\n✨ 验证完成！文档格式正确。');
  console.log(`\n📖 在线文档: http://localhost:3000/api-docs`);
  console.log(`📝 文档文件: ${SWAGGER_FILE}`);
  console.log(`\n💡 提示: 使用在线编辑器获得更完整的验证: https://editor.swagger.io/`);
}

// 运行主函数
main();
