import { highlightParts } from "../../functions/highlightParts";
import { CharacterModel } from "../../models/CharacterModel";

import "./Suggestion.css";

type SuggestionProps = {
    suggestion: CharacterModel;
    searchTerm: string;
    isHighlightEnabled: boolean;
};

const Suggestion: React.FC<SuggestionProps> = (props) => {
    const { suggestion, searchTerm, isHighlightEnabled } = props;

    if (isHighlightEnabled) {
        const highlightedName = highlightParts(suggestion.name, searchTerm);

        return <span>{highlightedName}</span>;
    } else {
        return <span>{suggestion.name}</span>;
    }
};

export default Suggestion;
