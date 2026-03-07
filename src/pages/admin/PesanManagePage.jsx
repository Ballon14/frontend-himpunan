import { useState } from 'react';
import { getPesanAdmin, markPesanRead, deletePesan } from '../../api/admin';
import toast from 'react-hot-toast';
import { FiSearch, FiChevronLeft, FiChevronRight, FiTrash2, FiCheck, FiMail, FiEye } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function PesanManagePage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selectedPesan, setSelectedPesan] = useState(null);

    const queryClient = useQueryClient();

    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['pesan', search, page],
        queryFn: () => getPesanAdmin({ search, page, per_page: 10 }),
    });

    const data = queryData?.data?.data?.data || [];
    const meta = queryData?.data?.data?.meta || {};
    const unreadCount = queryData?.data?.data?.unread_count || 0;

    const markReadMutation = useMutation({
        mutationFn: markPesanRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pesan'] });
            toast.success('Pesan ditandai sudah dibaca.');
        },
        onError: () => toast.error('Gagal menandai pesan.')
    });

    const deleteMutation = useMutation({
        mutationFn: deletePesan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pesan'] });
            toast.success('Pesan berhasil dihapus.');
            setSelectedPesan(null);
        },
        onError: () => toast.error('Gagal menghapus pesan.')
    });

    const handleMarkRead = async (id) => {
        markReadMutation.mutate(id);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus pesan ini?')) return;
        deleteMutation.mutate(id);
    };

    const handleSelect = async (pesan) => {
        setSelectedPesan(pesan);
        if (!pesan.is_read) {
            await handleMarkRead(pesan.id);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header">
                <div className="admin-search-bar">
                    <FiSearch className="admin-search-icon" />
                    <input
                        type="text"
                        placeholder="Cari pesan..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                {unreadCount > 0 && (
                    <div className="admin-unread-badge">
                        <FiMail /> {unreadCount} belum dibaca
                    </div>
                )}
            </div>

            <div className={`admin-pesan-layout ${selectedPesan ? 'show-detail' : ''}`}>
                {/* Pesan List */}
                <div className="admin-pesan-list">
                    {loading ? (
                        <div className="admin-loading"><div className="admin-spinner" /></div>
                    ) : data.length === 0 ? (
                        <div className="admin-empty-state">Belum ada pesan masuk.</div>
                    ) : (
                        data.map((item) => (
                            <div
                                key={item.id}
                                className={`admin-pesan-item ${!item.is_read ? 'unread' : ''} ${selectedPesan?.id === item.id ? 'selected' : ''}`}
                                onClick={() => handleSelect(item)}
                            >
                                <div className="admin-pesan-item-header">
                                    <span className="admin-pesan-nama">{item.nama}</span>
                                    <span className="admin-pesan-time">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                    </span>
                                </div>
                                <div className="admin-pesan-email">{item.email || 'Tanpa email'}</div>
                                <div className="admin-pesan-preview">{item.isi_pesan.substring(0, 80)}...</div>
                                {!item.is_read && <div className="admin-pesan-dot" />}
                            </div>
                        ))
                    )}
                </div>

                {/* Detail Pesan */}
                <div className="admin-pesan-detail">
                    {selectedPesan ? (
                        <>
                            <div className="admin-pesan-detail-header">
                                <div>
                                    <button
                                        className="admin-btn admin-btn-sm admin-btn-secondary admin-pesan-back-btn"
                                        onClick={() => setSelectedPesan(null)}
                                        style={{ marginBottom: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        <FiChevronLeft /> Batal / Kembali
                                    </button>
                                    <h3>{selectedPesan.nama}</h3>
                                    <span className="admin-pesan-detail-email">{selectedPesan.email || 'Tanpa email'}</span>
                                    <span className="admin-pesan-detail-time">
                                        {selectedPesan.created_at ? new Date(selectedPesan.created_at).toLocaleString('id-ID') : '-'}
                                    </span>
                                </div>
                                <div className="admin-pesan-detail-actions">
                                    {!selectedPesan.is_read && (
                                        <button className="admin-btn admin-btn-sm" onClick={() => handleMarkRead(selectedPesan.id)}>
                                            <FiCheck /> Tandai Dibaca
                                        </button>
                                    )}
                                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(selectedPesan.id)}>
                                        <FiTrash2 /> Hapus
                                    </button>
                                </div>
                            </div>
                            <div className="admin-pesan-detail-body">
                                <p>{selectedPesan.isi_pesan}</p>
                            </div>
                        </>
                    ) : (
                        <div className="admin-pesan-empty">
                            <FiEye size={48} />
                            <p>Pilih pesan untuk melihat detail</p>
                        </div>
                    )}
                </div>
            </div>

            {meta.last_page > 1 && (
                <div className="admin-pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}><FiChevronLeft /></button>
                    <span>Halaman {meta.current_page} dari {meta.last_page}</span>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)}><FiChevronRight /></button>
                </div>
            )}
        </div>
    );
}
