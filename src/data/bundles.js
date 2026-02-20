// =========================
//   ГОТОВІ НАБОРИ ПАРНИКІВ
// =========================

export const greenhouseBundles = [
    // ===== НАБОРИ З ПОЛИВОМ =====
    {
        id: "irrigation-3m",
        title: "Комплект 3м + 3м + набір для поливу",
        description: "Комплект із двох парників довжиною 3 м з набором для поливу",
        price: 799,
        currency: "UAH",
        category: "irrigation",
        includesIrrigationKit: true,
    },
    {
        id: "irrigation-4m",
        title: "Комплект 4м + 4м + набір для поливу",
        description: "Комплект із двох парників довжиною 4 м з набором для поливу",
        price: 1059,
        currency: "UAH",
        category: "irrigation",
        includesIrrigationKit: true,
    },
    {
        id: "irrigation-6m",
        title: "Комплект 6м + 6м + набір для поливу",
        description: "Комплект із двох парників довжиною 6 м з набором для поливу",
        price: 1259,
        currency: "UAH",
        category: "irrigation",
        includesIrrigationKit: true,
    },

    // ===== АКЦІЙНІ ПРОПОЗИЦІЇ 2 + 1 =====
    {
        id: "promo-4m-free",
        title: "Комплект 4м + 4м + 4м",
        description: "Акційний набір 2 + 1",
        price: 1198,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-3m-3m",
        title: "Комплект 3м + 3м + 3м",
        description: "Акційний набір 2 + 1",
        price: 999,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-4m-3m",
        title: "Комплект 4м + 4м + 3м",
        description: "Акційний набір 2 + 1",
        price: 1149,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-6m-3m",
        title: "Комплект 6м + 6м + 3м",
        description: "Акційний набір 2 + 1",
        price: 1329,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-6m-6m",
        title: "Комплект 6м + 6м + 6м",
        description: "Акційний набір 2 + 1",
        price: 1449,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-8m-4m",
        title: "Комплект 8м + 8м + 4м",
        description: "Акційний набір 2 + 1",
        price: 1429,
        currency: "UAH",
        category: "promo",
    },
    {
        id: "promo-10m-4m",
        title: "Комплект 10м + 10м + 4м",
        description: "Акційний набір 2 + 1",
        price: 1949,
        currency: "UAH",
        category: "promo",
    },
];

// =========================
//   НАБІР ДЛЯ ПОЛИВУ (2 × 3 м)
// =========================

export const irrigationKit3m = {
    title: "Набір для поливу (на 2 парники по 3 м)",
    note: "Для парників 4 та 6 метрів кількість крапельної стрічки та трубки збільшується. Інші фітинги залишаються в тій самій кількості.",
    items: [
        {
            id: 1,
            name: "Крапельна стрічка (емітерна / щілинна)",
            quantity: "10 м",
        },
        {
            id: 2,
            name: "Кран редукційний для стрічки",
            quantity: "2 шт.",
        },
        {
            id: 3,
            name: "Заглушка для стрічки",
            quantity: "2 шт.",
        },
        {
            id: 4,
            name: "Коліно для трубки",
            quantity: "2 шт.",
        },
        {
            id: 5,
            name: 'Трійник для трубки з HP 1/2"',
            quantity: "1 шт.",
        },
        {
            id: 6,
            name: 'Адаптер 1/2" BP',
            quantity: "1 шт.",
        },
        {
            id: 7,
            name: 'Конектор універсальний 1/2" × 3/4"',
            quantity: "1 шт.",
        },
        {
            id: 8,
            name: "Трубка сліпа Ø16",
            quantity: "5 м",
        },
    ],
};


