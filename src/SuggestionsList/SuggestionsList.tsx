import { CharacterModel } from "../models/CharacterModel";
import SuggestionsListItem from "./SuggestionsListItem/SuggestionsListItem";

type SuggestionsListProps = {
    suggestions: CharacterModel[];
    debouncedValue: string;
    activeIndex: number;
    onSelect: (selected: CharacterModel) => void;
};

const SuggestionsList: React.FC<SuggestionsListProps> = ({
    suggestions,
    debouncedValue,
    activeIndex,
    onSelect,
}) => (
    <ul
        id="suggestions-list"
        role="listbox"
        aria-labelledby="autocomplete-input"
        aria-expanded={suggestions.length > 0}
    >
        {suggestions.map((suggestion, index) => (
            <SuggestionsListItem
                key={suggestion.id}
                suggestion={suggestion}
                debouncedValue={debouncedValue}
                isActive={index === activeIndex}
                onSelect={() => onSelect(suggestion)}
            />
        ))}
    </ul>
);

export default SuggestionsList;
