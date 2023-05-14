import { highlightParts } from "../../functions/highlightParts";
import { CharacterModel } from "../../models/CharacterModel";

type CharacterProps = {
    character: CharacterModel;
    debouncedValue: string;
};

const Character: React.FC<CharacterProps> = ({ character, debouncedValue }) => {
    const highlightedName = highlightParts(character.name, debouncedValue);
    return <span>{highlightedName}</span>;
};

export default Character;
