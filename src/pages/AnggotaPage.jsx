import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Instagram, Linkedin, Mail, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import SectionTitle from '../components/SectionTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTransition from '../components/PageTransition';
import SEO from '../components/SEO';
import { getAnggota } from '../api/anggota';

export default function AnggotaPage() {
    const [search, setSearch] = useState('');
    const [angkatan, setAngkatan] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMember, setSelectedMember] = useState(null);

    const { data, isLoading: loading } = useQuery({
        queryKey: ['anggota', { page, search, angkatan }],
        queryFn: async () => {
            const params = { page, per_page: 12, status_aktif: 1 };
            if (search) params.search = search;
            if (angkatan) params.angkatan = angkatan;
            const res = await getAnggota(params);
            return res.data?.data || { data: [], meta: null };
        },
        staleTime: 5 * 60 * 1000,
    });

    const anggota = data?.data || [];
    const meta = data?.meta || null;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <PageTransition>
            <SEO title="Anggota" />
            <div className="page">
                <div className="container">
                    <div>
                        <SectionTitle
                            label="Anggota"
                            title="Daftar Anggota"
                            description="Kenali anggota-anggota himpunan kami yang berdedikasi."
                        />
                    </div>

                    <div className="filter-bar">
                        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                            <Search size={18} style={{
                                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                color: 'var(--color-text-muted)',
                            }} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Cari nama atau NIM..."
                                value={search}
                                onChange={handleSearch}
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={angkatan}
                            onChange={(e) => { setAngkatan(e.target.value); setPage(1); }}
                        >
                            <option value="">Semua Angkatan</option>
                            {['2020', '2021', '2022', '2023', '2024', '2025'].map(a => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : anggota.length > 0 ? (
                        <div className="members-grid">
                            {anggota.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    className="member-card glass-card"

                                    whileHover={{ y: -8, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    onClick={() => setSelectedMember(item)}
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.nama} className="member-avatar" />
                                        ) : (
                                            <div className="member-avatar-placeholder">
                                                {item.nama?.charAt(0)?.toUpperCase() || <User size={40} />}
                                            </div>
                                        )}
                                    </motion.div>
                                    <h3 className="member-name">{item.nama}</h3>
                                    {item.jabatan && <p className="member-role">{item.jabatan}</p>}
                                    <p className="member-info">
                                        {item.nim} • Angkatan {item.angkatan}
                                    </p>
                                    <div className="member-social-preview">
                                        {item.instagram && <span><Instagram size={16} /></span>}
                                        {item.linkedin && <span><Linkedin size={16} /></span>}
                                        {item.email && <span><Mail size={16} /></span>}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon"><User size={48} /></div>
                            <p>Tidak ada anggota ditemukan.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {meta && meta.last_page > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                            >
                                ← Prev
                            </button>
                            {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                                .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === meta.last_page)
                                .map((p, idx, arr) => {
                                    if (idx > 0 && p - arr[idx - 1] > 1) {
                                        return (
                                            <span key={`dot-${p}`}>
                                                <button disabled style={{ border: 'none', background: 'none' }}>...</button>
                                                <button
                                                    className={page === p ? 'active' : ''}
                                                    onClick={() => setPage(p)}
                                                >
                                                    {p}
                                                </button>
                                            </span>
                                        );
                                    }
                                    return (
                                        <button
                                            key={p}
                                            className={page === p ? 'active' : ''}
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            <button
                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                disabled={page >= meta.last_page}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Member Detail Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <motion.div
                        className="member-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMember(null)}
                    >
                        <motion.div
                            className="member-modal-content"
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="member-modal-close" onClick={() => setSelectedMember(null)}>
                                <X size={20} />
                            </button>

                            <div className="member-modal-header">
                                {selectedMember.foto ? (
                                    <img src={selectedMember.foto} alt={selectedMember.nama} className="member-avatar" />
                                ) : (
                                    <div className="member-avatar-placeholder">
                                        {selectedMember.nama?.charAt(0)?.toUpperCase() || <User size={40} />}
                                    </div>
                                )}
                                <h3>{selectedMember.nama}</h3>
                                {selectedMember.jabatan && <span className="role">{selectedMember.jabatan}</span>}
                            </div>

                            <div className="member-modal-body">
                                {selectedMember.motto && (
                                    <div className="member-modal-motto">
                                        "{selectedMember.motto}"
                                    </div>
                                )}

                                <div className="member-modal-info">
                                    <div className="member-modal-info-item">
                                        <span className="label">NIM</span>
                                        <span className="val">{selectedMember.nim}</span>
                                    </div>
                                    <div className="member-modal-info-item">
                                        <span className="label">Angkatan</span>
                                        <span className="val">{selectedMember.angkatan}</span>
                                    </div>
                                    <div className="member-modal-info-item">
                                        <span className="label">Status</span>
                                        <span className="val" style={{ color: selectedMember.status_aktif ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                            {selectedMember.status_aktif ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>
                                </div>

                                {(selectedMember.instagram || selectedMember.linkedin || selectedMember.email) && (
                                    <div className="member-modal-socials">
                                        {selectedMember.instagram && (
                                            <a href={`https://instagram.com/${selectedMember.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="member-modal-social-link" title="Instagram">
                                                <Instagram size={20} />
                                            </a>
                                        )}
                                        {selectedMember.linkedin && (
                                            <a href={selectedMember.linkedin.startsWith('http') ? selectedMember.linkedin : `https://${selectedMember.linkedin}`} target="_blank" rel="noopener noreferrer" className="member-modal-social-link" title="LinkedIn">
                                                <Linkedin size={20} />
                                            </a>
                                        )}
                                        {selectedMember.email && (
                                            <a href={`mailto:${selectedMember.email}`} className="member-modal-social-link" title="Email">
                                                <Mail size={20} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
