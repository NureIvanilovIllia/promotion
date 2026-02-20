import { useState, useEffect, useRef } from 'react';

/**
 * Кастомный хук для управления модальным окном
 */
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    /**
     * Открытие модального окна
     */
    const openModal = () => {
        setIsOpen(true);
    };

    /**
     * Закрытие модального окна
     */
    const closeModal = () => {
        setIsOpen(false);
    };

    /**
     * Обработка клика вне модального окна
     */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return {
        isOpen,
        modalRef,
        openModal,
        closeModal,
    };
};

