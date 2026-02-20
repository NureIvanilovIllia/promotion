import React from 'react';
import { PAYMENT_METHODS } from '../../constants/payment';
import styles from '../../pages/Checkout/Checkout.module.scss';

/**
 * Секция формы с данными оплаты
 */
export const PaymentSection = ({ formData, errors, handleChange }) => {

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Оплата</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Спосіб оплати <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                    {PAYMENT_METHODS.map((method) => (
                        <label key={method.value} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.value}
                                checked={formData.paymentMethod === method.value}
                                onChange={handleChange}
                                className={styles.radio}
                            />
                            <span>{method.label}</span>
                        </label>
                    ))}
                </div>
                {errors.paymentMethod && (
                    <span className={styles.error}>{errors.paymentMethod}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        className={styles.checkbox}
                    />
                    <span>
                        Я згоден на обробку персональних даних{' '}
                        <span className={styles.required}>*</span>
                    </span>
                </label>
                {errors.consent && (
                    <span className={styles.error}>{errors.consent}</span>
                )}
            </div>
        </section>
    );
};

