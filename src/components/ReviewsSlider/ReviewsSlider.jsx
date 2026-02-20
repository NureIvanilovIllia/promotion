import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ReviewsSlider.module.scss";
import { SECTION_IDS } from "../../constants/navigation";
import { MAX_STAR_RATING } from "../../constants/app";
import { reviews } from "../../data/reviews";

const StarRating = ({ rating }) => {
    const stars = useMemo(
        () => Array.from({ length: MAX_STAR_RATING }, (_, i) => i + 1),
        []
    );

    return (
        <div className={styles.rating}>
            {stars.map((star) => (
                <span
                    key={star}
                    className={`${styles.star} ${
                        star <= rating ? styles.starFilled : ""
                    }`}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const ReviewsSlider = () => {

    return (
        <section id={SECTION_IDS.REVIEWS} className={styles.reviews}>
            <div className={styles.container}>
                <h2 className={styles.title}>Відгуки клієнтів</h2>

                <div className={styles.swiperWrapper}>
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        pagination={{
                            clickable: true,
                        }}
                        navigation={{
                            nextEl: `.${styles.swiperButtonNext}`,
                            prevEl: `.${styles.swiperButtonPrev}`,
                        }}
                        breakpoints={{
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                        className={styles.swiper}
                    >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id} className={styles.slide}>
                            <div className={styles.card}>
                                <div className={styles.speechBubble}>
                                    <p className={styles.reviewText}>
                                        {review.text}
                                    </p>
                                </div>
                                <div className={styles.cardInfo}>
                                    <StarRating rating={review.rating} />
                                    <p className={styles.reviewerName}>
                                        {review.name}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    </Swiper>
                    
                    <button
                        className={`${styles.swiperButton} ${styles.swiperButtonPrev}`}
                        aria-label="Попередній слайд"
                    ></button>
                    <button
                        className={`${styles.swiperButton} ${styles.swiperButtonNext}`}
                        aria-label="Наступний слайд"
                    ></button>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSlider;
