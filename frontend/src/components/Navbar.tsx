import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-transparent relative z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="天乙神数 Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-black">天乙神数</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              首页
            </Link>
            <Link 
              to="/analysis" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              命盘
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              产品
            </Link>
            <Link 
              to="/learn" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              学习
            </Link>
            <Link 
              to="/shop" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              商店
            </Link>
          </div>

          {/* Right Menu */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/news" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              资讯
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-black transition-colors font-medium lg:text-lg"
            >
              关于我们
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                to="/analysis" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                命盘
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                产品
              </Link>
              <Link 
                to="/learn" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                学习
              </Link>
              <Link 
                to="/shop" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                商店
              </Link>
              <Link 
                to="/news" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                资讯
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-black transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                关于我们
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 