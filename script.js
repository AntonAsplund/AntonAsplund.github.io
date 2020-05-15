window.onload = function() {

    buttonEventListeners();
    
};

function buttonEventListeners() {
    let buttonPortfolio             = document.querySelector("#buttton-my-portfolio");
    let buttonAboutMe               = document.querySelector("#button-about-me");
    let buttonContact               = document.querySelector("#button-contact");
    let buttonReturnFromPortfolio   = document.querySelector("#return-from-portfolio");

    let mainLayoutContainer     = document.querySelector("#main-layout-container");
    let portfolioContainer      = document.querySelector("#portfolio-container");

    buttonPortfolio.addEventListener("click", () => {
        
        mainLayoutContainer.style.display = "none";
        portfolioContainer.style.display = "grid";

    });

    buttonAboutMe.addEventListener("click", () => {

        window.location.href = '';

    });

    buttonContact.addEventListener("click", () => {
        
        window.location.href = '';

    });

    buttonReturnFromPortfolio.addEventListener("click", () => {
        mainLayoutContainer.style.display = "grid";
        portfolioContainer.style.display = "none";
    });
};