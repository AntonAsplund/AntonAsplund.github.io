
  function employeeFunction(product, backgroundFiller) {
    var x = document.querySelector(product);
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }

    var backgroundFillerVariable = document.querySelector(backgroundFiller)
    if (backgroundFillerVariable.style.display === "block") {
      backgroundFillerVariable.style.display = "none";
    } else {
      backgroundFillerVariable.style.display = "block";
    }
  }