

import { useEffect, useState } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    getLocation,
    getRideLogs
} from "./api";



delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function App() {

    const [location, setLocation] =
        useState(null);

    const [logs, setLogs] =
        useState([]);

    const [date, setDate] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    // =================================================
    // LOAD DATA
    // =================================================

    async function loadData(selectedDate = "") {

        try {

            setLoading(true);

            const latestLocation =
                await getLocation();

            const rideLogs =
                await getRideLogs(selectedDate);

            setLocation(latestLocation);

            setLogs(rideLogs);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    }

    // =================================================
    // AUTO REFRESH
    // =================================================

    useEffect(() => {

        loadData(date);

        const interval = setInterval(() => {
            loadData(date);
        }, 15000);

        return () => clearInterval(interval);

    }, [date]);

    return (

        <div style={containerStyle}>

            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}

            <div style={headerStyle}>

                <div>

                    <h1 style={titleStyle}>
                        Ride Dashboard
                    </h1>

                    <p style={subtitleStyle}>
                        Live Ride Monitoring
                    </p>

                </div>

                <div style={liveStyle}>
                    {
                        loading
                        ? "Refreshing..."
                        : "Live"
                    }
                </div>
            </div>

            {/* ===================================== */}
            {/* FILTER */}
            {/* ===================================== */}

            <div style={filterContainerStyle}>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                    style={inputStyle}
                />

                <button
                    onClick={() => loadData(date)}
                    style={buttonStyle}
                >
                    Filter
                </button>

                <button
                    onClick={() => {
                        setDate("");
                        loadData("");
                    }}
                    style={clearButtonStyle}
                >
                    Clear
                </button>
            </div>

            {/* ===================================== */}
            {/* MAP */}
            {/* ===================================== */}

            <div style={mapWrapperStyle}>

                <div style={sectionTitleStyle}>
                    Current Location
                </div>

                {
                    location ? (

                        <MapContainer
                            center={[
                                location.latitude,
                                location.longitude
                            ]}
                            zoom={15}
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                        >

                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                            />

                            <Marker
                                position={[
                                    location.latitude,
                                    location.longitude
                                ]}
                            >
                                <Popup>
                                    Driver Location
                                </Popup>
                            </Marker>

                        </MapContainer>

                    ) : (

                        <div style={emptyStyle}>
                            No location data
                        </div>
                    )
                }
            </div>

            {/* ===================================== */}
            {/* TABLE */}
            {/* ===================================== */}

            <div style={tableWrapperStyle}>

                <div style={sectionTitleStyle}>
                    Ride Logs
                </div>

                <div style={{
                    overflowX: "auto"
                }}>

                    <table style={tableStyle}>

                        <thead>

                            <tr style={theadStyle}>
                                <th style={thStyle}>
                                    Sr No
                                </th>

                                <th style={thStyle}>
                                    Key
                                </th>

                                <th style={thStyle}>
                                    App
                                </th>

                                <th style={thStyle}>
                                    Status
                                </th>

                                <th style={thStyle}>
                                    Info
                                </th>

                                <th style={thStyle}>
                                    Ride Appear
                                </th>

                                <th style={thStyle}>
                                    Ride Accept
                                </th>

                                <th style={thStyle}>
                                    Updated
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                logs.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={7}
                                            style={
                                                emptyTableStyle
                                            }
                                        >
                                            No ride logs
                                        </td>
                                    </tr>

                                ) : (

                                    logs.map((log, index) => (

                                        <tr
                                            key={
                                                log.key
                                                || log._id
                                            }
                                            style={trStyle}
                                        >

                                            <td style={tdStyle}>
                                                {index + 1}
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    log.key
                                                    || "-"
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {log.app}
                                            </td>

                                            <td style={tdStyle}>
                                                {log.status}
                                            </td>

                                            <td style={tdStyle}>
                                                {log.info}
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    log.rideAppearTime
                                                    ? new Date(
                                                        log.rideAppearTime
                                                      ).toLocaleString()
                                                    : "-"
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    log.rideAcceptanceTime
                                                    ? new Date(
                                                        log.rideAcceptanceTime
                                                      ).toLocaleString()
                                                    : "-"
                                                }
                                            </td>

                                            <td style={tdStyle}>
                                                {
                                                    new Date(
                                                        log.updatedAt
                                                    ).toLocaleString()
                                                }
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// =====================================================
// STYLES
// =====================================================

const containerStyle = {
    padding: 20,
    fontFamily: "Arial",
    background: "#f5f7fb",
    minHeight: "100vh"
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30
};

const titleStyle = {
    margin: 0,
    fontSize: 32
};

const subtitleStyle = {
    color: "#666",
    marginTop: 6
};

const liveStyle = {
    background: "black",
    color: "white",
    padding: "10px 18px",
    borderRadius: 12,
    fontWeight: "bold"
};

const filterContainerStyle = {
    display: "flex",
    gap: 12,
    marginBottom: 25,
    alignItems: "center"
};

const inputStyle = {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc"
};

const buttonStyle = {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "black",
    color: "white",
    cursor: "pointer"
};

const clearButtonStyle = {
    padding: "12px 20px",
    borderRadius: 10,
    border: "1px solid #ccc",
    background: "white",
    cursor: "pointer"
};

const mapWrapperStyle = {
    height: 450,
    background: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 30,
    boxShadow:
        "0 2px 10px rgba(0,0,0,0.05)"
};

const sectionTitleStyle = {
    padding: 20,
    fontSize: 20,
    fontWeight: "bold"
};

const emptyStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    color: "#666"
};

const tableWrapperStyle = {
    background: "white",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow:
        "0 2px 10px rgba(0,0,0,0.05)"
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
};

const theadStyle = {
    background: "#f1f3f5"
};

const thStyle = {
    padding: 16,
    textAlign: "left",
    fontSize: 14
};

const trStyle = {
    borderTop: "1px solid #eee"
};

const tdStyle = {
    padding: 16,
    fontSize: 14
};

const emptyTableStyle = {
    padding: 30,
    textAlign: "center",
    color: "#666"
};