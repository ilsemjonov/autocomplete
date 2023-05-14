import { CharacterModel } from "../models/CharacterModel";

import NoResultsFound from "../NoResultsFound/NoResultsFound";
import Loader from "../Loader/Loader";
import SuggestionsList from "../SuggestionsList/SuggestionsList";

import "./Autocomplete.css";
import { useAutocomplete } from "./useAutoComplete";

type AutocompleteProps = {
    onSelect: (selected: CharacterModel) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
    const {
        searchTerm,
        debouncedSearchTerm,
        suggestions,
        activeIndex,
        loading,
        inputRef,
        onInputChange,
        onKeyDown,
        handleSelect
    } = useAutocomplete({ onSelect });

    return (
        <div className="autocomplete">
            <label htmlFor="autocomplete-input">Search for suggestions:</label>
            <input
                id="autocomplete-input"
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label="Search for suggestions"
                aria-autocomplete="list"
                aria-controls="suggestions-list"
            />
            {debouncedSearchTerm && searchTerm && !loading && suggestions.length === 0 && (
                <NoResultsFound />
            )}
            {loading && (
                <Loader />
            )}
            {!loading && suggestions.length > 0 && (
                <SuggestionsList
                    suggestions={suggestions}
                    debouncedValue={debouncedSearchTerm}
                    activeIndex={activeIndex}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
}

export default Autocomplete;
