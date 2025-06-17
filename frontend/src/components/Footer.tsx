import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-white w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0">
          {/* Logo and Language */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-black rounded-full"></div>
              </div>
              <span className="text-2xl font-bold">天乙神数</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <select className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm">
                <option value="zh">CHINESE_SIMPLIFIED</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">小红书</span>
            </a>
            <a href="#" className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">微博</span>
            </a>
            <a href="#" className="w-10 h-10 bg-black border border-white rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">抖音</span>
            </a>
            <a href="#" className="w-10 h-10 bg-black border border-white rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">X</span>
            </a>
            <a href="#" className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">IG</span>
            </a>
            <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
              <span className="text-white font-bold text-sm">FB</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">© 2025 天乙神数.com</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 