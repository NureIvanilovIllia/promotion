import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./Header.module.scss";
import logoIcon from "../../assets/images/logo.svg";
import { NAV_ITEMS } from "../../constants/navigation";
import { scrollToSection } from "../../utils/scrollToSection";
import { HEADER_HEIGHT } from "../../constants/app";
import { useCart } from "../../hooks/useCart";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    const isHomePage = location.pathname === "/";

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleNavClick = (e, href) => {
        e.preventDefault();
        closeMenu();
        
        if (isHomePage) {
            // Если на главной странице, просто прокручиваем к секции
            scrollToSection(href, HEADER_HEIGHT);
        } else {
            // Если на другой странице, переходим на главную с hash
            navigate("/");
            // Устанавливаем hash после небольшой задержки для рендера
            setTimeout(() => {
                window.location.hash = href;
                scrollToSection(href, HEADER_HEIGHT);
            }, 100);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo} onClick={closeMenu}>
                    <div className={styles.logoIcon}>
                        <img src={logoIcon} alt="DOMUS Logo" />
                    </div>
                </Link>

                <nav
                    className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
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

                <div className={styles.rightActions}>
                    <Link to="/cart" className={styles.cartLink} onClick={closeMenu}>
                        <FaShoppingCart className={styles.cartIcon} />
                        {cartItemsCount > 0 && (
                            <span className={styles.cartBadge}>{cartItemsCount}</span>
                        )}
                    </Link>

                    <button
                        className={`${styles.burger} ${isMenuOpen ? styles.burgerOpen : ""}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
