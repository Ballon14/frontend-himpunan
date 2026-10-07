import { useState, useRef } from 'react';
import { exportTable, exportAll, importTable, downloadImportTemplate } from '../../api/admin';
import { Download, Upload, Users, FileText, Briefcase, Image, Mail, Package, Check, Calendar, ShoppingBag, FileUp, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { notifySuccess, notifyError } from '../../utils/toast';
import '../../styles/admin.css';

const DATA_TABLES = [
    { key: 'anggotas', label: 'Anggota', desc: 'Data seluruh anggota organisasi', icon: Users, color: '#c0392b' },
    { key: 'beritas', label: 'Berita', desc: 'Artikel dan berita yang dipublikasikan', icon: FileText, color: '#27ae60' },
    { key: 'program_kerjas', label: 'Program Kerja', desc: 'Daftar program kerja organisasi', icon: Briefcase, color: '#e67e22' },
    { key: 'galeris', label: 'Galeri', desc: 'Data foto dan dokumentasi kegiatan', icon: Image, color: '#3498db' },
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
    
    // We delay the cleanup to prevent the browser download manager from losing 
    // the object reference and falling back to saving the Blob's UUID.
    setTimeout(() => {
        a.remove();
        window.URL.revokeObjectURL(url);
    }, 1000);
}

export default function ExportDataPage() {
    const [activeTab, setActiveTab] = useState('export');
    const [loadingTable, setLoadingTable] = useState(null);
    const [loadingAll, setLoadingAll] = useState(false);
    const [format, setFormat] = useState('csv');
    const [doneTable, setDoneTable] = useState(null);

    // Import state
    const [importTarget, setImportTarget] = useState(null);
    const [importFile, setImportFile] = useState(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [templateLoading, setTemplateLoading] = useState(null);
    const fileInputRef = useRef(null);

    // ─── Export handlers ─────────────────────────────────────────────────────
    const handleExportSingle = async (tableKey, label) => {
        setLoadingTable(tableKey);
        setDoneTable(null);
        try {
            const res = await exportTable(tableKey, format);
            const ext = format === 'json' ? 'json' : 'csv';
            const timestamp = new Date().toISOString().slice(0, 10);
            
            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            triggerDownload(fileBlob, `${label}_${timestamp}.${ext}`);
            setDoneTable(tableKey);
            notifySuccess(`${label} berhasil di-export!`);
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
            notifySuccess('Semua data berhasil di-export!');
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

    const handleImport = async () => {
        if (!importTarget || !importFile) return;

        setImportLoading(true);
        setImportResult(null);
        try {
            const res = await importTable(importTarget, importFile);
            const data = res.data?.data || res.data;
            setImportResult({
                success: true,
                message: res.data?.message || 'Import berhasil!',
                imported: data?.imported || 0,
                skipped: data?.skipped || 0,
                total: data?.total || 0,
                errors: data?.errors || [],
            });
            notifySuccess(res.data?.message || 'Import berhasil!');
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

    const handleDownloadTemplate = async (tableKey, label) => {
        setTemplateLoading(tableKey);
        try {
            const res = await downloadImportTemplate(tableKey);
            const fileBlob = res.data instanceof Blob ? res.data : new Blob([res.data]);
            triggerDownload(fileBlob, `Template_${label}.csv`);
            notifySuccess(`Template ${label} berhasil di-download!`);
        } catch (err) {
            console.error(err);
            notifyError(`Gagal download template ${label}.`);
        } finally {
            setTemplateLoading(null);
        }
    };

    const selectedTableConfig = DATA_TABLES.find(t => t.key === importTarget);

    return (
        <div className="admin-page">
            {/* Tab Switcher */}
            <div className="export-tab-container">
                <button
                    className={`export-tab-btn ${activeTab === 'export' ? 'active' : ''}`}
                    onClick={() => setActiveTab('export')}
                >
                    <Download size={18} />
                    Export Data
                </button>
                <button
                    className={`export-tab-btn ${activeTab === 'import' ? 'active' : ''}`}
                    onClick={() => setActiveTab('import')}
                >
                    <Upload size={18} />
                    Import Data
                </button>
            </div>

            {/* ══════════════════════ EXPORT TAB ══════════════════════ */}
            {activeTab === 'export' && (
                <>
                    {/* Header */}
                    <div className="export-header">
                        <div className="export-header-text">
                            <h2>Export & Backup Data</h2>
                            <p>Download data website dalam format CSV atau JSON untuk keperluan backup.</p>
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
                                    <span className="export-format-dot" style={{ background: '#f39c12' }} />
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
                        {DATA_TABLES.map((t) => {
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
                </>
            )}

            {/* ══════════════════════ IMPORT TAB ══════════════════════ */}
            {activeTab === 'import' && (
                <>
                    {/* Header */}
                    <div className="export-header">
                        <div className="export-header-text">
                            <h2>Import Data</h2>
                            <p>Upload file CSV atau JSON untuk menambahkan data secara massal ke database.</p>
                        </div>
                    </div>

                    {/* Step 1: Select Table */}
                    <div className="import-step">
                        <div className="import-step-header">
                            <span className="import-step-number">1</span>
                            <div>
                                <h3>Pilih Tabel Tujuan</h3>
                                <p>Pilih tabel yang ingin Anda import datanya.</p>
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
                                        style={{ '--table-color': t.color }}
                                    >
                                        <div className="import-table-icon" style={{ background: `${t.color}20`, color: t.color }}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="import-table-label">{t.label}</span>
                                        {isSelected && <CheckCircle2 size={16} className="import-table-check" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Upload File */}
                    {importTarget && (
                        <div className="import-step">
                            <div className="import-step-header">
                                <span className="import-step-number">2</span>
                                <div>
                                    <h3>Upload File</h3>
                                    <p>Pilih file CSV atau JSON yang berisi data <strong>{selectedTableConfig?.label}</strong>.</p>
                                </div>
                            </div>

                            <div className="import-upload-area">
                                <div className="import-upload-box" onClick={() => fileInputRef.current?.click()}>
                                    <FileUp size={40} strokeWidth={1.5} />
                                    {importFile ? (
                                        <div className="import-file-info">
                                            <span className="import-file-name">{importFile.name}</span>
                                            <span className="import-file-size">
                                                {(importFile.size / 1024).toFixed(1)} KB
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <p>Klik untuk memilih file atau drag & drop</p>
                                            <span className="import-file-hint">Format: CSV, JSON (Maks 10MB)</span>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.json"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>

                                <div className="import-upload-actions">
                                    <button
                                        className="admin-btn admin-btn-outline import-template-btn"
                                        onClick={() => handleDownloadTemplate(importTarget, selectedTableConfig?.label)}
                                        disabled={templateLoading === importTarget}
                                    >
                                        {templateLoading === importTarget ? (
                                            <span className="export-spinner" />
                                        ) : (
                                            <Download size={16} />
                                        )}
                                        Download Template CSV
                                    </button>

                                    <button
                                        className="admin-btn admin-btn-primary import-submit-btn"
                                        onClick={handleImport}
                                        disabled={!importFile || importLoading}
                                    >
                                        {importLoading ? (
                                            <>
                                                <span className="export-spinner" />
                                                Mengimport...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} />
                                                Import Data
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Import Result */}
                    {importResult && (
                        <div className={`import-result ${importResult.success ? 'success' : 'error'}`}>
                            <div className="import-result-header">
                                {importResult.success ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <AlertCircle size={20} />
                                )}
                                <strong>{importResult.message}</strong>
                            </div>
                            {importResult.success && (
                                <div className="import-result-stats">
                                    <div className="import-stat">
                                        <span className="import-stat-number">{importResult.imported}</span>
                                        <span className="import-stat-label">Berhasil diimport</span>
                                    </div>
                                    <div className="import-stat">
                                        <span className="import-stat-number">{importResult.skipped}</span>
                                        <span className="import-stat-label">Dilewati (duplikat)</span>
                                    </div>
                                    <div className="import-stat">
                                        <span className="import-stat-number">{importResult.total}</span>
                                        <span className="import-stat-label">Total baris</span>
                                    </div>
                                </div>
                            )}
                            {importResult.errors?.length > 0 && (
                                <div className="import-errors-list">
                                    <strong><AlertCircle size={14} /> Error Detail:</strong>
                                    <ul>
                                        {importResult.errors.map((e, i) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Info Note */}
                    <div className="export-note">
                        <strong>ℹ️ Informasi:</strong> 
                        <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                            <li>Data duplikat (berdasarkan field unik seperti NIM/Slug) akan otomatis dilewati.</li>
                            <li>Gunakan fitur "Download Template" untuk mendapatkan format kolom yang benar.</li>
                            <li>Format file harus CSV atau JSON (dari fitur Export juga bisa digunakan).</li>
                            <li>Import tidak menyertakan file foto/gambar, hanya data teks.</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}
