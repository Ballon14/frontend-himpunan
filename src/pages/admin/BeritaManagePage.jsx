import { useState, useEffect, useCallback } from 'react';
import { getBeritaAdmin, createBerita, updateBerita, deleteBerita } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const emptyForm = { judul: '', isi: '', status: 'draft', published_at: '', thumbnail: null };

export default function BeritaManagePage() {
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
            const res = await getBeritaAdmin({ search, page, per_page: 10 });
            setData(res.data.data.data || []);
            setMeta(res.data.data.meta || {});
        } catch (err) {
            toast.error('Gagal memuat data berita.');
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
            isi: item.isi,
            status: item.status,
            published_at: item.published_at ? item.published_at.slice(0, 16) : '',
            thumbnail: null,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { ...form };
            if (!payload.thumbnail) delete payload.thumbnail;
            if (!payload.published_at) delete payload.published_at;

            if (editing) {
                await updateBerita(editing.id, payload);
                toast.success('Berita berhasil diperbarui.');
            } else {
                await createBerita(payload);
                toast.success('Berita berhasil ditambahkan.');
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
        if (!confirm('Yakin ingin menghapus berita ini?')) return;
        try {
            await deleteBerita(id);
            toast.success('Berita berhasil dihapus.');
            fetchData();
        } catch (err) {
            toast.error('Gagal menghapus berita.');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <FiSearch className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <FiPlus /> Tambah Berita
                </button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Thumbnail</th>
                                <th>Judul</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="5" className="admin-empty">Belum ada data berita.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Thumbnail">
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt={item.judul} className="admin-table-img" />
                                        ) : (
                                            <div className="admin-table-img-placeholder">N</div>
                                        )}
                                    </td>
                                    <td data-label="Judul" className="admin-td-primary">{item.judul}</td>
                                    <td data-label="Status">
                                        <span className={`admin-badge ${item.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                            {item.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td data-label="Tanggal">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td data-label="Aksi">
                                        <div className="admin-actions">
                                            <button className="admin-action-btn edit" onClick={() => openEdit(item)}><FiEdit2 /></button>
                                            <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {meta.last_page > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><FiChevronLeft /></button>
                    <span>Halaman {meta.current_page} dari {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}><FiChevronRight /></button>
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Berita' : 'Tambah Berita'} size="lg">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label>Judul *</label>
                        <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Isi *</label>
                        <textarea rows="8" value={form.isi} onChange={(e) => setForm({ ...form, isi: e.target.value })} required />
                    </div>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal Publish</label>
                            <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Thumbnail</label>
                        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, thumbnail: e.target.files[0] })} />
                        {editing?.thumbnail && <img src={editing.thumbnail} alt="Current" className="admin-preview-img" />}
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
