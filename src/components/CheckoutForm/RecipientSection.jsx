import React from 'react';
import CitySelect from '../CitySelect/CitySelect';
import styles from '../../pages/Checkout/Checkout.module.scss';

/**
 * Секция формы с данными получателя
 */
export const RecipientSection = ({ formData, errors, handleChange, handleCitySelect }) => {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Отримувач</h2>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName" className={styles.label}>
                        Імʼя <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    />
                    {errors.firstName && (
                        <span className={styles.error}>{errors.firstName}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="lastName" className={styles.label}>
                        Прізвище <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    />
                    {errors.lastName && (
                        <span className={styles.error}>{errors.lastName}</span>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                    Телефон <span className={styles.required}>*</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+38 0XX XXX XX XX"
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                />
                {errors.phone && (
                    <span className={styles.error}>{errors.phone}</span>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                    Вибір населеного пункту <span className={styles.required}>*</span>
                </label>
                <CitySelect
                    selectedCity={formData.city}
                    onSelect={handleCitySelect}
                    error={errors.city}
                />
            </div>
        </section>
    );
};

