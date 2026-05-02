import { useState } from 'react';
import { exportTable, exportAll } from '../../api/admin';
import { Download, Users, FileText, Briefcase, Image, Mail, Package, Check, Calendar, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const EXPORT_TABLES = [
    { key: 'anggotas', label: 'Anggota', desc: 'Data seluruh anggota organisasi', icon: Users, color: '#6366f1' },
    { key: 'beritas', label: 'Berita', desc: 'Artikel dan berita yang dipublikasikan', icon: FileText, color: '#10b981' },
    { key: 'program_kerjas', label: 'Program Kerja', desc: 'Daftar program kerja organisasi', icon: Briefcase, color: '#f59e0b' },
    { key: 'galeris', label: 'Galeri', desc: 'Data foto dan dokumentasi kegiatan', icon: Image, color: '#ec4899' },
    { key: 'pesans', label: 'Pesan', desc: 'Pesan masuk dari pengunjung website', icon: Mail, color: '#8b5cf6' },
    { key: 'kegiatan', label: 'Kegiatan', desc: 'Data jadwal kegiatan dan acara organisasi', icon: Calendar, color: '#14b8a6' },
    { key: 'merchandise', label: 'Merchandise', desc: 'Data produk merchandise organisasi', icon: ShoppingBag, color: '#f97316' },
];

function triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // We delay the cleanup to prevent the browser download manager from losing 
    // the object reference and falling back to saving the Blob's UUID.
    setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
    }, 1000);
}

export default function ExportDataPage() {
    const [loadingTable, setLoadingTable] = useState(null);
    const [loadingAll, setLoadingAll] = useState(false);
    const [format, setFormat] = useState('csv');
    const [doneTable, setDoneTable] = useState(null);

    const handleExportSingle = async (tableKey, label) => {
        setLoadingTable(tableKey);
        setDoneTable(null);
        try {
            const res = await exportTable(tableKey, format);
            const ext = format === 'json' ? 'json' : 'csv';
            const timestamp = new Date().toISOString().slice(0, 10);
            
            // Axios responseType: 'blob' makes res.data already a valid Blob with the correct MIME type.
            // Wrapping it in new Blob([res.data]) without a type parameter strips the MIME type.
            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            triggerDownload(fileBlob, `${label}_${timestamp}.${ext}`);
            setDoneTable(tableKey);
            toast.success(`${label} berhasil di-export!`);
            setTimeout(() => setDoneTable(null), 2000);
        } catch (err) {
            console.error(err);
            toast.error(`Gagal export ${label}.`);
        } finally {
            setLoadingTable(null);
        }
    };

    const handleExportAll = async () => {
        setLoadingAll(true);
        setDoneTable(null);
        try {
            const res = await exportAll(format);
            const timestamp = new Date().toISOString().slice(0, 10);
            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            triggerDownload(fileBlob, `Backup_HMTKBG_${timestamp}.zip`);
            toast.success('Semua data berhasil di-export!');
        } catch (err) {
            console.error(err);
            toast.error('Gagal export semua data.');
        } finally {
            setLoadingAll(false);
        }
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="export-header">
                <div className="export-header-text">
                    <h2>Export & Backup Data</h2>
                    <p>Download data website dalam format Excel atau JSON untuk keperluan backup.</p>
                </div>
                <div className="export-header-actions">
                    <div className="export-format-selector">
                        <button
                            className={`export-format-btn ${format === 'csv' ? 'active' : ''}`}
                            onClick={() => setFormat('csv')}
                        >
                            <span className="export-format-dot" style={{ background: '#3b82f6' }} />
                            CSV (.csv)
                        </button>
                        <button
                            className={`export-format-btn ${format === 'json' ? 'active' : ''}`}
                            onClick={() => setFormat('json')}
                        >
                            <span className="export-format-dot" style={{ background: '#f59e0b' }} />
                            JSON
                        </button>
                    </div>
                </div>
            </div>

            {/* Export All Card */}
            <div className="export-all-card">
                <div className="export-all-info">
                    <div className="export-all-icon">
                        <Package size={16} />
                    </div>
                    <div>
                        <h3>Export Semua Data</h3>
                        <p>Download seluruh data dalam satu file ZIP berisi {format === 'csv' ? 'CSV' : 'JSON'} per tabel.</p>
                    </div>
                </div>
                <button
                    className="admin-btn admin-btn-primary export-all-btn"
                    onClick={handleExportAll}
                    disabled={loadingAll || loadingTable}
                >
                    {loadingAll ? (
                        <>
                            <span className="export-spinner" />
                            Mengekspor...
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Download ZIP
                        </>
                    )}
                </button>
            </div>

            {/* Individual Table Cards */}
            <div className="export-grid">
                {EXPORT_TABLES.map((t) => {
                    const Icon = t.icon;
                    const isLoading = loadingTable === t.key;
                    const isDone = doneTable === t.key;

                    return (
                        <div key={t.key} className="export-card">
                            <div className="export-card-header">
                                <div className="export-card-icon" style={{ background: `${t.color}20`, color: t.color }}>
                                    <Icon />
                                </div>
                                <div className="export-card-info">
                                    <h4>{t.label}</h4>
                                    <p>{t.desc}</p>
                                </div>
                            </div>
                            <div className="export-card-footer">
                                <span className="export-card-format">
                                    {format === 'csv' ? '📊 CSV' : '📄 JSON'}
                                </span>
                                <button
                                    className={`export-card-btn ${isDone ? 'done' : ''}`}
                                    onClick={() => handleExportSingle(t.key, t.label)}
                                    disabled={isLoading || loadingAll}
                                >
                                    {isLoading ? (
                                        <span className="export-spinner" />
                                    ) : isDone ? (
                                        <Check size={16} />
                                    ) : (
                                        <Download size={16} />
                                    )}
                                    {isLoading ? 'Proses...' : isDone ? 'Selesai' : 'Download'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info Note */}
            <div className="export-note">
                <strong>ℹ️ Informasi:</strong> Data yang di-export hanya mencakup data aktif (tidak termasuk data yang sudah dihapus). 
                File akan langsung di-download ke perangkat Anda.
            </div>
        </div>
    );
}
