import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStrukturImage, uploadStrukturImage } from '../../api/admin';
import { Upload, Image as ImageIcon, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StrukturManagePage() {
    const queryClient = useQueryClient();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Fetch current image info
    const { data: queryData, isLoading: loading } = useQuery({
        queryKey: ['struktur-image-admin'],
        queryFn: async () => {
            const res = await getStrukturImage();
            return res.data?.data;
        }
    });

    const currentImage = queryData?.url;
    const updatedAt = queryData?.updated_at;

    // Mutation to upload
    const uploadMutation = useMutation({
        mutationFn: uploadStrukturImage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['struktur-image-admin'] });
            queryClient.invalidateQueries({ queryKey: ['struktur-image'] });
            toast.success('Bagan struktur organisasi berhasil diperbarui!');
            setSelectedFile(null);
            setPreviewUrl(null);
        },
        onError: (err) => {
            console.error(err);
            toast.error(err.response?.data?.message || 'Gagal mengunggah bagan organisasi.');
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran berkas maksimal 5MB.');
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error('Berkas harus berupa gambar.');
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        uploadMutation.mutate(selectedFile);
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="admin-page">
            <div className="admin-page-header-simple" style={{ marginBottom: '2rem' }}>
                <h2 className="admin-page-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Manajemen Bagan Struktur Organisasi
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Unggah diagram struktur organisasi (PNG/JPG/WEBP, maks. 5MB) untuk ditampilkan di halaman publik.
                </p>
            </div>

            <div className="admin-grid-settings" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Left side: Upload card */}
                <div className="admin-card glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Upload size={18} /> Unggah Bagan Baru
                    </h3>

                    <form onSubmit={handleUpload} className="admin-form">
                        <div 
                            className="upload-dropzone"
                            style={{
                                border: '2px dashed var(--color-primary)',
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '1rem',
                                minHeight: '200px'
                            }}
                            onClick={() => document.getElementById('bagan-file-input').click()}
                        >
                            <input 
                                type="file" 
                                id="bagan-file-input" 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={handleFileChange} 
                            />
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview" 
                                    style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} 
                                />
                            ) : (
                                <>
                                    <ImageIcon size={48} style={{ opacity: 0.5, color: 'var(--color-primary)' }} />
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Klik untuk memilih berkas gambar</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                            PNG, JPG, JPEG, atau WEBP hingga 5MB
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {selectedFile && (
                            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    <span style={{ fontWeight: 600 }}>Terpilih: </span>
                                    <span style={{ color: 'var(--color-text-muted)' }}>{selectedFile.name}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button 
                                        type="button" 
                                        className="admin-btn admin-btn-secondary" 
                                        onClick={handleCancel}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="admin-btn admin-btn-primary" 
                                        disabled={uploadMutation.isPending}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        {uploadMutation.isPending ? 'Mengunggah...' : 'Unggah & Terapkan'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Right side: Preview card */}
                <div className="admin-card glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ImageIcon size={18} /> Bagan Aktif Saat Ini
                    </h3>

                    {loading ? (
                        <div className="admin-loading" style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="admin-spinner" />
                        </div>
                    ) : currentImage ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div 
                                style={{
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    padding: '1rem',
                                    background: 'var(--color-bg-secondary)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: '200px',
                                    maxHeight: '300px',
                                    overflow: 'hidden'
                                }}
                            >
                                <img 
                                    src={currentImage} 
                                    alt="Bagan Aktif" 
                                    style={{ maxWidth: '100%', maxHeight: '250px', objectFit: 'contain' }} 
                                />
                            </div>
                            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={14} style={{ color: '#2ecc71' }} />
                                <span>Terakhir diperbarui: {updatedAt ? new Date(updatedAt).toLocaleString('id-ID') : '-'}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                            <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                            <p>Belum ada bagan organisasi yang aktif.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
