
window.onload = function() {

    listSWAPI();
    buttonDisplayFavorite();
    buttonDisplaySelectedCharacter();
    buttonSaveCharacterFavorites();
    buttonRemoveSelectedCharacterFromFavorites();
    buttonRemoveAllCharactersFromFavorites();

};

async function listSWAPI() {
    let counter = 1;
    let url = `https://swapi.dev/api/people/?page=${counter}`;
    let dropDownListSWAPI = document.querySelector("#js-textbox-SWAPI-charachters");
    let datalistSwapi = document.querySelector("#list-SWAPI-charachters");

    let json = await (await fetch(url)).json();

    while (json.next){

        for (let character of json.results){
            let option = document.createElement("option");
            console.log(character.name);
            option.innerText = character.name;
            datalistSwapi.append(option);
        }

        counter++;
        url = `https://swapi.dev/api/people/?page=${counter}`;
        response = await fetch(url);
        json = await response.json();
    }

    dropDownListSWAPI.addEventListener("focus", () => {
        console.log("dropDownListSWAPI - focus");
    });
    dropDownListSWAPI.addEventListener("blur", () => {
        console.log("dropDownListSWAPI - blur");
    });
}

function buttonDisplayFavorite() {
    let searchFavorties = document.querySelector(".js-button-display-favorite-character");
    searchFavorties.addEventListener("click", () => {

        let informationPresenter = document.querySelector("#js-information-presenter");
        informationPresenter.innerHTML = "";

        let savedFavorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");

        if(savedFavorites.length) {
            for (let person of savedFavorites){

                let newPersonInformation = document.createElement("li");

                newPersonInformation.innerHTML = `Name: ${person.name} <br> 
                Height: ${person.height} cm <br> 
                Weight: ${person.weight} kg <br> 
                Gender: ${person.gender} <br> 
                Homeworld: ${person.homeworld}`;

                informationPresenter.append(newPersonInformation);
            }
        }
    });
};

function buttonDisplaySelectedCharacter() {
    let displaySWAPI = document.querySelector(".js-button-display-SWAPI-character");
    displaySWAPI.addEventListener("click", async () => {
        let informationPresenter = document.querySelector("#js-information-presenter");
        informationPresenter.innerHTML = "";

        let dropDownListSwapiInput = document.querySelector("#js-textbox-SWAPI-charachters");
        let newPersonInformation = document.createElement("li");

        let url = `https://swapi.dev/api/people/?search=${dropDownListSwapiInput.value}`;

        try {
            
            let personResponse = await (await fetch(url)).json();
            
            if(personResponse.results[0].homeworld.startsWith("http:")) {
                personResponse.results[0].homeworld = personResponse.results[0].homeworld.slice(0,4) + "s" + personResponse.results[0].homeworld.slice(4);
            }

            if(personResponse.count && dropDownListSwapiInput.value !== ""){
                let homeWorldResponse = await (await fetch(personResponse.results[0].homeworld)).json();
                newPersonInformation.innerHTML = `Name: ${personResponse.results[0].name} <br> 
                    Height: ${personResponse.results[0].height} cm <br> 
                    Weight: ${personResponse.results[0].mass} kg <br> 
                    Gender: ${personResponse.results[0].gender} <br> 
                    Homeworld: ${homeWorldResponse.name}`;
            } else {
                newPersonInformation.innerText = `No person by that name could be found.`;
            }
        
        } catch (error) {
            newPersonInformation.innerText = `Error while trying to retrieve data from server. Try again later.`;
        }

        informationPresenter.append(newPersonInformation);
        dropDownListSwapiInput.value = "";
    });
};

function buttonSaveCharacterFavorites() {
    let saveCharacterToFavorites = document.querySelector(".js-button-save-character-to-fav");
    saveCharacterToFavorites.addEventListener("click", async () => {
        
        let savedFavorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");

        let dropDownListSwapiInput = document.querySelector("#js-textbox-SWAPI-charachters");

        let alreadySavedArray = savedFavorites.map(person => person.name == dropDownListSwapiInput.value);

        let personNotSaved = new Boolean(true);

        for (let result of alreadySavedArray)
        {
            if(result){
                personNotSaved = false;
            }
        }

        if(dropDownListSwapiInput.value && personNotSaved == true){

            let url = `https://swapi.dev/api/people/?search=${dropDownListSwapiInput.value}`;
            let personResponse = await (await fetch(url)).json();

            if(personResponse.results[0].homeworld.startsWith("http:")) {
                personResponse.results[0].homeworld = personResponse.results[0].homeworld.slice(0,4) + "s" + personResponse.results[0].homeworld.slice(4);
            }

            if(personResponse.count){

                let homeWorldResponse = await (await fetch(personResponse.results[0].homeworld)).json();

                let character = {"name": `${dropDownListSwapiInput.value}`, 
                "height": `${personResponse.results[0].height}`, 
                "weight": `${personResponse.results[0].mass}`, 
                "gender": `${personResponse.results[0].gender}`, 
                "homeworld": `${homeWorldResponse.name}`
                };

                savedFavorites.push(character);

                localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));
            }
        }
        dropDownListSwapiInput.value = "";
        
    });
};

function buttonRemoveAllCharactersFromFavorites() {
    let removeAllCharacterFromFavorites = document.querySelector(".js-remove-all-characters-from-favorites");
    removeAllCharacterFromFavorites.addEventListener("click", () => {
        localStorage.removeItem("savedFavorites");

        let informationPresenter = document.querySelector("#js-information-presenter");
        informationPresenter.innerHTML = "";
    });
};

function buttonRemoveSelectedCharacterFromFavorites() {
    let removeSelectedCharacterFromFavorites = document.querySelector(".js-button-remove-character");
    removeSelectedCharacterFromFavorites.addEventListener("click", () => {

        let savedFavorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");

        let dropDownListSwapiInput = document.querySelector("#js-textbox-SWAPI-charachters");

        savedFavorites = savedFavorites.filter(person => person.name !== dropDownListSwapiInput.value);

        localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));

        let informationPresenter = document.querySelector("#js-information-presenter");
        informationPresenter.innerHTML = "";
    });
};