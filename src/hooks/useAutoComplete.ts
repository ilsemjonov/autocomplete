import { useEffect, useState } from "react";

import { CharacterModel } from "../models/CharacterModel";
import { useDebouncedFetch } from "./useDebouncedFetch";
import { defaultFormatter } from "../functions/defaultFormatter";

const searchApiUrl = process.env.REACT_APP_SEARCH_API_URL;

interface AutocompleteHookProps {
    onSelect: (selected: CharacterModel) => void;
    formatter?: (value: string) => string;
}

interface AutocompleteHook {
    searchTerm: string;
    suggestions: CharacterModel[] | undefined;
    activeIndex: number;
    loading: boolean;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSelect: (selected: CharacterModel) => void;
}

interface Response<T> {
    results: T;
}

export const useAutocomplete = ({ onSelect, formatter = defaultFormatter }: AutocompleteHookProps): AutocompleteHook => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<CharacterModel[] | undefined>(undefined);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [urlSearchTerm, setUrlSearchTerm] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');

    const encodedUrl = urlSearchTerm && searchTerm !== selectedItem
        ? `${searchApiUrl}/api/character/?name=${encodeURIComponent(urlSearchTerm)}`
        : '';

    const { error, loading, data } = useDebouncedFetch<Response<CharacterModel[]>>(encodedUrl, 500);
    const { results } = data || {};

    const handleSelect = (selected: CharacterModel) => {
        setSearchTerm(selected.name);
        setSuggestions(undefined);
        setSelectedItem(selected.name);
        onSelect(selected);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(formatter(event.target.value));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "Enter":
                if (suggestions?.length && suggestions?.length > 0 && activeIndex >= 0) {
                    event.preventDefault();
                    handleSelect(suggestions[activeIndex]);
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                } else {
                    if (suggestions?.length)
                        setActiveIndex(suggestions.length - 1);
                }
                break;
            case "ArrowDown":
                event.preventDefault();
                if (suggestions?.length && activeIndex < suggestions.length - 1) {
                    setActiveIndex(activeIndex + 1);
                } else {
                    setActiveIndex(0);
                }
                break;
            case "Escape":
                event.preventDefault();
                setSuggestions(undefined);
                setActiveIndex(-1);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        setActiveIndex(-1);
        if (urlSearchTerm === '') {
            setSuggestions(undefined);
        }
    }, [urlSearchTerm]);

    useEffect(() => {
        setUrlSearchTerm(searchTerm.toLowerCase().trim());
        if (searchTerm !== selectedItem) setSelectedItem('');
    }, [searchTerm, selectedItem])

    useEffect(() => {
        if (error) {
            setSuggestions([]);
        }
    }, [error])

    useEffect(() => {
        if (results) {
            setSuggestions(
                results.sort((a: CharacterModel, b: CharacterModel) => a.name.localeCompare(b.name))
            );
        }
    }, [results])

    return {
        searchTerm,
        suggestions,
        activeIndex,
        loading,
        onInputChange,
        onKeyDown,
        handleSelect
    }
};