/**
 * Утилита для настройки CORS заголовков
 */
const getCorsHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
});

/**
 * Обработка preflight запроса
 */
const handlePreflight = () => ({
    statusCode: 200,
    headers: getCorsHeaders(),
    body: '',
});

module.exports = {
    getCorsHeaders,
    handlePreflight,
};

