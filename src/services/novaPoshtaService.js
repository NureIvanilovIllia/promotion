/**
 * Сервис для работы с API Новой Почты на клиенте
 */
class NovaPoshtaClientService {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;

        /**
         * Простой in-memory кэш:
         *  - settlementsCache: ключ = search.toLowerCase()
         *  - warehousesCache: ключ = `${settlementRef}|${warehouseType}|${search || ''}`
         *
         * Кэш живёт только в рамках сессии и не трогает LocalStorage.
         */
        this.settlementsCache = new Map();
        this.warehousesCache = new Map();
    }

    /**
     * Получить список населенных пунктов
     * @param {string} search - поисковый запрос
     * @returns {Promise<Array>} - массив населенных пунктов
     */
    async getSettlements(search) {
        if (!search || search.length < 2) {
            return [];
        }

        const key = search.toLowerCase().trim();
        if (this.settlementsCache.has(key)) {
            return this.settlementsCache.get(key);
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/getSettlements?search=${encodeURIComponent(search)}`
            );

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Помилка завантаження');
            }

            const result = await response.json();
            const data = result.data || [];

            this.settlementsCache.set(key, data);

            return data;
        } catch (error) {
            throw new Error(error.message || 'Помилка завантаження населених пунктів');
        }
    }

    /**
     * Получить список отделений/почтоматов
     * @param {string} settlementRef - ссылка на населенный пункт
     * @param {string} warehouseType - тип отделения ('branch' или 'postomat')
     * @param {string|null} search - поисковый запрос (опционально)
     * @returns {Promise<Array>} - массив отделений/почтоматов
     */
    async getWarehouses(settlementRef, warehouseType, search = null) {
        if (!settlementRef || !warehouseType) {
            return [];
        }

        const key = `${settlementRef}|${warehouseType}|${(search || '').toLowerCase().trim()}`;
        if (this.warehousesCache.has(key)) {
            return this.warehousesCache.get(key);
        }

        try {
            const response = await fetch(`${this.baseUrl}/getWarehouses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    settlementRef,
                    warehouseType,
                    search: search || undefined,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Помилка завантаження');
            }

            const result = await response.json();
            const data = result.data || [];

            this.warehousesCache.set(key, data);

            return data;
        } catch (error) {
            throw new Error(error.message || 'Помилка завантаження відділень');
        }
    }
}

// Экспортируем singleton экземпляр
export const novaPoshtaService = new NovaPoshtaClientService();

