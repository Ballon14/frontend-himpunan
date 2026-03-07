import React from 'react';
import '../styles/skeleton.css';

export default function Skeleton({ width = '100%', height = '20px', borderRadius = 'var(--radius-md)', style = {}, className = '' }) {
    return (
        <div 
            className={`skeleton ${className}`} 
            style={{ 
                width, 
                height, 
                borderRadius, 
                ...style 
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="skeleton-card glass-card">
            <Skeleton height="220px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
            <div className="card-body">
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <Skeleton width="60px" height="24px" borderRadius="12px" />
                    <Skeleton width="100px" height="24px" />
                </div>
                <Skeleton width="90%" height="28px" style={{ marginBottom: '10px' }} />
                <Skeleton width="60%" height="28px" style={{ marginBottom: '1rem' }} />
                <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                <Skeleton width="80%" height="16px" style={{ marginBottom: '1.5rem' }} />
                <Skeleton width="120px" height="20px" />
            </div>
        </div>
    );
}
