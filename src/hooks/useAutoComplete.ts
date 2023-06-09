import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { CharacterModel } from "../models/CharacterModel";
import { defaultFormatter } from "../functions/defaultFormatter";
import { useDebouncedAsync } from './useDebouncedAsync';
import { useAxiosLazyQuery } from './useAxiosLazyQuery';

interface AutocompleteHookProps {
    onSelect: (selected: CharacterModel) => void;
    searchUrl: string;
    searchParameterName: string;
    paginationParameterName: string;
    formatter?: (value: string) => string;
    delay?: number;
    enableHighlight?: boolean;
}

interface AutocompleteHook {
    searchTerm: string;
    suggestions: CharacterModel[] | undefined;
    activeIndex: number;
    loading: boolean;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSelect: (selected: CharacterModel) => void;
    isHighlightEnabled: boolean;
    dropdownRef: MutableRefObject<HTMLDivElement | null>;
    handleDropdownScroll: (e: any) => void;
    isItemSelected: boolean;
    inputRef: MutableRefObject<HTMLInputElement | null>
}

interface Response<T> {
    results: T;
}

export const useAutocomplete = (props: AutocompleteHookProps): AutocompleteHook => {
    const {
        onSelect,
        searchUrl,
        searchParameterName,
        paginationParameterName,
        formatter = defaultFormatter,
        delay = 0,
        enableHighlight: isHighlightEnabled = false
    } = props;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<CharacterModel[] | undefined>(undefined);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const prevScrollTopRef = useRef<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const { loading, error, data, executeFetch } = useAxiosLazyQuery<Response<CharacterModel[]>>();
    const { results } = data || {};

    const executeDebouncedFetch = useDebouncedAsync(executeFetch, delay);

    const resetState = useCallback(() => {
        setSuggestions(undefined);
        setActiveIndex(-1);
        setPage(1);
    }, [])

    useEffect(() => {
        if (searchTerm !== selectedItem) setSelectedItem('');

        const formattedSearchTerm = searchTerm.toLowerCase().trim();
        const encodedSearchTerm = encodeURIComponent(formattedSearchTerm);
        const fetchUrl = formattedSearchTerm && searchTerm !== selectedItem
            ? `${searchUrl}?${searchParameterName}=${encodedSearchTerm}&${paginationParameterName}=${page}`
            : '';

        executeDebouncedFetch(fetchUrl);
    }, [
        searchTerm,
        page,
        selectedItem,
        executeDebouncedFetch,
        searchUrl,
        searchParameterName,
        paginationParameterName
    ])

    useEffect(() => {
        if (error && page === 1) {
            setSuggestions([]);
        }
    }, [error, page])

    useEffect(() => {
        if (results) {
            setSuggestions((prevSuggestions) => {
                if (prevSuggestions) {
                    if (dropdownRef.current) {
                        dropdownRef.current.scrollTop = prevScrollTopRef.current;
                    }
                    return [
                        ...prevSuggestions,
                        ...results.sort((a: CharacterModel, b: CharacterModel) =>
                            a.name.localeCompare(b.name)
                        ),
                    ];
                } else {
                    return results.sort((a: CharacterModel, b: CharacterModel) =>
                        a.name.localeCompare(b.name)
                    );
                }
            });
        }
    }, [results])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                resetState();
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [resetState]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        const formattedValue = formatter(value);

        resetState();
        setSearchTerm(formattedValue);
    };

    const handleSelect = (selected: CharacterModel) => {
        resetState();
        setSearchTerm(selected.name);
        setSelectedItem(selected.name);
        onSelect(selected);
    };

    const handleDropdownScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        const isEndOfScroll = scrollTop && clientHeight && scrollTop + clientHeight === scrollHeight;

        if (isEndOfScroll) {
            if (prevScrollTopRef.current !== scrollTop) {
                setPage(prevPage => prevPage + 1);
                prevScrollTopRef.current = scrollTop;
            }
        }
    }, []);
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
                resetState();
                break;
            default:
                break;
        }
    };

    return {
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
        isItemSelected: !!selectedItem,
        inputRef
    }
};