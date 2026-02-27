import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import RoleSelect from './pages/RoleSelect'
import PatientIntake from './pages/PatientIntake'
import TriageAI from './pages/TriageAI'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import DoctorPanel from './pages/DoctorPanel'
import Analytics from './pages/Analytics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 4000 }
  }
})

// Pages that use the full Layout (Navbar + padding)
const LAYOUT_ROUTES = ['/triage', '/dashboard', '/patients'];

function AppRoutes() {
  const loc = useLocation();
  const useLayout = LAYOUT_ROUTES.includes(loc.pathname);

  const content = (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/role" element={<RoleSelect />} />
      <Route path="/intake" element={<PatientIntake />} />
      <Route path="/triage" element={<TriageAI />} />
      <Route path="/doctor" element={<DoctorPanel />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/patients" element={<Patients />} />
    </Routes>
  );

  return useLayout ? <Layout>{content}</Layout> : content;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
