import { useState, useCallback, useEffect, useRef } from 'react';
import { novaPoshtaService } from '../services/novaPoshtaService';

/**
 * Кастомный хук для поиска отделений/почтоматов через API Новой Почты
 */
export const useWarehouseSearch = (settlementRef, warehouseType) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimerRef = useRef(null);

    const isDisabled = !settlementRef || !warehouseType;

    /**
     * Получение отделений/почтоматов из API
     */
    const fetchWarehouses = useCallback(
        async (search = null) => {
            if (!settlementRef || !warehouseType) {
                setSuggestions([]);
                return [];
            }

            setIsLoading(true);
            setErrorMessage(null);

            try {
                const data = await novaPoshtaService.getWarehouses(
                    settlementRef,
                    warehouseType,
                    search
                );
                setSuggestions(data);
                return data;
            } catch (error) {
                setErrorMessage(error.message || 'Помилка завантаження відділень');
                setSuggestions([]);
                return [];
            } finally {
                setIsLoading(false);
            }
        },
        [settlementRef, warehouseType]
    );

    /**
     * Обработка изменения поискового запроса с debounce
     * 
     * Оптимизация:
     *  - не загружаем все отделения города "оптом"
     *  - делаем запрос только когда пользователь ввёл хотя бы 1 символ
     */
    useEffect(() => {
        // Очищаем предыдущий таймер
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Если нет поискового термина — просто очищаем список и не ходим в API
        if (searchTerm.length === 0) {
            setSuggestions([]);
            setErrorMessage(null);
            return;
        }

        // Устанавливаем новый таймер
        debounceTimerRef.current = setTimeout(() => {
            if (searchTerm.length >= 1) {
                fetchWarehouses(searchTerm);
            }
        }, 450);

        // Очистка при размонтировании
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm, fetchWarehouses]);

    /**
     * Очистка результатов поиска
     */
    const clearSearch = useCallback(() => {
        setSearchTerm('');
    }, []);

    /**
     * Загрузка всех отделений при фокусе (без поискового запроса)
     */
    const loadAllWarehouses = useCallback(() => {
        if (!settlementRef || !warehouseType) {
            return;
        }

        // Если уже есть результаты или идёт загрузка — не дергаем API лишний раз
        if (suggestions.length > 0 || isLoading) {
            return;
        }

        fetchWarehouses(null);
    }, [settlementRef, warehouseType, suggestions.length, isLoading, fetchWarehouses]);

    return {
        searchTerm,
        suggestions,
        isLoading,
        errorMessage,
        isDisabled,
        setSearchTerm,
        fetchWarehouses,
        clearSearch,
        loadAllWarehouses,
    };
};

