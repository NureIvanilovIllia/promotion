import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import HeroSection from "../../components/HeroSection/HeroSection";
import BenefitsSection from "../../components/BenefitsSection/BenefitsSection";
import BundlesSection from "../../components/BundlesSection/BundlesSection";
import ReviewsSlider from "../../components/ReviewsSlider/ReviewsSlider";
import ContactsSection from "../../components/ContactsSection/ContactsSection";
import Footer from "../../components/Footer/Footer";
import { scrollToSection } from "../../utils/scrollToSection";
import { HEADER_HEIGHT } from "../../constants/app";
import styles from "./Home.module.scss";

const Home = () => {
    const location = useLocation();

    useEffect(() => {
        // Если есть hash в URL, прокручиваем к соответствующей секции
        if (location.hash) {
            setTimeout(() => {
                scrollToSection(location.hash, HEADER_HEIGHT);
            }, 100);
        }
    }, [location]);

    return (
        <div className={styles.home}>
            <Header />
            <HeroSection />
            <BenefitsSection />
            <BundlesSection />
            <ReviewsSlider />
            <ContactsSection />
            <Footer />
        </div>
    );
};

export default Home;

