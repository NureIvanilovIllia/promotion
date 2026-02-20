const { handlePreflight } = require('./utils/cors.js');
const { createSuccessResponse, createErrorResponse } = require('./utils/response.js');
const { validateHttpMethod, validateApiKey } = require('./utils/validation.js');
const { NovaPoshtaService } = require('./services/novaPoshtaService.js');
const { transformWarehouses } = require('./utils/warehouseTransformer.js');

/**
 * Обработчик запроса получения отделений/почтоматов
 */
const handleGetWarehouses = async (event) => {
    // Валидация HTTP метода
    const methodError = validateHttpMethod(event.httpMethod, 'POST');
    if (methodError) {
        return methodError;
    }

    // Получение и валидация API ключа
    const apiKey = process.env.NOVA_POSHTA_API_KEY;
    const apiKeyError = validateApiKey(apiKey);
    if (apiKeyError) {
        return apiKeyError;
    }

    // Парсинг body
    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (error) {
        return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { settlementRef, warehouseType, search } = body;

    // Валидация обязательных полей
    if (!settlementRef) {
        return createErrorResponse('settlementRef is required', 400);
    }

    if (!warehouseType || !['branch', 'postomat'].includes(warehouseType)) {
        return createErrorResponse('warehouseType must be "branch" or "postomat"', 400);
    }

    try {
        // Получение данных из API
        const novaPoshtaService = new NovaPoshtaService(apiKey);
        const warehouses = await novaPoshtaService.getWarehouses(
            settlementRef,
            warehouseType,
            search || null
        );

        // Трансформация и возврат данных
        const transformedWarehouses = transformWarehouses(warehouses);
        return createSuccessResponse({ data: transformedWarehouses });
    } catch (error) {
        console.error('Error fetching warehouses:', error);
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

    return handleGetWarehouses(event);
};

