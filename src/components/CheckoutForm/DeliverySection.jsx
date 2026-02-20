import React from 'react';
import WarehouseSelect from '../WarehouseSelect/WarehouseSelect';
import { DELIVERY_METHODS, getWarehouseType } from '../../constants/delivery';
import styles from '../../pages/Checkout/Checkout.module.scss';

/**
 * Секция формы с данными доставки
 */
export const DeliverySection = ({ formData, errors, handleChange, handleWarehouseSelect }) => {
    const warehouseType = getWarehouseType(formData.deliveryMethod);
    const settlementRef = formData.city?.ref || null;

    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Доставка</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Спосіб доставки <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                    {DELIVERY_METHODS.map((method) => (
                        <label key={method.value} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="deliveryMethod"
                                value={method.value}
                                checked={formData.deliveryMethod === method.value}
                                onChange={handleChange}
                                className={styles.radio}
                            />
                            <span>{method.label}</span>
                        </label>
                    ))}
                </div>
                {errors.deliveryMethod && (
                    <span className={styles.error}>{errors.deliveryMethod}</span>
                )}
            </div>

            {formData.deliveryMethod && warehouseType && (
                <div className={styles.formGroup}>
                    <label htmlFor="deliveryPoint" className={styles.label}>
                        Відділення/поштомат <span className={styles.required}>*</span>
                    </label>
                    <WarehouseSelect
                        settlementRef={settlementRef}
                        warehouseType={warehouseType}
                        onSelect={handleWarehouseSelect}
                        error={errors.deliveryPoint}
                        selectedWarehouse={formData.deliveryPoint}
                    />
                </div>
            )}

            {formData.deliveryMethod === 'ukrposhta' && (
                <div className={styles.formGroup}>
                    <label htmlFor="deliveryPoint" className={styles.label}>
                        Відділення/поштомат <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="deliveryPoint"
                        name="deliveryPoint"
                        value={formData.deliveryPoint || ''}
                        onChange={handleChange}
                        className={`${styles.input} ${
                            errors.deliveryPoint ? styles.inputError : ''
                        }`}
                    />
                    {errors.deliveryPoint && (
                        <span className={styles.error}>{errors.deliveryPoint}</span>
                    )}
                </div>
            )}

            <div className={styles.formGroup}>
                <label htmlFor="comment" className={styles.label}>
                    Коментар
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    className={styles.textarea}
                />
            </div>
        </section>
    );
};

