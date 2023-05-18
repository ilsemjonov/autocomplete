import { lazy, Suspense } from 'react';

import { CharacterModel } from '../../models/CharacterModel';
import { useAutocomplete } from '../../hooks/useAutoComplete';

import './Autocomplete.css';

const SuggestionsList = lazy(() => import('../SuggestionsList/SuggestionsList'));

interface AutocompleteProps {
    id: string;
    onSelect: (selected: CharacterModel) => void;
    searchUrl: string;
    searchParameterName: string;
    paginationParameterName: string;
    formatter?: (value: string) => string;
    delay?: number;
    enableHighlight?: boolean;
    placeholder?: string;
    ariaLabel?: string;
};

const Autocomplete: React.FC<AutocompleteProps> = (props) => {
    const {
        id,
        onSelect,
        searchUrl,
        searchParameterName,
        paginationParameterName,
        formatter,
        delay,
        enableHighlight,
        placeholder = '',
        ariaLabel = 'Search input'
    } = props;

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
        handleDropdownScroll,
        isItemSelected,
        inputRef
    } = useAutocomplete({
        onSelect,
        searchUrl,
        searchParameterName,
        paginationParameterName,
        formatter,
        delay,
        enableHighlight
    });

    return (
        <div className='autocomplete-container'>
            <label htmlFor={id}>{ariaLabel}</label>
            <span />
            <input
                ref={inputRef}
                id={id}
                placeholder={placeholder}
                value={searchTerm}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label={ariaLabel}
                type='text'
                role="search"
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
                    isItemSelected={isItemSelected}
                />
            </Suspense>
        </div>
    );
}

export default Autocomplete;
