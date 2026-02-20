/**
 * Форматирует заголовок комплекта, выделяя последнюю часть оранжевым цветом
 * @param {string} title - Исходный заголовок
 * @param {boolean} isIrrigation - Является ли комплект с набором для полива
 * @returns {Object} Объект с основной частью и выделенной частью заголовка
 */
export const formatBundleTitle = (title, isIrrigation) => {
    if (isIrrigation) {
        const marker = "набір для поливу";
        const index = title.indexOf(marker);

        if (index !== -1) {
            let titleMain = title.slice(0, index).trim();
            
            // Убираем "+" в конце, если есть
            if (titleMain.endsWith("+")) {
                titleMain = titleMain.slice(0, -1).trim();
            }
            
            return {
                main: titleMain,
                highlight: marker,
            };
        }
    } else {
        const lastPlusIndex = title.lastIndexOf("+");

        if (lastPlusIndex !== -1) {
            return {
                main: title.slice(0, lastPlusIndex).trim(),
                highlight: title.slice(lastPlusIndex + 1).trim(),
            };
        }
    }

    return {
        main: title,
        highlight: "",
    };
};

