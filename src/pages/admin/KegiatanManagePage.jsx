import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Modal from '../../components/admin/Modal';
import { getKegiatan, createKegiatan, updateKegiatan, deleteKegiatan } from '../../api/komunitas';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const KATEGORI = ['rapat', 'seminar', 'sosial', 'lainnya'];
const emptyForm = { judul: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', lokasi: '', kategori: 'lainnya' };

function toLocalDatetime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 16);
}

export default function KegiatanManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['kegiatan-admin', search, page],
        queryFn: () => getKegiatan({ search, page, per_page: 10 }),
    });

    const data = queryData?.data?.data?.data || [];
    const meta = queryData?.data?.data?.meta || {};

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (item) => {
        setEditing(item);
        setForm({
            judul: item.judul,
            deskripsi: item.deskripsi || '',
            tanggal_mulai: toLocalDatetime(item.tanggal_mulai),
            tanggal_selesai: toLocalDatetime(item.tanggal_selesai),
            lokasi: item.lokasi || '',
            kategori: item.kategori || 'lainnya',
        });
        setModalOpen(true);
    };

    const createMut = useMutation({
        mutationFn: (payload) => createKegiatan(payload),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kegiatan-admin'] }); toast.success('Kegiatan berhasil ditambahkan.'); setModalOpen(false); },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan.'),
    });
    const updateMut = useMutation({
        mutationFn: ({ id, payload }) => updateKegiatan(id, payload),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kegiatan-admin'] }); toast.success('Kegiatan berhasil diperbarui.'); setModalOpen(false); },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan.'),
    });
    const deleteMut = useMutation({
        mutationFn: deleteKegiatan,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kegiatan-admin'] }); toast.success('Kegiatan berhasil dihapus.'); },
        onError: () => toast.error('Gagal menghapus.'),
    });

    const submitting = createMut.isPending || updateMut.isPending;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.tanggal_selesai) delete payload.tanggal_selesai;
        if (editing) updateMut.mutate({ id: editing.id, payload });
        else createMut.mutate(payload);
    };

    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus kegiatan ini?')) deleteMut.mutate(id); };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <FiSearch className="admin-search-icon" />
                    <input type="text" placeholder="Cari kegiatan..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}><FiPlus /> Tambah Kegiatan</button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Judul</th>
                                <th>Tanggal Mulai</th>
                                <th>Lokasi</th>
                                <th>Kategori</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="5" className="admin-empty">Belum ada data kegiatan.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Judul" className="admin-td-primary">{item.judul}</td>
                                    <td data-label="Tanggal">{new Date(item.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                    <td data-label="Lokasi">{item.lokasi || '-'}</td>
                                    <td data-label="Kategori"><span className="admin-badge badge-info" style={{ textTransform: 'capitalize' }}>{item.kategori}</span></td>
                                    <td data-label="Aksi">
                                        <div className="admin-actions">
                                            <button className="admin-action-btn edit" onClick={() => openEdit(item)} title="Edit"><FiEdit2 /></button>
                                            <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)} title="Hapus"><FiTrash2 /></button>
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Kegiatan' : 'Tambah Kegiatan'}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-grid">
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Judul *</label>
                            <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal Mulai *</label>
                            <input type="datetime-local" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal Selesai</label>
                            <input type="datetime-local" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Lokasi</label>
                            <input type="text" value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} placeholder="Contoh: Aula Kampus" />
                        </div>
                        <div className="admin-form-group">
                            <label>Kategori</label>
                            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                                {KATEGORI.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Deskripsi</label>
                            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows="3" placeholder="Detail kegiatan..." />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setModalOpen(false)}>Batal</button>
                        <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
