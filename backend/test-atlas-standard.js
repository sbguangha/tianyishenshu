const { MongoClient } = require('mongodb');

// 使用标准MongoDB连接字符串（非SRV）
// 需要您手动从Atlas控制台获取具体的服务器地址
const uri = 'mongodb://tianyishenshu:2eXpxM8W3LXFbrX@cluster0-shard-00-00.bvzohtw.mongodb.net:27017,cluster0-shard-00-01.bvzohtw.mongodb.net:27017,cluster0-shard-00-02.bvzohtw.mongodb.net:27017/tianyishenshu?ssl=true&replicaSet=atlas-dgh1pb-shard-0&authSource=admin&retryWrites=true&w=majority';

async function testAtlasStandardConnection() {
  console.log('📋 如果这种方式仍然失败，请手动操作：');
  console.log('1. 在Atlas控制台点击 "Connect"');
  console.log('2. 选择 "Connect your application"');
  console.log('3. 选择 "Standard connection string instead of SRV"');
  console.log('4. 复制标准连接字符串并替换上面的uri');
  console.log('');

  const client = new MongoClient(uri);

  try {
    console.log('🌐 尝试使用标准连接字符串连接Atlas...');
    await client.connect();
    console.log('✅ Atlas连接成功!');
    
    // 测试ping
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('✅ Ping结果:', result);
    
    console.log('🎉 MongoDB Atlas连接正常，可以开始开发了！');
    
  } catch (error) {
    console.error('❌ 标准连接也失败:', error.message);
    console.log('');
    console.log('🔧 请检查网络环境：');
    console.log('- 是否在企业网络或有网络限制？');
    console.log('- 是否可以正常访问其他网站？');
    console.log('- 可以尝试使用手机热点测试');
    console.log('');
    console.log('🌐 Atlas控制台操作：');
    console.log('- 确认IP白名单包含 0.0.0.0/0');
    console.log('- 确认数据库用户密码正确');
  } finally {
    await client.close();
  }
}

testAtlasStandardConnection(); 