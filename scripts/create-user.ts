#!/usr/bin/env ts
/**
 * 临时用户创建脚本
 * 用法: npx tsx scripts/create-user.ts <username> <email> <password>
 */

import bcrypt from 'bcrypt';
import prisma from '../src/lib/prisma.js';

const BCRYPT_SALT_ROUNDS = 12;

async function createUser(username: string, email: string, password: string) {
  // Validate inputs
  if (!username || !email || !password) {
    console.error('用法: npx tsx scripts/create-user.ts <username> <email> <password>');
    process.exit(1);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    console.error('错误: 用户名或邮箱已存在');
    process.exit(1);
  }

  // Hash password
  console.log('正在加密密码...');
  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Create user
  console.log('正在创建用户...');
  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
    },
  });

  console.log('\n✅ 用户创建成功!');
  console.log(`用户ID: ${user.id}`);
  console.log(`用户名: ${user.username}`);
  console.log(`邮箱: ${user.email}`);
}

// Get command line arguments
const [username, email, password] = process.argv.slice(2);

createUser(username, email, password)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('创建用户失败:', error);
    process.exit(1);
  });
