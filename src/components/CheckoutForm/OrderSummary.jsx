import React from 'react';
import styles from '../../pages/Checkout/Checkout.module.scss';

/**
 * Компонент отображения сводки заказа
 */
export const OrderSummary = ({ cart, totalPrice }) => {
    return (
        <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Ваше замовлення</h2>
            <div className={styles.summaryItems}>
                {cart.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                        <span className={styles.summaryItemName}>{item.title}</span>
                        <span className={styles.summaryItemQty}>{item.quantity} шт.</span>
                        <span className={styles.summaryItemPrice}>
                            {(item.price * item.quantity).toFixed(2)}₴
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles.summaryTotal}>
                <span className={styles.summaryTotalLabel}>Всього:</span>
                <span className={styles.summaryTotalValue}>
                    {totalPrice.toFixed(2)}₴
                </span>
            </div>
        </div>
    );
};

