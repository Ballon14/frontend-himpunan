import { useState } from 'react';
import { getBeritaAdmin, createBerita, updateBerita, deleteBerita } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TiptapEditor from '../../components/admin/TiptapEditor';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const emptyForm = { judul: '', isi: '', status: 'draft', published_at: '', thumbnail: null };

export default function BeritaManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['berita', search, page],
        queryFn: () => getBeritaAdmin({ search, page, per_page: 10 }),
    });

    const data = queryData?.data?.data?.data || [];
    const meta = queryData?.data?.data?.meta || {};

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

    const createMutation = useMutation({
        mutationFn: createBerita,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['berita'] });
            toast.success('Berita berhasil ditambahkan.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateBerita(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['berita'] });
            toast.success('Berita berhasil diperbarui.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBerita,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['berita'] });
            toast.success('Berita berhasil dihapus.');
        },
        onError: () => toast.error('Gagal menghapus berita.')
    });

    const submitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.thumbnail) delete payload.thumbnail;
        if (!payload.published_at) delete payload.published_at;

        if (editing) {
            updateMutation.mutate({ id: editing.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus berita ini?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <Search size={16} className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari berita..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Tambah Berita
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
                                            <button className="admin-action-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                                            <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
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
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                    <span>Halaman {meta.current_page} dari {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
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
                        <TiptapEditor value={form.isi} onChange={(content) => setForm({ ...form, isi: content })} />
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
