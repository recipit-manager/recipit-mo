export const COLORS = {
    ERROR: "#c00",
    SUCCESS: "#2e7d32",
    WARNING: "#555",
};

export const uiUtil = {
    showMsg($el, text, color = COLORS.ERROR) {
        if (!$el) return;
        $el.textContent = text || "";
        $el.style.color = color;
    },

    clearMsg($el) {
        if (!$el) return;
        $el.textContent = "";
    },

    showSuccess($el, text) {
        this.showMsg($el, text, COLORS.SUCCESS);
    },

    showWarning($el, text) {
        this.showMsg($el, text, COLORS.WARNING);
    },

    showModal(message, { onClose = null, confirmText = "확인", success = false } = {}) {
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
        $close.textContent = confirmText;
        $close.style.color = success ? COLORS.SUCCESS : COLORS.ERROR;

        modal.style.display = "flex";

        $close.onclick = () => {
            modal.style.display = "none";
            if (onClose) onClose();
        };
    }
};
