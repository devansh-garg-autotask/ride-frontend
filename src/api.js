import axios from "axios";

// =====================================================
// CONFIG
// =====================================================

const BASE_URL =
    "https://ride-log-backend.onrender.com";

// =====================================================
// FETCH LOCATION
// =====================================================

export async function getLocation() {

    try {

        const response = await axios.get(
            `${BASE_URL}/location`
        );

        return response.data.data;

    } catch (error) {

        console.error(
            "❌ getLocation error:",
            error
        );

        return null;
    }
}

// =====================================================
// FETCH RIDE LOGS
// =====================================================

export async function getRideLogs(
    date = ""
) {

    try {

        let url =
            `${BASE_URL}/ride/logs`;

        if (date) {
            url += `?date=${date}`;
        }

        const response =
            await axios.get(url);

        // =========================================
        // MERGE USING KEY
        // =========================================

        const map = new Map();

        response.data.data.forEach(log => {

            if (log.key) {
                map.set(log.key, log);
            } else {
                map.set(log._id, log);
            }
        });

        return Array.from(map.values());

    } catch (error) {

        console.error(
            "❌ getRideLogs error:",
            error
        );

        return [];
    }
}

export async function getAppStatus() {

    try {

        const response = await axios.get(
            `${BASE_URL}/app-status`
        );

        return response.data.data;

    } catch (error) {

        console.error(
            "❌ getAppStatus error:",
            error
        );

        return null;
    }
}

export async function getBreakLogs(date = "") {

    try {

        let url = `${BASE_URL}/break/logs`;

        // 🔹 Add date query if provided
        if (date) {
            url += `?date=${date}`;
        }

        const response = await axios.get(url);

        return response.data.data || [];

    } catch (error) {

        console.error(
            "❌ getBreakLogs error:",
            error
        );

        return [];
    }
}