/**
 * Плавно прокручивает страницу к указанной секции с учетом высоты хедера
 * @param {string} sectionId - ID секции (например, "#about")
 * @param {number} headerHeight - Высота фиксированного хедера в пикселях
 */
export const scrollToSection = (sectionId, headerHeight = 80) => {
    const element = document.querySelector(sectionId);
    
    if (!element) {
        return;
    }

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
    });
};

