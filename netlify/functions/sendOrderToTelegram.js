const { handlePreflight } = require('./utils/cors.js');
const { createSuccessResponse, createErrorResponse } = require('./utils/response.js');

/**
 * Экранирует HTML-символы для безопасной отправки в Telegram
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 */
const escapeHtml = (text) => {
    if (typeof text !== 'string') {
        return String(text || '');
    }
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

/**
 * Формирует текстовое сообщение для Telegram из данных заказа
 * Все пользовательские данные экранируются для предотвращения XSS
 */
const formatOrderMessage = (orderData) => {
    const { customer, delivery, cart, totalPrice, comment, paymentMethod } = orderData;

    let message = '🛒 <b>НОВЕ ЗАМОВЛЕННЯ</b>\n\n';

    // Покупець (экранируем все пользовательские данные)
    message += '👤 <b>Покупець:</b>\n';
    message += `Імʼя: ${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}\n`;
    message += `Телефон: ${escapeHtml(customer.phone)}\n\n`;

    // Доставка
    message += '🚚 <b>Доставка:</b>\n';
    message += `Населений пункт: ${escapeHtml(delivery.city)}\n`;

    // Тип доставки
    let deliveryTypeText = '';
    if (delivery.type === 'branch') {
        deliveryTypeText = 'Відділення';
    } else if (delivery.type === 'postomat') {
        deliveryTypeText = 'Поштомат';
    } else {
        deliveryTypeText = 'Укрпошта';
    }
    message += `Тип доставки: ${deliveryTypeText}\n`;

    // Відділення/поштомат
    if (delivery.warehouse) {
        message += `Адреса:\n`;
        message += `${escapeHtml(delivery.warehouse.description)}\n`;
    } else if (delivery.warehouseText) {
        message += `Відділення: ${escapeHtml(delivery.warehouseText)}\n`;
    }
    message += '\n';

    // Замовлення
    message += '📦 <b>Замовлення:</b>\n';
    cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        message += `- ${escapeHtml(item.title)} × ${item.quantity} — ${itemTotal} грн\n`;
    });
    message += '\n';

    // Разом
    message += `💰 <b>Разом: ${totalPrice} грн</b>\n\n`;

    // Спосіб оплати
    const paymentText = paymentMethod === 'cash' ? 'Оплата під час отримання товару' : 'Оплата онлайн';
    message += `💳 <b>Спосіб оплати:</b> ${paymentText}\n`;

    // Коментар (экранируем пользовательский ввод)
    if (comment && comment.trim()) {
        message += `\n💬 <b>Коментар:</b>\n${escapeHtml(comment)}`;
    }

    return message;
};

/**
 * Отправка сообщения в Telegram
 */
const sendTelegramMessage = async (message) => {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        throw new Error('Telegram credentials not configured');
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.description || `Telegram API error: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
};

/**
 * Обработчик запроса отправки заказа в Telegram
 */
const handleSendOrder = async (event) => {
    // Валидация HTTP метода
    if (event.httpMethod === 'OPTIONS') {
        return handlePreflight();
    }

    if (event.httpMethod !== 'POST') {
        return createErrorResponse('Невірний метод запиту. Спробуйте оформити замовлення ще раз.', 405);
    }

    // Загружаем переменные окружения при каждом вызове (на случай, если они не загрузились при старте)
    try {
        require('dotenv').config();
    } catch (e) {
        // Игнорируем ошибки загрузки dotenv
    }

    // Проверка наличия Telegram credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error('Telegram credentials not found. TELEGRAM_BOT_TOKEN:', !!botToken, 'TELEGRAM_CHAT_ID:', !!chatId);
        return createErrorResponse('Помилка налаштування сервера. Будь ласка, зв\'яжіться з нами для оформлення замовлення.', 500);
    }

    // Парсинг body
    let orderData;
    try {
        orderData = JSON.parse(event.body || '{}');
    } catch (error) {
        return createErrorResponse('Невірний формат даних. Спробуйте оформити замовлення ще раз.', 400);
    }

    // Валидация обязательных полей с детальными сообщениями
    const missingFields = [];
    if (!orderData.customer) {
        missingFields.push('Дані покупця');
    } else {
        if (!orderData.customer.firstName) missingFields.push('Ім\'я');
        if (!orderData.customer.lastName) missingFields.push('Прізвище');
        if (!orderData.customer.phone) missingFields.push('Телефон');
    }
    
    if (!orderData.delivery) {
        missingFields.push('Дані доставки');
    } else {
        if (!orderData.delivery.city) missingFields.push('Населений пункт');
        if (!orderData.delivery.type && orderData.delivery.type !== '') {
            missingFields.push('Тип доставки');
        }
    }
    
    if (!orderData.cart || !Array.isArray(orderData.cart) || orderData.cart.length === 0) {
        missingFields.push('Товари в кошику');
    }
    
    if (!orderData.totalPrice || orderData.totalPrice <= 0) {
        missingFields.push('Загальна сума замовлення');
    }

    if (missingFields.length > 0) {
        return createErrorResponse(
            `Відсутні обов'язкові дані: ${missingFields.join(', ')}. Перевірте форму та спробуйте ще раз.`,
            400
        );
    }

    try {
        // Формируем сообщение
        const message = formatOrderMessage(orderData);

        // Отправляем в Telegram
        await sendTelegramMessage(message);

        return createSuccessResponse({
            success: true,
            message: 'Order sent to Telegram successfully',
        });
    } catch (error) {
        console.error('Error sending order to Telegram:', error);
        
        // Обрабатываем различные типы ошибок Telegram API
        let errorMessage = 'Помилка відправки замовлення. Спробуйте ще раз через кілька хвилин.';
        
        if (error.message) {
            if (error.message.includes('Telegram credentials not configured')) {
                errorMessage = 'Помилка налаштування сервера. Будь ласка, зв\'яжіться з нами для оформлення замовлення.';
            } else if (error.message.includes('Telegram API error')) {
                // Пытаемся извлечь более детальную информацию из ошибки
                if (error.message.includes('400')) {
                    errorMessage = 'Помилка формату повідомлення. Спробуйте оформити замовлення ще раз.';
                } else if (error.message.includes('401')) {
                    errorMessage = 'Помилка авторизації. Будь ласка, зв\'яжіться з нами.';
                } else if (error.message.includes('429')) {
                    errorMessage = 'Занадто багато запитів. Спробуйте через кілька хвилин.';
                } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
                    errorMessage = 'Помилка сервера Telegram. Спробуйте через кілька хвилин.';
                }
            }
        }
        
        return createErrorResponse(errorMessage, 500);
    }
};

/**
 * Экспорт обработчика для Netlify Functions
 */
exports.handler = handleSendOrder;

