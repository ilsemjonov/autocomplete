import { CharacterModel } from "../../models/CharacterModel";
import Character from "./Character";

type SuggestionsListItemProps = {
    suggestion: CharacterModel;
    debouncedValue: string;
    isActive: boolean;
    onClick: () => void;
};

const SuggestionsListItem: React.FC<SuggestionsListItemProps> = ({
    suggestion,
    debouncedValue,
    isActive,
    onClick,
}) => {
    const ariaSelected = isActive ? "true" : "false";
    return (
        <li
            key={suggestion.id}
            role="option"
            tabIndex={0}
            aria-selected={ariaSelected}
            className={isActive ? "active" : ""}
            onClick={onClick}
        >
            <Character character={suggestion} debouncedValue={debouncedValue} />
        </li>
    );
};

export default SuggestionsListItem;
