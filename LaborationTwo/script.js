window.onload = function() {

    let searchFavorties = document.querySelector(".js-button-search-favorite-character");
    let searchSWAPI = document.querySelector(".js-button-search-SWAPI-character");
    let saveCharacterToFavorites = document.querySelector(".js-button-save-character-to-fav");
    let removeCharacterFromFavorites = document.querySelector(".js-button-remove-character");

    searchFavorties.addEventListener("click", buttonSearchFavorites);
    searchSWAPI.addEventListener("click", buttonSearchSWAPI);
    saveCharacterToFavorites.addEventListener("click", buttonSaveCharacterFavorites);
    removeCharacterFromFavorites.addEventListener("click", buttonRemoveCharacterFromFavorites);

};

function buttonSearchFavorites() {
    console.log("buttonSearchFavorites");
};

function buttonSearchSWAPI() {
    console.log("buttonSearchSWAPI");
};

function buttonSaveCharacterFavorites() {
    console.log("buttonSaveCharacterFavorites");
};

function buttonRemoveCharacterFromFavorites() {
    console.log("buttonRemoveCharacterFromFavorites");
};