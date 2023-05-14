export const SPACE_REGEX = /\s+/g;
export const HIGHLIGHT_REGEX = (searchTerm: string) => new RegExp(`(${searchTerm.replace(SPACE_REGEX, '|')})`, 'gi');
export const ALPHABET_REGEX = /[a-zA-Z]/;
export const NON_ALPHABET_REGEX = /[^A-Za-z\s]/g;
export const MULTIPLE_SPACES_REGEX = /\s{2,}/g;