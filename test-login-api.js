// 测试登录相关API的简单脚本
// 使用 node test-login-api.js 运行

async function testAPI(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`http://localhost:3001/api${url}`, options)
    const data = await response.json()
    
    console.log(`\n=== ${method} ${url} ===`)
    console.log('状态码:', response.status)
    console.log('响应:', JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error(`API请求失败 ${url}:`, error.message)
  }
}

async function runTests() {
  console.log('🚀 开始测试登录相关API...\n')
  
  // 测试发送验证码
  await testAPI('/auth/send-sms', 'POST', {
    phone: '13800138000'
  })
  
  // 测试验证兑换码
  await testAPI('/auth/validate-exchange-code', 'POST', {
    exchangeCode: '1234-5678-9ABC-DEF0'
  })
  
  // 测试无效兑换码
  await testAPI('/auth/validate-exchange-code', 'POST', {
    exchangeCode: 'INVALID-CODE-TEST-1234'
  })
  
  // 测试登录验证
  await testAPI('/auth/verify-login', 'POST', {
    phone: '13800138000',
    code: '123456',
    exchangeCode: '1234-5678-9ABC-DEF0',
    rememberMe: true
  })
  
  // 用户提交表单
  const userProfile = {
    nickname: "张三",
    gender: "男",
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 15,
    birthHour: 14,
    birthMinute: 30,
    birthLocation: "北京市朝阳区",
    lunarBirthInfo: {
      year: 1989,
      month: 12,
      day: 19,
      isLeapMonth: false
    }
  }
  
  console.log('\n✅ API测试完成!')
  console.log('\n📝 测试说明:')
  console.log('- 有效兑换码: 1234-5678-9ABC-DEF0, ABCD-1234-5678-9EFG, TEST-CODE-2024-DEMO')
  console.log('- 开发环境验证码: 任意6位数字都可以')
  console.log('- 手机号格式: 1开头的11位数字')
}

// 运行测试
runTests().catch(console.error) 