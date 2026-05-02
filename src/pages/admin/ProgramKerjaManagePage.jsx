import { useState } from 'react';
import { getProgramKerjaAdmin, createProgramKerja, updateProgramKerja, deleteProgramKerja } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const statusOptions = [
    { value: 'perencanaan', label: 'Perencanaan', color: 'badge-info' },
    { value: 'berjalan', label: 'Berjalan', color: 'badge-warning' },
    { value: 'selesai', label: 'Selesai', color: 'badge-success' },
    { value: 'dibatalkan', label: 'Dibatalkan', color: 'badge-danger' },
];

const emptyForm = { nama_program: '', deskripsi: '', tanggal_mulai: '', tanggal_selesai: '', status: 'perencanaan', foto: null };

export default function ProgramKerjaManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['proker', search, page],
        queryFn: () => getProgramKerjaAdmin({ search, page, per_page: 10 }),
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
            nama_program: item.nama_program,
            deskripsi: item.deskripsi,
            tanggal_mulai: item.tanggal_mulai || '',
            tanggal_selesai: item.tanggal_selesai || '',
            status: item.status,
            foto: null,
        });
        setModalOpen(true);
    };

    const createMutation = useMutation({
        mutationFn: createProgramKerja,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proker'] });
            toast.success('Program kerja berhasil ditambahkan.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateProgramKerja(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proker'] });
            toast.success('Program kerja berhasil diperbarui.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProgramKerja,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['proker'] });
            toast.success('Program kerja berhasil dihapus.');
        },
        onError: () => toast.error('Gagal menghapus program kerja.')
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
        if (!confirm('Yakin ingin menghapus program kerja ini?')) return;
        deleteMutation.mutate(id);
    };

    const getStatusBadge = (status) => {
        const opt = statusOptions.find((o) => o.value === status);
        return opt || { label: status, color: 'badge-info' };
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <Search size={16} className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari program kerja..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Tambah Program
                </button>
            </div>

            <div className="admin-table-wrapper">
                {loading ? (
                    <div className="admin-loading"><div className="admin-spinner" /></div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Nama Program</th>
                                <th>Status</th>
                                <th>Mulai</th>
                                <th>Selesai</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="6" className="admin-empty">Belum ada data program kerja.</td></tr>
                            ) : data.map((item) => {
                                const badge = getStatusBadge(item.status);
                                return (
                                    <tr key={item.id}>
                                        <td data-label="Foto">
                                            {item.foto ? (
                                                <img src={item.foto} alt={item.nama_program} className="admin-table-img" />
                                            ) : (
                                                <div className="admin-table-img-placeholder">P</div>
                                            )}
                                        </td>
                                        <td data-label="Nama Program" className="admin-td-primary">{item.nama_program}</td>
                                        <td data-label="Status"><span className={`admin-badge ${badge.color}`}>{badge.label}</span></td>
                                        <td data-label="Mulai">{item.tanggal_mulai || '-'}</td>
                                        <td data-label="Selesai">{item.tanggal_selesai || '-'}</td>
                                        <td data-label="Aksi">
                                            <div className="admin-actions">
                                                <button className="admin-action-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                                                <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Program Kerja' : 'Tambah Program Kerja'} size="lg">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label>Nama Program *</label>
                        <input type="text" value={form.nama_program} onChange={(e) => setForm({ ...form, nama_program: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                        <label>Deskripsi *</label>
                        <ReactQuill theme="snow" value={form.deskripsi} onChange={(content) => setForm({ ...form, deskripsi: content })} style={{ height: '200px', marginBottom: '40px' }} />
                    </div>
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Tanggal Mulai *</label>
                            <input type="date" value={form.tanggal_mulai} onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Tanggal Selesai *</label>
                            <input type="date" value={form.tanggal_selesai} onChange={(e) => setForm({ ...form, tanggal_selesai: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Foto</label>
                        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files[0] })} />
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
