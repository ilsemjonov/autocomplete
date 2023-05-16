import React from "react";
import "./App.css";
import Autocomplete from "../Autocomplete/Autocomplete";
import { CharacterModel } from "../../models/CharacterModel";
import { customFormatter } from "../../functions/customFormatter";

const App: React.FC = () => {
    const handleSelect = (selected: CharacterModel) => {
        console.log(selected);
    };

    return (
        <div className="app">
            <h1>Autocomplete</h1>
            <Autocomplete
                onSelect={handleSelect}
                formatter={customFormatter}
            />
        </div>
    );
};

export default App;
