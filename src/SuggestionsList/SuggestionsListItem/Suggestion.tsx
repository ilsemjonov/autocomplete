import { highlightParts } from "../../functions/highlightParts";
import { CharacterModel } from "../../models/CharacterModel";

type SuggestionProps = {
    suggestion: CharacterModel;
    debouncedValue: string;
};

const Suggestion: React.FC<SuggestionProps> = ({ suggestion, debouncedValue }) => {
    const highlightedName = highlightParts(suggestion.name, debouncedValue);
    return <span>{highlightedName}</span>;
};

export default Suggestion;
