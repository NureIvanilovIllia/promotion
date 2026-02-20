import { useState, useCallback, useEffect, useRef } from 'react';
import { novaPoshtaService } from '../services/novaPoshtaService';

/**
 * Кастомный хук для поиска городов через API Новой Почты
 */
export const useCitySearch = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimerRef = useRef(null);

    /**
     * Получение населенных пунктов из API
     */
    const fetchSettlements = useCallback(async (search) => {
        if (!search || search.length < 2) {
            setSuggestions([]);
            return [];
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const data = await novaPoshtaService.getSettlements(search);
            setSuggestions(data);
            return data;
        } catch (error) {
            setErrorMessage(error.message || 'Помилка завантаження населених пунктів');
            setSuggestions([]);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

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
            if (searchTerm.length >= 2) {
                fetchSettlements(searchTerm);
            } else {
                setSuggestions([]);
            }
        }, 450);

        // Очистка при размонтировании
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchTerm, fetchSettlements]);

    /**
     * Очистка результатов поиска
     */
    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSuggestions([]);
        setErrorMessage(null);
    }, []);

    return {
        searchTerm,
        suggestions,
        isLoading,
        errorMessage,
        setSearchTerm,
        fetchSettlements,
        clearSearch,
    };
};

