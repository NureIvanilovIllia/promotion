import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import styles from "./LocationMap.module.scss";
import { CONTACT_INFO } from "../../constants/contacts";

// Исправление проблемы с отсутствующей иконкой маркера
const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMap = () => {

    return (
        <div className={styles.mapWrapper}>
            <MapContainer
                center={CONTACT_INFO.coordinates}
                zoom={CONTACT_INFO.mapZoom}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={CONTACT_INFO.coordinates}>
                    <Popup>{CONTACT_INFO.address}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default LocationMap;

