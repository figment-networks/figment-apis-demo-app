import Image from "next/image"
import styles from "./styles.module.css"

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a href="https://docs.figment.io/" target="_blank" rel="noopener noreferrer">
                Figment Docs
            </a>
            <a href="https://figment.io" target="_blank" rel="noopener noreferrer">
                Figment{" "}
                <span className={styles.logo}>
                    <Image src="/f.svg" alt="Figment Logo" width={16} height={16} />
                </span>
            </a>
        </footer>
    )
}