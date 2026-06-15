import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

// Public components (always loaded — used on every page)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import LoadingSpinner from './components/LoadingSpinner';

// Public pages (Lazy Loaded — only loaded when visited)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AnggotaPage = lazy(() => import('./pages/AnggotaPage'));
const BeritaPage = lazy(() => import('./pages/BeritaPage'));
const BeritaDetailPage = lazy(() => import('./pages/BeritaDetailPage'));
const ProgramKerjaPage = lazy(() => import('./pages/ProgramKerjaPage'));
const ProgramKerjaDetailPage = lazy(() => import('./pages/ProgramKerjaDetailPage'));
const GaleriPage = lazy(() => import('./pages/GaleriPage'));
const PrestasiPage = lazy(() => import('./pages/PrestasiPage'));
const PrestasiDetailPage = lazy(() => import('./pages/PrestasiDetailPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const KomunitasPage = lazy(() => import('./pages/KomunitasPage'));
const MerchandiseDetailPage = lazy(() => import('./pages/MerchandiseDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin components (Lazy Loaded)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));

// Admin pages (Lazy Loaded)
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const AdminAnggotaPage = lazy(() => import('./pages/admin/AnggotaManagePage'));
const AdminStrukturPage = lazy(() => import('./pages/admin/StrukturManagePage'));
const AdminBeritaPage = lazy(() => import('./pages/admin/BeritaManagePage'));
const AdminProgramKerjaPage = lazy(() => import('./pages/admin/ProgramKerjaManagePage'));
const AdminGaleriPage = lazy(() => import('./pages/admin/GaleriManagePage'));
const AdminPrestasiPage = lazy(() => import('./pages/admin/PrestasiManagePage'));
const AdminPesanPage = lazy(() => import('./pages/admin/PesanManagePage'));
const AdminExportPage = lazy(() => import('./pages/admin/ExportDataPage'));
const AdminKegiatanPage = lazy(() => import('./pages/admin/KegiatanManagePage'));
const AdminMerchandisePage = lazy(() => import('./pages/admin/MerchandiseManagePage'));
const AdminLogsPage = lazy(() => import('./pages/admin/LogsPage'));

// Google Analytics — set VITE_GA_MEASUREMENT_ID in .env to enable tracking
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

function ScrollToTopAndTrack() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track pageview on route change (only if GA is initialized)
    if (GA_MEASUREMENT_ID) {
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    }
  }, [location]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/anggota" element={<AnggotaPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:slug" element={<BeritaDetailPage />} />
          <Route path="/program-kerja" element={<ProgramKerjaPage />} />
          <Route path="/program-kerja/:id" element={<ProgramKerjaDetailPage />} />
          <Route path="/galeri" element={<GaleriPage />} />
          <Route path="/prestasi" element={<PrestasiPage />} />
          <Route path="/prestasi/:id" element={<PrestasiDetailPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="/komunitas" element={<KomunitasPage />} />
          <Route path="/komunitas/merchandise/:id" element={<MerchandiseDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function PublicLayout() {
  return (
    <>
      <ScrollProgress />
      <BackToTop />
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
    <Suspense fallback={<LoadingSpinner />}>
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
                  <Route path="struktur" element={<AdminStrukturPage />} />
                  <Route path="berita" element={<AdminBeritaPage />} />
                  <Route path="program-kerja" element={<AdminProgramKerjaPage />} />
                  <Route path="galeri" element={<AdminGaleriPage />} />
                  <Route path="prestasi" element={<AdminPrestasiPage />} />
                  <Route path="pesan" element={<AdminPesanPage />} />
                  <Route path="export" element={<AdminExportPage />} />
                  <Route path="kegiatan" element={<AdminKegiatanPage />} />
                  <Route path="merchandise" element={<AdminMerchandisePage />} />
                  <Route path="logs" element={<AdminLogsPage />} />
                  <Route path="" element={<AdminDashboardPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  useEffect(() => {
    // Initialize GA once on app load (skip if no real measurement ID)
    if (GA_MEASUREMENT_ID) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTopAndTrack />
            <Toaster position="top-center" containerStyle={{ top: 24 }} />
            <Routes>
              <Route path="/admin/*" element={<AdminRoutes />} />
              <Route path="*" element={<PublicLayout />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
