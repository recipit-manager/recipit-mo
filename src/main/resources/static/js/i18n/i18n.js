const DEFAULT_LANGUAGE = "KO";

let cache = {};

function getLanguage() {
    return localStorage.getItem("language") || DEFAULT_LANGUAGE;
}

export async function loadLanguageFile() {
    const language = getLanguage();

    if (cache[language]) { return cache[language]; }

    let file = `/js/i18n/messages.${language}.js`;

    try {
        const module = await import(file);
        cache[language] = module.default;
        return cache[language];
    } catch (e) {
        const koModule = await import('/js/i18n/messages.KO.js');
        cache["KO"] = koModule.default;
        return cache["KO"];
    }
}

function getByPath(obj, path) {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
}

function interpolate(str, params = {}) {
    return String(str).replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
        return params[k] != null ? params[k] : "";
    });
}

export function translate(key, params) {
    const dict = cache[getLanguage()];
    const val = getByPath(dict, key);
    return typeof val === "string" ? interpolate(val, params) : val;
}

export function applyI18nTexts() {
    document.querySelectorAll("[data-i18n]").forEach(($el) => {
        const key = $el.getAttribute("data-i18n");
        const params = $el.dataset.i18nParams
            ? JSON.parse($el.dataset.i18nParams)
            : undefined;

        const text = translate(key, params);
        if (text != null) {
            $el.textContent = text;
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(($el) => {
        const key = $el.getAttribute("data-i18n-placeholder");
        const text = translate(key);
        if (text != null) {
            $el.setAttribute("placeholder", text);
        }
    });
}