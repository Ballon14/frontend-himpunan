import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null;

    return (
        <div className="admin-modal-overlay" onClick={onClose}>
            <div
                className={`admin-modal admin-modal-${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="admin-modal-header">
                    <h2 className="admin-modal-title">{title}</h2>
                    <button className="admin-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="admin-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}
