const btnAdd = document.querySelector("#logo button");
const addDrink = document.querySelector("#addDrink");
const closeAddDrink = document.querySelector("#closeAdd");
let fileForm = document.getElementById("image");

btnAdd.addEventListener("click", () => {
  addDrink.classList.add("addDrinkUnhide");
});

closeAddDrink.addEventListener("click", (e) => {
  e.preventDefault();
  addDrink.classList.remove("addDrinkUnhide");
});

fileForm.addEventListener("change", () => {
  let filePath = fileForm.value;
  let allowedExtensions = /(.jpg|.jpeg|.png|.gif)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert("Por favor seleccione una imagen con extensión .jpeg/.jpg/.png/.gif");
    fileForm.value = "";
    return false;
  }
});
