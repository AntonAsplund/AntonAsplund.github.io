let savedFavoritesArray = localStorage.getItem("savedFavoritesArray");

console.log(savedFavoritesArray);

window.onload = function() {

    listFavorites();
    listSWAPI();
    buttonDisplayFavorite();
    buttonDisplaySWAPI();
    buttonSaveCharacterFavorites();
    buttonRemoveCharacterFromFavorites();

};

function listFavorites() {
    let dropDownListFavorites = document.querySelector("#js-list-favorite-characters");
    dropDownListFavorites.addEventListener("focus", () => {
        console.log("1");
    });
    
}

async function listSWAPI() {
    let counter = 1;
    let url = `https://swapi.dev/api/people/?page=${counter}`;
    let dropDownListSWAPI = document.querySelector("#js-textbox-SWAPI-charachters");
    let datalistSwapi = document.querySelector("#list-SWAPI-charachters");

    let response = await fetch(url);
    let json = await response.json();

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
        console.log("3");
    });
};

function buttonDisplaySWAPI() {
    let displaySWAPI = document.querySelector(".js-button-display-SWAPI-character");
    displaySWAPI.addEventListener("click", async () => {
        let informationPresenter = document.querySelector("#js-information-presenter");
        informationPresenter.innerHTML = "";

        let dropDownListSwapiInput = document.querySelector("#js-textbox-SWAPI-charachters");
        let newPersonInformation = document.createElement("li");

        let url = `https://swapi.dev/api/people/?search=${dropDownListSwapiInput.value}`;

        try {
            
            let personResponse = await (await fetch(url)).json();

            if(personResponse.count){
                let homeWorldResponse = await (await fetch(personResponse.results[0].homeworld)).json();
                newPersonInformation.innerHTML = `Name: ${personResponse.results[0].name} <br> Homeworld: ${homeWorldResponse.name}`;
            } else {
                newPersonInformation.innerText = `No person by that name could be found.`;
            }
        
        } catch (error) {
            if(personResponse.count){
                let homeWorldResponse = await (await fetch(personResponse.results[0].homeworld)).json();
                newPersonInformation.innerHTML = `Name: ${personResponse.results[0].name} <br> Homeworld: ${homeWorldResponse.name}`;
            } else {
                newPersonInformation.innerText = `No person by that name could be found.`;
            }
            newPersonInformation.innerText = `Error while trying to retrieve data from server. Try again later.`;
        }

        informationPresenter.append(newPersonInformation);
        dropDownListSwapiInput.value = "";
    });
};

function buttonSaveCharacterFavorites() {
    let saveCharacterToFavorites = document.querySelector(".js-button-save-character-to-fav");
    saveCharacterToFavorites.addEventListener("click", () => {
        console.log("5");
    });
};

function buttonRemoveCharacterFromFavorites() {
    let removeCharacterFromFavorites = document.querySelector(".js-button-remove-character");
    removeCharacterFromFavorites.addEventListener("click", () => {
        console.log("6");
    });
};