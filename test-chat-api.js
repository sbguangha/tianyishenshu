const axios = require('axios')

const BASE_URL = 'http://localhost:3001/api'

// 测试用的JWT token（需要先登录获取）
let authToken = ''

async function testChatAPI() {
  try {
    console.log('🧪 开始测试聊天API...')
    
    // 1. 测试健康检查
    console.log('\n1. 测试健康检查...')
    const healthResponse = await axios.get('http://localhost:3001/health')
    console.log('✅ 健康检查通过:', healthResponse.data)
    
    // 2. 测试登录获取token
    console.log('\n2. 测试登录...')
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      exchangeCode: 'TEST_CODE_2024_001'
    })
    
    if (loginResponse.data.success) {
      authToken = loginResponse.data.token
      console.log('✅ 登录成功，获取到token')
    } else {
      console.log('❌ 登录失败:', loginResponse.data)
      return
    }
    
    // 3. 测试获取聊天历史
    console.log('\n3. 测试获取聊天历史...')
    const historyResponse = await axios.get(`${BASE_URL}/coze/chat-history`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 聊天历史:', historyResponse.data)
    
    // 4. 测试创建新对话
    console.log('\n4. 测试创建新对话...')
    const createResponse = await axios.post(`${BASE_URL}/coze/chat-history`, {
      title: '测试对话'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 创建对话:', createResponse.data)
    
    const chatId = createResponse.data.chat.id
    
    // 5. 测试发送消息
    console.log('\n5. 测试发送消息...')
    const chatResponse = await axios.post(`${BASE_URL}/coze/personality-chat`, {
      message: '你好，我想了解我的性格特点',
      chatId: chatId,
      context: {}
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 聊天回复:', chatResponse.data)
    
    // 6. 测试重命名对话
    console.log('\n6. 测试重命名对话...')
    const renameResponse = await axios.put(`${BASE_URL}/coze/chat-history/${chatId}/rename`, {
      title: '重命名的测试对话'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 重命名成功:', renameResponse.data)
    
    // 7. 测试置顶对话
    console.log('\n7. 测试置顶对话...')
    const pinResponse = await axios.put(`${BASE_URL}/coze/chat-history/${chatId}/pin`, {
      isPinned: true
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 置顶成功:', pinResponse.data)
    
    // 8. 测试获取对话详情
    console.log('\n8. 测试获取对话详情...')
    const detailResponse = await axios.get(`${BASE_URL}/coze/chat-history/${chatId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    console.log('✅ 对话详情:', detailResponse.data)
    
    console.log('\n🎉 所有测试通过！')
    
  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message)
  }
}

// 运行测试
testChatAPI() 