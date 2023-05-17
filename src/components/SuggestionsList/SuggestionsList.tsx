import { MutableRefObject, forwardRef } from "react";

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
    ref?: MutableRefObject<HTMLDivElement | null>;
    handleDropdownScroll: (e: any) => void;
};

const SuggestionsList: React.ForwardRefRenderFunction<
    HTMLDivElement,
    SuggestionsListProps
> = (props, ref) => {
    const {
        suggestions,
        searchTerm,
        activeIndex,
        onSelect,
        loading,
        isHighlightEnabled,
        handleDropdownScroll
    } = props;

    const isNoResults = suggestions?.length === 0 && !loading;

    return (
        <div ref={ref} className="list-container" onScroll={handleDropdownScroll}>
            <ul
                id="suggestions-list"
                role="listbox"
                aria-labelledby="autocomplete-input"
                aria-expanded={(suggestions && suggestions.length > 0) || false}
            >
                {suggestions && suggestions.map((suggestion, index) => (
                    <SuggestionsListItem
                        key={suggestion.id}
                        suggestion={suggestion}
                        searchTerm={searchTerm}
                        isActive={index === activeIndex}
                        onSelect={() => onSelect(suggestion)}
                        isHighlightEnabled={isHighlightEnabled}
                    />
                ))}
                {loading && (
                    <Loader />
                )}
                {isNoResults && (
                    <NoResultsFound />
                )}
            </ul>
        </div>
    )
};

export default forwardRef<HTMLDivElement, SuggestionsListProps>(SuggestionsList);
