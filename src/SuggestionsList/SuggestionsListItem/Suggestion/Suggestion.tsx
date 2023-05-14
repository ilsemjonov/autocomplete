import { highlightParts } from "../../../functions/highlightParts";
import { CharacterModel } from "../../../models/CharacterModel";

import "./Suggestion.css";

type SuggestionProps = {
    suggestion: CharacterModel;
    debouncedSearchTerm: string;
};

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, debouncedSearchTerm }) => {
    const highlightedName = highlightParts(suggestion.name, debouncedSearchTerm);

    return <span>{highlightedName}</span>;
};

export default Suggestion;
