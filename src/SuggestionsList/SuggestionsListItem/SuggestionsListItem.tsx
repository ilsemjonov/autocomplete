import { CharacterModel } from "../../models/CharacterModel";
import Suggestion from "./Suggestion/Suggestion";

import "./SuggestionsListItem.css";

type SuggestionsListItemProps = {
    suggestion: CharacterModel;
    debouncedSearchTerm: string;
    isActive: boolean;
    onSelect: () => void;
};

const SuggestionsListItem: React.FC<SuggestionsListItemProps> = (props) => {
    const {
        suggestion,
        debouncedSearchTerm,
        isActive,
        onSelect,
    } = props;

    const ariaSelected = isActive ? "true" : "false";
    const className = isActive ? "active" : ""

    return (
        <li
            key={suggestion.id}
            role="option"
            tabIndex={0}
            aria-selected={ariaSelected}
            className={className}
            onClick={onSelect}
        >
            <Suggestion suggestion={suggestion} debouncedSearchTerm={debouncedSearchTerm} />
        </li>
    );
};

export default SuggestionsListItem;
