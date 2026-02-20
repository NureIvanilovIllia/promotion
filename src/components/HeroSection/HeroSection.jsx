import React from "react";
import Button from "../Button/Button";
import styles from "./HeroSection.module.scss";
import heroImage from "../../assets/images/hero-image.png";
import plusIcon from "../../assets/icons/plus-icon.svg";
import equalIcon from "../../assets/icons/equal-icon.svg";
import { scrollToSection } from "../../utils/scrollToSection";
import { HEADER_HEIGHT } from "../../constants/app";
import { SECTION_IDS } from "../../constants/navigation";

const HeroSection = () => {
  const handleBuyClick = () => {
    scrollToSection(`#${SECTION_IDS.KITS}`, HEADER_HEIGHT);
  };

  return (
    <section className={styles.hero}>
            <div className={styles.background}>
                <img
                    src={heroImage}
                    alt="Garden background"
                    className={styles.backgroundImage}
                />
                <div className={styles.backgroundOverlay} />
            </div>
      
            <div className={styles.container}>
                <h1 className={styles.title}>ПАРНИК "ПРОЛІСОК"</h1>

                <div className={styles.greenhouse}>
                    <div className={styles.promoEquation}>
                        <div className={styles.equationItem}>
                            <span className={styles.number}>1</span>
                        </div>
                        <span className={styles.operator}>
                            <img src={plusIcon} alt="plus" />
                        </span>
                        <div className={styles.equationItem}>
                            <span className={styles.number}>1</span>
                        </div>
                        <span className={styles.operator}>
                            <img src={equalIcon} alt="equals" />
                        </span>
                        <div className={styles.equationItem}>
                            <span className={styles.number}>3</span>
                        </div>
                    </div>
                </div>

                <div className={styles.promoText}>
                    <p className={styles.promoLine}>Візьміть два парника –</p>
                    <p className={styles.promoLine}>
                        отримайте третій в подарунок
                    </p>
                </div>

                <div className={styles.buttonWrapper}>
                    <Button className={styles.buyButton} onClick={handleBuyClick}>
                        КУПИТИ
                    </Button>
                </div>
            </div>
    </section>
  );
};

export default HeroSection;

