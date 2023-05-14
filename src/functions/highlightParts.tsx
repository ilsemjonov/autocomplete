// export const highlightParts = (name: string, searchTerm: string): React.ReactNode[] => {
//     const regex = new RegExp(`(${searchTerm})`, "gi");
//     const parts = name.split(regex);
//     return parts.reduce<React.ReactNode[]>((result, part, index) => {
//         if (index % 2 === 0) {
//             // Even parts are non-matching text
//             result.push(part);
//         } else {
//             // Odd parts are matching text, wrapped in a <span> with the "highlight" class
//             result.push(<span key={index} className="highlight">{part}</span>);
//         }
//         return result;
//     }, []);
// }

export const highlightParts = (name: string, searchTerm: string): React.ReactNode[] => {
    const regex = new RegExp(`(${searchTerm.replace(/\s+/g, '|')})`, 'gi');
    const parts = name.split(regex);

    return parts.reduce<React.ReactNode[]>((result, part, index) => {
        if (index % 2 === 0) {
            // Even parts are non-matching text
            result.push(part);
        } else {
            // Odd parts are matching text
            const isSpace = /\s+/.test(part);
            const className = isSpace ? '' : 'highlight';
            result.push(<span key={index} className={className}>{part}</span>);
        }
        return result;
    }, []);
};
