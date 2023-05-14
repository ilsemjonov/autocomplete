import { CharacterModel } from "../../models/CharacterModel";
import Suggestion from "./Suggestion";

type SuggestionsListItemProps = {
    suggestion: CharacterModel;
    debouncedValue: string;
    isActive: boolean;
    onSelect: () => void;
};

const SuggestionsListItem: React.FC<SuggestionsListItemProps> = ({
    suggestion,
    debouncedValue,
    isActive,
    onSelect,
}) => {
    const ariaSelected = isActive ? "true" : "false";
    return (
        <li
            key={suggestion.id}
            role="option"
            tabIndex={0}
            aria-selected={ariaSelected}
            className={isActive ? "active" : ""}
            onClick={onSelect}
        >
            <Suggestion suggestion={suggestion} debouncedValue={debouncedValue} />
        </li>
    );
};

export default SuggestionsListItem;
