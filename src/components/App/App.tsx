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

const rickAndMortySearchApiUrl = process.env.REACT_APP_RICKANDMORTY_API_URL;
const starWarsSearchApiUrl = process.env.REACT_APP_STARWARS_API_URL;

const App: React.FC = () => {

    const rickAndMortySearchUrl = `${rickAndMortySearchApiUrl}/api/character/`;
    const starWarsSearchUrl= `${starWarsSearchApiUrl}/api/people/`
    
    const handleSelect = (selected: CharacterModel) => {
        console.log(selected);
    };

    return (
        <div className="app">
            <h5>Autocomplete with delay, highlighting. Allowed symbols are: numbers, letters, dashes. Endpoint: https://rickandmortyapi.com/api</h5>
            <Autocomplete
                id='autocomplete-input'
                onSelect={handleSelect}
                searchUrl={rickAndMortySearchUrl}
                searchParameterName='name'
                paginationParameterName='page'
                formatter={customFormatter}
                delay={300}
                enableHighlight
                placeholder='Search rick & morty characters...'
                ariaLabel='Search for suggestions'
            />
            <h5>Autocomplete without delay, highlighting. All symbols allowed. Endpoint: https://swapi.dev/api</h5>
            <Autocomplete
                id='autocomplete-input-2'
                onSelect={handleSelect}
                searchUrl={starWarsSearchUrl}
                searchParameterName='search'
                paginationParameterName='page'
                placeholder='Search star wars characters...'
                ariaLabel='Search for suggestions 2'
            />
        </div>
    );
};

export default App;
