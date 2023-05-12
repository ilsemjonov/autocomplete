import React from "react";
import "./App.css";
import Autocomplete, { Character } from "./Autocomplete/Autocomplete";

const App: React.FC = () => {
    const handleSelect = (selected: Character) => {
        console.log(selected);
    };

    return (
        <div className="app">
            <h1>Autocomplete</h1>
            <Autocomplete onSelect={handleSelect} />
        </div>
    );
};

export default App;
