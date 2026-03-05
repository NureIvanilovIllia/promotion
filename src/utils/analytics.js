/**
 * Утилита для работы с Google Analytics
 * Безопасная проверка и вызов gtag
 */

/**
 * Проверяет наличие gtag и безопасно вызывает событие
 * @param {string} eventName - Название события
 * @param {Object} params - Параметры события
 */
export const trackEvent = (eventName, params = {}) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        try {
            window.gtag('event', eventName, params);
        } catch (error) {
            // Тихо игнорируем ошибки аналитики, чтобы не ломать UX
            console.warn('Analytics error:', error);
        }
    }
};

/**
 * Отслеживание добавления товара в корзину
 */
export const trackAddToCart = (item) => {
    trackEvent('add_to_cart', {
        currency: 'UAH',
        value: item.price,
        items: [
            {
                item_id: item.id,
                item_name: item.title,
                price: item.price,
                quantity: item.quantity || 1,
            },
        ],
    });
};

/**
 * Отслеживание покупки
 */
export const trackPurchase = (cart, totalPrice) => {
    trackEvent('purchase', {
        value: totalPrice,
        currency: 'UAH',
        items: cart.map((item) => ({
            item_id: item.id,
            item_name: item.title,
            price: item.price,
            quantity: item.quantity,
        })),
    });
};

