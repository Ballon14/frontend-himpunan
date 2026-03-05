export default function LoadingSpinner({ message = 'Memuat data...' }) {
    return (
        <div className="loading-container">
            <div className="spinner" />
            <p>{message}</p>
        </div>
    );
}
