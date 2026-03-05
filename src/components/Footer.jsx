import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>HIMA<span>PUP</span></h3>
                        <p>
                            Himpunan Mahasiswa Politeknik Pembangunan Umum Semarang.
                            Membangun generasi unggul, berprestasi, dan berkarakter.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Menu</h4>
                        <Link to="/">Beranda</Link>
                        <Link to="/tentang">Tentang</Link>
                        <Link to="/anggota">Anggota</Link>
                        <Link to="/berita">Berita</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Lainnya</h4>
                        <Link to="/program-kerja">Program Kerja</Link>
                        <Link to="/galeri">Galeri</Link>
                        <Link to="/kontak">Kontak</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Kontak</h4>
                        <a href="mailto:himpunan@pup.ac.id">
                            <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            himpunan@pup.ac.id
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FiInstagram style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            @himapup
                        </a>
                        <a href="#">
                            <FiMapPin style={{ marginRight: 6, verticalAlign: 'middle' }} />
                            Semarang, Jawa Tengah
                        </a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {year} HIMAPUP. All rights reserved.</p>
                    <div className="footer-socials">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FiInstagram />
                        </a>
                        <a href="mailto:himpunan@pup.ac.id" aria-label="Email">
                            <FiMail />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
