// Утилиты для работы с LocalStorage
export const getItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage:`, error);
    return null;
  }
};

export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item to localStorage:`, error);
  }
};

export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from localStorage:`, error);
  }
};
