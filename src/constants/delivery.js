/**
 * Константы для типов доставки
 */
export const DELIVERY_METHODS = [
    { value: 'nova-poshta', label: 'Самовивіз з Нової Пошти' },
    { value: 'postomat', label: 'Самовивіз з поштоматів' },
    { value: 'ukrposhta', label: 'Самовивіз з Укрпошти' },
];

/**
 * Маппинг типа доставки на тип отделения
 */
export const DELIVERY_TO_WAREHOUSE_TYPE = {
    'nova-poshta': 'branch',
    'postomat': 'postomat',
    'ukrposhta': null,
};

/**
 * Получить тип отделения по типу доставки
 * @param {string} deliveryMethod - тип доставки
 * @returns {string|null} - тип отделения или null
 */
export const getWarehouseType = (deliveryMethod) => {
    return DELIVERY_TO_WAREHOUSE_TYPE[deliveryMethod] || null;
};

