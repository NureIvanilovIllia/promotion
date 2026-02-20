import React from "react";
import styles from "./Footer.module.scss";
import logoIcon from "../../assets/images/logo.svg";
import { NAV_ITEMS } from "../../constants/navigation";
import { scrollToSection } from "../../utils/scrollToSection";
import { HEADER_HEIGHT } from "../../constants/app";

const Footer = () => {
    const handleNavClick = (e, href) => {
        e.preventDefault();
        scrollToSection(href, HEADER_HEIGHT);
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <img src={logoIcon} alt="DOMUS Logo" />
                    </div>
                </div>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {NAV_ITEMS.map((item) => (
                            <li key={item.href} className={styles.navItem}>
                                <a
                                    href={item.href}
                                    className={styles.navLink}
                                    onClick={(e) => handleNavClick(e, item.href)}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
