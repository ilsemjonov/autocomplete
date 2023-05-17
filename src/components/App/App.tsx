/* 
    Auocomplete component accepts 4 parameters:

        1. 'onSelect' callback to be executed when user selects some item 
            via mouse or keyboard (required).

        2. 'formatter' function to format the input value, for example to 
            forbid non-alphabet-numeric symbols to be inserted (optional). Default: defaultFormatter.ts

        3. 'delay' to wait after user stops typing for some time, 
            use-case: to preserve traffic (optional). Default: 0

        4. 'enableHighlight' to highlighting mathed symbols in suggestions list (optional). Default: true

*/

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
                delay={500}
            />
        </div>
    );
};

export default App;
