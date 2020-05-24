window.onload = function() {

    buttonEventListeners();

    let hasVisited = JSON.parse(localStorage.getItem("hasVisited"))

    if(hasVisited) {
        alert("Welcome back!");
    } else {
        alert("This page uses cookies. By continuing you accept the use of these to store a list of favorite characters. The information will only be used by the web application and not by any third party.");
        hasVisited = "true";
        localStorage.setItem("hasVisited", JSON.stringify(hasVisited));
    }
    
};

function buttonEventListeners() {
    let buttonPortfolio             = document.querySelector("#buttton-my-portfolio");
    let buttonAboutMe               = document.querySelector("#button-about-me");
    let buttonContact               = document.querySelector("#button-contact");

    let buttonReturnFromPortfolio   = document.querySelector("#return-from-portfolio");
    let buttonReturnFromAboutMe     = document.querySelector("#return-from-about-me");
    let buttonReturnFromContact     = document.querySelector("#return-from-contact");

    let mainLayoutContainer     = document.querySelector("#main-layout-container");
    let portfolioContainer      = document.querySelector("#portfolio-container");
    let aboutMeContainer        = document.querySelector("#about-me-container");
    let contactContainer        = document.querySelector("#contact-container");

    buttonPortfolio.addEventListener("click", () => {
        
        mainLayoutContainer.style.display = "none";
        portfolioContainer.style.display = "grid";

    });

    buttonAboutMe.addEventListener("click", () => {

        mainLayoutContainer.style.display = "none";
        aboutMeContainer.style.display = "grid";

    });

    buttonContact.addEventListener("click", () => {
        
        mainLayoutContainer.style.display = "none";
        contactContainer.style.display = "grid";

    });

    buttonReturnFromPortfolio.addEventListener("click", () => {
        mainLayoutContainer.style.display = "grid";
        portfolioContainer.style.display = "none";
    });

    buttonReturnFromAboutMe.addEventListener("click", () => {
        mainLayoutContainer.style.display = "grid";
        aboutMeContainer.style.display = "none";
    });

    buttonReturnFromContact.addEventListener("click", () => {
        mainLayoutContainer.style.display = "grid";
        contactContainer.style.display = "none";
    });
};