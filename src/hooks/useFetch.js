import { useState, useEffect, useCallback } from 'react';

/**
 * Reusable data-fetching hook with loading & error states.
 * @param {Function} fetchFn — async function that returns { data }
 * @param {Array} deps — dependency array for re-fetching
 */
export default function useFetch(fetchFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchFn();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data.');
        } finally {
            setLoading(false);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        execute();
    }, [execute]);

    return { data, loading, error, refetch: execute };
}
