import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../api/admin';

export const DEFAULT_SETTINGS = {
    site_name: 'HMTKBG Politeknik PU',
    site_tagline: 'Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung',
    site_description: 'Wadah aspirasi, kreasi, dan sinergi mahasiswa Teknologi Konstruksi Bangunan Gedung Politeknik Pekerjaan Umum.',
    whatsapp_number: '6281515630448',
    email: 'hima.kbg@gmail.com',
    alamat: 'Gedung Pusat Kegiatan Mahasiswa Lt. 2, Teknologi Konstruksi Bangunan Gedung, Semarang, Jawa Tengah',
    jam_operasional: 'Senin - Jumat: 08:00 - 16:00 WIB',
    instagram_url: 'https://www.instagram.com/hmtkbg?igsh=M2owdXpkMXprcjA4',
    instagram_username: '@hmtkbg',
    tiktok_url: 'https://www.tiktok.com/@hmtkbg?_r=1&_t=ZS-9AM3oNXfHBm',
    tiktok_username: '@hmtkbg',
    youtube_url: 'https://www.youtube.com/@hmtkbgpoliteknikpu6903',
    youtube_channel: 'HMTKBG Politeknik PU',
};

const SettingsContext = createContext({
    settings: DEFAULT_SETTINGS,
    isLoading: false,
    refetch: () => {},
    getWaUrl: () => '',
    getWaDisplay: () => '',
});

export function SettingsProvider({ children }) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['site-settings'],
        queryFn: async () => {
            const res = await getSettings();
            return res.data?.data || DEFAULT_SETTINGS;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    const settings = { ...DEFAULT_SETTINGS, ...(data || {}) };

    const getWaUrl = (customText = '') => {
        let wa = (settings.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number).replace(/[^0-9]/g, '');
        if (wa.startsWith('0')) {
            wa = '62' + wa.slice(1);
        }
        const textParam = customText ? `?text=${encodeURIComponent(customText)}` : '';
        return `https://wa.me/${wa}${textParam}`;
    };

    const getWaDisplay = () => {
        let wa = (settings.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number).replace(/[^0-9]/g, '');
        if (wa.startsWith('0')) {
            wa = '62' + wa.slice(1);
        }
        if (wa.startsWith('62')) {
            const rest = wa.slice(2);
            if (rest.length >= 8) {
                return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
            }
            return `+62 ${rest}`;
        }
        return wa;
    };

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refetch, getWaUrl, getWaDisplay }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
