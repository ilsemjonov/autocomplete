import { highlightParts } from "../../functions/highlightParts";
import { CharacterModel } from "../../models/CharacterModel";

import "./Suggestion.css";

type SuggestionProps = {
    suggestion: CharacterModel;
    searchTerm: string;
};

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, searchTerm }) => {
    const highlightedName = highlightParts(suggestion.name, searchTerm);

    return <span>{highlightedName}</span>;
};

export default Suggestion;
