import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { FormPage } from './pages/FormPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-student" element={<FormPage />} />
            <Route path="/edit-student/:id" element={<FormPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
