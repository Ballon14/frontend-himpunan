import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Public components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';

// Public pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AnggotaPage from './pages/AnggotaPage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import ProgramKerjaPage from './pages/ProgramKerjaPage';
import ProgramKerjaDetailPage from './pages/ProgramKerjaDetailPage';
import GaleriPage from './pages/GaleriPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin components
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin pages
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminAnggotaPage from './pages/admin/AnggotaManagePage';
import AdminBeritaPage from './pages/admin/BeritaManagePage';
import AdminProgramKerjaPage from './pages/admin/ProgramKerjaManagePage';
import AdminGaleriPage from './pages/admin/GaleriManagePage';
import AdminPesanPage from './pages/admin/PesanManagePage';

// Styles
import './styles/admin.css';

// Replace 'G-XXXXXXXXXX' with real Measurement ID when ready
const MEASUREMENT_ID = 'G-XXXXXXXXXX';

function ScrollToTopAndTrack() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track pageview on route change
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/anggota" element={<AnggotaPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/berita/:slug" element={<BeritaDetailPage />} />
        <Route path="/program-kerja" element={<ProgramKerjaPage />} />
        <Route path="/program-kerja/:id" element={<ProgramKerjaDetailPage />} />
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function PublicLayout() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="anggota" element={<AdminAnggotaPage />} />
                <Route path="berita" element={<AdminBeritaPage />} />
                <Route path="program-kerja" element={<AdminProgramKerjaPage />} />
                <Route path="galeri" element={<AdminGaleriPage />} />
                <Route path="pesan" element={<AdminPesanPage />} />
                <Route path="" element={<AdminDashboardPage />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize GA once on app load
    ReactGA.initialize(MEASUREMENT_ID);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTopAndTrack />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1d27',
              color: '#e4e6ed',
              border: '1px solid #2a2e3a',
            },
          }}
        />
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<PublicLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
