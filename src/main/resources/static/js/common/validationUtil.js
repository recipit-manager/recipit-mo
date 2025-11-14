export const validationUtil = {
    isValidNickname(nick) {
        return /^[A-Za-z0-9가-힣]{2,8}$/.test(nick);
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidVerifyCode(verifyCode) {
        return /^[A-Z0-9]{8}$/.test(verifyCode);
    },

    isValidPassword(password) {
        const length = /^.{8,16}$/;
        const upper = /[A-Z]/;
        const lower = /[a-z]/;
        const number = /[0-9]/;
        const special = /[!@#$%^&*]/;
        const repeat = /(.)\1\1/;
        return (
            length.test(password) &&
            upper.test(password) &&
            lower.test(password) &&
            number.test(password) &&
            special.test(password) &&
            !repeat.test(password)
        );
    }
}