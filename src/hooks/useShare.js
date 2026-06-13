import { notifySuccess } from '../utils/toast';

export default function useShare() {
    const share = async ({ title, url }) => {
        const shareUrl = url || window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title, url: shareUrl });
            } catch (error) {
                // User cancelled share
            }
        } else {
            await navigator.clipboard.writeText(shareUrl);
            notifySuccess('Link berhasil disalin ke clipboard!');
        }
    };
    return share;
}
