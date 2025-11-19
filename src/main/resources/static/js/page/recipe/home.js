import { translate, applyI18nTexts, loadLanguageFile } from "/js/i18n/i18n.js";

document.addEventListener("DOMContentLoaded", initHome);

async function initHome() {
    await loadLanguageFile();
    applyI18nTexts();
}