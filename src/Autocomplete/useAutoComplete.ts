import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CharacterModel } from "../models/CharacterModel";

interface AutocompleteHookProps {
    onSelect: (selected: CharacterModel) => void;
}

interface AutocompleteHook {
    searchTerm: string;
    debouncedSearchTerm: string;
    suggestions: CharacterModel[];
    activeIndex: number;
    loading: boolean;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    handleSelect: (selected: CharacterModel) => void;
}

export const useAutocomplete = ({ onSelect }: AutocompleteHookProps): AutocompleteHook => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<CharacterModel[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequestActive, setIsRequestActive] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const lastSearchTermRef = useRef<string>(searchTerm);
    const timeoutIdRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    useLayoutEffect(() => {
        if (searchTerm === "") {
            setSuggestions([]);
        }
        lastSearchTermRef.current = searchTerm;
    }, [searchTerm]);

    const onSearch = useCallback((searchTerm: string) => {
        const regex = /[a-zA-Z]/;
        if (regex.test(searchTerm)) {
            if (isRequestActive) { // check if a request is already active
                return;
            }
            setIsRequestActive(true); // set request active
            setLoading(true);
            fetch(`https://rickandmortyapi.com/api/character/?name=${searchTerm.toLowerCase()}`)
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
                .catch((error) => {
                    console.error(error);
                    setSuggestions([]);
                })
                .finally(() => {
                    setLoading(false);
                    setIsRequestActive(false); // set request inactive
                });
        } else {
            setSuggestions([]);
        }
    }, [isRequestActive])

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

        debounce(lastSearchTermRef.current, searchTerm, 500).then(() => {
            onSearch(searchTerm);
        });

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const handleSelect = (selected: CharacterModel) => {
        setSearchTerm(selected.name);
        setSuggestions([]);
        onSelect(selected);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ');
        setSearchTerm(newValue);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.keyCode) {
            case 13: // Enter
                if (suggestions.length > 0 && activeIndex >= 0) {
                    event.preventDefault();
                    handleSelect(suggestions[activeIndex]);
                }
                break;
            case 38: // Up arrow
                event.preventDefault();
                if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                } else {
                    setActiveIndex(suggestions.length - 1);
                }
                break;
            case 40: // Down arrow
                event.preventDefault();
                if (activeIndex < suggestions.length - 1) {
                    setActiveIndex(activeIndex + 1);
                } else {
                    setActiveIndex(0);
                }
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
        inputRef,
        onInputChange,
        onKeyDown,
        handleSelect
    }
};