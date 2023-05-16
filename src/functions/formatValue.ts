import { MULTIPLE_SPACES_REGEX, NON_ALPHANUM_REGEX, WHITESPACE_AT_START_REGEX } from "../utils/regexConstants";

interface FormatValueProps {
    value: string;
    onlyAlphaNum?: boolean;
}

export const formatValue = ({ value, onlyAlphaNum }: FormatValueProps): string => {
    if (onlyAlphaNum) {
        return value.replace(NON_ALPHANUM_REGEX, '')
            .replace(MULTIPLE_SPACES_REGEX, ' ');
    } else {
        return value.replace(WHITESPACE_AT_START_REGEX, '')
            .replace(MULTIPLE_SPACES_REGEX, ' ');
    }
};
