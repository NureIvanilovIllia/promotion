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
     */
    useEffect(() => {
        // Очищаем предыдущий таймер
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Устанавливаем новый таймер
        debounceTimerRef.current = setTimeout(() => {
            if (searchTerm.length >= 1) {
                fetchWarehouses(searchTerm);
            } else if (searchTerm.length === 0 && settlementRef && warehouseType) {
                // При очистке поля загружаем все отделения
                fetchWarehouses(null);
            }
        }, 450);

        // Очистка при размонтировании
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm, fetchWarehouses, settlementRef, warehouseType]);

    /**
     * Очистка результатов поиска
     */
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSuggestions([]);
        setErrorMessage(null);
    }, []);

    /**
     * Загрузка всех отделений при фокусе
     */
    const loadAllWarehouses = useCallback(() => {
        if (!searchTerm && settlementRef && warehouseType) {
            fetchWarehouses(null);
        }
    }, [searchTerm, settlementRef, warehouseType, fetchWarehouses]);

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

