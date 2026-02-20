/**
 * Сервис для работы с API Новой Почты на клиенте
 */
class NovaPoshtaClientService {
    constructor(baseUrl = '/api') {
        this.baseUrl = baseUrl;
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

        try {
            const response = await fetch(
                `${this.baseUrl}/getSettlements?search=${encodeURIComponent(search)}`
            );

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Помилка завантаження');
            }

            const result = await response.json();
            return result.data || [];
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
            return result.data || [];
        } catch (error) {
            throw new Error(error.message || 'Помилка завантаження відділень');
        }
    }
}

// Экспортируем singleton экземпляр
export const novaPoshtaService = new NovaPoshtaClientService();

