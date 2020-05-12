
window.onload = function() {

    listSWAPI();
    buttonDisplayFavorite();
    buttonDisplaySelectedCharacter();
    buttonSaveCharacterFavorites();
    buttonsRemoveCharacterFromFavorites();
    buttonRemoveAllCharactersFromFavorites();
    buttonGoToCustomFavorites();
    buttonSaveNewCustomCharacter();
    buttonResetCookieAlert();
    addCustomTextboxFavoritesEvents();
    buttonReturnToMainFromCustomCharacter();
    buttonUpdateFavoriteCharacter();
    buttonRemoveCharacterMenu();

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
    let datalistSWAPI = document.querySelector("#list-SWAPI-characters");

    let json = await (await fetch(url)).json();

    while (json.next){

        for (let character of json.results){
            let option = document.createElement("option");
            console.log(character.name);
            option.innerText = character.name;
            datalistSWAPI.append(option);
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
                newPersonInformation.innerText = `No person by that name could be found on the SWAPI server, try adding a custom character.`;
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
        let informationPresenter = document.querySelector("#js-information-presenter");
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
                informationPresenter.innerHTML = "";
                
                let newInfo = document.createElement("li");
                newInfo.innerText = `No person by that name could be found on the server, try adding a custom character.`;

                informationPresenter.append(newInfo);
            }
        }

        if(dropDownListSwapiInput.value == "") {
            informationPresenter.innerHTML = "";
            let newInfo = document.createElement("li");
            newInfo.innerText = `Selected character textbox cannot be empty.`;
            informationPresenter.append(newInfo);
        }
        dropDownListSwapiInput.value = "";
        
    });
};

function buttonRemoveAllCharactersFromFavorites() {
    let removeAllCharacterFromFavorites = document.querySelector(".js-remove-all-characters-from-favorites");
    let layoutGridContainer             = document.querySelector(".layout-grid-container");
    let layoutCustomCharacterContainer  = document.querySelector(".layout-custom-character-container");

    removeAllCharacterFromFavorites.addEventListener("click", () => {
        let informationPresenter = document.querySelector("#js-information-presenter");
        localStorage.removeItem("savedFavorites");

        informationPresenter.innerHTML = "";
        let newInfo = document.createElement("li");
        newInfo.innerText = `All favorite characters have been removed.`;
        informationPresenter.append(newInfo);
        layoutGridContainer.style.display = "grid";
        layoutCustomCharacterContainer.style.display = "none";
    });
};

function buttonRemoveCharacterMenu(){
    let layoutRemoveCustomCharacterContainer      = document.querySelector(".layout-remove-custom-character-container");
    let layoutCustomCharacterContainer                  = document.querySelector(".layout-custom-character-container");
    let removeCharacterFromFavorites                    = document.querySelector(".js-button-remove-character");
    let removeCharacterFromFavoritesButtons             = document.querySelector(".remove-character-button-container");
    let updateCharacterFromFavoritesButtons             = document.querySelector(".update-character-button-container");

    removeCharacterFromFavorites.addEventListener("click", () => {
        layoutRemoveCustomCharacterContainer.style.display = "grid";
        layoutCustomCharacterContainer.style.display = "none";

    });
};

function buttonsRemoveCharacterFromFavorites() {
    let removeCharacterFromFavorites                    = document.querySelector(".js-button-remove-custom-character");
    let savedFavorites                                  = JSON.parse(localStorage.getItem("savedFavorites") || "[]");
    let informationPresenter                            = document.querySelector("#js-information-presenter");
    let textBoxRemoveCustomName                   = document.querySelector("#js-update-remove-custom-character-name");
    let newInfo                                         = document.createElement("li");
    let layoutGridContainer                             = document.querySelector(".layout-grid-container");
    let layoutCustomCharacterContainer                  = document.querySelector(".layout-custom-character-container");
    let layoutUpdateRemoveCustomCharacterContainer      = document.querySelector(".layout-remove-custom-character-container");

    removeCharacterFromFavorites.addEventListener("click", () => {
        informationPresenter.innerHTML = "";

        let containsCharacterToRemove = savedFavorites.find(person => person.name.toLowerCase() == textBoxRemoveCustomName.value.toLowerCase());
        
        if(containsCharacterToRemove) {
            savedFavorites = savedFavorites.filter(person => person.name.toLowerCase() !== textBoxRemoveCustomName.value.toLowerCase());
            localStorage.setItem("savedFavorites", JSON.stringify(savedFavorites));

            newInfo.innerText = `Favorites have been updated. The person ${textBoxRemoveCustomName.value} has been removed`;
            
        }  else {
            newInfo.innerText = `No person with that name has been found in the list, please check spelling and try again.`;
        }    

        informationPresenter.append(newInfo);
        textBoxRemoveCustomName.value = "";
        layoutGridContainer.style.display = "grid";
        layoutCustomCharacterContainer.style.display = "none";
        layoutUpdateRemoveCustomCharacterContainer.style.display = "none";

    });

    let cancelRemoveCharacterFromFavorites = document.querySelector(".js-button-cancel-remove-custom-character");

    cancelRemoveCharacterFromFavorites.addEventListener("click", () => {
        layoutCustomCharacterContainer.style.display = "grid";
        layoutUpdateRemoveCustomCharacterContainer.style.display = "none";
    });
};

function buttonGoToCustomFavorites() {
    let GoToCustomFavorites = document.querySelector(".js-go-to-custom-favorite-character-menu");

    GoToCustomFavorites.addEventListener("click", () => {

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
    let informationPresenter            = document.querySelector("#js-information-presenter");

    returnToMainFromCustomCharacter.addEventListener("click", () => {
        layoutGridContainer.style.display = "grid";
        layoutCustomCharacterContainer.style.display = "none";
        informationPresenter.innerHTML = "";
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


function buttonUpdateFavoriteCharacter() {
    let changeFavoriteCharacter                     = document.querySelector(".js-update-a-favorite-character");
    let layoutGridContainer                         = document.querySelector(".layout-grid-container");
    let layoutCustomCharacterContainer              = document.querySelector(".layout-custom-character-container");
    let layoutUpdateCustomCharacterContainer        = document.querySelector(".layout-update-custom-character-container");

    changeFavoriteCharacter.addEventListener("click", () => {

        layoutCustomCharacterContainer.style.display = "none";
        layoutUpdateCustomCharacterContainer.style.display = "grid";

        

    });

    let cancelUpdateCharacterButton = document.querySelector(".js-button-cancel-update-custom-character");

    cancelUpdateCharacterButton.addEventListener("click", () => {

        layoutCustomCharacterContainer.style.display = "grid";
        layoutUpdateCustomCharacterContainer.style.display = "none";
    });
}

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
