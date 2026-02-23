import { useState, useCallback } from 'react';
import { z } from 'zod';
import { checkoutSchema, initialFormData } from '../schemas/checkoutSchema';

/**
 * Кастомный хук для управления формой оформления заказа
 */
export const useCheckoutForm = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Очистка ошибки поля
     */
    const clearFieldError = useCallback((fieldName) => {
        setErrors((prev) => {
            if (!prev[fieldName]) {
                return prev;
            }
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);


    /**
     * Обработка изменения поля формы
     */
    const handleChange = useCallback(
        (e) => {
            const { name, value, type, checked } = e.target;
            const fieldValue = type === 'checkbox' ? checked : value;

            setFormData((prev) => {
                const newData = {
                    ...prev,
                    [name]: fieldValue,
                    // Очищаем поле доставки при смене способа доставки
                    ...(name === 'deliveryMethod' && { deliveryPoint: null }),
                };

                // Проверка: если выбран способ доставки, требующий город, но город не выбран
                if (name === 'deliveryMethod' && (value === 'nova-poshta' || value === 'postomat')) {
                    if (!prev.city || !prev.city.ref) {
                        // Устанавливаем ошибку для поля city
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            city: 'Оберіть населений пункт',
                        }));
                    } else {
                        // Если город выбран, очищаем ошибку
                        clearFieldError('city');
                    }
                }

                return newData;
            });

            // Валидация в реальном времени для текстовых полей
            if (type !== 'checkbox' && type !== 'radio') {
                // Не валидируем сразу, даем пользователю ввести данные
                // Очищаем ошибку только если поле было с ошибкой
                if (errors[name]) {
                    clearFieldError(name);
                }
            } else {
                // Для checkbox и radio сразу очищаем ошибку (кроме случая с deliveryMethod выше)
                if (name !== 'deliveryMethod') {
                    clearFieldError(name);
                }
            }
        },
        [clearFieldError, errors]
    );

    /**
     * Обработка выбора города
     */
    const handleCitySelect = useCallback(
        (city) => {
            setFormData((prev) => ({
                ...prev,
                city: city,
                // Очищаем отделение при смене города
                deliveryPoint: null,
            }));

            clearFieldError('city');
        },
        [clearFieldError]
    );

    /**
     * Обработка выбора отделения/почтомата
     */
    const handleWarehouseSelect = useCallback(
        (warehouse) => {
            setFormData((prev) => ({
                ...prev,
                deliveryPoint: warehouse,
            }));

            clearFieldError('deliveryPoint');
        },
        [clearFieldError]
    );

    /**
     * Валидация формы
     */
    const validateForm = useCallback(() => {
        try {
            checkoutSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = {};
                // У Zod v4 массив ошибок хранится в свойстве `issues`
                const issues = error.issues || [];

                issues.forEach((issue) => {
                    const fieldName = issue.path[0];
                    // Если для поля уже есть ошибка, берем первую (более общую)
                    if (fieldName && !fieldErrors[fieldName]) {
                        fieldErrors[fieldName] = issue.message;
                    }
                });

                setErrors(fieldErrors);

                // Прокручиваем к первому полю с ошибкой
                const firstErrorField = Object.keys(fieldErrors)[0];
                if (firstErrorField) {
                    setTimeout(() => {
                        const errorElement = document.querySelector(
                            `[name="${firstErrorField}"]`
                        );
                        if (errorElement) {
                            errorElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                            });
                            errorElement.focus();
                        }
                    }, 100);
                }
            }
            return false;
        }
    }, [formData]);

    /**
     * Обработка отправки формы
     */
    const handleSubmit = useCallback(
        async (onSubmit) => {
            setIsSubmitting(true);

            try {
                if (!validateForm()) {
                    return;
                }

                await onSubmit(formData);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, validateForm]
    );

    /**
     * Сброс формы
     */
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setErrors({});
    }, []);

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleCitySelect,
        handleWarehouseSelect,
        handleSubmit,
        validateForm,
        resetForm,
    };
};

