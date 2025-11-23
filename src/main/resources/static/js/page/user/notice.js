import { apiUtil } from "/js/common/apiUtil.js";
import { loadLanguageFile, applyI18nTexts } from "/js/i18n/i18n.js";

document.addEventListener("DOMContentLoaded", initNotice);

async function initNotice() {
    await loadLanguageFile();
    applyI18nTexts();

    initEvents();
}

function initEvents() {
    const checkAll = document.getElementById("checkAll");
    const list = document.getElementById("noticeList");
    const btnRead = document.getElementById("btnRead");

    checkAll.addEventListener("change", () => {
        const checked = checkAll.checked;
        const items = document.querySelectorAll(".notice-check");

        items.forEach(chk => chk.checked = checked);
        refreshSelectedCount();
    });

    list.addEventListener("change", (e) => {
        if (!e.target.classList.contains("notice-check")) return;
        refreshSelectedCount();
    });

    btnRead.addEventListener("click", markSelectedAsRead);
}

function refreshSelectedCount() {
    const selected = document.querySelectorAll(".notice-check:checked");
    const selectedCountBox = document.getElementById("selectedCountBox");
    const selectedCount = document.getElementById("selectedCount");
    const btnRead = document.getElementById("btnRead");

    const count = selected.length;
    selectedCount.textContent = count;

    if (count > 0) {
        selectedCountBox.classList.remove("hidden");
        btnRead.disabled = false;
        btnRead.classList.add("enabled");
    } else {
        selectedCountBox.classList.add("hidden");
        btnRead.disabled = true;
        btnRead.classList.remove("enabled");
    }

    const all = document.querySelectorAll(".notice-check");
    document.getElementById("checkAll").checked = count === all.length;
}

async function markSelectedAsRead() {
    const selected = [...document.querySelectorAll(".notice-check:checked")];
    if (selected.length === 0) return;

    const ids = selected.map(chk => chk.dataset.id);

    try {
        await apiUtil.patch("/user/notification/read", { ids });

        ids.forEach(id => {
            const item = document.querySelector(`.notice-check[data-id='${id}']`)
                .closest(".notice-item");
            item.classList.remove("unread");
        });

        document.getElementById("checkAll").checked = false;
        document.querySelectorAll(".notice-check").forEach(c => c.checked = false);
        refreshSelectedCount();

    } catch (err) {
        console.error(err);
        alert("읽음 처리 실패");
    }
}
