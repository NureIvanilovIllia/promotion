import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import styles from "./Success.module.scss";

/**
 * Страница успешного оформления заказа
 */
const Success = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={styles.success}>
            <Header />
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.icon}>✓</div>
                    <h1 className={styles.title}>
                        Замовлення успішно оформлено!
                    </h1>
                    <p className={styles.subtext}>
                        Наш менеджер зв'яжеться з вами найближчим часом
                    </p>
                    <button
                        type="button"
                        className={styles.button}
                        onClick={handleGoHome}
                    >
                        На головну
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;

