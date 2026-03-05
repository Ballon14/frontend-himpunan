import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReactGA from 'react-ga4';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
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

export default function App() {
  useEffect(() => {
    // Initialize GA once on app load
    ReactGA.initialize(MEASUREMENT_ID);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTopAndTrack />
      <ScrollProgress />
      <Navbar />
      <main>
        <AnimatedRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
