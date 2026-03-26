import { useState } from 'react';
import { getAnggotaAdmin, createAnggota, updateAnggota, deleteAnggota } from '../../api/admin';
import Modal from '../../components/admin/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const emptyForm = { nama: '', nim: '', jurusan: '', angkatan: '', jabatan: '', email: '', instagram: '', linkedin: '', motto: '', status_aktif: true, foto: null };

export default function AnggotaManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['anggota', search, page],
        queryFn: () => getAnggotaAdmin({ search, page, per_page: 10 }),
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
            nama: item.nama,
            nim: item.nim,
            jurusan: item.jurusan,
            angkatan: item.angkatan,
            jabatan: item.jabatan || '',
            email: item.email || '',
            instagram: item.instagram || '',
            linkedin: item.linkedin || '',
            motto: item.motto || '',
            status_aktif: item.status_aktif,
            foto: null,
        });
        setModalOpen(true);
    };

    const createMutation = useMutation({
        mutationFn: createAnggota,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anggota'] });
            toast.success('Anggota berhasil ditambahkan.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateAnggota(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anggota'] });
            toast.success('Anggota berhasil diperbarui.');
            setModalOpen(false);
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan data.')
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAnggota,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['anggota'] });
            toast.success('Anggota berhasil dihapus.');
        },
        onError: () => toast.error('Gagal menghapus anggota.')
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
        if (!confirm('Yakin ingin menghapus anggota ini?')) return;
        deleteMutation.mutate(id);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <FiSearch className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari anggota..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <FiPlus /> Tambah Anggota
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
                                <th>Nama</th>
                                <th>NIM</th>
                                <th>Jurusan</th>
                                <th>Angkatan</th>
                                <th>Jabatan</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="8" className="admin-empty">Belum ada data anggota.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Foto">
                                        {item.foto ? (
                                            <img src={item.foto} alt={item.nama} className="admin-table-img" />
                                        ) : (
                                            <div className="admin-table-img-placeholder">{item.nama.charAt(0)}</div>
                                        )}
                                    </td>
                                    <td data-label="Nama" className="admin-td-primary">{item.nama}</td>
                                    <td data-label="NIM">{item.nim}</td>
                                    <td data-label="Jurusan">{item.jurusan}</td>
                                    <td data-label="Angkatan">{item.angkatan}</td>
                                    <td data-label="Jabatan">{item.jabatan || '-'}</td>
                                    <td data-label="Status">
                                        <span className={`admin-badge ${item.status_aktif ? 'badge-success' : 'badge-danger'}`}>
                                            {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td data-label="Aksi">
                                        <div className="admin-actions">
                                            <button className="admin-action-btn edit" onClick={() => openEdit(item)} title="Edit">
                                                <FiEdit2 />
                                            </button>
                                            <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)} title="Hapus">
                                                <FiTrash2 />
                                            </button>
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Anggota' : 'Tambah Anggota'}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Nama *</label>
                            <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>NIM *</label>
                            <input type="text" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Jurusan *</label>
                            <input type="text" value={form.jurusan} onChange={(e) => setForm({ ...form, jurusan: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Angkatan *</label>
                            <input type="text" value={form.angkatan} onChange={(e) => setForm({ ...form, angkatan: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Jabatan</label>
                            <input type="text" value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value })} />
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select value={form.status_aktif} onChange={(e) => setForm({ ...form, status_aktif: e.target.value === 'true' })}>
                                <option value="true">Aktif</option>
                                <option value="false">Nonaktif</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contoh@gmail.com" />
                        </div>
                        <div className="admin-form-group">
                            <label>Instagram</label>
                            <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="username (tanpa @)" />
                        </div>
                        <div className="admin-form-group">
                            <label>LinkedIn</label>
                            <input type="text" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="URL lengkap" />
                        </div>
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Motto</label>
                            <textarea value={form.motto} onChange={(e) => setForm({ ...form, motto: e.target.value })} rows="3" placeholder="Motto hidup..." />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Foto</label>
                        <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files[0] })} />
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
