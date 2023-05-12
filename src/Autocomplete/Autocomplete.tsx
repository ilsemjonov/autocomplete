import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Autocomplete.css";

export interface Character {
    id: number;
    name: string;
    searchTermIndex?: number;
}

type AutocompleteProps = {
    onSelect: (selected: Character) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState<Character[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [debouncedValue, setDebouncedValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRequestActive, setIsRequestActive] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const lastValueRef = useRef(value);
    const timeoutIdRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useLayoutEffect(() => {
        if (value === "") {
            setSuggestions([]);
        }
        lastValueRef.current = value;
    }, [value]);

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
                            .map((character: Character) => ({
                                ...character,
                                searchTermIndex: character.name.search(regex),
                            }))
                            .sort((a: Character, b: Character) => a.name.localeCompare(b.name))
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
                        setDebouncedValue(value);
                    }
                    resolve();
                }, delay);
            });
        };

        debounce(lastValueRef.current, value, 500).then(() => {
            onSearch(value);
        });

        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleSelect = (selected: Character) => {
        setValue(selected.name);
        setSuggestions([]);
        onSelect(selected);
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value.replace(/[^A-Za-z\s]/g, '');
        setValue(newValue);
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

    const highlightParts = (name: string, searchTerm: string): React.ReactNode[] => {
        const regex = new RegExp(`(${searchTerm})`, "gi");
        const parts = name.split(regex);
        return parts.reduce<React.ReactNode[]>((result, part, index) => {
            if (index % 2 === 0) {
                // Even parts are non-matching text
                result.push(part);
            } else {
                // Odd parts are matching text, wrapped in a <span> with the "highlight" class
                result.push(<span key={index} className="highlight">{part}</span>);
            }
            return result;
        }, []);
    }

    return (
        <div className="autocomplete">
            <label htmlFor="autocomplete-input">Search for suggestions:</label>
            <input
                id="autocomplete-input"
                ref={inputRef}
                type="text"
                value={value}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                aria-label="Search for suggestions"
                aria-autocomplete="list"
                aria-controls="suggestions-list"
            />
            {debouncedValue && value && !loading && suggestions.length === 0 && (
                <li className="no-results">No results found</li>
            )}
            {loading && (
                <li className="loading">loading</li>
            )}
            {!loading && suggestions.length > 0 && (
                <ul
                    id="suggestions-list"
                    role="listbox"
                    aria-expanded={suggestions.length > 0}
                >
                    {suggestions.map((suggestion, index) => {
                        const parts = highlightParts(suggestion.name, debouncedValue)
                        return (
                            <li
                                key={suggestion.id}
                                role="option"
                                tabIndex={0}
                                aria-selected={index === activeIndex}
                                className={index === activeIndex ? "active" : ""}
                                onClick={() => handleSelect(suggestion)}
                            >
                                {parts}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Autocomplete;
