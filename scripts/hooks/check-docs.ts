/**
 * Git Hook: 检查路由文件修改时是否更新了 API 文档
 *
 * 使用方式:
 *   在 package.json 中添加:
 *   "husky": {
 *     "hooks": {
 *       "pre-commit": "tsx scripts/hooks/check-docs.ts"
 *     }
 *   }
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface CheckResult {
  hasRouteChanges: boolean;
  hasDocChanges: boolean;
  routeFiles: string[];
}

/**
 * 获取暂存的修改文件
 */
function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf8'
    });
    return output.trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * 检查是否有路由或文档的修改
 */
function checkChanges(): CheckResult {
  const files = getStagedFiles();

  const routeFiles = files.filter(f =>
    f.match(/^src\/modules\/.+\/.*\.routes\.ts$/)
  );

  const docFiles = files.filter(f =>
    f === 'openapi.yaml' ||
    f === 'API.md' ||
    f.match(/src\/modules\/api-docs\/.*/)
  );

  return {
    hasRouteChanges: routeFiles.length > 0,
    hasDocChanges: docFiles.length > 0,
    routeFiles
  };
}

/**
 * 主函数
 */
function main() {
  // 跳过文档检查的标志
  if (process.env.SKIP_DOCS_CHECK === 'true') {
    console.log('⏭️  跳过文档检查 (SKIP_DOCS_CHECK=true)');
    return;
  }

  const result = checkChanges();

  if (result.hasRouteChanges && !result.hasDocChanges) {
    console.log('\n📚 检测到路由文件修改:\n');
    result.routeFiles.forEach(f => console.log(`  - ${f}`));

    console.log('\n⚠️  请更新 API 文档后再提交:');
    console.log('   1. 更新 openapi.yaml');
    console.log('   2. 运行 npm run docs:check 验证');
    console.log('\n💡 如果确认文档无需更新，使用以下命令跳过检查:');
    console.log('   SKIP_DOCS_CHECK=true git commit\n');

    process.exit(1);
  }

  if (result.hasRouteChanges && result.hasDocChanges) {
    console.log('\n✅ 路由和文档都已更新，提交继续...\n');
  }

  if (result.hasDocChanges) {
    console.log('\n📝 API 文档已更新\n');
  }
}

main();
