import { useState, useEffect, useCallback } from 'react';
import { getGaleriAdmin, createGaleri, updateGaleri, deleteGaleri } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const emptyForm = { judul: '', kategori: '', tanggal: '', foto: null };

export default function GaleriManagePage() {
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState({});
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getGaleriAdmin({ search, page, per_page: 12 });
            setData(res.data.data.data || []);
            setMeta(res.data.data.meta || {});
        } catch (err) {
            toast.error('Gagal memuat data galeri.');
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    const openEdit = (item) => {
        setEditing(item);
        setForm({
            judul: item.judul,
            kategori: item.kategori,
            tanggal: item.tanggal || '',
            foto: null,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...form };
            if (!payload.foto) delete payload.foto;

            if (editing) {
                await updateGaleri(editing.id, payload);
                toast.success('Galeri berhasil diperbarui.');
            } else {
                if (!payload.foto && !form.foto) {
                    toast.error('Foto wajib diupload.');
                    setSubmitting(false);
                    return;
                }
                await createGaleri(payload);
                toast.success('Galeri berhasil ditambahkan.');
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Gagal menyimpan data.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus galeri ini?')) return;
        try {
            await deleteGaleri(id);
            toast.success('Galeri berhasil dihapus.');
            fetchData();
        } catch (err) {
            toast.error('Gagal menghapus galeri.');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <FiSearch className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari galeri..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <FiPlus /> Tambah Galeri
                </button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
            ) : data.length === 0 ? (
                <div className="admin-empty-state">Belum ada data galeri.</div>
            ) : (
                <div className="admin-galeri-grid">
                    {data.map((item) => (
                        <div key={item.id} className="admin-galeri-card">
                            <div className="admin-galeri-img-wrapper">
                                {item.foto ? (
                                    <img src={item.foto} alt={item.judul} />
                                ) : (
                                    <div className="admin-galeri-placeholder">No Image</div>
                                )}
                                <div className="admin-galeri-overlay">
                                    <button className="admin-action-btn edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                                    <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                                </div>
                            </div>
                            <div className="admin-galeri-info">
                                <h4>{item.judul}</h4>
                                <span className="admin-badge badge-info">{item.kategori}</span>
                                <span className="admin-galeri-date">{item.tanggal || '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {meta.last_page > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><FiChevronLeft /></button>
                    <span>Halaman {meta.current_page} dari {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}><FiChevronRight /></button>
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Galeri' : 'Tambah Galeri'}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label>Judul *</label>
                        <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
                    </div>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Kategori *</label>
                            <input type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal *</label>
                            <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Foto {editing ? '' : '*'}</label>
                        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files[0] })} required={!editing} />
                        {editing?.foto && <img src={editing.foto} alt="Current" className="admin-preview-img" />}
                    </div>
                    <div className="admin-form-actions">
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>Batal</button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
