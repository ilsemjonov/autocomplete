import { CharacterModel } from "../../models/CharacterModel";
import SuggestionsListItem from "../SuggestionsListItem/SuggestionsListItem";
import NoResultsFound from "../NoResultsFound/NoResultsFound";
import Loader from "../Loader/Loader";

import "./SuggestionsList.css";

type SuggestionsListProps = {
    suggestions: CharacterModel[] | undefined;
    searchTerm: string;
    activeIndex: number;
    onSelect: (selected: CharacterModel) => void;
    loading: boolean;
    isHighlightEnabled: boolean;
};

const SuggestionsList: React.FC<SuggestionsListProps> = (props) => {
    const {
        suggestions,
        searchTerm,
        activeIndex,
        onSelect,
        loading,
        isHighlightEnabled
    } = props;

    if (!suggestions) return null;

    const isNoResults = suggestions.length === 0 && !loading;
    const isResults = !loading && suggestions.length > 0;

    return (
        <div className="list-container">
            {isNoResults && (
                <NoResultsFound />
            )}
            {loading && (
                <Loader />
            )}
            {isResults && (
                <ul
                    id="suggestions-list"
                    role="listbox"
                    aria-labelledby="autocomplete-input"
                    aria-expanded={suggestions.length > 0}
                >

                    {suggestions?.map((suggestion, index) => (
                        <SuggestionsListItem
                            key={suggestion.id}
                            suggestion={suggestion}
                            searchTerm={searchTerm}
                            isActive={index === activeIndex}
                            onSelect={() => onSelect(suggestion)}
                            isHighlightEnabled={isHighlightEnabled}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
};

export default SuggestionsList;
