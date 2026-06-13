import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * CivilBackground — Animated civil-engineering themed background for HomePage.
 * Combines a blueprint grid with floating construction element silhouettes.
 * Purely decorative: pointer-events: none, aria-hidden.
 */

/* ── Construction element SVG paths (simplified silhouettes) ── */
const CONSTRUCTION_ELEMENTS = [
    {
        name: 'building',
        svg: (
            <svg viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="10" y="20" width="60" height="100" rx="2" />
                <rect x="20" y="30" width="12" height="12" rx="1" />
                <rect x="48" y="30" width="12" height="12" rx="1" />
                <rect x="20" y="52" width="12" height="12" rx="1" />
                <rect x="48" y="52" width="12" height="12" rx="1" />
                <rect x="20" y="74" width="12" height="12" rx="1" />
                <rect x="48" y="74" width="12" height="12" rx="1" />
                <rect x="32" y="98" width="16" height="22" rx="1" />
                <line x1="10" y1="20" x2="40" y2="4" />
                <line x1="40" y1="4" x2="70" y2="20" />
            </svg>
        ),
    },
    {
        name: 'crane',
        svg: (
            <svg viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="30" y1="120" x2="30" y2="10" />
                <line x1="30" y1="10" x2="90" y2="10" />
                <line x1="30" y1="10" x2="10" y2="30" />
                <line x1="90" y1="10" x2="90" y2="40" />
                <line x1="85" y1="40" x2="95" y2="40" />
                <line x1="85" y1="40" x2="90" y2="50" />
                <line x1="95" y1="40" x2="90" y2="50" />
                <line x1="20" y1="120" x2="40" y2="120" />
                <line x1="30" y1="40" x2="60" y2="10" />
                <line x1="30" y1="70" x2="50" y2="10" />
            </svg>
        ),
    },
    {
        name: 'beam',
        svg: (
            <svg viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="2" width="116" height="26" rx="1" />
                <line x1="2" y1="8" x2="118" y2="8" />
                <line x1="2" y1="22" x2="118" y2="22" />
                <line x1="30" y1="8" x2="30" y2="22" />
                <line x1="60" y1="8" x2="60" y2="22" />
                <line x1="90" y1="8" x2="90" y2="22" />
            </svg>
        ),
    },
    {
        name: 'truss',
        svg: (
            <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="5" y1="55" x2="50" y2="5" />
                <line x1="50" y1="5" x2="95" y2="55" />
                <line x1="5" y1="55" x2="95" y2="55" />
                <line x1="27" y1="30" x2="73" y2="30" />
                <line x1="27" y1="30" x2="50" y2="55" />
                <line x1="73" y1="30" x2="50" y2="55" />
            </svg>
        ),
    },
    {
        name: 'helmet',
        svg: (
            <svg viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M5 35 Q5 10 30 5 Q55 10 55 35" />
                <line x1="2" y1="35" x2="58" y2="35" />
                <path d="M10 35 Q10 42 30 45 Q50 42 50 35" />
                <line x1="25" y1="15" x2="35" y2="15" />
            </svg>
        ),
    },
    {
        name: 'compass',
        svg: (
            <svg viewBox="0 0 60 70" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="30" y1="5" x2="15" y2="65" />
                <line x1="30" y1="5" x2="45" y2="65" />
                <circle cx="30" cy="5" r="4" />
                <line x1="20" y1="40" x2="40" y2="40" />
                <path d="M13 65 L15 60 L17 65" />
            </svg>
        ),
    },
    {
        name: 'ruler',
        svg: (
            <svg viewBox="0 0 120 20" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="2" width="116" height="16" rx="1" />
                <line x1="15" y1="2" x2="15" y2="10" />
                <line x1="30" y1="2" x2="30" y2="14" />
                <line x1="45" y1="2" x2="45" y2="10" />
                <line x1="60" y1="2" x2="60" y2="14" />
                <line x1="75" y1="2" x2="75" y2="10" />
                <line x1="90" y1="2" x2="90" y2="14" />
                <line x1="105" y1="2" x2="105" y2="10" />
            </svg>
        ),
    },
    {
        name: 'angle',
        svg: (
            <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="5" y1="55" x2="55" y2="55" />
                <line x1="5" y1="55" x2="55" y2="5" />
                <path d="M20 55 A35 35 0 0 1 55 20" strokeDasharray="3 3" />
                <text x="30" y="48" fontSize="8" fill="currentColor" stroke="none">90°</text>
            </svg>
        ),
    },
];

/* ── Seeded pseudo-random for stable element placement ── */
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

export default function CivilBackground() {
    const particles = useMemo(() => {
        const rng = seededRandom(42);
        const items = [];
        const count = 14;

        for (let i = 0; i < count; i++) {
            const el = CONSTRUCTION_ELEMENTS[i % CONSTRUCTION_ELEMENTS.length];
            const size = 40 + Math.floor(rng() * 60); // 40-100px
            items.push({
                id: i,
                element: el,
                x: rng() * 100,           // 0-100% from left
                y: rng() * 100,           // 0-100% from top
                size,
                opacity: 0.03 + rng() * 0.06, // very subtle: 0.03-0.09
                duration: 18 + rng() * 24,     // 18-42s float cycle
                delay: rng() * -20,            // stagger start
                rotate: rng() * 360,           // initial rotation
                rotateRange: 5 + rng() * 15,   // ±5-20° rotation during float
                driftX: -15 + rng() * 30,     // ±15px horizontal drift
                driftY: -20 + rng() * 15,     // -20 to -5px vertical drift (float up)
            });
        }
        return items;
    }, []);

    return (
        <div
            className="civil-bg"
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            {/* Layer 1: Animated Blueprint Grid */}
            <div className="civil-grid" />

            {/* Layer 2: Blueprint measurement marks */}
            <div className="civil-measure-marks" />

            {/* Layer 3: Floating construction silhouettes */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="civil-particle"
                    style={{
                        position: 'absolute',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity,
                        color: 'var(--color-primary)',
                        transform: `rotate(${p.rotate}deg)`,
                        willChange: 'transform',
                    }}
                    animate={{
                        x: [0, p.driftX, 0],
                        y: [0, p.driftY, 0],
                        rotate: [p.rotate, p.rotate + p.rotateRange, p.rotate - p.rotateRange, p.rotate],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    {p.element.svg}
                </motion.div>
            ))}

            {/* Layer 4: Subtle gradient vignette (fade edges) */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at center, transparent 40%, var(--color-bg) 100%)',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
