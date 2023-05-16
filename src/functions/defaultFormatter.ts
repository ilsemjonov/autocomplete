import { MULTIPLE_SPACES_REGEX, WHITESPACE_AT_START_REGEX } from "../utils/regexConstants";

export const defaultFormatter = (value: string): string => {
    return value.replace(WHITESPACE_AT_START_REGEX, '')
        .replace(MULTIPLE_SPACES_REGEX, ' ');

};
