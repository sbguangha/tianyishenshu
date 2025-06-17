const { MongoClient } = require('mongodb');
const dns = require('dns');

// 设置DNS服务器为Google DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

// MongoDB Atlas连接字符串
const uri = 'mongodb+srv://tianyishenshu:2eXpxM8W3LXFbrX@cluster0.bvzohtw.mongodb.net/tianyishenshu?retryWrites=true&w=majority&appName=Cluster0';

async function testAtlasWithDNS() {
  console.log('🔧 使用自定义DNS设置测试Atlas连接...');
  console.log('DNS服务器:', dns.getServers());
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 增加超时时间到10秒
    connectTimeoutMS: 10000,
    socketTimeoutMS: 0,
  });

  try {
    console.log('🌐 尝试连接MongoDB Atlas...');
    await client.connect();
    console.log('✅ Atlas连接成功!');
    
    // 测试ping
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('✅ Ping结果:', result);
    
    // 测试写入数据
    const db = client.db('tianyishenshu');
    const collection = db.collection('connection_test');
    const testDoc = { 
      message: 'Atlas连接测试成功!', 
      timestamp: new Date(),
      from: 'Node.js应用'
    };
    
    const insertResult = await collection.insertOne(testDoc);
    console.log('✅ 测试数据写入成功:', insertResult.insertedId);
    
    // 读取数据验证
    const findResult = await collection.findOne({ _id: insertResult.insertedId });
    console.log('✅ 数据读取验证:', findResult.message);
    
    // 清理测试数据
    await collection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ 测试数据清理完成');
    
    console.log('🎉 MongoDB Atlas完全正常，可以开始开发了！');
    return true;
    
  } catch (error) {
    console.error('❌ Atlas连接失败:', error.message);
    console.log('');
    console.log('🔍 错误类型:', error.constructor.name);
    
    if (error.message.includes('ETIMEDOUT') || error.message.includes('ENOTFOUND')) {
      console.log('🌐 这是网络连接问题。可能的解决方案：');
      console.log('1. 检查防火墙设置，确保允许MongoDB Atlas端口(27017)');
      console.log('2. 尝试使用手机热点测试');
      console.log('3. 联系网络管理员开放MongoDB Atlas访问');
      console.log('4. 临时使用项目的无数据库模式进行开发');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

testAtlasWithDNS().then(success => {
  if (success) {
    console.log('\n📝 下一步：');
    console.log('1. 更新backend/.env文件，设置MONGODB_URI');
    console.log('2. 运行 npm run dev 启动项目');
    console.log('3. 开始开发数据库相关功能');
  } else {
    console.log('\n🛠️ 如果网络问题无法解决：');
    console.log('1. 可以先使用无数据库模式开发');
    console.log('2. 项目部署时使用Atlas（服务器网络通常没有限制）');
    console.log('3. 或者稍后在不同网络环境下重试');
  }
}); 