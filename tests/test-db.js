const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'nova_core',
    user: 'nova',
    password: 'nova_password',
  });

  try {
    await client.connect();
    console.log('✓ 数据库连接成功');

    const result = await client.query('SELECT NOW()');
    console.log('✓ 查询测试:', result.rows[0]);

    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log('✓ 数据表:', tables.rows.map(r => r.table_name));

    await client.end();
  } catch (error) {
    console.error('✗ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

testConnection();
