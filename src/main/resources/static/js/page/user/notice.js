import { apiUtil } from "/js/common/apiUtil.js";
import { formatUtil } from "/js/common/form/formatUtil.js";
import { loadLanguageFile, applyI18nTexts } from "/js/i18n/i18n.js";
import { log, responseCode , commonCode} from "/js/common/constants.js";

document.addEventListener("DOMContentLoaded", initNotice);

async function initNotice() {
    await loadLanguageFile();
    applyI18nTexts();

    initEvents();

    document.querySelectorAll("#noticeList .time").forEach($el => {
        $el.textContent = formatUtil.formatTime($el.textContent);
    });
}

function initEvents() {
    const $checkAll = document.getElementById("checkAll");
    const $noticeList = document.getElementById("noticeList");
    const $btnRead = document.getElementById("btnRead");

    $checkAll.addEventListener("change", () => {
        const checked = $checkAll.checked;
        const $items = document.querySelectorAll(".notice-check");

        $items.forEach(chk => chk.checked = checked);
        refreshSelectedCount();
    });

    $noticeList.addEventListener("change", (e) => {
        if (!e.target.classList.contains("notice-check")) {
            return;
        }

        refreshSelectedCount();
    });

    $noticeList.addEventListener("click", clickNotice);

    $btnRead.addEventListener("click", markSelectedAsRead);
}

function refreshSelectedCount() {
    const $selected = document.querySelectorAll(".notice-check:checked");
    const $selectedCountBox = document.getElementById("selectedCountBox");
    const $selectedCount = document.getElementById("selectedCount");
    const $btnRead = document.getElementById("btnRead");

    const count = $selected.length;
    $selectedCount.textContent = count;

    if (count > 0) {
        $selectedCountBox.classList.remove("hidden");
        $btnRead.disabled = false;
        $btnRead.classList.add("enabled");
    } else {
        $selectedCountBox.classList.add("hidden");
        $btnRead.disabled = true;
        $btnRead.classList.remove("enabled");
    }

    const $all = document.querySelectorAll(".notice-check");
    document.getElementById("checkAll").checked = count === $all.length;
}

async function markSelectedAsRead() {
    const $selected = [...document.querySelectorAll(".notice-check:checked")];
    if ($selected.length === 0) {
        return;
    }

    const notificationIdList = $selected.map(checked => checked.dataset.id);

    try {
        const data = await apiUtil.patch(apiUtil.url.USER.NOTICE_READ, notificationIdList);

        if (data.code === responseCode.SUCCESS) {
            notificationIdList.forEach(id => {
                const $item = document.querySelector(`.notice-check[data-id='${id}']`)
                    .closest(".notice-item");
                $item.classList.remove("unread");
            });

            document.getElementById("checkAll").checked = false;
            document.querySelectorAll(".notice-check").forEach($check => $check.checked = false);
            refreshSelectedCount();
        } else {
            console.error(log.NOTIFICATION_READ_FAILED, data);
        }
    } catch (e) {
        console.error(log.NOTIFICATION_READ_FAILED, e);
    }
}

function clickNotice(e) {
    const item = e.target.closest(".notice-item");
    if (!item || e.target.classList.contains("notice-check")) {
        return;
    }

    const noticeId = item.dataset.id;
    const type = item.dataset.type;
    const recipeNo = item.dataset.recipeNo;

    readNotice(noticeId, item);

    switch (type) {
        case commonCode.NOTICE_TYPE.DRAFT:
            window.location.href = "/myPage/recipe/draft";
            break;
        case commonCode.NOTICE_TYPE.USER_REACTION:
        case commonCode.NOTICE_TYPE.RECIPE_STATUS:
            if (recipeNo) {
                window.location.href = `/recipe/${recipeNo}`;
            }
            break;
        case commonCode.NOTICE_TYPE.REPORT:
            break;
        default:
            console.warn(log.UNKNOWN_NOTIFICATION_TYPE, item);
            break;
    }
}

async function readNotice(noticeId, itemElement) {
    try {
        const data = await apiUtil.patch(apiUtil.url.USER.NOTICE_READ, [noticeId]);

        if (data.code === responseCode.SUCCESS) {
            itemElement.classList.remove("unread");
        } else {
            console.error(log.NOTIFICATION_READ_FAILED, data);
        }
    } catch (e) {
        console.error(log.NOTIFICATION_READ_FAILED, e);
    }
}