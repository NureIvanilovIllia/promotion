/**
 * Формирует данные заказа для отправки в Telegram
 * @param {Object} formData - данные формы
 * @param {Array} cart - корзина товаров
 * @param {number} totalPrice - общая стоимость
 * @returns {Object} данные заказа
 */
export const prepareOrderData = (formData, cart, totalPrice) => {
    // Тип доставки для Telegram / бэкенда
    // Для Нової Пошти: 'branch' або 'postomat'
    // Для Укрпошти: 'ukrposhta'
    let deliveryType = '';
    if (formData.deliveryMethod === 'nova-poshta') {
        deliveryType = 'branch';
    } else if (formData.deliveryMethod === 'postomat') {
        deliveryType = 'postomat';
    } else if (formData.deliveryMethod === 'ukrposhta') {
        deliveryType = 'ukrposhta';
    }

    // Формируем данные доставки
    const delivery = {
        city: formData.city?.name || '',
        cityRef: formData.city?.ref || '',
        type: deliveryType || '',
    };

    // Добавляем данные отделения/почтомата
    if (formData.deliveryPoint) {
        if (typeof formData.deliveryPoint === 'object') {
            // Новая Почта
            delivery.warehouse = {
                description: formData.deliveryPoint.description || '',
                address: formData.deliveryPoint.address || '',
                number: formData.deliveryPoint.number || '',
            };
        } else {
            // Укрпошта (строка)
            delivery.warehouseText = formData.deliveryPoint;
        }
    }

    return {
        customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
        },
        delivery,
        cart: cart.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
        })),
        totalPrice,
        comment: formData.comment || '',
        paymentMethod: formData.paymentMethod,
    };
};

