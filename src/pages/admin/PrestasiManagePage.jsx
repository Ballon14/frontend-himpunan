import { useState } from 'react';
import { getPrestasiAdmin, createPrestasi, updatePrestasi, deletePrestasi } from '../../api/prestasi';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { notifySuccess, notifyError } from '../../utils/toast';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const KATEGORI = ['Akademik', 'Non-Akademik', 'Lomba', 'Sertifikasi', 'Lainnya'];
const emptyForm = { judul: '', deskripsi: '', kategori: '', tanggal: '', penerima: '', foto: null };

export default function PrestasiManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['prestasi-admin', search, page],
        queryFn: () => getPrestasiAdmin({ search, page, per_page: 12 }),
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
            deskripsi: item.deskripsi || '',
            kategori: item.kategori,
            tanggal: item.tanggal || '',
            penerima: item.penerima || '',
            foto: null,
        });
        setModalOpen(true);
    };

    const createMutation = useMutation({
        mutationFn: createPrestasi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestasi-admin'] });
            notifySuccess('Prestasi berhasil ditambahkan.');
            setModalOpen(false);
        },
        onError: (err) => notifyError(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updatePrestasi(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestasi-admin'] });
            notifySuccess('Prestasi berhasil diperbarui.');
            setModalOpen(false);
        },
        onError: (err) => notifyError(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const deleteMutation = useMutation({
        mutationFn: deletePrestasi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prestasi-admin'] });
            notifySuccess('Prestasi berhasil dihapus.');
        },
        onError: () => notifyError('Gagal menghapus prestasi.')
    });

    const submitting = createMutation.isPending || updateMutation.isPending;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.foto) delete payload.foto;

        if (editing) {
            updateMutation.mutate({ id: editing.id, payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleDelete = async (id) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Hapus Data',
            message: 'Yakin ingin menghapus prestasi ini?',
            onConfirm: () => deleteMutation.mutateAsync(id),
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <Search size={16} className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari prestasi..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Tambah Prestasi
                </button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /></div>
            ) : data.length === 0 ? (
                <div className="admin-empty-state">Belum ada data prestasi.</div>
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
                                    <button className="admin-action-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                                    <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="admin-galeri-info">
                                <h4>{item.judul}</h4>
                                <span className="admin-badge admin-badge-info">{item.kategori}</span>
                                <span className="admin-galeri-date">{item.penerima ? `${item.penerima} — ${item.tanggal || '-'}` : item.tanggal || '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {meta.last_page > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
                    <span>Halaman {meta.current_page} dari {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
                </div>
            )}

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Prestasi' : 'Tambah Prestasi'}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label>Judul *</label>
                        <input type="text" value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Deskripsi</label>
                        <textarea
                            value={form.deskripsi}
                            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                            rows="3"
                            placeholder="Deskripsi singkat prestasi..."
                        />
                    </div>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Kategori *</label>
                            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} required>
                                <option value="">Pilih Kategori</option>
                                {KATEGORI.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal *</label>
                            <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} required />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Nama Penerima</label>
                        <input
                            type="text"
                            value={form.penerima}
                            onChange={(e) => setForm({ ...form, penerima: e.target.value })}
                            placeholder="Contoh: Tim Robotika HMTKBG"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Foto {editing ? '' : ''}</label>
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

            <ConfirmDialog {...confirmDialog} onClose={() => setConfirmDialog(d => ({ ...d, isOpen: false }))} />
        </div>
    );
}
