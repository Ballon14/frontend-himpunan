import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description = "Situs resmi Himpunan Mahasiswa Politeknik Pembangunan Umum Semarang. Menjadi wadah aspirasi dan pengembangan diri mahasiswa.",
    name = "HIMAPUP",
    type = "website",
    image = "https://example.com/default-og-image.jpg"
}) {
    const fullTitle = title ? `${title} — ${name}` : name;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Facebook / Open Graph tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
}
