/**
 * Сервис для работы с API Новой Почты
 */
class NovaPoshtaService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
    }

    /**
     * Получить список населенных пунктов
     */
    async getSettlements(search, options = {}) {
        const {
            warehouse = '1',
            limit = 20,
        } = options;

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: this.apiKey,
                modelName: 'AddressGeneral',
                calledMethod: 'getSettlements',
                methodProperties: {
                    FindByString: search,
                    Warehouse: warehouse,
                    Limit: limit,
                },
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.errors?.[0] || 'API error');
        }

        return data.data || [];
    }

    /**
     * Получить список отделений/почтоматов
     *
     * Для типа `branch`:
     *  - загружаем ВСЕ типы отделений для нас. пункта
     *  - затем на нашей стороне отфильтровываем почтоматы
     *
     * Для типа `postomat`:
     *  - сразу фильтруем на стороне API по TypeOfWarehouseRef почтоматов
     */
    async getWarehouses(settlementRef, warehouseType, search = null) {
        // Идентификатор типа "Поштомат" из довідника НП
        const POSTOMAT_TYPE_REF = 'f9316480-5f2d-425d-bc2c-ac7cd29decf0';

        const methodProperties = {
            SettlementRef: settlementRef,
            // Ограничиваем количество результатов для ускорения ответа
            Limit: 50,
        };

        // Для почтоматов запрашиваем только их на стороне API
        if (warehouseType === 'postomat') {
            methodProperties.TypeOfWarehouseRef = POSTOMAT_TYPE_REF;
        }

        if (search) {
            methodProperties.FindByString = search;
        }

        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: this.apiKey,
                modelName: 'AddressGeneral',
                calledMethod: 'getWarehouses',
                methodProperties,
            }),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.errors?.[0] || 'API error');
        }

        let warehouses = data.data || [];

        // Для "Самовивіз з Нової Пошти" исключаем почтоматы,
        // чтобы отображались ВСІ види відділень, крім поштоматів
        if (warehouseType === 'branch') {
            warehouses = warehouses.filter((item) => {
                const isPostomatByType =
                    item.TypeOfWarehouseRef === POSTOMAT_TYPE_REF;

                const desc = `${item.Description || ''} ${item.ShortAddress || ''}`.toLowerCase();
                const isPostomatByText =
                    desc.includes('поштомат') || desc.includes('почтомат');

                return !isPostomatByType && !isPostomatByText;
            });
        }

        return warehouses;
    }
}

module.exports = {
    NovaPoshtaService,
};

