import React from 'react'
// import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black mb-8 leading-tight">
            解读命运实为一场人生策展
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 mb-8 max-w-6xl mx-auto leading-relaxed">
            基于东方古老智慧和现代人工智能技术，助您为人生策展，
            <br />
            成为自己最好的命理师。
          </p>
          <Link 
            to="/login"
            className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
          >
            马上体验
          </Link>
        </div>
        
        {/* Device Mockup */}
        <div className="mt-20 flex justify-center items-center space-x-8 px-4">
          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="bg-gray-800 rounded-t-2xl p-6 w-96 h-64">
              <div className="bg-white rounded-lg h-full p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-100 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-100 h-4 rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-600 h-4 rounded-b-2xl"></div>
          </div>
          
          {/* Mobile */}
          <div className="relative">
            <div className="bg-black rounded-3xl p-2 w-64 h-128">
              <div className="bg-white rounded-3xl h-full p-4">
                <div className="text-center">
                  <div className="bg-gray-800 w-20 h-1 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-bold text-lg mb-2">日运日签</h3>
                  <div className="bg-green-100 w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">高</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">春心似秋月<br />碧潭清皎洁</p>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="w-full h-20 bg-green-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dialogue Section */}
      <section className="py-20 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">对话召唤</h2>
            <p className="text-xl lg:text-2xl text-gray-700">
              24/7随时随地响应。持续追问，细致解答。不同功能，各司其职
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {/* 小道童 */}
            <div className="text-center group">
              <div className="bg-gray-50 rounded-3xl p-8 h-80 flex flex-col justify-center items-center mb-6 group-hover:bg-gray-100 transition-colors">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">👶</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">小道童</h3>
              <p className="text-gray-600 mb-2">·命理学习 ·命理如镜，照见自我</p>
              <p className="text-gray-700 leading-relaxed">
                你的命理学习小助手<br />
                深入解构常见的迷信迷思<br />
                充满东方哲思的积极引导
              </p>
            </div>

            {/* 一事一卦 */}
            <div className="text-center group">
              <div className="bg-gray-50 rounded-3xl p-8 h-80 flex flex-col justify-center items-center mb-6 group-hover:bg-gray-100 transition-colors">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🎯</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">一事一卦</h3>
              <p className="text-gray-600 mb-2">·一事一卦 ·擅易者不卜，当下心决定未来果</p>
              <p className="text-gray-700 leading-relaxed">
                基于周易六十四卦的占卜工具<br />
                一事一卦，必有回应<br />
                东方智慧针对具体问题的惊喜解读
              </p>
            </div>

            {/* 大司命 */}
            <div className="text-center group">
              <div className="bg-gray-50 rounded-3xl p-8 h-80 flex flex-col justify-center items-center mb-6 group-hover:bg-gray-100 transition-colors">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">👑</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">大司命</h3>
              <p className="text-gray-600 mb-2">·命盘分析 ·改命即改心</p>
              <p className="text-gray-700 leading-relaxed">
                命理基础知识与常见问题科普<br />
                根据八字命盘独家定制，专属于你<br />
                回答一切你想问的问题
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Section */}
      <section className="py-20 bg-gray-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">解读报告</h2>
            <p className="text-xl lg:text-2xl text-gray-700 mb-8">
              根植命盘，阴阳为纲。逻辑清晰，层层递进。经纬万象，天人合一
            </p>
            <Link 
              to="/login"
              className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
            >
              马上体验
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mt-16">
            {/* 命之书 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-green-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl text-green-800">命</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-center">命之书</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                全球首创可对话的东方命理报告<br />
                10张卡片·万字内容·助你六个人生学活<br />
                高效解答·精确·健康·学习周天克专<br />
                两年评价·数据每月提供通
              </p>
            </div>

            {/* 运之书 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl text-purple-800">运</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 text-center">运之书</h3>
              <p className="text-gray-700 text-center leading-relaxed">
                以高维度内·其细腻接你个人情况·<br />
                定位时空·延观宝石学与十年运势向·也有分类展示·<br />
                四季评价·爱足基月庚部提醒
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Sign Section */}
      <section className="py-20 bg-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">日运日签</h2>
              <p className="text-xl lg:text-2xl text-gray-700 mb-6 leading-relaxed">
                解锁你每天的能量状态。免费查看今日的宜忌<br />
                事项并进行占卜。
              </p>
              <p className="text-gray-600 mb-8">*订阅会员可查看全部日历</p>
              <Link 
                to="/login"
                className="inline-block bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors"
              >
                马上体验
              </Link>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-black rounded-3xl p-2 w-64 h-128">
                <div className="bg-white rounded-3xl h-full p-4">
                  <div className="text-center">
                    <div className="bg-gray-800 w-20 h-1 rounded-full mx-auto mb-4"></div>
                    <h3 className="font-bold text-lg mb-2">日运日签</h3>
                    <div className="bg-green-100 w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">高</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">春心似秋月<br />碧潭清皎洁</p>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="w-full h-20 bg-green-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center">
          <p className="text-xl lg:text-2xl mb-8">与AI对话，读懂八字密码，发现更好的自己。</p>
          <Link 
            to="/login"
            className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            马上体验
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 