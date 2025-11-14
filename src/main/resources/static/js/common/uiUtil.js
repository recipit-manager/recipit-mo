import {applyI18nTexts, translate} from "/js/i18n/i18n.js";

export const COLORS = {
    ERROR: "#c00",
    SUCCESS: "#2e7d32",
    WARNING: "#555",
};

export const uiUtil = {
    showMsg($el, text, color = COLORS.ERROR) {
        if (!$el) { return; }
        $el.textContent = text || "";
        $el.style.color = color;
    },

    clearMsg($el) {
        if (!$el) { return; }
        $el.textContent = "";
    },

    showSuccess($el, text) {
        this.showMsg($el, text, COLORS.SUCCESS);
    },

    showWarning($el, text) {
        this.showMsg($el, text, COLORS.WARNING);
    },

    showModal(message, { onClose = null, confirmText = null, success = false } = {}) {
        let modal = document.getElementById("globalModal");

        if (!modal) {
            modal = document.createElement("div");
            modal.id = "globalModal";
            modal.className = "modal-overlay";
            modal.innerHTML = `
                <div class="modal-box">
                    <p id="modalMsg"></p>
                    <button id="modalClose" class="btn-small"></button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById("modalMsg").textContent = message;
        const $close = document.getElementById("modalClose");
        $close.textContent = confirmText
            ? confirmText
            : translate("common.confirm");

        modal.style.display = "flex";

        $close.onclick = () => {
            modal.style.display = "none";
            if (onClose) { onClose() }
        };

        applyI18nTexts();
    }
};
