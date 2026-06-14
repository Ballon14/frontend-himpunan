import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://hmtkbg.buildsys.site';
const SITE_NAME = 'HMTKBG';
const SITE_NAME_FULL = 'Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung';
const DEFAULT_DESC = 'Situs resmi Himpunan Mahasiswa Teknologi Konstruksi Bangunan Gedung Semarang. Menjadi wadah aspirasi dan pengembangan diri mahasiswa.';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export default function SEO({
    title,
    description = DEFAULT_DESC,
    type = 'website',
    image = DEFAULT_IMAGE,
    noindex = false,
    canonical = true,
    jsonLd = null,
}) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_NAME_FULL}`;
    const canonicalUrl = canonical ? `${SITE_URL}${typeof window !== 'undefined' ? window.location.pathname : '/'}` : null;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Robots */}
            {noindex
                ? <meta name="robots" content="noindex, nofollow" />
                : <meta name="robots" content="index, follow" />
            }

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonicalUrl || SITE_URL} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:locale" content="id_ID" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content={SITE_NAME} />
            <meta name="twitter:creator" content={SITE_NAME} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            )}
        </Helmet>
    );
}

/* ── Pre-built JSON-LD schemas ─────────────────────────────────────────── */

export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME_FULL,
        alternateName: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.jpg`,
        description: DEFAULT_DESC,
        sameAs: [],
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Semarang',
            addressRegion: 'Jawa Tengah',
            addressCountry: 'ID',
        },
    };
}

export function articleSchema({ title, description, image, datePublished, dateModified, url }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        url: `${SITE_URL}${url}`,
        author: {
            '@type': 'Organization',
            name: SITE_NAME_FULL,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME_FULL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/logo.jpg`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}${url}`,
        },
    };
}

export function eventSchema({ name, description, image, startDate, endDate, location, url }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name,
        description,
        image,
        startDate,
        endDate,
        location: location ? {
            '@type': 'Place',
            name: location,
        } : undefined,
        organizer: {
            '@type': 'Organization',
            name: SITE_NAME_FULL,
            url: SITE_URL,
        },
        url: `${SITE_URL}${url}`,
    };
}

export function breadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`,
        })),
    };
}
