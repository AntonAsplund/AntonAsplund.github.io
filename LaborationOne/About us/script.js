
  function employeeFunction(product, backgroundFiller) {
    var x = document.getElementById(product);
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }

    var backgroundFillerVariable = document.getElementById(backgroundFiller)
    if (backgroundFillerVariable.style.display === "block") {
      backgroundFillerVariable.style.display = "none";
    } else {
      backgroundFillerVariable.style.display = "block";
    }
  }