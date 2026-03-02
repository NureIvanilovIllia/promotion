import React from 'react';
import { useModal } from '../../hooks/useModal';
import { useCitySearch } from '../../hooks/useCitySearch';
import { novaPoshtaService } from '../../services/novaPoshtaService';
import { POPULAR_CITIES } from '../../constants/cities';
import styles from './CitySelect.module.scss';

/**
 * Компонент выбора города с поиском через API Новой Почты
 */
const CitySelect = ({ value, onChange, onSelect, error, selectedCity }) => {
    const { isOpen: isModalOpen, modalRef, openModal, closeModal } = useModal();
    const {
        searchTerm,
        suggestions,
        isLoading,
        errorMessage,
        setSearchTerm,
        fetchSettlements,
        clearSearch,
    } = useCitySearch();

    /**
     * Обработка изменения поискового запроса
     */
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    /**
     * Обработка выбора города
     */
    const handleSelectCity = (city) => {
        onSelect?.({
            ref: city.ref,
            name: city.name,
            type: city.type || '',
            area: city.area || '',
        });
        closeModal();
        clearSearch();
    };

    /**
     * Обработка выбора популярного города
     *
     * Оптимизация и фикc:
     *  - используем Ref из локальных констант POPULAR_CITIES,
     *    чтобы не зависеть от выборки API (особенно для міст типу "Запоріжжя")
     *  - не делаем лишний запрос к getSettlements
     */
    const handlePopularCityClick = (popularCity) => {
        // Обновляем поисковую строку только для UX
        setSearchTerm(popularCity.name);

        // Передаём наверх данные из констант (ref гарантированно наш)
        handleSelectCity({
            ref: popularCity.ref,
            name: popularCity.name,
            type: popularCity.type || '',
            area: popularCity.area || '',
        });
    };

    /**
     * Обработка применения выбора
     */
    const handleApply = () => {
        if (suggestions.length > 0) {
            handleSelectCity(suggestions[0]);
        }
    };

    /**
     * Обработка примера поиска
     */
    const handleExampleClick = () => {
        const exampleCity = 'Люботин';
        setSearchTerm(exampleCity);
        fetchSettlements(exampleCity);
    };
    return (
        <>
            {/* Кнопка выбора города */}
            <div className={styles.wrapper}>
                <div
                    className={`${styles.trigger} ${error ? styles.error : ''}`}
                    onClick={openModal}
                >
                    <div className={styles.triggerContent}>
                        {selectedCity ? (
                            <>
                                <div className={styles.cityName}>{selectedCity.name}</div>
                                <div className={styles.cityArea}>{selectedCity.area}</div>
                            </>
                        ) : (
                            <div className={styles.notSelected}>Не обрано</div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal();
                        }}
                        className={`${styles.triggerButton} ${
                            selectedCity ? styles.selected : styles.notSelected
                        }`}
                    >
                        {selectedCity ? 'Змінити' : 'Обрати'}
                    </button>
                </div>

                {/* Ошибка валидации */}
                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div ref={modalRef} className={styles.modal}>
                        {/* Заголовок */}
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Виберіть своє місто</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className={styles.modalClose}
                            >
                                ×
                            </button>
                        </div>

                        {/* Текст о доставке */}
                        <div className={styles.deliveryText}>
                            <span>🚚</span>
                            <span>Доставляємо замовлення по всій Україні!</span>
                        </div>

                        {/* Популярные города */}
                        <div className={styles.popularCitiesGrid}>
                            {POPULAR_CITIES.map((city) => (
                                <button
                                    key={city.ref}
                                    type="button"
                                    onClick={() => handlePopularCityClick(city)}
                                    className={styles.popularCityButton}
                                >
                                    {city.name}
                                </button>
                            ))}
                        </div>

                        {/* Поле поиска */}
                        <div className={styles.searchGroup}>
                            <label className={styles.searchLabel}>
                                Вкажіть населений пункт України
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleInputChange}
                                placeholder="Запоріжжя"
                                className={styles.searchInput}
                            />
                            <div className={styles.searchExample}>
                                Наприклад,{' '}
                                <span onClick={handleExampleClick} className={styles.exampleLink}>
                                    Люботин
                                </span>
                            </div>
                        </div>

                        {/* Список результатов */}
                        {isLoading && (
                            <div className={styles.loading}>Завантаження...</div>
                        )}

                        {errorMessage && (
                            <div className={styles.errorText}>{errorMessage}</div>
                        )}

                        {!isLoading && !errorMessage && suggestions.length > 0 && (
                            <div className={styles.suggestionsList}>
                                {suggestions.map((city, index) => (
                                    <div
                                        key={`${city.ref}-${index}`}
                                        onClick={() => handleSelectCity(city)}
                                        className={styles.suggestionItem}
                                    >
                                        <div className={styles.suggestionName}>{city.name}</div>
                                        <div className={styles.suggestionDetails}>
                                            {city.type}, {city.area}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Кнопка применения */}
                        <button
                            type="button"
                            onClick={handleApply}
                            disabled={suggestions.length === 0}
                            className={styles.applyButton}
                        >
                            Застосувати
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CitySelect;
