/**
 * Трансформирует данные населенного пункта из формата API в формат клиента
 */
const transformSettlement = (item) => ({
    ref: item.Ref,
    name: item.Description,
    type: item.SettlementTypeDescription,
    area: item.AreaDescription,
});

/**
 * Трансформирует массив населенных пунктов
 */
const transformSettlements = (settlements) => {
    return (settlements || []).map(transformSettlement);
};

module.exports = {
    transformSettlement,
    transformSettlements,
};

