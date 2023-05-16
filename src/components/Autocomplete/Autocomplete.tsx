import { CharacterModel } from "../../models/CharacterModel";
import SuggestionsList from "../SuggestionsList/SuggestionsList";
import { useAutocomplete } from "./useAutoComplete";

import "./Autocomplete.css";

interface AutocompleteProps {
    onSelect: (selected: CharacterModel) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
    const {
        searchTerm,
        debouncedSearchTerm,
        suggestions,
        activeIndex,
        loading,
        noResults,
        inputRef,
        onInputChange,
        onKeyDown,
        handleSelect
    } = useAutocomplete({ onSelect });

    return (
        <div className="autocomplete-container">
            <label htmlFor="autocomplete-input">Search for suggestions:</label>
            <span />
            <input
                id="autocomplete-input"
                ref={inputRef}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label="Search for suggestions"
                aria-autocomplete="list"
                autoFocus
            />
            <SuggestionsList
                suggestions={suggestions}
                debouncedSearchTerm={debouncedSearchTerm}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                loading={loading}
                noResults={noResults}
            />
        </div>
    );
}

export default Autocomplete;
