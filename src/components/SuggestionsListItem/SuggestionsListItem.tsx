import { useEffect, useRef } from 'react';

import { CharacterModel } from "../../models/CharacterModel";
import Suggestion from "../Suggestion/Suggestion";

import "./SuggestionsListItem.css";

type SuggestionsListItemProps = {
    suggestion: CharacterModel;
    searchTerm: string;
    isActive: boolean;
    onSelect: () => void;
    isHighlightEnabled: boolean;
};

const SuggestionsListItem: React.FC<SuggestionsListItemProps> = (props) => {
    const {
        suggestion,
        searchTerm,
        isActive,
        onSelect,
        isHighlightEnabled
    } = props;

    const focusedItemRef = useRef<HTMLLIElement>(null);

    const ariaSelected = isActive ? "true" : "false";
    const className = isActive ? "active" : ""

    useEffect(() => {
        if (isActive && focusedItemRef.current) {
            focusedItemRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    }, [isActive])

    return (
        <li
            ref={focusedItemRef}
            key={suggestion.id}
            role="option"
            tabIndex={0}
            aria-selected={ariaSelected}
            className={className}
            onClick={onSelect}
        >
            <Suggestion
                suggestion={suggestion}
                searchTerm={searchTerm}
                isHighlightEnabled={isHighlightEnabled}
            />
        </li>
    );
};

export default SuggestionsListItem;
