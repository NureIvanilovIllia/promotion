/**
 * Трансформирует данные отделения/почтомата из формата API в формат клиента
 */
const transformWarehouse = (item) => ({
    ref: item.Ref,
    description: item.Description,
    address: item.ShortAddress,
    number: item.Number,
});

/**
 * Трансформирует массив отделений/почтоматов
 */
const transformWarehouses = (warehouses) => {
    return (warehouses || []).map(transformWarehouse);
};

module.exports = {
    transformWarehouse,
    transformWarehouses,
};

