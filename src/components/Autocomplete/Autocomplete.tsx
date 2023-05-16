import { lazy, Suspense } from 'react';
import { CharacterModel } from '../../models/CharacterModel';
import { useAutocomplete } from '../../hooks/useAutoComplete';

import './Autocomplete.css';

const SuggestionsList = lazy(() => import('../SuggestionsList/SuggestionsList'));

interface AutocompleteProps {
    onSelect: (selected: CharacterModel) => void;
    formatter?: (value: string) => string;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect, formatter }) => {
    const {
        searchTerm,
        suggestions,
        activeIndex,
        loading,
        inputRef,
        onInputChange,
        onKeyDown,
        handleSelect
    } = useAutocomplete({ onSelect, formatter });

    return (
        <div className='autocomplete-container'>
            <label htmlFor='autocomplete-input'>Search for suggestions:</label>
            <span />
            <input
                id='autocomplete-input'
                ref={inputRef}
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label='Search for suggestions'
                aria-autocomplete='list'
                autoFocus
            />
            {searchTerm && (
                <Suspense>
                    <SuggestionsList
                        suggestions={suggestions}
                        searchTerm={searchTerm}
                        activeIndex={activeIndex}
                        onSelect={handleSelect}
                        loading={loading}
                    />
                </Suspense>
            )}
        </div>
    );
}

export default Autocomplete;
