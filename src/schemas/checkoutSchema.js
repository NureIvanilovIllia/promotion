import { z } from 'zod';

const phoneRegex = /^(\+38)?\s?0\d{9}$/;

/**
 * Схема валидации формы оформления заказа
 */
export const checkoutSchema = z.object({
    firstName: z
        .string()
        .min(1, 'Імʼя обовʼязкове')
        .max(50, 'Імʼя занадто довге (максимум 50 символів)')
        .refine((val) => val.trim().length > 0, {
            message: 'Імʼя не може бути порожнім',
        }),
    lastName: z
        .string()
        .min(1, 'Прізвище обовʼязкове')
        .max(50, 'Прізвище занадто довге (максимум 50 символів)')
        .refine((val) => val.trim().length > 0, {
            message: 'Прізвище не може бути порожнім',
        }),
    phone: z
        .string()
        .min(1, 'Телефон обовʼязковий')
        .regex(phoneRegex, 'Невірний формат телефону. Використовуйте формат: +38 0XX XXX XX XX або 0XX XXX XX XX'),
    city: z
        .object({
            ref: z.string(),
            name: z.string(),
            type: z.string(),
            area: z.string(),
        })
        .nullable()
        .refine((val) => val !== null && val.ref, {
            message: 'Оберіть населений пункт зі списку',
        }),
    // Для радіо-кнопок значення за замовчуванням — порожній рядок,
    // тому обгортаємо enum у union з '' і даємо своє повідомлення
    deliveryMethod: z
        .union([
            z.enum(['nova-poshta', 'postomat', 'ukrposhta']),
            z.literal(''),
        ])
        .refine((val) => val !== '', {
            message: 'Оберіть спосіб доставки',
        }),
    deliveryPoint: z
        .union([
            z.object({
                ref: z.string(),
                description: z.string(),
                address: z.string(),
                number: z.string(),
            }),
            z.string().min(1, 'Вкажіть відділення/поштомат'),
        ])
        .refine((val) => {
            if (typeof val === 'string') {
                return val.trim().length > 0;
            }
            return val && val.ref && val.description;
        }, {
            message: 'Оберіть відділення/поштомат зі списку або введіть адресу',
        }),
    comment: z
        .string()
        .max(500, 'Коментар занадто довгий (максимум 500 символів)')
        .optional(),
    paymentMethod: z
        .union([
            z.enum(['cash', 'online']),
            z.literal(''),
        ])
        .refine((val) => val !== '', {
            message: 'Оберіть спосіб оплати',
        }),
    consent: z.boolean().refine((val) => val === true, {
        message: 'Необхідно дати згоду на обробку персональних даних для оформлення замовлення',
    }),
});

/**
 * Начальные значения формы
 */
export const initialFormData = {
    firstName: '',
    lastName: '',
    phone: '',
    city: null,
    deliveryMethod: '',
    deliveryPoint: null,
    comment: '',
    paymentMethod: '',
    consent: false,
};

