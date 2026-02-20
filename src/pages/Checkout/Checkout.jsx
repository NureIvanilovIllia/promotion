import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useCart } from "../../hooks/useCart";
import { useCheckoutForm } from "../../hooks/useCheckoutForm";
import { RecipientSection } from "../../components/CheckoutForm/RecipientSection";
import { DeliverySection } from "../../components/CheckoutForm/DeliverySection";
import { PaymentSection } from "../../components/CheckoutForm/PaymentSection";
import { OrderSummary } from "../../components/CheckoutForm/OrderSummary";
import { telegramService } from "../../services/telegramService";
import { prepareOrderData } from "../../utils/orderUtils";
import styles from "./Checkout.module.scss";

/**
 * Страница оформления заказа
 */
const Checkout = () => {
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState(null);
    const {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleCitySelect,
        handleWarehouseSelect,
        handleSubmit,
    } = useCheckoutForm();

    /**
     * Обработка отправки формы заказа
     */
    const onSubmitOrder = async (formData) => {
        setSubmitError(null);

        try {
            // Дополнительная валидация перед отправкой
            if (cart.length === 0) {
                setSubmitError('Ваш кошик порожній. Додайте товари до кошика перед оформленням замовлення.');
                return;
            }

            if (totalPrice <= 0) {
                setSubmitError('Сума замовлення повинна бути більше нуля.');
                return;
            }

            // Формируем данные заказа
            const orderData = prepareOrderData(formData, cart, totalPrice);

            // Валидация данных перед отправкой
            if (!orderData.customer.firstName || !orderData.customer.lastName || !orderData.customer.phone) {
                setSubmitError('Перевірте дані отримувача. Всі поля обов\'язкові.');
                return;
            }

            if (!orderData.delivery.city) {
                setSubmitError('Оберіть населений пункт для доставки.');
                return;
            }

            if (!orderData.delivery.type) {
                setSubmitError('Оберіть спосіб доставки.');
                return;
            }

            if (!orderData.delivery.warehouse && !orderData.delivery.warehouseText) {
                setSubmitError('Вкажіть відділення/поштомат для доставки.');
                return;
            }

            if (!orderData.paymentMethod) {
                setSubmitError('Оберіть спосіб оплати.');
                return;
            }

            // Отправляем заказ
            await telegramService.sendOrder(orderData);
            
            // Очищаем корзину и перенаправляем
            clearCart();
            navigate('/', { state: { orderSuccess: true } });
        } catch (error) {
            // Обрабатываем ошибку с понятным сообщением
            const errorMessage = error.message || 'Помилка при відправці замовлення. Спробуйте ще раз.';
            setSubmitError(errorMessage);
            
            // Прокручиваем к ошибке
            setTimeout(() => {
                const errorElement = document.querySelector(`.${styles.errorMessage}`);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit(onSubmitOrder);
    };

    if (cart.length === 0) {
        return (
            <div className={styles.checkout}>
                <Header />
                <div className={styles.container}>
                    <div className={styles.empty}>
                        <h1 className={styles.title}>Оформлення замовлення</h1>
                        <p className={styles.emptyText}>Ваш кошик порожній</p>
                        <Link to="/cart" className={styles.backLink}>
                            Назад до кошика
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.checkout}>
            <Header />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Оформлення замовлення</h1>
                    <Link to="/cart" className={styles.backLink}>
                        Назад до кошика
                    </Link>
                </div>

                <div className={styles.content}>
                    <form className={styles.form} onSubmit={onSubmit}>
                        <RecipientSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            handleCitySelect={handleCitySelect}
                        />
                        <DeliverySection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            handleWarehouseSelect={handleWarehouseSelect}
                        />
                        <PaymentSection
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                        />
                        {submitError && (
                            <div className={styles.errorMessage}>
                                {submitError}
                            </div>
                        )}
                        <div className={styles.formActions}>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Відправка...' : 'Оформити замовлення'}
                            </button>
                        </div>
                    </form>

                    <OrderSummary cart={cart} totalPrice={totalPrice} />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
