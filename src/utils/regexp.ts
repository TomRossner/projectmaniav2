import { IPasswordRegExp } from "./interfaces";

const SPACES_AND_DASHES_PATTERN: RegExp = /[\s\-]/g

// Forms
const NAME_REGEX: RegExp = /([a-zA-Z]{3,16}-*)+/;
const EMAIL_REGEX: RegExp = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/;

const PASSWORD_REGEX: IPasswordRegExp = {
    MIN_LENGTH: 8,
    LOWERCASE: /([a-z])+/,
    UPPERCASE: /([A-Z])+/,
    DIGIT: /(\d)+/,
    SPECIAL_CHAR: /(\W)+/
}

export {
    SPACES_AND_DASHES_PATTERN,
    NAME_REGEX,
    EMAIL_REGEX,
    PASSWORD_REGEX
}