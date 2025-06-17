const { MongoClient } = require('mongodb');

// MongoDB Atlas连接字符串
const uri = 'mongodb+srv://tianyishenshu:2eXpxM8W3LXFbrX@cluster0.bvzohtw.mongodb.net/tianyishenshu?retryWrites=true&w=majority&appName=Cluster0';

async function testAtlasConnection() {
  if (uri === 'YOUR_MONGODB_ATLAS_CONNECTION_STRING') {
    console.log('❌ 请先设置您的MongoDB Atlas连接字符串');
    console.log('📋 设置步骤：');
    console.log('1. 访问 https://www.mongodb.com/atlas');
    console.log('2. 注册免费账号');
    console.log('3. 创建免费集群');
    console.log('4. 获取连接字符串并替换上面的 uri 变量');
    return;
  }

  const client = new MongoClient(uri);

  try {
    console.log('🌐 尝试连接MongoDB Atlas...');
    await client.connect();
    console.log('✅ Atlas连接成功!');
    
    // 测试ping
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('✅ Ping结果:', result);
    
    // 创建测试数据
    const db = client.db('tianyishenshu');
    const collection = db.collection('test');
    const testDoc = { 
      message: 'Hello from MongoDB Atlas!', 
      timestamp: new Date(),
      version: 'MongoDB Atlas云数据库'
    };
    
    const insertResult = await collection.insertOne(testDoc);
    console.log('✅ 测试数据插入成功:', insertResult.insertedId);
    
    // 查询测试数据
    const findResult = await collection.findOne({ _id: insertResult.insertedId });
    console.log('✅ 查询测试数据:', findResult);
    
    // 删除测试数据
    await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ 测试数据清理完成');
    
    console.log('🎉 MongoDB Atlas完全正常工作！');
    
  } catch (error) {
    console.error('❌ Atlas连接失败:', error.message);
    console.log('💡 请检查：');
    console.log('- 连接字符串是否正确');
    console.log('- 用户名密码是否正确');
    console.log('- IP地址是否已加入白名单');
  } finally {
    await client.close();
  }
}

testAtlasConnection(); 