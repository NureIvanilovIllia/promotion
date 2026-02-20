import React from "react";
import styles from "./BenefitsSection.module.scss";
import { SECTION_IDS } from "../../constants/navigation";

import iconReliability from "../../assets/icons/icon-1.svg";
import iconDensity from "../../assets/icons/icon-2.svg";
import iconUVResistant from "../../assets/icons/icon-3.svg";
import iconEasyInstall from "../../assets/icons/icon-4.svg";
import iconConsultation from "../../assets/icons/icon-5.svg";

const BENEFITS = [
    {
        id: 1,
        icon: iconReliability,
        title: "Надійна конструкція з гарантією якості",
    },
    {
        id: 2,
        icon: iconDensity,
        title: "Агроволокно підвищеної щільності",
    },
    {
        id: 3,
        icon: iconUVResistant,
        title: "Пластик, стійкий до ультрафіолету",
    },
    {
        id: 4,
        icon: iconEasyInstall,
        title: "Зручний монтаж і проста експлуатація",
    },
    {
        id: 5,
        icon: iconConsultation,
        title: "Індивідуальна консультація спеціаліста",
    },
];

const BenefitsSection = () => {
    return (
        <section id={SECTION_IDS.ABOUT} className={styles.benefits}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Ми пропонуємо</h2>
                    <p className={styles.subtitle}>
                        Рішення для тих, хто хоче отримати стабільний урожай,
                        надійну конструкцію та чесну вигоду без компромісів
                    </p>
                </div>

                <div className={styles.cards}>
                    {BENEFITS.map((benefit) => (
                        <article key={benefit.id} className={styles.card}>
                            <div className={styles.cardIcon}>
                                <img src={benefit.icon} alt={benefit.title} />
                            </div>
                            <h3 className={styles.cardTitle}>
                                {benefit.title}
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
