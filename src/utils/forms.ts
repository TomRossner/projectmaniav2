import { PASSWORD_REGEX } from "./regexp";

const {
    MIN_LENGTH,
    LOWERCASE,
    UPPERCASE,
    DIGIT,
    SPECIAL_CHAR
} = PASSWORD_REGEX;


// For Sign-up form
const isValidPassword_SignUp = (password: string): boolean => {
    return (
        password.length >= MIN_LENGTH)
        && (LOWERCASE.test(password))
        && (UPPERCASE.test(password))
        && (DIGIT.test(password))
        && (SPECIAL_CHAR.test(password)
    ) ? true : false;
}


// For Login form

const isValidPassword_Login = (password: string): boolean => {
    return password.length ? true : false;
}

const isValidPasswordPattern = (password: string): boolean => {
    return (
        password.length >= MIN_LENGTH)
        && (LOWERCASE.test(password))
        && (UPPERCASE.test(password))
        && (DIGIT.test(password))
        && (SPECIAL_CHAR.test(password)
    ) ? true : false;
}

export {
    isValidPassword_Login,
    isValidPassword_SignUp,
    isValidPasswordPattern
}