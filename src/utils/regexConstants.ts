export const SPACE_REGEX = /\s+/g;
export const WHITESPACE_AT_START_REGEX = /^\s+/;
export const HIGHLIGHT_REGEX = (searchTerm: string) => new RegExp(`(${searchTerm.replace(SPACE_REGEX, '|')})`, 'gi');
export const ALPHANUM_REGEX = /[A-Za-zА-Яа-я0-9]/;
export const NON_ALPHANUM_REGEX = /^\s+|[^A-Za-zА-Яа-я0-9\s]/g;
export const MULTIPLE_SPACES_REGEX = /\s{2,}/g;
export const EMPTY_OR_SPACES_REGEX = /^(\s+|)$/;