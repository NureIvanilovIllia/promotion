/**
 * Сервис для отправки заказов в Telegram через Netlify Function
 */

/**
 * Получает понятное сообщение об ошибке для пользователя
 * @param {Error} error - Ошибка
 * @param {number} status - HTTP статус код
 * @param {Object} errorData - Данные ошибки от сервера
 * @returns {string} Понятное сообщение об ошибке
 */
const getErrorMessage = (error, status, errorData) => {
    // Ошибка сети или отсутствие соединения
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return 'Помилка з\'єднання з сервером. Перевірте інтернет-з\'єднання та спробуйте ще раз.';
    }

    // Ошибка валидации данных (400)
    if (status === 400) {
        if (errorData.error) {
            // Переводим технические сообщения на понятный язык
            if (errorData.error.includes('Missing required fields')) {
                return 'Не всі обов\'язкові поля заповнені. Перевірте форму та спробуйте ще раз.';
            }
            if (errorData.error.includes('Invalid JSON')) {
                return 'Помилка формату даних. Спробуйте оформити замовлення ще раз.';
            }
            return errorData.error;
        }
        return 'Помилка в даних форми. Перевірте всі поля та спробуйте ще раз.';
    }

    // Ошибка сервера (500)
    if (status === 500) {
        if (errorData.error && errorData.error.includes('Telegram credentials')) {
            return 'Помилка налаштування сервера. Будь ласка, зв\'яжіться з нами для оформлення замовлення.';
        }
        if (errorData.error && errorData.error.includes('Telegram API')) {
            return 'Помилка відправки замовлення. Спробуйте ще раз через кілька хвилин або зв\'яжіться з нами.';
        }
        return 'Помилка сервера. Спробуйте оформити замовлення ще раз через кілька хвилин.';
    }

    // Таймаут или другие ошибки
    if (status === 408 || status === 504) {
        return 'Час очікування вичерпано. Спробуйте ще раз.';
    }

    // Общая ошибка
    return 'Помилка при відправці замовлення. Спробуйте ще раз або зв\'яжіться з нами.';
};

/**
 * Отправка данных заказа в Telegram
 * @param {Object} orderData - Данные заказа
 * @returns {Promise<Object>} Результат отправки
 */
export const sendOrder = async (orderData) => {
    try {
        const response = await fetch('/api/sendOrderToTelegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // Если не удалось распарсить JSON, используем пустой объект
            }

            const errorMessage = getErrorMessage(
                new Error('Request failed'),
                response.status,
                errorData
            );

            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = errorData;
            throw error;
        }

        return await response.json();
    } catch (error) {
        // Если это уже наша обработанная ошибка, просто пробрасываем её
        if (error.status && error.data) {
            throw error;
        }

        // Обрабатываем сетевые ошибки и другие неожиданные ошибки
        const errorMessage = getErrorMessage(error, 0, {});
        const processedError = new Error(errorMessage);
        processedError.status = 0;
        processedError.data = {};
        throw processedError;
    }
};

export const telegramService = {
    sendOrder,
};
