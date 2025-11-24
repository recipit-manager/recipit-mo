import { translate } from "/js/i18n/i18n.js";

export const formatUtil = {
    parseGroups(formatStr) {
        if (!formatStr) {
            return [];
        }
        const parts = formatStr.split(/[^0-9]/).filter(Boolean);
        return parts.map((p) => p.length);
    },

    autoFormatNumber(digits, formatStr) {
        if (!formatStr) {
            return digits;
        }

        const groups = this.parseGroups(formatStr);
        let formatted = "";
        let idx = 0;

        for (let i = 0; i < groups.length; i++) {
            const groupLen = groups[i];
            const part = digits.slice(idx, idx + groupLen);
            formatted += part;
            idx += groupLen;

            if (idx < digits.length && i < groups.length - 1) {
                formatted += " ";
            }
        }
        return formatted.trim();
    },

    formatTime(isoString) {
        const date = new Date(isoString);

        const kr = new Date(date.getTime() + 9 * 60 * 60 * 1000);

        const month = kr.getMonth() + 1;
        const day = kr.getDate();

        let hours = kr.getHours();
        const minutes = kr.getMinutes().toString().padStart(2, "0");

        const isPM = hours >= 12;
        const period = translate(isPM ? "time.period.pm" : "time.period.am");

        hours = hours % 12 || 12;

        const monthSuffix = translate("time.date.month_suffix");
        const daySuffix   = translate("time.date.day_suffix");

        return `${month}${monthSuffix} ${day}${daySuffix} ${period} ${hours}:${minutes}`;
    }
};