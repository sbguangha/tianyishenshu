import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './utils/auth'
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
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-form" element={<UserForm />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/report" element={<PersonalityReport />} />
            
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="/products" element={<Products />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  )
}

export default App 