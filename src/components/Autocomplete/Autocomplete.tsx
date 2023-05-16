import { CharacterModel } from "../../models/CharacterModel";
import SuggestionsList from "../SuggestionsList/SuggestionsList";
import { useAutocomplete } from "../../hooks/useAutoComplete";

import "./Autocomplete.css";

interface AutocompleteProps {
    onSelect: (selected: CharacterModel) => void;
    onlyAlphaNum?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect, onlyAlphaNum }) => {
    const {
        searchTerm,
        debouncedSearchTerm,
        suggestions,
        activeIndex,
        loading,
        isDropDownVisible,
        inputRef,
        onInputChange,
        onKeyDown,
        handleSelect
    } = useAutocomplete({ onSelect, onlyAlphaNum });

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
                searchTerm={searchTerm}
                debouncedSearchTerm={debouncedSearchTerm}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                loading={loading}
                isDropDownVisible={isDropDownVisible}
            />
        </div>
    );
}

export default Autocomplete;
