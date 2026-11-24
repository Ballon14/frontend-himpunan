import { useState, useRef } from 'react';
import { exportTable, exportAll, importTable, downloadImportTemplate } from '../../api/admin';
import {
    Download, Upload, Users, FileText, Briefcase, Image, Mail,
    Package, Check, Calendar, ShoppingBag, FileUp, AlertCircle,
    CheckCircle2, Info, Trophy, Search, FileSpreadsheet, FileCode,
    FileCheck, XCircle, ArrowRight
} from 'lucide-react';
import { notifySuccess, notifyError } from '../../utils/toast';
import '../../styles/admin.css';

const DATA_TABLES = [
    { key: 'anggotas', label: 'Anggota', desc: 'Data seluruh anggota organisasi', icon: Users, color: '#c0392b' },
    { key: 'beritas', label: 'Berita', desc: 'Artikel dan berita yang dipublikasikan', icon: FileText, color: '#27ae60' },
    { key: 'program_kerjas', label: 'Program Kerja', desc: 'Daftar program kerja organisasi', icon: Briefcase, color: '#e67e22' },
    { key: 'galeris', label: 'Galeri', desc: 'Data foto dan dokumentasi kegiatan', icon: Image, color: '#3498db' },
    { key: 'prestasis', label: 'Prestasi', desc: 'Data pencapaian dan prestasi organisasi/mahasiswa', icon: Trophy, color: '#f59e0b' },
    { key: 'pesans', label: 'Pesan', desc: 'Pesan masuk dari pengunjung website', icon: Mail, color: '#8e44ad' },
    { key: 'kegiatan', label: 'Kegiatan', desc: 'Data jadwal kegiatan dan acara organisasi', icon: Calendar, color: '#f39c12' },
    { key: 'merchandise', label: 'Merchandise', desc: 'Data produk merchandise organisasi', icon: ShoppingBag, color: '#1abc9c' },
];

function triggerDownload(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
    }, 1000);
}

export default function ExportDataPage() {
    const [activeTab, setActiveTab] = useState('export');
    const [loadingTable, setLoadingTable] = useState(null);
    const [loadingAll, setLoadingAll] = useState(false);
    const [format, setFormat] = useState('xlsx');
    const [doneTable, setDoneTable] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Import state
    const [importTarget, setImportTarget] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [importLoading, setImportLoading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [templateLoading, setTemplateLoading] = useState(null);
    const fileInputRef = useRef(null);

    const filteredTables = DATA_TABLES.filter(t =>
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ─── Export handlers ─────────────────────────────────────────────────────
    const handleExportSingle = async (tableKey, label) => {
        setLoadingTable(tableKey);
        setDoneTable(null);
        try {
            const res = await exportTable(tableKey, format);
            const ext = format === 'json' ? 'json' : format === 'xlsx' ? 'xlsx' : 'csv';
            const timestamp = new Date().toISOString().slice(0, 10);

            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            triggerDownload(fileBlob, `${label}_${timestamp}.${ext}`);
            setDoneTable(tableKey);
            notifySuccess(`${label} berhasil di-export dalam format ${ext.toUpperCase()}!`);
            setTimeout(() => setDoneTable(null), 2000);
        } catch (err) {
            console.error(err);
            notifyError(`Gagal export ${label}.`);
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
            notifySuccess('Semua data berhasil di-export ke dalam ZIP!');
        } catch (err) {
            console.error(err);
            notifyError('Gagal export semua data.');
        } finally {
            setLoadingAll(false);
        }
    };

    // ─── Import handlers ─────────────────────────────────────────────────────
    const handleSelectTable = (tableKey) => {
        setImportTarget(tableKey);
        setImportFile(null);
        setImportResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImportFile(file);
            setImportResult(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) {
            const ext = file.name.split('.').pop().toLowerCase();
            if (['xlsx', 'xls', 'csv', 'json'].includes(ext)) {
                setImportFile(file);
                setImportResult(null);
            } else {
                notifyError('Format file tidak didukung. Harap gunakan Excel (.xlsx), CSV, atau JSON.');
            }
        }
    };

    const handleImport = async () => {
        if (!importTarget || !importFile) return;

        setImportLoading(true);
        setImportResult(null);
        try {
            const res = await importTable(importTarget, importFile);
            const data = res.data?.data || res.data;
            setImportResult({
                success: true,
                message: res.data?.message || 'Import data berhasil!',
                imported: data?.imported || 0,
                skipped: data?.skipped || 0,
                total: data?.total || 0,
                errors: data?.errors || [],
            });
            notifySuccess(res.data?.message || 'Import data berhasil!');
            setImportFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Gagal melakukan import.';
            const errData = err.response?.data?.data;
            setImportResult({
                success: false,
                message: msg,
                errors: errData?.errors || [],
            });
            notifyError(msg);
        } finally {
            setImportLoading(false);
        }
    };

    const handleDownloadTemplate = async (tableKey, label, templateFormat = 'xlsx') => {
        setTemplateLoading(`${tableKey}-${templateFormat}`);
        try {
            const res = await downloadImportTemplate(tableKey, templateFormat);
            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            const ext = templateFormat === 'xlsx' ? 'xlsx' : 'csv';
            triggerDownload(fileBlob, `Template_${label}.${ext}`);
            notifySuccess(`Template ${label} (${ext.toUpperCase()}) berhasil di-download!`);
        } catch (err) {
            console.error(err);
            notifyError(`Gagal download template ${label}.`);
        } finally {
            setTemplateLoading(null);
        }
    };

    const selectedTableConfig = DATA_TABLES.find(t => t.key === importTarget);

    return (
        <div className="admin-page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ─── Tab Switcher ────────────────────────────────────── */}
            <div className="export-tab-container" style={{ marginBottom: '4px' }}>
                <button
                    className={`export-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                    onClick={() => setActiveTab('export')}
                >
                    <Download size={18} />
                    <span>Export Data</span>
                </button>
                <button
                    className={`export-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                    onClick={() => setActiveTab('import')}
                >
                    <Upload size={18} />
                    <span>Import Data</span>
                </button>
            </div>

            {/* ══════════════════════ EXPORT TAB ══════════════════════ */}
            {activeTab === 'export' && (
                <>
                    {/* Header Controls */}
                    <div className="export-header" style={{
                        background: 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: 'var(--admin-radius)',
                        padding: '18px 24px'
                    }}>
                        <div className="export-header-text">
                            <h2>Export & Backup Data</h2>
                            <p>Download cadangan data website dalam format Excel (.xlsx), CSV, atau JSON.</p>
                        </div>
                        <div className="export-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <div className="export-format-selector">
                                <button
                                    className={`export-format-btn ${format === 'xlsx' ? 'active' : ''}`}
                                    onClick={() => setFormat('xlsx')}
                                    title="Export file format Microsoft Excel .xlsx"
                                >
                                    <span className="export-format-dot" style={{ background: '#10b981' }} />
                                    <span>Excel (.xlsx)</span>
                                </button>
                                <button
                                    className={`export-format-btn ${format === 'csv' ? 'active' : ''}`}
                                    onClick={() => setFormat('csv')}
                                    title="Export file format CSV"
                                >
                                    <span className="export-format-dot" style={{ background: '#3b82f6' }} />
                                    <span>CSV (.csv)</span>
                                </button>
                                <button
                                    className={`export-format-btn ${format === 'json' ? 'active' : ''}`}
                                    onClick={() => setFormat('json')}
                                    title="Export file format JSON"
                                >
                                    <span className="export-format-dot" style={{ background: '#f59e0b' }} />
                                    <span>JSON</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Export All Card */}
                    <div className="export-all-card" style={{
                        background: 'linear-gradient(135deg, rgba(192, 57, 43, 0.15) 0%, rgba(26, 29, 36, 0.95) 100%)',
                        border: '1px solid rgba(192, 57, 43, 0.3)'
                    }}>
                        <div className="export-all-info">
                            <div className="export-all-icon">
                                <Package size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px' }}>Export Seluruh Database (Full Backup)</h3>
                                <p style={{ fontSize: '0.85rem' }}>
                                    Mengunduh seluruh 8 tabel ke dalam 1 file arsip ZIP berisi file {format.toUpperCase()} untuk setiap entitas.
                                </p>
                            </div>
                        </div>
                        <button
                            className="admin-btn admin-btn-primary export-all-btn"
                            onClick={handleExportAll}
                            disabled={loadingAll || loadingTable}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: 600 }}
                        >
                            {loadingAll ? (
                                <>
                                    <span className="export-spinner" />
                                    <span>Mengekspor ZIP...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={18} />
                                    <span>Download ZIP ({format.toUpperCase()})</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Search / Filter Tables Bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        flexWrap: 'wrap',
                        marginTop: '4px'
                    }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-muted)' }} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama tabel..."
                                style={{
                                    width: '100%',
                                    background: 'var(--admin-surface)',
                                    border: '1px solid var(--admin-border)',
                                    borderRadius: 'var(--admin-radius-sm)',
                                    padding: '8px 12px 8px 36px',
                                    color: 'var(--admin-text)',
                                    fontSize: '0.85rem'
                                }}
                            />
                        </div>
                        <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                            Menampilkan {filteredTables.length} dari {DATA_TABLES.length} tabel
                        </span>
                    </div>

                    {/* Individual Table Cards */}
                    <div className="export-grid">
                        {filteredTables.map((t) => {
                            const Icon = t.icon;
                            const isLoading = loadingTable === t.key;
                            const isDone = doneTable === t.key;

                            return (
                                <div key={t.key} className="export-card" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                    <div className="export-card-header">
                                        <div className="export-card-icon" style={{ background: `${t.color}20`, color: t.color }}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="export-card-info">
                                            <h4>{t.label}</h4>
                                            <p>{t.desc}</p>
                                        </div>
                                    </div>
                                    <div className="export-card-footer">
                                        <span className="export-card-format" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                                            {format === 'xlsx' && '📗 Excel (.xlsx)'}
                                            {format === 'csv' && '📊 CSV (.csv)'}
                                            {format === 'json' && '📄 JSON'}
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
                    <div className="export-note" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Info size={18} style={{ color: 'var(--admin-info)', flexShrink: 0 }} />
                        <div>
                            <strong>Informasi Export:</strong> Data yang di-export adalah data aktif terbaru. Format <strong>Excel (.xlsx)</strong> dilengkapi dengan pemformatan header berwarna, auto-filter kolom, dan baris belang (zebra) otomatis.
                        </div>
                    </div>
                </>
            )}

            {/* ══════════════════════ IMPORT TAB ══════════════════════ */}
            {activeTab === 'import' && (
                <>
                    {/* Header */}
                    <div className="export-header" style={{
                        background: 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: 'var(--admin-radius)',
                        padding: '18px 24px'
                    }}>
                        <div className="export-header-text">
                            <h2>Import & Restore Data</h2>
                            <p>Upload berkas Excel (.xlsx), CSV, atau JSON untuk memasukkan data secara massal ke database.</p>
                        </div>
                    </div>

                    {/* Step 1: Select Table */}
                    <div className="import-step" style={{
                        background: 'var(--admin-surface)',
                        border: '1px solid var(--admin-border)',
                        borderRadius: 'var(--admin-radius)',
                        padding: '24px'
                    }}>
                        <div className="import-step-header" style={{ marginBottom: '18px' }}>
                            <span className="import-step-number" style={{ background: 'var(--admin-primary)', color: '#fff' }}>1</span>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Pilih Tabel Tujuan</h3>
                                <p style={{ margin: '2px 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                                    Klik tabel yang ingin Anda tambahkan datanya.
                                </p>
                            </div>
                        </div>
                        <div className="import-table-grid">
                            {DATA_TABLES.map((t) => {
                                const Icon = t.icon;
                                const isSelected = importTarget === t.key;
                                return (
                                    <button
                                        key={t.key}
                                        className={`import-table-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => handleSelectTable(t.key)}
                                        style={{
                                            '--table-color': t.color,
                                            border: isSelected ? `2px solid ${t.color}` : '1px solid var(--admin-border)'
                                        }}
                                    >
                                        <div className="import-table-icon" style={{ background: `${t.color}20`, color: t.color }}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="import-table-label" style={{ fontWeight: isSelected ? 700 : 500 }}>{t.label}</span>
                                        {isSelected && <CheckCircle2 size={16} className="import-table-check" style={{ color: t.color }} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Upload File & Template */}
                    {importTarget && (
                        <div className="import-step" style={{
                            background: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--admin-radius)',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <div className="import-step-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="import-step-number" style={{ background: 'var(--admin-primary)', color: '#fff' }}>2</span>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                                            Upload File Data ({selectedTableConfig?.label})
                                        </h3>
                                        <p style={{ margin: '2px 0 0', color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                                            Format yang didukung: Excel (.xlsx), CSV (.csv), atau JSON (.json)
                                        </p>
                                    </div>
                                </div>

                                {/* Download Template Buttons */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        className="admin-btn admin-btn-outline"
                                        onClick={() => handleDownloadTemplate(importTarget, selectedTableConfig?.label, 'xlsx')}
                                        disabled={templateLoading === `${importTarget}-xlsx`}
                                        style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        title="Download template berkas Excel siap isi"
                                    >
                                        {templateLoading === `${importTarget}-xlsx` ? (
                                            <span className="export-spinner" />
                                        ) : (
                                            <FileSpreadsheet size={15} style={{ color: '#10b981' }} />
                                        )}
                                        <span>Template Excel</span>
                                    </button>

                                    <button
                                        className="admin-btn admin-btn-outline"
                                        onClick={() => handleDownloadTemplate(importTarget, selectedTableConfig?.label, 'csv')}
                                        disabled={templateLoading === `${importTarget}-csv`}
                                        style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        title="Download template berkas CSV"
                                    >
                                        {templateLoading === `${importTarget}-csv` ? (
                                            <span className="export-spinner" />
                                        ) : (
                                            <Download size={15} style={{ color: '#3b82f6' }} />
                                        )}
                                        <span>Template CSV</span>
                                    </button>
                                </div>
                            </div>

                            {/* Drag and Drop Zone */}
                            <div className="import-upload-area">
                                <div
                                    className={`import-upload-box ${isDragging ? 'dragging' : ''}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    style={{
                                        cursor: 'pointer',
                                        border: isDragging ? '2px dashed var(--admin-primary)' : '2px dashed var(--admin-border)',
                                        background: isDragging ? 'var(--admin-primary-soft)' : 'rgba(255, 255, 255, 0.02)',
                                        borderRadius: 'var(--admin-radius)',
                                        padding: '36px 20px',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    {importFile ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '14px',
                                                background: 'rgba(39, 174, 96, 0.15)',
                                                color: 'var(--admin-success)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FileCheck size={28} />
                                            </div>
                                            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                                {importFile.name}
                                            </span>
                                            <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                                                Ukuran: {(importFile.size / 1024).toFixed(1)} KB • Klik untuk mengganti berkas
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: '14px',
                                                background: 'rgba(192, 57, 43, 0.12)',
                                                color: 'var(--admin-primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <FileUp size={28} />
                                            </div>
                                            <div>
                                                <p style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--admin-text)' }}>
                                                    {isDragging ? 'Lepaskan berkas di sini...' : 'Tarik & lepas file ke sini atau klik untuk memilih'}
                                                </p>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                                                    Format didukung: .xlsx, .csv, .json (Maksimal 10MB)
                                                </span>
                                            </div>
                                        </>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".xlsx,.xls,.csv,.json"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                    {importFile && (
                                        <button
                                            type="button"
                                            className="admin-btn admin-btn-outline"
                                            onClick={() => {
                                                setImportFile(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            <XCircle size={16} />
                                            <span>Batal</span>
                                        </button>
                                    )}

                                    <button
                                        className="admin-btn admin-btn-primary"
                                        onClick={handleImport}
                                        disabled={!importFile || importLoading}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '10px 24px',
                                            fontWeight: 600
                                        }}
                                    >
                                        {importLoading ? (
                                            <>
                                                <span className="export-spinner" />
                                                <span>Mengimpor Data...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} />
                                                <span>Mulai Import Data</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Import Result Notification */}
                    {importResult && (
                        <div
                            className={`import-result ${importResult.success ? 'success' : 'error'}`}
                            style={{
                                background: importResult.success ? 'rgba(39, 174, 96, 0.08)' : 'rgba(231, 76, 60, 0.08)',
                                border: importResult.success ? '1px solid rgba(39, 174, 96, 0.25)' : '1px solid rgba(231, 76, 60, 0.25)',
                                borderRadius: 'var(--admin-radius)',
                                padding: '20px'
                            }}
                        >
                            <div className="import-result-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                {importResult.success ? (
                                    <CheckCircle2 size={22} style={{ color: 'var(--admin-success)' }} />
                                ) : (
                                    <AlertCircle size={22} style={{ color: 'var(--admin-danger)' }} />
                                )}
                                <strong style={{ fontSize: '1rem', color: importResult.success ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                                    {importResult.message}
                                </strong>
                            </div>

                            {importResult.success && (
                                <div className="import-result-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                                    <div className="import-stat" style={{ background: 'var(--admin-surface)', padding: '12px 16px', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
                                        <span className="import-stat-number" style={{ color: 'var(--admin-success)', fontSize: '1.5rem', fontWeight: 700 }}>{importResult.imported}</span>
                                        <span className="import-stat-label" style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Berhasil diimport</span>
                                    </div>
                                    <div className="import-stat" style={{ background: 'var(--admin-surface)', padding: '12px 16px', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
                                        <span className="import-stat-number" style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>{importResult.skipped}</span>
                                        <span className="import-stat-label" style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Dilewati (duplikat)</span>
                                    </div>
                                    <div className="import-stat" style={{ background: 'var(--admin-surface)', padding: '12px 16px', borderRadius: 'var(--admin-radius-sm)', border: '1px solid var(--admin-border)' }}>
                                        <span className="import-stat-number" style={{ color: 'var(--admin-text)', fontSize: '1.5rem', fontWeight: 700 }}>{importResult.total}</span>
                                        <span className="import-stat-label" style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Total baris berkas</span>
                                    </div>
                                </div>
                            )}

                            {importResult.errors?.length > 0 && (
                                <div className="import-errors-list" style={{ marginTop: '14px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--admin-radius-sm)' }}>
                                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--admin-danger)', fontSize: '0.85rem' }}>
                                        <AlertCircle size={14} /> Catatan Validasi:
                                    </strong>
                                    <ul style={{ margin: '6px 0 0 18px', padding: 0, fontSize: '0.82rem', color: 'var(--admin-text-muted)' }}>
                                        {importResult.errors.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="export-note" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <Info size={18} style={{ color: 'var(--admin-info)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <strong>Panduan Import Data:</strong>
                            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                                <li>Gunakan tombol <strong>Template Excel</strong> atau <strong>Template CSV</strong> untuk memastikan susunan kolom data sesuai standar database.</li>
                                <li>Data duplikat pada field unik (seperti NIM pada Anggota atau Slug pada Berita) akan otomatis dilewati agar data eksisting tidak rusak.</li>
                                <li>File export yang dihasilkan dari tab "Export Data" dapat langsung diunggah kembali sebagai berkas pemulihan (restore).</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
