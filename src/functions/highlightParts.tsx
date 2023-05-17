import { HIGHLIGHT_REGEX, WHITESPACE_REGEX } from "../utils/regexConstants";

export const highlightParts = (name: string, searchTerm: string): React.ReactNode[] => {
    const regex = HIGHLIGHT_REGEX(searchTerm);
    const parts = name.split(regex);

    return parts.reduce<React.ReactNode[]>((result, part, index) => {
        if (index % 2 === 0) {
            // Even parts are non-matching text
            result.push(part);
        } else {
            // Odd parts are matching text
            const isSpace = WHITESPACE_REGEX.test(part);
            const className = isSpace ? '' : 'highlight';
            result.push(<span key={index} className={className}>{part}</span>);
        }
        return result;
    }, []);
};
