import { MULTIPLE_SPACES_REGEX, NON_ALPHANUM_REGEX } from "../utils/regexConstants";

export const customFormatter = (value: string): string => {
    return value.replace(NON_ALPHANUM_REGEX, '')
        .replace(MULTIPLE_SPACES_REGEX, ' ');
};
