import { lazy, Suspense } from 'react';

import { CharacterModel } from '../../models/CharacterModel';
import { useAutocomplete } from '../../hooks/useAutoComplete';

import './Autocomplete.css';

const SuggestionsList = lazy(() => import('../SuggestionsList/SuggestionsList'));

interface AutocompleteProps {
    onSelect: (selected: CharacterModel) => void;
    formatter?: (value: string) => string;
    delay?: number;
    enableHighlight?: boolean;
};

const Autocomplete: React.FC<AutocompleteProps> = (props) => {
    const { onSelect, formatter, delay, enableHighlight } = props;

    const {
        searchTerm,
        suggestions,
        activeIndex,
        loading,
        onInputChange,
        onKeyDown,
        handleSelect,
        isHighlightEnabled,
        dropdownRef,
        handleDropdownScroll
    } = useAutocomplete({ onSelect, formatter, delay, enableHighlight });

    return (
        <div className='autocomplete-container'>
            <label htmlFor='autocomplete-input'>Search for suggestions:</label>
            <span />
            <input
                id='autocomplete-input'
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label='Search for suggestions'
                aria-autocomplete='list'
                autoFocus
            />
            <Suspense fallback={null}>
                <SuggestionsList
                    ref={dropdownRef}
                    suggestions={suggestions}
                    searchTerm={searchTerm}
                    activeIndex={activeIndex}
                    onSelect={handleSelect}
                    loading={loading}
                    isHighlightEnabled={isHighlightEnabled}
                    handleDropdownScroll={handleDropdownScroll}
                />
            </Suspense>
        </div>
    );
}

export default Autocomplete;
