const { createErrorResponse } = require('./response.js');

/**
 * Валидация HTTP метода запроса
 */
const validateHttpMethod = (method, allowedMethod = 'GET') => {
    if (method === 'OPTIONS') {
        return null; // OPTIONS обрабатывается отдельно
    }
    
    if (method !== allowedMethod) {
        return createErrorResponse('Method not allowed', 405);
    }
    
    return null;
};

/**
 * Валидация параметра поиска
 */
const validateSearchParameter = (search, minLength = 2) => {
    if (!search || search.length < minLength) {
        return createErrorResponse(
            `Search parameter is required (min ${minLength} characters)`,
            400
        );
    }
    
    return null;
};

/**
 * Валидация API ключа
 */
const validateApiKey = (apiKey) => {
    if (!apiKey) {
        return createErrorResponse('API key not configured', 500);
    }
    
    return null;
};

module.exports = {
    validateHttpMethod,
    validateSearchParameter,
    validateApiKey,
};

