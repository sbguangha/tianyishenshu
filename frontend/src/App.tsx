import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Analysis from './pages/Analysis'
import About from './pages/About'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Products from './pages/Products'
import Learn from './pages/Learn'
import Shop from './pages/Shop'
import News from './pages/News'
import UserForm from './pages/UserForm'
import Dashboard from './pages/Dashboard'
import PersonalityReport from './pages/PersonalityReport'

function App() {
  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin-panel-2024" element={<Admin />} />
      
      {/* 需要登录的路由 */}
      <Route path="/user-form" element={
        <ProtectedRoute>
          <UserForm />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/personality-report" element={
        <ProtectedRoute>
          <PersonalityReport />
        </ProtectedRoute>
      } />
      
      {/* 其他公开路由 */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App 