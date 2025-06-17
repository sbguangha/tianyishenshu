const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = 'mongodb://127.0.0.1:27018/tianyishenshu';
  const client = new MongoClient(uri);

  try {
    console.log('尝试连接MongoDB端口27018...');
    await client.connect();
    console.log('✅ 连接成功!');
    
    // 测试ping
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('✅ Ping结果:', result);
    
    // 列出数据库
    const databases = await client.db().admin().listDatabases();
    console.log('✅ 可用数据库:', databases.databases.map(db => db.name));
    
  } catch (error) {
    console.error('❌ 连接失败:', error.message);
  } finally {
    await client.close();
  }
}

testConnection(); 