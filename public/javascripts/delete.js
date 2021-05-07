const recipeDel = document.querySelector("#recipeDel");

recipeDel.addEventListener("click", (e) => {
  e.preventDefault();
  let del = confirm("¿Esta seguro que desea eliminar la receta?");
  if (del == true) {
    window.location = e.target.origin + e.target.pathname;
  }
});
