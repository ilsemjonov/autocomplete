import { CharacterModel } from "../../models/CharacterModel";
import SuggestionsListItem from "../SuggestionsListItem/SuggestionsListItem";
import NoResultsFound from "../NoResultsFound/NoResultsFound";
import Loader from "../Loader/Loader";

import "./SuggestionsList.css";

type SuggestionsListProps = {
    suggestions: CharacterModel[];
    debouncedSearchTerm: string;
    activeIndex: number;
    onSelect: (selected: CharacterModel) => void;
    loading: boolean;
    noResults: boolean;
};

const SuggestionsList: React.FC<SuggestionsListProps> = (props) => {
    const {
        suggestions,
        debouncedSearchTerm,
        activeIndex,
        onSelect,
        loading,
        noResults
    } = props;

    return <div className="list-container">
        {noResults && !loading && (
            <NoResultsFound />
        )}
        {loading && (
            <Loader />
        )}
        {!loading && suggestions.length > 0 && <ul
            id="suggestions-list"
            role="listbox"
            aria-labelledby="autocomplete-input"
            aria-expanded={suggestions.length > 0}
        >

            {suggestions.map((suggestion, index) => (
                <SuggestionsListItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    debouncedSearchTerm={debouncedSearchTerm}
                    isActive={index === activeIndex}
                    onSelect={() => onSelect(suggestion)}
                />
            ))}
        </ul>}
    </div>
};

export default SuggestionsList;
