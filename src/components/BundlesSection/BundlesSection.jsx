import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./BundlesSection.module.scss";
import { SECTION_IDS } from "../../constants/navigation";
import { MODAL_CLOSE_ANIMATION_DURATION } from "../../constants/app";
import { formatBundleTitle } from "../../utils/formatBundleTitle";
import { useCart } from "../../hooks/useCart";
import cardImage from "../../assets/images/card.webp";
import cardImageIrrigation from "../../assets/images/card2.webp";
import { greenhouseBundles, irrigationKit3m } from "../../data/bundles";

const BundlesSection = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);
    const { addItem } = useCart();
    const navigate = useNavigate();

    const handleOpenModal = () => {
        setIsClosing(false);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, MODAL_CLOSE_ANIMATION_DURATION);
    };

    const handleAddToCart = (bundle) => {
        addItem({
            id: bundle.id,
            title: bundle.title,
            price: bundle.price,
            quantity: 1,
        });

        setIsAddedModalOpen(true);
    };

    const handleCloseAddedModal = () => {
        setIsAddedModalOpen(false);
    };

    const handleGoToCart = () => {
        setIsAddedModalOpen(false);
        navigate("/cart");
    };

    return (
        <section id={SECTION_IDS.KITS} className={styles.bundles}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Акційні набори</h2>
                </header>

                <div className={styles.grid}>
                    {greenhouseBundles.map((bundle) => {
                        const isIrrigation = bundle.category === "irrigation";
                        const { main: titleMain, highlight: titleHighlight } =
                            formatBundleTitle(bundle.title, isIrrigation);

                        return (
                        <article key={bundle.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img
                                    src={
                                        isIrrigation
                                            ? cardImageIrrigation
                                            : cardImage
                                    }
                                    alt={bundle.title}
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.cardTitle}>
                                    {titleMain}
                                    {titleHighlight && (
                                        <>
                                            {" + "}
                                            <span className={styles.cardTitleHighlight}>
                                                {titleHighlight}
                                            </span>
                                        </>
                                    )}
                                </h3>

                                <p className={styles.cardDescription}>
                                    {bundle.description}
                                </p>

                                <div className={styles.badgeContainer}>
                                    <div className={styles.densityBadge}>
                                        Щільність 50г/м2
                                    </div>

                                    {bundle.includesIrrigationKit && (
                                        <button
                                            type="button"
                                            className={styles.infoButton}
                                            onClick={() =>
                                                handleOpenModal(bundle.id)
                                            }
                                            aria-label="Деталі набору для поливу"
                                        >
                                            ?
                                        </button>
                                    )}
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.footer}>
                                    <div className={styles.price}>
                                        <span className={styles.priceValue}>
                                            {bundle.price.toFixed(2)}₴
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.buyButton}
                                        onClick={() => handleAddToCart(bundle)}
                                    >
                                        Купити
                                    </button>
                                </div>
                            </div>
                        </article>
                    )})}
                </div>
            </div>
        
            {isModalOpen && (
                <div
                    className={`${styles.modalOverlay} ${
                        isClosing ? styles.modalOverlayClosing : ""
                    }`}
                    onClick={handleCloseModal}
                >
                    <div
                        className={`${styles.modal} ${
                            isClosing ? styles.modalClosing : ""
                        }`}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {irrigationKit3m.title}
                            </h3>
                            <button
                                type="button"
                                className={styles.modalClose}
                                onClick={handleCloseModal}
                                aria-label="Закрити"
                            >
                                ×
                            </button>
                        </div>

                        <p className={styles.modalNote}>
                            {irrigationKit3m.note}
                        </p>

                        <ul className={styles.modalList}>
                            {irrigationKit3m.items.map((item) => (
                                <li
                                    key={item.id}
                                    className={styles.modalListItem}
                                >
                                    <span className={styles.modalItemName}>
                                        {item.name}
                                    </span>
                                    <span className={styles.modalItemQty}>
                                        {item.quantity}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {isAddedModalOpen && (
                <div
                    className={styles.addedModalOverlay}
                    onClick={handleCloseAddedModal}
                >
                    <div
                        className={styles.addedModal}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className={styles.addedModalText}>Товар додано у кошик</p>
                        <div className={styles.addedModalActions}>
                            <button
                                type="button"
                                className={styles.addedModalSecondaryButton}
                                onClick={handleCloseAddedModal}
                            >
                                Продовжити покупки
                            </button>
                            <button
                                type="button"
                                className={styles.addedModalPrimaryButton}
                                onClick={handleGoToCart}
                            >
                                До кошика
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default BundlesSection;
