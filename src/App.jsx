import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AnggotaPage from './pages/AnggotaPage';
import BeritaPage from './pages/BeritaPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import ProgramKerjaPage from './pages/ProgramKerjaPage';
import GaleriPage from './pages/GaleriPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/anggota" element={<AnggotaPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/berita/:slug" element={<BeritaDetailPage />} />
          <Route path="/program-kerja" element={<ProgramKerjaPage />} />
          <Route path="/galeri" element={<GaleriPage />} />
          <Route path="/kontak" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
