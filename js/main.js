let formulario = document.getElementById("formulario");
let input = document.getElementById("input");
let listaTareas = document.getElementById("lista-tareas");
let template = document.getElementById("template").content;
let fragment = document.createDocumentFragment();
let tareas = {}

document.addEventListener("DOMContentLoaded", () => {
    if(localStorage.getItem("tareas")){
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    crearTareas();
});

listaTareas.addEventListener("click", e =>{
    btnAction(e);
})

formulario.addEventListener("submit", e => {
    e.preventDefault();
    tomarTarea(e);
})

let tomarTarea = e =>{
    if(input.value.trim() === ""){
        return;
    }

    let tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }

    tareas[tarea.id] = tarea;
    
    formulario.reset();

    input.focus();

    crearTareas();
}

let crearTareas = () =>{
    localStorage.setItem("tareas",JSON.stringify(tareas));

    if(Object.values(tareas).length === 0){
        listaTareas.innerHTML=`<div class="alert alert-dark text-center">
                                No hay tareas pendientes 👻 !
                                </div>`;
        return;
    }
    
    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea =>{
      const clone = template.cloneNode(true);  
      clone.querySelector("p").textContent = tarea.texto;
    
      if(tarea.estado){
          clone.querySelector(".alert").classList.replace("alert-warning", "alert-dark");
          clone.querySelectorAll(".fas")[0].classList.replace("fa-check-circle", "fa-undo-alt");
          clone.querySelector("p").style.textDecoration = "line-through";
      }
      clone.querySelectorAll(".fas")[0].dataset.id = tarea.id;
      clone.querySelectorAll(".fas")[1].dataset.id = tarea.id;
      fragment.appendChild(clone);
    })
    listaTareas.appendChild(fragment);
}

let btnAction = e =>{
    if(e.target.classList.contains("fa-check-circle")){
        tareas[e.target.dataset.id].estado = true;
        crearTareas();
    }
    if(e.target.classList.contains("fa-minus-circle")){
        delete tareas[e.target.dataset.id];
        crearTareas()
    }
    if(e.target.classList.contains("fa-undo-alt")){
        tareas[e.target.dataset.id].estado = false;
        crearTareas()
    }
    e.stopPropagation();
}