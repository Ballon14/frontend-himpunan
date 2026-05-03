import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Modal from '../../components/admin/Modal';
import { getMerchandise, createMerchandise, updateMerchandise, deleteMerchandise } from '../../api/komunitas';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const KATEGORI = ['kaos', 'jaket', 'topi', 'aksesori', 'lainnya'];
const emptyForm = { nama: '', deskripsi: '', harga: '', kategori: 'lainnya', is_available: true, foto: null };

function formatRp(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

export default function MerchandiseManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['merch-admin', search, page],
        queryFn: () => getMerchandise({ search, page, per_page: 10 }),
    });

    const data = queryData?.data?.data?.data || [];
    const meta = queryData?.data?.data?.meta || {};

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (item) => {
        setEditing(item);
        setForm({
            nama: item.nama,
            deskripsi: item.deskripsi || '',
            harga: item.harga.toString(),
            kategori: item.kategori || 'lainnya',
            is_available: item.is_available,
            foto: null,
        });
        setModalOpen(true);
    };

    const createMut = useMutation({
        mutationFn: createMerchandise,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['merch-admin'] }); toast.success('Merchandise berhasil ditambahkan.'); setModalOpen(false); },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan.'),
    });
    const updateMut = useMutation({
        mutationFn: ({ id, payload }) => updateMerchandise(id, payload),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['merch-admin'] }); toast.success('Merchandise berhasil diperbarui.'); setModalOpen(false); },
        onError: (err) => toast.error(err.response?.data?.message || 'Gagal menyimpan.'),
    });
    const deleteMut = useMutation({
        mutationFn: deleteMerchandise,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['merch-admin'] }); toast.success('Merchandise berhasil dihapus.'); },
        onError: () => toast.error('Gagal menghapus.'),
    });

    const submitting = createMut.isPending || updateMut.isPending;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };
        if (!payload.foto) delete payload.foto;
        if (editing) updateMut.mutate({ id: editing.id, payload });
        else createMut.mutate(payload);
    };

    const handleDelete = (id) => { if (confirm('Yakin ingin menghapus merchandise ini?')) deleteMut.mutate(id); };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <Search size={16} className="admin-search-icon" />
                    <input type="text" placeholder="Cari merchandise..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={openCreate}><Plus size={16} /> Tambah Merchandise</button>
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
                                <th>Harga</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr><td colSpan="6" className="admin-empty">Belum ada data merchandise.</td></tr>
                            ) : data.map((item) => (
                                <tr key={item.id}>
                                    <td data-label="Foto">
                                        {item.foto && item.foto.length > 0 ? (
                                            <img src={item.foto[0]} alt={item.nama} className="admin-table-img" />
                                        ) : (
                                            <div className="admin-table-img-placeholder">{item.nama.charAt(0)}</div>
                                        )}
                                    </td>
                                    <td data-label="Nama" className="admin-td-primary">{item.nama}</td>
                                    <td data-label="Harga">{formatRp(item.harga)}</td>
                                    <td data-label="Kategori"><span className="admin-badge badge-info" style={{ textTransform: 'capitalize' }}>{item.kategori}</span></td>
                                    <td data-label="Status">
                                        <span className={`admin-badge ${item.is_available ? 'badge-success' : 'badge-danger'}`}>
                                            {item.is_available ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </td>
                                    <td data-label="Aksi">
                                        <div className="admin-actions">
                                            <button className="admin-action-btn edit" onClick={() => openEdit(item)} title="Edit"><Pencil size={16} /></button>
                                            <button className="admin-action-btn delete" onClick={() => handleDelete(item.id)} title="Hapus"><Trash2 size={16} /></button>
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Merchandise' : 'Tambah Merchandise'}>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-grid">
                        <div className="admin-form-group">
                            <label>Nama *</label>
                            <input type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Harga (Rp) *</label>
                            <input type="number" min="0" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Kategori</label>
                            <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                                {KATEGORI.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select value={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.value === 'true' })}>
                                <option value="true">Tersedia</option>
                                <option value="false">Habis</option>
                            </select>
                        </div>
                        <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Deskripsi</label>
                            <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows="3" placeholder="Detail merchandise..." />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Foto (Pilih &gt; 1)</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files })} />
                        
                        {form.foto ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {Array.from(form.foto).map((f, i) => (
                                    <img key={i} src={URL.createObjectURL(f)} alt="" className="admin-preview-img" style={{ maxHeight: 80, borderRadius: 8, border: '1px solid var(--color-border)' }} />
                                ))}
                            </div>
                        ) : editing?.foto && editing.foto.length > 0 ? (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                                {editing.foto.map((url, i) => (
                                    <img key={i} src={url} alt="" className="admin-preview-img" style={{ maxHeight: 80, borderRadius: 8, border: '1px solid var(--color-border)' }} />
                                ))}
                            </div>
                        ) : null}
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
