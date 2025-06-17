import { Shield, Zap, Users2, Heart } from 'lucide-react'

const About = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
          关于天乙神数
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          天乙神数致力于传承中华传统命理文化，运用现代技术为用户提供专业、准确的命理分析服务。
        </p>
      </div>

      {/* 核心价值 */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
          我们的核心价值
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              专业准确
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              严格遵循传统命理学原理，确保分析结果的专业性和准确性
            </p>
          </div>
          <div className="text-center p-6">
            <Zap className="w-16 h-16 mx-auto mb-4 text-secondary-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              技术创新
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              融合现代技术与传统智慧，提供快速便捷的在线分析服务
            </p>
          </div>
          <div className="text-center p-6">
            <Users2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              用户至上
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              始终以用户需求为中心，提供个性化的命理指导建议
            </p>
          </div>
          <div className="text-center p-6">
            <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              文化传承
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              致力于传承和弘扬中华优秀传统文化，让古老智慧焕发新的活力
            </p>
          </div>
        </div>
      </section>

      {/* 服务介绍 */}
      <section className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
            服务介绍
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">
                八字命理分析
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                基于传统八字学说，通过分析您的出生年月日时，为您揭示天赋特质、性格特点、事业方向等重要信息。
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 五行分析与平衡建议</li>
                <li>• 十神关系与性格解读</li>
                <li>• 大运流年吉凶预测</li>
                <li>• 用神喜忌指导</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-secondary-600 dark:text-secondary-400">
                人生规划指导
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                结合命理分析结果，为您提供个性化的人生规划建议，帮助您在关键时刻做出正确的选择。
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• 事业发展方向建议</li>
                <li>• 婚姻感情指导</li>
                <li>• 健康养生建议</li>
                <li>• 投资理财时机</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 团队介绍 */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
          专业团队
        </h2>
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              我们的团队由经验丰富的命理学专家和技术开发人员组成，共同致力于为用户提供最优质的服务体验。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">命</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white">命理专家</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">30年实战经验</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">技</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white">技术团队</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">现代化技术架构</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">服</span>
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white">客服团队</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">贴心服务支持</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系方式 */}
      <section>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white">
            联系我们
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            如有任何问题或建议，欢迎随时与我们联系
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">邮箱</h4>
              <p className="text-primary-600 dark:text-primary-400">contact@tianyishenshu.com</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">电话</h4>
              <p className="text-primary-600 dark:text-primary-400">+86 138-0000-0000</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">地址</h4>
              <p className="text-primary-600 dark:text-primary-400">北京市朝阳区</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About 