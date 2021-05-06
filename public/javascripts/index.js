const btnAdd = document.querySelector("#logo button");
const addDrink = document.querySelector("#addDrink");
const closeAddDrink = document.querySelector("#closeAdd");

btnAdd.addEventListener("click", () => {
  addDrink.classList.add("addDrinkUnhide");
});

closeAddDrink.addEventListener("click", () => {
  addDrink.classList.remove("addDrinkUnhide");
});
