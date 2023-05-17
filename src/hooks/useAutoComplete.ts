import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { CharacterModel } from "../models/CharacterModel";
import { useDebouncedFetch } from "./useDebouncedFetch";
import { defaultFormatter } from "../functions/defaultFormatter";

const searchApiUrl = process.env.REACT_APP_SEARCH_API_URL;

interface AutocompleteHookProps {
    onSelect: (selected: CharacterModel) => void;
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
}

interface Response<T> {
    results: T;
}

export const useAutocomplete = (props: AutocompleteHookProps): AutocompleteHook => {
    const {
        onSelect,
        formatter = defaultFormatter,
        delay = 0,
        enableHighlight: isHighlightEnabled = true
    } = props;

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<CharacterModel[] | undefined>(undefined);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [urlSearchTerm, setUrlSearchTerm] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const prevScrollTopRef = useRef<number>(0);

    const encodedSearchTerm = encodeURIComponent(urlSearchTerm);

    const fetchUrl = urlSearchTerm && searchTerm !== selectedItem
        ? `${searchApiUrl}/api/character/?name=${encodedSearchTerm}&page=${page}`
        : '';

    const { error, loading, data } = useDebouncedFetch<Response<CharacterModel[]>>(fetchUrl, delay);
    const { results } = data || {};

    const handleSelect = (selected: CharacterModel) => {
        setSearchTerm(selected.name);
        setSelectedItem(selected.name);
        setSuggestions(undefined);
        setPage(1);
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
        setPage(1);
        setSuggestions(undefined);
        if (urlSearchTerm === '') {
            setSuggestions(undefined);
        }
    }, [urlSearchTerm]);

    useEffect(() => {
        setUrlSearchTerm(searchTerm.toLowerCase().trim());
        if (searchTerm !== selectedItem) setSelectedItem('');
    }, [searchTerm, selectedItem])

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

    const handleDropdownScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollTop && clientHeight && scrollTop + clientHeight === scrollHeight) {
            if (prevScrollTopRef.current !== scrollTop) {
                setPage(prevPage => prevPage + 1);
                prevScrollTopRef.current = scrollTop;
            }
        }
    }, []);

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
        handleDropdownScroll
    }
};