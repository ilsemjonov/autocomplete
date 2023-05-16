import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CharacterModel } from "../models/CharacterModel";
import { ALPHANUM_REGEX, EMPTY_OR_SPACES_REGEX } from "../utils/regexConstants";
import { formatValue } from "../functions/formatValue";

const searchApiUrl = process.env.REACT_APP_SEARCH_API_URL;

interface AutocompleteHookProps {
    onSelect: (selected: CharacterModel) => void;
    onlyAlphaNum?: boolean;
}

interface AutocompleteHook {
    searchTerm: string;
    debouncedSearchTerm: string;
    suggestions: CharacterModel[];
    activeIndex: number;
    loading: boolean;
    isDropDownVisible: boolean;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSelect: (selected: CharacterModel) => void;
}

export const useAutocomplete = ({ onSelect, onlyAlphaNum = true }: AutocompleteHookProps): AutocompleteHook => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<CharacterModel[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isDropDownVisible, setIsDropDownVisible] = useState<boolean>(false);
    const [adjustedSearchTerm, setAdjustedSearchTerm] = useState<string>('')

    const inputRef = useRef<HTMLInputElement>(null);
    const lastSearchTermRef = useRef<string>(searchTerm);
    const timeoutIdRef = useRef<NodeJS.Timeout>();


    useLayoutEffect(() => {
        if (EMPTY_OR_SPACES_REGEX.test(adjustedSearchTerm)) {
            setSuggestions([]);
            setDebouncedSearchTerm('')
            setIsDropDownVisible(false);
        }
        lastSearchTermRef.current = adjustedSearchTerm;
    }, [adjustedSearchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm !== '')
            setIsDropDownVisible(true);
    }, [debouncedSearchTerm])


    useEffect(() => {
        setAdjustedSearchTerm(searchTerm.toLowerCase().trim())
    }, [searchTerm])

    const onSearch = useCallback((searchTerm: string) => {
        // if (ALPHANUM_REGEX.test(searchTerm)) {
        if (loading) {
            return;
        }
        setLoading(true);
        fetch(`${searchApiUrl}/api/character/?name=${searchTerm}`)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Network response was not ok");
                }
            })
            .then((data) => {
                const regex = new RegExp(`(${searchTerm})`, "gi");
                setSuggestions(
                    data.results
                        .map((character: CharacterModel) => ({
                            ...character,
                            searchTermIndex: character.name.search(regex),
                        }))
                        .sort((a: CharacterModel, b: CharacterModel) => a.name.localeCompare(b.name))
                );
            })
            .catch(() => {
                setSuggestions([]);
            })
            .finally(() => {
                setLoading(false);
            });
        // } else {
        //     setSuggestions([]);
        // }
    }, [loading, searchApiUrl])

    useLayoutEffect(() => {
        const debounce = (prevValue: string, value: string, delay: number) => {
            return new Promise<void>((resolve) => {
                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current);
                }
                timeoutIdRef.current = setTimeout(() => {
                    if (prevValue === value) {
                        setDebouncedSearchTerm(value);
                    }
                    resolve();
                }, delay);
            });
        };

        if (!EMPTY_OR_SPACES_REGEX.test(adjustedSearchTerm))
            debounce(lastSearchTermRef.current, adjustedSearchTerm, 500).then(() => {
                onSearch(adjustedSearchTerm);
            });

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adjustedSearchTerm]);

    const handleSelect = (selected: CharacterModel) => {
        setSearchTerm(selected.name);
        setSuggestions([]);
        onSelect(selected);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(formatValue({ value: event.target.value, onlyAlphaNum }));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "Enter":
                if (suggestions.length > 0 && activeIndex >= 0) {
                    event.preventDefault();
                    handleSelect(suggestions[activeIndex]);
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                } else {
                    setActiveIndex(suggestions.length - 1);
                }
                break;
            case "ArrowDown":
                event.preventDefault();
                if (activeIndex < suggestions.length - 1) {
                    setActiveIndex(activeIndex + 1);
                } else {
                    setActiveIndex(0);
                }
                break;
            case "Escape":
                event.preventDefault();
                setIsDropDownVisible(false);
                setActiveIndex(-1);
                break;
            default:
                break;
        }
    };

    return {
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
    }
};