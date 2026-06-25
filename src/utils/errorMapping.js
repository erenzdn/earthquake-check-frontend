export const FIELD_LABELS_TR = {
    yearBuilt: "Yapım Yılı",
    buildingAge: "Yapım Yılı",
    floorCount: "Kat Sayısı",
    address: "Adres",
    buildingType: "Bina Tipi",
    latitude: "Enlem",
    longitude: "Boylam"
};

export function toUserFriendlyFieldErrors(details) {
    if (!details || typeof details !== "object" || Array.isArray(details)) {
        return {};
    }

    return Object.entries(details).reduce((acc, [field, message]) => {
        const normalizedField = field === "buildingAge" ? "yearBuilt" : field;
        const normalizedMessage = Array.isArray(message)
            ? message.filter(Boolean).join(", ")
            : String(message || "").trim();

        if (!normalizedMessage) {
            return acc;
        }

        const label = FIELD_LABELS_TR[normalizedField] || normalizedField;
        acc[normalizedField] = `${label}: ${normalizedMessage}`;
        return acc;
    }, {});
}

export function getGeneralErrorMessage(err) {
    const status = err?.status;

    if (status === 400) {
        return "Gonderilen bilgiler dogrulanamadi. Lutfen alanlari kontrol edin.";
    }

    if (typeof status === "number" && status >= 500) {
        return "Sunucu tarafinda gecici bir hata olustu. Lutfen tekrar deneyin.";
    }

    return "Islem sirasinda bir hata olustu. Lutfen tekrar deneyin.";
}
