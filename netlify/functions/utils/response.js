const { getCorsHeaders } = require('./cors.js');

/**
 * Создает успешный HTTP ответ
 */
const createSuccessResponse = (data, statusCode = 200) => ({
    statusCode,
    headers: getCorsHeaders(),
    body: JSON.stringify(data),
});

/**
 * Создает ответ с ошибкой
 */
const createErrorResponse = (error, statusCode = 500) => ({
    statusCode,
    headers: getCorsHeaders(),
    body: JSON.stringify({ error }),
});

module.exports = {
    createSuccessResponse,
    createErrorResponse,
};

