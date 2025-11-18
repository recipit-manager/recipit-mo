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
    }
};