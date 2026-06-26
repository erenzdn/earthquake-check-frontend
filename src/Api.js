const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const API_URL_DEV = `${API_BASE_URL}/api`;
const BUILDING_EVALUATION_URL = `${API_BASE_URL}/api/building/evaluate`;
const CONTACT_MESSAGES_URL = `${API_BASE_URL}/api/contact/messages`;

const isDev = process.env.NODE_ENV === "development";

function debugLog(...args) {
    if (isDev) {
        console.debug(...args);
    }
}

function debugError(...args) {
    if (isDev) {
        console.error(...args);
    }
}

async function parseJsonSafe(response) {
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
}

function buildApiError(response, data, fallbackMessage) {
    const errorMessage =
        data?.details ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null) ||
        fallbackMessage;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.details = data?.details || null;
    error.responseBody = data;
    return error;
}

export async function fetchLocationFromAddress(address) {
    const formdata = new FormData();
    formdata.append("address", address);
    const response = await fetch(`${API_URL_DEV}/geolocation/coordinates`, {
        method: "POST",
        body: formdata
    });

    return response.json();
}

function toOptionalNumber(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : null;
}

function toRequiredInt(value) {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? Math.trunc(numericValue) : null;
}

function toOptionalTrimmedString(value) {
    if (value === undefined || value === null) {
        return null;
    }

    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
}

function buildEvaluationPayload(rawPayload = {}) {
    const payload = {
        yearBuilt: toRequiredInt(rawPayload.yearBuilt),
        floorCount: toRequiredInt(rawPayload.floorCount),
        address: toOptionalTrimmedString(rawPayload.address),
        buildingType: toOptionalTrimmedString(rawPayload.buildingType),
        latitude: toOptionalNumber(rawPayload.latitude),
        longitude: toOptionalNumber(rawPayload.longitude)
    };

    return Object.fromEntries(
        Object.entries(payload).filter(([, value]) => value !== undefined)
    );
}

export async function fetchEvaluation(rawPayload) {
    const payload = buildEvaluationPayload(rawPayload);
    debugLog("[fetchEvaluation] submit payload:", payload);

    const response = await fetch(BUILDING_EVALUATION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    debugLog("[fetchEvaluation] response status:", response.status);
    const data = await parseJsonSafe(response);

    if (!response.ok) {
        debugError("[fetchEvaluation] error response body:", data);
        debugError("[fetchEvaluation] error details:", data?.details);
        const errorMessage =
            data?.message ||
            data?.error ||
            data?.errors?.[0]?.message ||
            (typeof data === "string" ? data : null) ||
            (response.status === 400
                ? "Gönderilen bilgiler geçersiz. Lütfen alanları kontrol edip tekrar deneyin."
                : "Sunucu hatası oluştu.");

        const error = new Error(errorMessage);
        error.status = response.status;
        error.details = data?.details || null;
        error.responseBody = data;
        throw error;
    }

    return data;
}

export async function submitContactMessage({ fullName, email, subject, message }) {
    const response = await fetch(CONTACT_MESSAGES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName, email, subject, message })
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
        let fallback = "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.";
        if (response.status === 400) {
            fallback = "Gönderilen bilgiler geçersiz. Lütfen alanları kontrol edin.";
        } else if (response.status === 429) {
            fallback = "Çok fazla mesaj gönderdiniz. Lütfen bir süre sonra tekrar deneyin.";
        }
        throw buildApiError(response, data, fallback);
    }

    return data;
}

export async function fetchAdminContactMessages(adminToken, page = 0, size = 10) {
    const response = await fetch(
        `${API_URL_DEV}/contact/admin/messages?page=${page}&size=${size}`,
        {
            headers: {
                "X-Admin-Token": adminToken
            }
        }
    );

    const data = await parseJsonSafe(response);

    if (!response.ok) {
        throw buildApiError(response, data, "Mesajlar yüklenemedi.");
    }

    return data;
}

export async function markContactMessageAsRead(adminToken, messageId) {
    const response = await fetch(`${API_URL_DEV}/contact/admin/messages/${messageId}/read`, {
        method: "PATCH",
        headers: {
            "X-Admin-Token": adminToken
        }
    });

    const data = await parseJsonSafe(response);

    if (!response.ok) {
        throw buildApiError(response, data, "Mesaj güncellenemedi.");
    }

    return data;
}
