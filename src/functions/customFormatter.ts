import { NON_ALPHANUM_REGEX } from "../utils/regexConstants";

export const customFormatter = (value: string): string => {
    return value
        .trimStart()
        .replace(NON_ALPHANUM_REGEX, '');
};
