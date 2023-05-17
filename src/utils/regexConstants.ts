export const WHITESPACE_REGEX = /\s+/g;
export const NON_ALPHANUM_REGEX = /[^A-Za-zА-Яа-я0-9\s-]/g;

export const HIGHLIGHT_REGEX = (value: string) => new RegExp(`(${value.replace(WHITESPACE_REGEX, '|')})`, 'gi');