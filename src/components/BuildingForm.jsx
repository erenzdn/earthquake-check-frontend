import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

const MIN_YEAR = 1800;
const MAX_YEAR = 2026;
const MAX_FLOORS = 100;

const shakeAnimation = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.32 }
};

function sanitizeValue(value) {
  if (!value) {
    return "";
  }

  // Tehlikeli karakterleri ayıkla ve sadece rakam bırak.
  return value.replace(/[<>'";-]/g, "").replace(/\D/g, "");
}

function BuildingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    kat_sayisi: "",
    yapim_yili: ""
  });
  const [errors, setErrors] = useState({
    kat_sayisi: "",
    yapim_yili: ""
  });

  const yearNumber = useMemo(() => Number(formData.yapim_yili), [formData.yapim_yili]);
  const isYearOutOfRange =
    formData.yapim_yili.length === 4 &&
    (Number.isNaN(yearNumber) || yearNumber < MIN_YEAR || yearNumber > MAX_YEAR);

  const validateField = (name, value) => {
    if (name === "kat_sayisi") {
      if (!value) {
        return "Kat sayısı zorunludur.";
      }

      const numericValue = Number(value);
      if (Number.isNaN(numericValue) || numericValue < 0 || numericValue > MAX_FLOORS) {
        return `Kat sayısı 0-${MAX_FLOORS} aralığında olmalıdır.`;
      }
    }

    if (name === "yapim_yili") {
      if (!value) {
        return "Yapım yılı zorunludur.";
      }

      if (value.length !== 4) {
        return "Yapım yılı 4 haneli olmalıdır.";
      }

      const numericYear = Number(value);
      if (Number.isNaN(numericYear) || numericYear < MIN_YEAR || numericYear > MAX_YEAR) {
        return `Yapım yılı ${MIN_YEAR}-${MAX_YEAR} aralığında olmalıdır.`;
      }
    }

    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let cleanedValue = sanitizeValue(value);

    if (name === "kat_sayisi") {
      if (cleanedValue.length > 3) {
        cleanedValue = cleanedValue.slice(0, 3);
      }

      const parsed = Number(cleanedValue);
      if (!Number.isNaN(parsed) && parsed > MAX_FLOORS) {
        cleanedValue = String(MAX_FLOORS);
      }
    }

    if (name === "yapim_yili") {
      cleanedValue = cleanedValue.slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));

    const fieldError = validateField(name, cleanedValue);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const sanitizedPayload = {
      kat_sayisi: sanitizeValue(formData.kat_sayisi),
      yapim_yili: sanitizeValue(formData.yapim_yili)
    };

    const nextErrors = {
      kat_sayisi: validateField("kat_sayisi", sanitizedPayload.kat_sayisi),
      yapim_yili: validateField("yapim_yili", sanitizedPayload.yapim_yili)
    };

    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      return;
    }

    const payload = {
      kat_sayisi: Number(sanitizedPayload.kat_sayisi),
      yapim_yili: Number(sanitizedPayload.yapim_yili)
    };

    if (typeof onSubmit === "function") {
      onSubmit(payload);
      return;
    }

    console.info("[BuildingForm] submit payload:", payload);
  };

  const handleDigitOnlyKeyDown = (event) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End"
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handlePaste = (event, fieldName) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    let cleaned = sanitizeValue(pastedText);

    if (fieldName === "yapim_yili") {
      cleaned = cleaned.slice(0, 4);
    }

    if (fieldName === "kat_sayisi") {
      cleaned = cleaned.slice(0, 3);
      const parsed = Number(cleaned);
      if (!Number.isNaN(parsed) && parsed > MAX_FLOORS) {
        cleaned = String(MAX_FLOORS);
      }
    }

    setFormData((prev) => ({ ...prev, [fieldName]: cleaned }));
    setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, cleaned) }));
  };

  const yearInputInvalid = Boolean(errors.yapim_yili) || isYearOutOfRange;
  const floorInputInvalid = Boolean(errors.kat_sayisi);

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Bina Bilgileri</h2>
      <p className="mt-1 text-sm text-slate-500">
        Deprem analizi için yapı bilgilerinizi güvenli şekilde girin.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <motion.div animate={floorInputInvalid ? shakeAnimation : { x: 0 }}>
          <label htmlFor="kat_sayisi" className="mb-2 block text-sm font-medium text-slate-700">
            Kat Sayısı
          </label>
          <input
            id="kat_sayisi"
            name="kat_sayisi"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            value={formData.kat_sayisi}
            onChange={handleChange}
            onKeyDown={handleDigitOnlyKeyDown}
            onPaste={(event) => handlePaste(event, "kat_sayisi")}
            placeholder="Örn: 8"
            aria-invalid={floorInputInvalid}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-200 ${
              floorInputInvalid
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          {errors.kat_sayisi && <p className="mt-1 text-xs text-red-600">{errors.kat_sayisi}</p>}
        </motion.div>

        <motion.div animate={yearInputInvalid ? shakeAnimation : { x: 0 }}>
          <label htmlFor="yapim_yili" className="mb-2 block text-sm font-medium text-slate-700">
            Yapım Yılı
          </label>
          <input
            id="yapim_yili"
            name="yapim_yili"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={formData.yapim_yili}
            onChange={handleChange}
            onKeyDown={handleDigitOnlyKeyDown}
            onPaste={(event) => handlePaste(event, "yapim_yili")}
            placeholder="Örn: 2004"
            aria-invalid={yearInputInvalid}
            className={`w-full rounded-xl border px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-200 ${
              yearInputInvalid
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-indigo-500"
            }`}
          />
          {yearInputInvalid && (
            <p className="mt-1 text-xs text-red-600">
              {errors.yapim_yili || `Yapım yılı ${MIN_YEAR}-${MAX_YEAR} aralığında olmalıdır.`}
            </p>
          )}
        </motion.div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Kaydet ve Devam Et
        </button>
      </form>
    </div>
  );
}

export default BuildingForm;
