import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Tag, ShoppingBag, X, MessageCircle, Phone } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getKegiatan, getMerchandise } from '../api/komunitas';

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const MERCH_KATEGORI = [
    { value: '', label: 'Semua' },
    { value: 'kaos', label: 'Kaos' },
    { value: 'jaket', label: 'Jaket' },
    { value: 'topi', label: 'Topi' },
    { value: 'aksesori', label: 'Aksesori' },
    { value: 'lainnya', label: 'Lainnya' },
];

const KATEGORI_COLORS = {
    rapat: '#6366f1',
    seminar: '#10b981',
    sosial: '#f59e0b',
    lainnya: '#8b5cf6',
};

function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export default function KomunitasPage() {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [merch, setMerch] = useState([]);
    const [loadingMerch, setLoadingMerch] = useState(true);
    const [merchKategori, setMerchKategori] = useState('');

    // ─── Fetch events for current month ────────────────────────
    const fetchEvents = useCallback(async () => {
        setLoadingEvents(true);
        try {
            const res = await getKegiatan({ bulan: currentMonth + 1, tahun: currentYear, per_page: 100 });
            setEvents(res.data?.data?.data || []);
        } catch { setEvents([]); }
        finally { setLoadingEvents(false); }
    }, [currentMonth, currentYear]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    // ─── Fetch merchandise ─────────────────────────────────────
    const fetchMerch = useCallback(async () => {
        setLoadingMerch(true);
        try {
            const params = { per_page: 50 };
            if (merchKategori) params.kategori = merchKategori;
            const res = await getMerchandise(params);
            setMerch(res.data?.data?.data || []);
        } catch { setMerch([]); }
        finally { setLoadingMerch(false); }
    }, [merchKategori]);

    useEffect(() => { fetchMerch(); }, [fetchMerch]);

    // ─── Calendar logic ────────────────────────────────────────
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevDays = new Date(currentYear, currentMonth, 0).getDate();

        const days = [];
        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({ day: prevDays - i, inMonth: false });
        }
        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            days.push({ day: d, inMonth: true });
        }
        // Next month padding
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            days.push({ day: d, inMonth: false });
        }
        return days;
    }, [currentMonth, currentYear]);

    const eventsByDate = useMemo(() => {
        const map = {};
        events.forEach(ev => {
            const d = new Date(ev.tanggal_mulai).getDate();
            if (!map[d]) map[d] = [];
            map[d].push(ev);
        });
        return map;
    }, [events]);

    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
        setSelectedDate(null);
    };
    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
        setSelectedDate(null);
    };

    const today = new Date();
    const isToday = (day) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

    return (
        <PageTransition>
            <SEO title="Komunitas" />
            <div className="page">
                <div className="container">

                    {/* ─── Section 1: Kalender Kegiatan ─────────────── */}
                    <div data-aos="fade-down">
                        <SectionTitle
                            label="Komunitas"
                            title="Kalender Kegiatan"
                            description="Jadwal kegiatan dan acara himpunan kami."
                        />
                    </div>

                    <div className="komunitas-calendar-wrapper" data-aos="fade-up">
                        <div className="kcal-split">
                            {/* LEFT — Calendar */}
                            <div className="kcal-left">
                                <div className="kcal-header">
                                    <button className="kcal-nav" onClick={prevMonth}><ChevronLeft size={20} /></button>
                                    <h3 className="kcal-title">{BULAN[currentMonth]} {currentYear}</h3>
                                    <button className="kcal-nav" onClick={nextMonth}><ChevronRight size={20} /></button>
                                </div>

                                <div className="kcal-grid">
                                    {HARI.map(h => <div key={h} className="kcal-day-label">{h}</div>)}

                                    {calendarDays.map((cell, i) => {
                                        const hasEvents = cell.inMonth && eventsByDate[cell.day];
                                        const isSel = cell.inMonth && selectedDate === cell.day;
                                        return (
                                            <motion.div
                                                key={i}
                                                className={`kcal-cell ${!cell.inMonth ? 'kcal-cell-outside' : ''} ${isToday(cell.day) && cell.inMonth ? 'kcal-cell-today' : ''} ${isSel ? 'kcal-cell-selected' : ''} ${hasEvents ? 'kcal-cell-has-event' : ''}`}
                                                onClick={() => cell.inMonth && setSelectedDate(cell.day === selectedDate ? null : cell.day)}
                                                whileHover={cell.inMonth ? { scale: 1.1 } : {}}
                                                whileTap={cell.inMonth ? { scale: 0.95 } : {}}
                                            >
                                                <span>{cell.day}</span>
                                                {hasEvents && (
                                                    <div className="kcal-dots">
                                                        {eventsByDate[cell.day].slice(0, 3).map((ev, j) => (
                                                            <span key={j} className="kcal-dot" style={{ background: KATEGORI_COLORS[ev.kategori] || '#6366f1' }} />
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Kategori Legend */}
                                <div className="kcal-legend">
                                    {Object.entries(KATEGORI_COLORS).map(([k, c]) => (
                                        <span key={k} className="kcal-legend-item">
                                            <span className="kcal-dot" style={{ background: c }} /> {k.charAt(0).toUpperCase() + k.slice(1)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT — Event Details */}
                            <div className="kcal-right">
                                <div className="kcal-right-header">
                                    <Calendar size={18} />
                                    <h4>{selectedDate ? `Kegiatan ${selectedDate} ${BULAN[currentMonth]}` : 'Detail Kegiatan'}</h4>
                                </div>

                                <div className="kcal-right-body">
                                    {!selectedDate ? (
                                        <div className="kcal-events-hint">
                                            <Calendar size={40} strokeWidth={1} />
                                            <p>Pilih tanggal pada kalender untuk melihat detail kegiatan.</p>
                                        </div>
                                    ) : selectedEvents.length === 0 ? (
                                        <div className="kcal-events-hint">
                                            <p>Tidak ada kegiatan pada tanggal ini.</p>
                                        </div>
                                    ) : (
                                        <div className="kcal-events-list">
                                            <AnimatePresence mode="popLayout">
                                                {selectedEvents.map(ev => (
                                                    <motion.div
                                                        key={ev.id}
                                                        className="kcal-event-card"
                                                        style={{ borderLeft: `4px solid ${KATEGORI_COLORS[ev.kategori] || '#6366f1'}` }}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        whileHover={{ x: 4 }}
                                                        onClick={() => setSelectedEvent(ev)}
                                                    >
                                                        <h5>{ev.judul}</h5>
                                                        <div className="kcal-event-meta">
                                                            <span><Clock size={12} /> {new Date(ev.tanggal_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                            {ev.lokasi && <span><MapPin size={12} /> {ev.lokasi}</span>}
                                                            <span><Tag size={12} /> {ev.kategori}</span>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ─── Section 2: Merchandise Showcase ──────────── */}
                    <div style={{ marginTop: 'var(--spacing-3xl)' }} data-aos="fade-down">
                        <SectionTitle
                            label="Merchandise"
                            title="Showcase Merchandise"
                            description="Koleksi merchandise resmi himpunan kami. Pesan langsung via WhatsApp!"
                        />
                    </div>

                    <div className="merch-filter" data-aos="fade-up">
                        {MERCH_KATEGORI.map(k => (
                            <button
                                key={k.value}
                                className={`merch-filter-btn ${merchKategori === k.value ? 'active' : ''}`}
                                onClick={() => setMerchKategori(k.value)}
                            >
                                {k.label}
                            </button>
                        ))}
                    </div>

                    {loadingMerch ? (
                        <LoadingSpinner />
                    ) : merch.length > 0 ? (
                        <div className="merch-grid" data-aos="fade-up">
                            {merch.map((item, i) => (
                                <Link
                                    key={item.id}
                                    to={`/komunitas/merchandise/${item.id}`}
                                    className="merch-card glass-card"
                                    data-aos="zoom-in"
                                    data-aos-delay={(i % 8) * 60}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="merch-card-img">
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.nama} loading="lazy" />
                                        ) : (
                                            <div className="merch-card-img-placeholder"><ShoppingBag size={40} /></div>
                                        )}
                                        <span className={`merch-badge ${item.is_available ? 'available' : 'unavailable'}`}>
                                            {item.is_available ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </div>
                                    <div className="merch-card-body">
                                        <h4>{item.nama}</h4>
                                        <span className="merch-price">{formatRupiah(item.harga)}</span>
                                        <span className="merch-kategori">{item.kategori}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state" data-aos="fade-in">
                            <div className="empty-icon"><ShoppingBag size={48} /></div>
                            <p>Belum ada merchandise tersedia.</p>
                        </div>
                    )}

                    {/* WhatsApp CTA Banner */}
                    <div className="merch-wa-banner" data-aos="fade-up">
                        <div className="merch-wa-banner-content">
                            <div className="merch-wa-icon">
                                <MessageCircle size={32} />
                            </div>
                            <div className="merch-wa-text">
                                <h4>Tertarik dengan merchandise kami?</h4>
                                <p>Hubungi kami langsung via WhatsApp untuk pemesanan dan informasi lebih lanjut.</p>
                            </div>
                            <a
                                href="https://wa.me/6281515630448?text=Halo%20Admin%20HMTKBG%2C%20saya%20tertarik%20dengan%20merchandise%20himpunan."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="merch-wa-btn"
                            >
                                <Phone size={18} />
                                Pesan via WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Event Detail Modal ──────────────────────── */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div className="member-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedEvent(null)}>
                        <motion.div className="member-modal-content" initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()}>
                            <button className="member-modal-close" onClick={() => setSelectedEvent(null)}><X size={20} /></button>
                            <div className="member-modal-header" style={{ background: `linear-gradient(135deg, ${KATEGORI_COLORS[selectedEvent.kategori] || '#6366f1'}22, transparent)` }}>
                                <div style={{ width: 64, height: 64, borderRadius: '50%', background: KATEGORI_COLORS[selectedEvent.kategori] || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                    <Calendar size={28} color="#fff" />
                                </div>
                                <h3>{selectedEvent.judul}</h3>
                                <span className="role">{selectedEvent.kategori.charAt(0).toUpperCase() + selectedEvent.kategori.slice(1)}</span>
                            </div>
                            <div className="member-modal-body">
                                {selectedEvent.deskripsi && <div className="member-modal-motto">{selectedEvent.deskripsi}</div>}
                                <div className="member-modal-info">
                                    <div className="member-modal-info-item">
                                        <span className="label">Tanggal Mulai</span>
                                        <span className="val">{new Date(selectedEvent.tanggal_mulai).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="member-modal-info-item">
                                        <span className="label">Waktu</span>
                                        <span className="val">{new Date(selectedEvent.tanggal_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    {selectedEvent.tanggal_selesai && (
                                        <div className="member-modal-info-item">
                                            <span className="label">Sampai</span>
                                            <span className="val">{new Date(selectedEvent.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} {new Date(selectedEvent.tanggal_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                    {selectedEvent.lokasi && (
                                        <div className="member-modal-info-item">
                                            <span className="label">Lokasi</span>
                                            <span className="val">{selectedEvent.lokasi}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </PageTransition>
    );
}
