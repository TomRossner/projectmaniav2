import { IPasswordRegExp } from "./interfaces";

const SPACES_AND_DASHES_PATTERN: RegExp = /[\s\-]/g;

// Forms
const NAME_REGEX: RegExp = /([a-zA-Z]{2,16}-*)+/;
const EMAIL_REGEX: RegExp = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/;

// const PASSWORD_REGEX: IPasswordRegExp = {
//     MIN_LENGTH: 8,
//     LOWERCASE: /([a-z])+/,
//     UPPERCASE: /([A-Z])+/,
//     DIGIT: /(\d)+/,
//     SPECIAL_CHAR: /(\W)+/
// }

const PASSWORD_REGEX: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

const URL_REGEX: RegExp = /((?:https\:\/\/)|(?:http\:\/\/)|(?:www\.))?([a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(?:\??)[a-zA-Z0-9\-\._\?\,\'\/\\\+&%\$#\=~]+)/gi;

export {
    SPACES_AND_DASHES_PATTERN,
    NAME_REGEX,
    EMAIL_REGEX,
    PASSWORD_REGEX,
    URL_REGEX,
}