import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import RequireRole from './components/RequireRole.jsx'
import About from './pages/About.jsx'
import AdminReports from './pages/AdminReports.jsx'
import Contact from './pages/Contact.jsx'
import EmployerMyJobs from './pages/EmployerMyJobs.jsx'
import EmployerPostJob from './pages/EmployerPostJob.jsx'
import Home from './pages/Home.jsx'
import JobDetail from './pages/JobDetail.jsx'
import Jobs from './pages/Jobs.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'

function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">The page you’re looking for doesn’t exist.</p>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-full bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />

          <Route
            path="/employer/post-job"
            element={
              <RequireRole allow={['employer']}>
                <EmployerPostJob />
              </RequireRole>
            }
          />
          <Route
            path="/employer/my-jobs"
            element={
              <RequireRole allow={['employer']}>
                <EmployerMyJobs />
              </RequireRole>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <RequireRole allow={['admin']}>
                <AdminReports />
              </RequireRole>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
