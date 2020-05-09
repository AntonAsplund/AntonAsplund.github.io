
window.onload = function() {

    listSWAPI();
    buttonDisplayFavorite();
    buttonDisplaySelectedCharacter();
    buttonSaveCharacterFavorites();
    buttonRemoveSelectedCharacterFromFavorites();
    buttonRemoveAllCharactersFromFavorites();
    buttonGoToAddCustomFavorites();
    buttonSaveNewCustomCharacter();
    buttonResetCookieAlert();
    addCustomTextboxFavoritesEvents();
    buttonReturnToMainFromCustomCharacter();

    let hasVisited = JSON.parse(localStorage.getItem("hasVisited"))

    if(hasVisited) {
        alert("Welcome back!");
    } else {
        alert("This page uses cookies. By continuing you accept the use of these to store a list of favorite characters. The information will only be used by the web application and not by any third party.");
        hasVisited = "true";
        localStorage.setItem("hasVisited", JSON.stringify(hasVisited));
    }


};

async function listSWAPI() {
    let counter = 1;
    let url = `https://swapi.dev/api/people/?page=${counter}`;
    let dropDownListSWAPI = document.querySelector("#js-textbox-SWAPI-characters");
    let datalistSwapi = document.querySelector("#list-SWAPI-characters");

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

        let dropDownListSwapiInput  = document.querySelector("#js-textbox-SWAPI-characters");
        let newPersonInformation    = document.createElement("li");

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
                newPersonInformation.innerText = `No person by that name could be found on the server, try adding a custom character.`;
            }
        
        } catch (error) {
            if(dropDownListSwapiInput.value !== "") {
                newPersonInformation.innerText = `No person by that name could be found on the server, try adding a custom character.`;
            } else {
                newPersonInformation.innerText = `Error while trying to retrieve data from server. Try again later.`;
            }
        }

        informationPresenter.append(newPersonInformation);
        dropDownListSwapiInput.value = "";
    });
};

function buttonSaveCharacterFavorites() {
    let saveCharacterToFavorites = document.querySelector(".js-button-save-character-to-fav");
    saveCharacterToFavorites.addEventListener("click", async () => {
        
        let savedFavorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");

        let dropDownListSwapiInput = document.querySelector("#js-textbox-SWAPI-characters");

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

            if(personResponse.count){

                if(personResponse.results[0].homeworld.startsWith("http:")) {
                    personResponse.results[0].homeworld = personResponse.results[0].homeworld.slice(0,4) + "s" + personResponse.results[0].homeworld.slice(4);
                }

                let homeWorldResponse = await (await fetch(personResponse.results[0].homeworld)).json();

                let character = {"name": `${dropDownListSwapiInput.value}`, 
                "height": `${personResponse.results[0].height}`, 
                "weight": `${personResponse.results[0].mass}`, 
                "gender": `${personResponse.results[0].gender}`, 
                "homeworld": `${homeWorldResponse.name}`
                };

                savedFavorites.push(character);

                localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));
            } else {
                let informationPresenter = document.querySelector("#js-information-presenter");
                informationPresenter.innerHTML = "";
                
                let newInfo = document.createElement("li");
                newInfo.innerText = `No person by that name could be found on the server, try adding a custom character.`;

                informationPresenter.append(newInfo);
            }
        }
        dropDownListSwapiInput.value = "";
        
    });
};

function buttonRemoveAllCharactersFromFavorites() {
    let removeAllCharacterFromFavorites = document.querySelector(".js-remove-all-characters-from-favorites");
    removeAllCharacterFromFavorites.addEventListener("click", () => {
        let informationPresenter = document.querySelector("#js-information-presenter");
        localStorage.removeItem("savedFavorites");

        informationPresenter.innerHTML = "";
    });
};

function buttonRemoveSelectedCharacterFromFavorites() {
    let removeSelectedCharacterFromFavorites = document.querySelector(".js-button-remove-character");
    removeSelectedCharacterFromFavorites.addEventListener("click", () => {

        let savedFavorites          = JSON.parse(localStorage.getItem("savedFavorites") || "[]");
        let informationPresenter    = document.querySelector("#js-information-presenter");
        let dropDownListSwapiInput  = document.querySelector("#js-textbox-SWAPI-characters");
        let newInfo                 = document.createElement("li");

        savedFavorites = savedFavorites.filter(person => person.name.toLowerCase() !== dropDownListSwapiInput.value.toLowerCase());
        localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));

        newInfo.innerText = `Favorites have been updated. If the person is not removed, please check the spelling of the characters name.`;
        dropDownListSwapiInput.value = "";
        informationPresenter.innerHTML = "";
        informationPresenter.append(newInfo);
    });
};

function buttonGoToAddCustomFavorites() {
    let GoToAddCustomFavorites = document.querySelector(".js-go-to-add-custom-favorite-character");
    GoToAddCustomFavorites.addEventListener("click", () => {

        let layoutGridContainer             = document.querySelector(".layout-grid-container");
        let layoutCustomCharacterContainer  = document.querySelector(".layout-custom-character-container");

        layoutGridContainer.style.display = "none";
        layoutCustomCharacterContainer.style.display = "grid";

    });

}

function buttonSaveNewCustomCharacter() {
    let textBoxCustomName           = document.querySelector("#js-custom-character-name");
    let textBoxCustomHeight         = document.querySelector("#js-custom-character-height");
    let textBoxCustomWeight         = document.querySelector("#js-custom-character-weight");
    let textBoxCustomGender         = document.querySelector("#js-custom-character-gender");
    let textBoxCustomHomeworld      = document.querySelector("#js-custom-character-homeworld");
    let textBoxNotEmptyWarning      = document.querySelector("#js-text-box-not-empty-warning");
    let textBoxIsNotNumberWarning   = document.querySelector("#js-text-box-is-not-number-warning");
    let personHasAlreadyBeenSaved    = document.querySelector("#js-person-is-already-saved");
    
    let saveCustomCharacter     = document.querySelector(".js-button-save-custom-character");

    saveCustomCharacter.addEventListener("click", () => {
        if(
            addInputWarningToTextbox(textBoxCustomName, textBoxNotEmptyWarning, personHasAlreadyBeenSaved) &&
            addInputWarningToNumberTextbox(textBoxCustomHeight, textBoxNotEmptyWarning, textBoxIsNotNumberWarning, personHasAlreadyBeenSaved) &&
            addInputWarningToNumberTextbox(textBoxCustomWeight, textBoxNotEmptyWarning, textBoxIsNotNumberWarning, personHasAlreadyBeenSaved) &&
            addInputWarningToTextbox(textBoxCustomGender, textBoxNotEmptyWarning, personHasAlreadyBeenSaved) &&
            addInputWarningToTextbox(textBoxCustomHomeworld, textBoxNotEmptyWarning, personHasAlreadyBeenSaved)
        ){
            let savedFavorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");

            let alreadySavedArray = savedFavorites.map(person => person.name == textBoxCustomName.value);

            console.log("textbox custom name: " + textBoxCustomName.value);

            let personNotSaved = new Boolean(true);

            for (let result of alreadySavedArray)
            {
                if(result){
                    personNotSaved = false;
                }
            }

            if(personNotSaved){
                let character = {"name": `${textBoxCustomName.value}`, 
                    "height": `${textBoxCustomHeight.value}`, 
                    "weight": `${textBoxCustomWeight.value}`, 
                    "gender": `${textBoxCustomGender.value}`, 
                    "homeworld": `${textBoxCustomHomeworld.value}`
                };

                savedFavorites.push(character);

                localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));

                textBoxCustomName.value = "";
                textBoxCustomHeight.value = "";
                textBoxCustomWeight.value = "";
                textBoxCustomGender.value = "";
                textBoxCustomHomeworld.value = "";
                textBoxNotEmptyWarning.style.display = "none";
                textBoxIsNotNumberWarning.style.display = "none";
                personHasAlreadyBeenSaved.style.display = "none";
            } else {
                textBoxNotEmptyWarning.style.display = "none";
                textBoxIsNotNumberWarning.style.display = "none";
                personHasAlreadyBeenSaved.style.display = "block";
            }
        };
    });
};

function buttonReturnToMainFromCustomCharacter() {
    let returnToMainFromCustomCharacter = document.querySelector(".js-button-return");
    let layoutGridContainer             = document.querySelector(".layout-grid-container");
    let layoutCustomCharacterContainer  = document.querySelector(".layout-custom-character-container");

    returnToMainFromCustomCharacter.addEventListener("click", () => {
        layoutGridContainer.style.display = "grid";
        layoutCustomCharacterContainer.style.display = "none";
    });
}

function addCustomTextboxFavoritesEvents() {
    let textBoxCustomName           = document.querySelector("#js-custom-character-name");
    let textBoxCustomHeight         = document.querySelector("#js-custom-character-height");
    let textBoxCustomWeight         = document.querySelector("#js-custom-character-weight");
    let textBoxCustomGender         = document.querySelector("#js-custom-character-gender");
    let textBoxCustomHomeworld      = document.querySelector("#js-custom-character-homeworld");
    let textBoxNotEmptyWarning      = document.querySelector("#js-text-box-not-empty-warning");
    let textBoxIsNotNumberWarning   = document.querySelector("#js-text-box-is-not-number-warning");
    let personHasAlreadyBeenSaved   = document.querySelector("#js-person-is-already-saved");
 
    textBoxCustomName.addEventListener("blur", () => {
        addInputWarningToTextbox(textBoxCustomName, textBoxNotEmptyWarning, personHasAlreadyBeenSaved);
    });
    textBoxCustomHeight.addEventListener("blur", () => {
        addInputWarningToNumberTextbox(textBoxCustomHeight, textBoxNotEmptyWarning, textBoxIsNotNumberWarning, personHasAlreadyBeenSaved)
    });
    textBoxCustomWeight.addEventListener("blur", () => {
        addInputWarningToNumberTextbox(textBoxCustomWeight, textBoxNotEmptyWarning, textBoxIsNotNumberWarning, personHasAlreadyBeenSaved)
    });
    textBoxCustomGender.addEventListener("blur", () => {
        addInputWarningToTextbox(textBoxCustomGender, textBoxNotEmptyWarning, personHasAlreadyBeenSaved)
    });
    textBoxCustomHomeworld.addEventListener("blur",() => {
        addInputWarningToTextbox(textBoxCustomHomeworld, textBoxNotEmptyWarning, personHasAlreadyBeenSaved)
    });
};

function addInputWarningToTextbox(textbox, textBoxNotEmptyWarning, personHasAlreadyBeenSaved) {
    personHasAlreadyBeenSaved.style.display = "none";
    if(textbox.value === ""){
        textbox.style.borderColor = "#ff0000";
        textBoxNotEmptyWarning.style.display = "block";
    } else {
        textbox.style.borderColor = "#ffe81f";
        return true;
    };
}

function addInputWarningToNumberTextbox(textbox, textBoxNotEmptyWarning, textBoxIsNotNumberWarning, personHasAlreadyBeenSaved) {
    personHasAlreadyBeenSaved.style.display = "none";
    if(!isNaN(textbox.value) && textbox.value !== ""){
        textbox.style.borderColor = "#ffe81f";
        return true;
    } else if (textbox.value === "") {
        textbox.style.borderColor = "#ff0000";
        textBoxNotEmptyWarning.style.display = "block";
    } else if (isNaN(textbox.value)){
        textbox.style.borderColor = "#ff0000";
        textBoxIsNotNumberWarning.style.display = "block";
    };
}

function buttonResetCookieAlert() {
    let resetCookieAlert = document.querySelector(".js-Test-reset-cookie-alert");
    resetCookieAlert.addEventListener("click", () => {
        let hasVisited = JSON.parse(localStorage.getItem("hasVisited"))
        hasVisited = "";
        localStorage.setItem("hasVisited", JSON.stringify(hasVisited));
    });
};