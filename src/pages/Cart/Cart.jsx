import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { useCart } from "../../hooks/useCart";
import styles from "./Cart.module.scss";

const Cart = () => {
    const navigate = useNavigate();
    const { cart, removeItem, updateQuantity, totalPrice } = useCart();

    const handleQuantityChange = (itemId, newQuantity) => {
        const quantity = parseInt(newQuantity, 10);
        if (!isNaN(quantity) && quantity > 0) {
            updateQuantity(itemId, quantity);
        }
    };

    const handleDecrease = (itemId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(itemId, currentQuantity - 1);
        } else {
            removeItem(itemId);
        }
    };

    const handleIncrease = (itemId, currentQuantity) => {
        updateQuantity(itemId, currentQuantity + 1);
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    if (cart.length === 0) {
        return (
            <div className={styles.cart}>
                <Header />
                <div className={styles.container}>
                    <h1 className={styles.title}>Кошик</h1>
                    <div className={styles.empty}>
                        <p className={styles.emptyText}>Ваш кошик порожній</p>
                        <Link to="/" className={styles.backLink}>
                            Повернутись до покупок
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.cart}>
            <Header />
            <div className={styles.container}>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Кошик</h1>
                    <Link to="/" className={styles.backLink}>
                        Повернутись до покупок
                    </Link>
                </div>

                <div className={styles.content}>
                    <div className={styles.items}>
                        {cart.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemInfo}>
                                    <h3 className={styles.itemTitle}>{item.title}</h3>
                                    <p className={styles.itemPrice}>
                                        {item.price.toFixed(2)}₴
                                    </p>
                                </div>

                                <div className={styles.itemControls}>
                                    <div className={styles.quantity}>
                                        <button
                                            type="button"
                                            className={styles.quantityButton}
                                            onClick={() => handleDecrease(item.id, item.quantity)}
                                            aria-label="Зменшити кількість"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            className={styles.quantityInput}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(item.id, e.target.value)
                                            }
                                            min="1"
                                            aria-label="Кількість"
                                        />
                                        <button
                                            type="button"
                                            className={styles.quantityButton}
                                            onClick={() => handleIncrease(item.id, item.quantity)}
                                            aria-label="Збільшити кількість"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className={styles.itemTotal}>
                                        {(item.price * item.quantity).toFixed(2)}₴
                                    </div>

                                    <button
                                        type="button"
                                        className={styles.removeButton}
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Видалити товар"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.summary}>
                        <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Всього:</span>
                            <span className={styles.summaryValue}>
                                {totalPrice.toFixed(2)}₴
                            </span>
                        </div>
                        <button
                            type="button"
                            className={styles.checkoutButton}
                            onClick={handleCheckout}
                        >
                            Оформити замовлення
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

