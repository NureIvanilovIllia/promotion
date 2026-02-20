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
     */
    async getWarehouses(settlementRef, warehouseType, search = null) {
        const typeOfWarehouseRefMap = {
            branch: '841339c7-591a-42e2-8233-7a0a00f0ed6f',
            postomat: 'f9316480-5f2d-425d-bc2c-ac7cd29decf0',
        };

        const typeOfWarehouseRef = typeOfWarehouseRefMap[warehouseType];
        if (!typeOfWarehouseRef) {
            throw new Error('Invalid warehouse type');
        }

        const methodProperties = {
            TypeOfWarehouseRef: typeOfWarehouseRef,
            SettlementRef: settlementRef,
        };

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

        return data.data || [];
    }
}

module.exports = {
    NovaPoshtaService,
};

