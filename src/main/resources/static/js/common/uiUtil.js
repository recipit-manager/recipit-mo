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

    showModal(message, {title = null, onClose = null, confirmText = null, success = false } = {}) {
        let $modal = document.getElementById("globalModal");

        if (!$modal) {
            $modal = document.createElement("div");
            $modal.id = "globalModal";
            $modal.className = "modal-overlay";
            $modal.innerHTML = `
                <div class="modal-box">
                    <h3 id="modalTitle"></h3>
                    <p id="modalMsg"></p>
                    <button id="modalClose" class="btn-small"></button>
                </div>
            `;
            document.body.appendChild($modal);
        }

        const $title = document.getElementById("modalTitle");
        if (title) {
            $title.style.display = "block";
            $title.textContent = title;
        } else {
            $title.style.display = "none";
        }

        document.getElementById("modalMsg").textContent = message;
        const $close = document.getElementById("modalClose");
        $close.textContent = confirmText
            ? confirmText
            : translate("common.confirm");

        $modal.style.display = "flex";

        $close.onclick = () => {
            $modal.style.display = "none";
            if (onClose) { onClose() }
        };

        applyI18nTexts();
    },

    showDraftLimitModal() {
        let $modal = document.getElementById("draftLimitModal");

        if (!$modal) {
            $modal = document.createElement("div");
            $modal.id = "draftLimitModal";
            $modal.className = "modal-overlay";

            $modal.innerHTML = `
            <div class="modal-box">
                <p data-i18n="ui.draftLimit.msg"></p>

                <div class="modal-btn-group">
                    <button id="draftManageBtn" class="btn-small" data-i18n="ui.draftLimit.manage"></button>
                    <button id="draftContinueBtn" class="btn-small gray" data-i18n="ui.draftLimit.continue"></button>
                </div>
            </div>
        `;

            document.body.appendChild($modal);
        }

        $modal.style.display = "flex";

        const $manage = document.getElementById("draftManageBtn");
        const $continue = document.getElementById("draftContinueBtn");

        $manage.onclick = () => {
            $modal.style.display = "none";
            alert("개발 진행중입니다.")
            // window.location.href = "/myPage/recipe/draft";
        };

        $continue.onclick = () => {
            $modal.style.display = "none";
            window.location.href = "/home/recipe/upload";
        };

        applyI18nTexts();
    },

    showConfirmModal(message, {
        title = null,
        confirmText = translate("common.confirm"),
        cancelText = translate("common.cancel"),
        onConfirm = null,
        onCancel = null
    } = {}) {
        let $modal = document.getElementById("globalConfirmModal");

        if (!$modal) {
            $modal = document.createElement("div");
            $modal.id = "globalConfirmModal";
            $modal.className = "modal-overlay";

            $modal.innerHTML = `
            <div class="modal-box">
                <h3 id="confirmModalTitle"></h3>
                <p id="confirmModalMsg"></p>

                <div class="modal-btn-group">
                    <button id="confirmModalCancel" class="btn-small-gray"></button>
                    <button id="confirmModalOk" class="btn-small"></button>
                </div>
            </div>
        `;
            document.body.appendChild($modal);
        }

        const $title = document.getElementById("confirmModalTitle");
        if (title) {
            $title.style.display = "block";
            $title.textContent = title;
        } else {
            $title.style.display = "none";
        }

        document.getElementById("confirmModalMsg").textContent = message;

        const $cancel = document.getElementById("confirmModalCancel");
        const $ok = document.getElementById("confirmModalOk");

        $cancel.textContent = cancelText;
        $ok.textContent = confirmText;

        $modal.style.display = "flex";

        $cancel.onclick = () => {
            $modal.style.display = "none";
            if (onCancel) onCancel();
        };

        $ok.onclick = () => {
            $modal.style.display = "none";
            if (onConfirm) onConfirm();
        };

        applyI18nTexts();
    }

};
