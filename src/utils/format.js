/**
 * Centralized formatting utilities.
 * Eliminates duplicate helper functions across pages.
 */

/**
 * Format a date string to Indonesian locale.
 * @param {string} dateStr - ISO date string
 * @param {object} [options] - Intl.DateTimeFormat options override
 * @returns {string}
 */
export function formatDate(dateStr, options) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    });
}

/**
 * Format a date string to short Indonesian locale (e.g., "1 Jan 2024").
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDateShort(dateStr) {
    return formatDate(dateStr, { month: 'short' });
}

/**
 * Format a date string to time only (HH:mm).
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatTime(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format a number as Indonesian Rupiah currency.
 * @param {number} num - Amount in IDR
 * @returns {string}
 */
export function formatRupiah(num) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(num);
}

/**
 * Strip HTML tags and &nbsp; entities from a string.
 * @param {string} html - HTML string
 * @returns {string}
 */
export function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}
