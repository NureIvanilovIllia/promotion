
const { handlePreflight } = require('./utils/cors.js');
const { createSuccessResponse, createErrorResponse } = require('./utils/response.js');
const {
    validateHttpMethod,
    validateSearchParameter,
    validateApiKey,
} = require('./utils/validation.js');
const { NovaPoshtaService } = require('./services/novaPoshtaService.js');
const { transformSettlements } = require('./utils/settlementTransformer.js');

/**
 * Обработчик запроса получения населенных пунктов
 */
const handleGetSettlements = async (event) => {
    // Валидация HTTP метода
    const methodError = validateHttpMethod(event.httpMethod);
    if (methodError) {
        return methodError;
    }

    // Получение и валидация параметра поиска
    const { search } = event.queryStringParameters || {};
    const searchError = validateSearchParameter(search);
    if (searchError) {
        return searchError;
    }

    // Получение и валидация API ключа
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    const apiKeyError = validateApiKey(apiKey);
    if (apiKeyError) {
        return apiKeyError;
    }

    try {
        // Получение данных из API
        const novaPoshtaService = new NovaPoshtaService(apiKey);
        const settlements = await novaPoshtaService.getSettlements(search);

        // Трансформация и возврат данных
        const transformedSettlements = transformSettlements(settlements);
        return createSuccessResponse({ data: transformedSettlements });
    } catch (error) {
        console.error('Error fetching settlements:', error);
        return createErrorResponse(
            error.message || 'Internal server error',
            500
        );
    }
};

/**
 * Главный обработчик Netlify функции
 */
exports.handler = async (event) => {
    // Обработка preflight запроса
    if (event.httpMethod === 'OPTIONS') {
        return handlePreflight();
    }

    return handleGetSettlements(event);
};

