import { motion } from 'framer-motion';

export default function SectionTitle({ label, title, description }) {
    return (
        <motion.div
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {label && <span className="label">{label}</span>}
            <h2>{title}</h2>
            {description && <p>{description}</p>}
        </motion.div>
    );
}
