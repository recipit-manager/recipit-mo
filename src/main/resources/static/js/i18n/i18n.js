(function () {
    const DEFAULT_LANGUAGE = "KO";

    function getLanguage() {
        return localStorage.getItem("language") || DEFAULT_LANGUAGE;
    }

    function getDict() {
        const language = getLanguage();
        const languageFile = language === "EN" ? window.I18N_EN : window.I18N_KO;
        return languageFile || window.I18N_KO;
    }

    function getByPath(obj, path) {
        return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    }

    function interpolate(str, params = {}) {
        return String(str).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
            return params[k] != null ? params[k] : "";
        });
    }

    window.t = function t(key, params) {
        const dict = getDict();
        const val = getByPath(dict, key);
        return typeof val === "string" ? interpolate(val, params) : val;
    };

    window.applyI18nTexts = function applyI18nTexts() {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            const text = t(key);
            if (text != null) el.textContent = text;
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            const text = t(key);
            if (text != null) el.setAttribute("placeholder", text);
        });

    };
})();
