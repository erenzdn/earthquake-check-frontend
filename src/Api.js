const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const API_URL_DEV = `${API_BASE_URL}/api`;
const BUILDING_EVALUATION_URL = `${API_BASE_URL}/api/building/evaluate`;



export async function fetchLocationFromAddress(address) {
    const formdata = new FormData();    
    formdata.append("address", address);
    const response = await fetch(`${API_URL_DEV}/geolocation/coordinates`, {
        method: "POST",
        body: formdata
    });

    //return type json {latitude: number, longitude: number}

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
        // Frontend standardi: backend'e ana alan olarak yearBuilt gonderilir.
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
    console.debug("[fetchEvaluation] submit payload:", payload);

    const response = await fetch(BUILDING_EVALUATION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    console.debug("[fetchEvaluation] response status:", response.status);
    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    if (!response.ok) {
        console.error("[fetchEvaluation] error response body:", data);
        console.error("[fetchEvaluation] error details:", data?.details);
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
