import React from "react";
import LocationMap from "../LocationMap/LocationMap";
import styles from "./ContactsSection.module.scss";
import { SECTION_IDS } from "../../constants/navigation";
import { CONTACT_INFO } from "../../constants/contacts";
import contactImage from "../../assets/images/contact-image.png";
import callIcon from "../../assets/icons/call.svg";
import emailIcon from "../../assets/icons/email.svg";
import markerIcon from "../../assets/icons/marker.svg";

const ContactsSection = () => {
    const contactItems = [
        {
            icon: callIcon,
            label: "Номер телефону",
            value: CONTACT_INFO.phone,
            alt: "Phone icon",
        },
        {
            icon: emailIcon,
            label: "Email",
            value: CONTACT_INFO.email,
            alt: "Email icon",
        },
        {
            icon: markerIcon,
            label: "Адреса",
            value: CONTACT_INFO.address,
            alt: "Location icon",
        },
    ];

    return (
        <section id={SECTION_IDS.CONTACTS} className={styles.contacts}>
            <div className={styles.backgroundImage}>
                <img src={contactImage} alt="Contact background" />
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.leftSection}>
                        <h2 className={styles.sectionTitle}>КОНТАКТИ</h2>
                        <p className={styles.description}>
                            Наші менеджери допоможуть з оформленням замовлення,
                            доставкою та підбором товарів.
                        </p>

                        <div className={styles.contactList}>
                            {contactItems.map((item, index) => (
                                <div key={index} className={styles.contactItem}>
                                    <div className={styles.contactIcon}>
                                        <img src={item.icon} alt={item.alt} />
                                    </div>
                                    <div className={styles.contactInfo}>
                                        <span className={styles.contactLabel}>
                                            {item.label}
                                        </span>
                                        <p className={styles.contactValue}>
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <LocationMap />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactsSection;
