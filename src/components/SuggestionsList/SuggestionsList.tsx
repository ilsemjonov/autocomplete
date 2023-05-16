import { CharacterModel } from "../../models/CharacterModel";
import SuggestionsListItem from "../SuggestionsListItem/SuggestionsListItem";
import NoResultsFound from "../NoResultsFound/NoResultsFound";
import Loader from "../Loader/Loader";

import "./SuggestionsList.css";

type SuggestionsListProps = {
    suggestions: CharacterModel[];
    searchTerm: string;
    debouncedSearchTerm: string;
    activeIndex: number;
    onSelect: (selected: CharacterModel) => void;
    loading: boolean;
    isDropDownVisible: boolean;
};

const SuggestionsList: React.FC<SuggestionsListProps> = (props) => {
    const {
        suggestions,
        searchTerm,
        debouncedSearchTerm,
        activeIndex,
        onSelect,
        loading,
        isDropDownVisible
    } = props;

    if (!isDropDownVisible) return null;

    const isNoResultsVisible = searchTerm && debouncedSearchTerm && suggestions.length === 0 && !loading;
    const isListVisible = !loading && suggestions.length > 0;

    return (
        <div className="list-container">
            {isNoResultsVisible && (
                <NoResultsFound />
            )}
            {loading && (
                <Loader />
            )}
            {isListVisible && (
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
                            debouncedSearchTerm={debouncedSearchTerm}
                            isActive={index === activeIndex}
                            onSelect={() => onSelect(suggestion)}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
};

export default SuggestionsList;
