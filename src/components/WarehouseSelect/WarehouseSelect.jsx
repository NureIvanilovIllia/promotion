import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWarehouseSearch } from '../../hooks/useWarehouseSearch';
import styles from './WarehouseSelect.module.scss';

/**
 * Компонент выбора отделения/почтомата с поиском через API Новой Почты
 */
const WarehouseSelect = ({ settlementRef, warehouseType, onSelect, error, selectedWarehouse }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const {
        searchTerm,
        suggestions,
        isLoading,
        errorMessage,
        isDisabled,
        setSearchTerm,
        clearSearch,
        loadAllWarehouses,
    } = useWarehouseSearch(settlementRef, warehouseType);

    const placeholder = useMemo(
        () => (warehouseType === 'postomat' ? 'Оберіть поштомат' : 'Оберіть відділення'),
        [warehouseType]
    );

    // Закрываем dropdown при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Открываем dropdown при появлении результатов
    useEffect(() => {
        if (suggestions.length > 0 && !isLoading) {
            setIsOpen(true);
        }
    }, [suggestions, isLoading]);

    /**
     * Обработка изменения input
     */
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        
        // При начале редактирования сбрасываем выбранное отделение
        if (selectedWarehouse) {
            onSelect?.(null);
        }
        
        setSearchTerm(newValue);
    };

    /**
     * Обработка выбора отделения
     */
    const handleSelectWarehouse = (warehouse) => {
        onSelect?.(warehouse);
        setIsOpen(false);
        clearSearch();
    };

    /**
     * Обработка фокуса на input
     */
    const handleInputFocus = () => {
        if (!searchTerm && !selectedWarehouse) {
            loadAllWarehouses();
        } else if (suggestions.length > 0) {
            setIsOpen(true);
        }
    };

    // Сбрасываем поиск при изменении выбранного отделения
    useEffect(() => {
        if (selectedWarehouse && searchTerm !== selectedWarehouse.description) {
            setSearchTerm('');
        }
    }, [selectedWarehouse, searchTerm, setSearchTerm]);

    const inputValue = selectedWarehouse ? selectedWarehouse.description : searchTerm;
    const inputClassName = `${styles.input} ${error ? styles.inputError : ''} ${isDisabled ? styles.inputDisabled : ''}`;

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder={placeholder}
                disabled={isDisabled}
                className={inputClassName}
            />

            {/* Состояние загрузки */}
            {isLoading && (
                <div className={styles.dropdown}>
                    <div className={styles.loading}>Завантаження...</div>
                </div>
            )}

            {/* Список предложений */}
            {isOpen && !isLoading && suggestions.length > 0 && (
                <div className={styles.dropdown}>
                    {suggestions.map((warehouse, index) => (
                        <div
                            key={`${warehouse.ref}-${index}`}
                            onClick={() => handleSelectWarehouse(warehouse)}
                            className={styles.suggestionItem}
                        >
                            <div className={styles.suggestionDescription}>
                                {warehouse.description}
                            </div>
                            <div className={styles.suggestionAddress}>
                                {warehouse.address}
                                {warehouse.number && `, ${warehouse.number}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Пустой результат */}
            {isOpen && !isLoading && searchTerm.length >= 1 && suggestions.length === 0 && !errorMessage && (
                <div className={styles.dropdown}>
                    <div className={styles.empty}>Нічого не знайдено</div>
                </div>
            )}

            {/* Ошибка */}
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {/* Ошибка валидации */}
            {error && !errorMessage && (
                <div className={styles.errorMessage}>{error}</div>
            )}
        </div>
    );
};

export default WarehouseSelect;

