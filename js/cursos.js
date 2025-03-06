
const areasContainer = document.getElementById("areas-container");
function hexToRGBA(hex, alpha = 1) {
  const r = Number.parseInt(hex.slice(1, 3), 16),
    g = Number.parseInt(hex.slice(3, 5), 16),
    b = Number.parseInt(hex.slice(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}  
fetchAreas().then(areas => {
  areas.forEach((area) => {
    const transparentColor = hexToRGBA(area.color, 0.5);
    const card = document.createElement("div");
    card.className = "col-12 col-md-6 col-lg-4 hover-scale";
    card.innerHTML = `
      <div class="form-check custom-card h-100 w-100" style="transition: transform 0.2s ease-in-out;">
        <label class="form-check-label w-100 h-100" for="area${area.id}">
            <div class="card-body d-flex flex-column align-items-center justify-content-end" 
                 style="background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('${area.imagen}');
                        background-position: center;
                        background-size: cover;
                        background-repeat: no-repeat;
                        height: 200px; 
                        border-radius: 15px;
                        border-bottom: 8px solid ${area.color};">
                <h3 class="h4 mb-2 text-white text-center">${area.nombre}</h3>
                <p class="text-white text-center small">${area.descripcion}</p>
            </div>
            <style>
              .custom-card:hover {
                transform: scale(1.1);
              }
            </style>
        </label>
      </div>
    `;
    areasContainer.appendChild(card);
  });
  
  // Renderizamos las áreas en el select
  const selectAreas = document.getElementById("filter-area");
  selectAreas.innerHTML = ""; // Limpiamos opciones previas
  const optionDefault = document.createElement("option");
  optionDefault.value = "todas";
  optionDefault.textContent = "Ver todas";
  optionDefault.selected = true;
  selectAreas.appendChild(optionDefault);
  
  areas.forEach((area) => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.nombre;
    selectAreas.appendChild(option);
  });
});


/* RENDERIZAMOS LOS CURSOS */
//Funcion para renderizar todos los cursos
async function cargarCursos() {
  try {
    const response = await fetch("../data/cursos.json")
    if (!response.ok) throw new Error("Error al cargar el archivo JSON")

    const cursos = await response.json()

    // Renderizar los cursos
    const listaCursos = document.getElementById("cursosContainer")
    listaCursos.innerHTML = "" // Limpiar contenido previo
    cursos.forEach((curso) => {
      const nuevoBadge = curso.nuevo
        ? `<span class="destacado ms-2 me-2 mb-2 rounded-pill bg-danger text-white">Nuevo</span>`
        : ""
      const dispobibleInscripcion = curso.fechainicio
        ? `<span class="destacado mb-2 rounded-pill bg-primary text-white">Inscripciones Abiertas</span>`
        : ""
      const bookmarkIcon = curso.destacado
        ? `<i class="bi bi-bookmark-fill" aria-hidden="true"></i>`
        : `<i class="bi bi-bookmark-plus" aria-hidden="true"></i>`

        const cardHTML = `
        <div class="col mb-2">
            <a href="detalle_curso.html?idcur=${curso.id}" class="card-curso-link" data-curso="${curso.id}">
                <div class="card-curso hover-scale" style="background-img: url('.${curso.imagen}'); background-size: cover; background-repeat: no-repeat; background-position: bottom; border-bottom: 8px solid ${curso.colorArea};">
                    ${nuevoBadge}
                    ${dispobibleInscripcion}
                    <button type="button" class="btn btn-link p-0 bookmark" title="Guardar curso" aria-label="Guardar curso">
                        ${bookmarkIcon}
                    </button>
                    
                </div>
            </a>
        </div>`
      listaCursos.insertAdjacentHTML("beforeend", cardHTML)
    })

    // Guardar los datos en sessionStorage
    sessionStorage.setItem("cursos", JSON.stringify(cursos))
  } catch (error) {
    console.error("Error:", error)
  }
}

// Ejecutar la función para cargar y renderizar cursos
cargarCursos()

// Objeto para almacenar los filtros
let filters = JSON.parse(sessionStorage.getItem("filters")) || {}

// Función para actualizar los filtros en sessionStorage
function updateFiltersInSessionStorage() {
  sessionStorage.setItem("filters", JSON.stringify(filters))
  console.log("Filtros actualizados en sessionStorage:", filters)
}

// Agregamos los event listeners para detectar los cambios en los filtros
document.getElementById("filter-area").addEventListener("change", (e) => {
  filters["filter-area"] = e.target.value
  console.log("Filtro de área cambiado:", filters["filter-area"])
  updateFiltersInSessionStorage()
  filtrarCursos()
})
document.getElementById("filter-tipo").addEventListener("change", (e) => {
  filters["filter-tipo"] = e.target.value
  console.log("Filtro de tipo cambiado:", filters["filter-tipo"])
  updateFiltersInSessionStorage()
  filtrarCursos()
})
document.getElementById("filter-modalidad").addEventListener("change", (e) => {
  filters["filter-modalidad"] = e.target.value
  console.log("Filtro de modalidad cambiado:", filters["filter-modalidad"])
  updateFiltersInSessionStorage()
  filtrarCursos()
})
document.getElementById("search-courses").addEventListener("input", (e) => {
  filters["search-courses"] = e.target.value.toLowerCase()
  console.log("Búsqueda cambiada:", filters["search-courses"])
  updateFiltersInSessionStorage()
  filtrarCursos()
})
document.getElementById("filter-duration").addEventListener("change", (e) => {
  filters["filter-duration"] = e.target.value
  console.log("Filtro de duración cambiado:", filters["filter-duration"])
  updateFiltersInSessionStorage()
  filtrarCursos()
})

// Función para obtener cursos filtrados según los criterios
function obtenerCursosFiltrados(cursos) {
  return cursos.filter((curso) => {
    const coincideArea =
      !filters["filter-area"] || filters["filter-area"] === "todas" || String(curso.idarea) === filters["filter-area"]
    const coincideDuration =
      !filters["filter-duration"] ||
      (filters["filter-duration"] === "3" && curso.duracion === 3) ||
      (filters["filter-duration"] === "4" && curso.duracion === 4) ||
      (filters["filter-duration"] === "5" && curso.duracion === 5) ||
      (filters["filter-duration"] === "6" && curso.duracion === 6) ||
      (filters["filter-duration"] === "todas")
    const coincideTipo = !filters["filter-tipo"] || String(curso.tipoCursoId) === filters["filter-tipo"]
    const coincideModalidad =
      !filters["filter-modalidad"] || String(curso.tipoModalidadId) === filters["filter-modalidad"]
    const coincideTitulo = !filters["search-courses"] || curso.titulo.toLowerCase().includes(filters["search-courses"])
    return (
      coincideArea &&
      coincideTipo &&
      coincideModalidad &&
      coincideTitulo &&
      coincideDuration      
    )
  })
}

// Función para renderizar cursos
function renderizarCursos(cursos) {
  const listaCursos = document.getElementById("cursosContainer")
  listaCursos.innerHTML = "" // Limpiar contenido previo
  cursos.forEach((curso) => {
    const nuevoBadge = curso.nuevo
      ? `<span class="destacado mb-2 me-1 rounded-pill bg-danger text-white">Nuevo</span><br>`
      : ""
    const bookmarkIcon = curso.destacado
      ? `<i class="bi bi-bookmark-fill" aria-hidden="true"></i>`
      : `<i class="bi bi-bookmark-plus" aria-hidden="true"></i>`
    const dispobibleInscripcion = curso.fechainicio
      ? `<span class="destacado mb-2 rounded-pill bg-primary text-white">Inscripciones Abiertas</span>`
      : ""
    const cardHTML = `
            <div class="col mb-2">
                <a href="detalle_curso.html?idcur=${curso.id}" class="card-curso-link" data-curso="${curso.id}">
                    <div class="card-curso hover-scale" style="background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.0)), url('.${curso.imagen}'); background-size: cover; background-repeat: no-repeat; background-position: bottom; border-bottom: 8px solid ${curso.colorArea};"">
                       <div class="badges" >
                        ${nuevoBadge}
                        ${dispobibleInscripcion}

                       </div>
                        <button type="button" class="btn btn-link p-0 bookmark" title="Guardar curso" aria-label="Guardar curso">
                            ${bookmarkIcon}
                        </button>                        
                    </div>
                </a>
            </div>`
    listaCursos.insertAdjacentHTML("beforeend", cardHTML)
  })
  console.log("Cursos renderizados:", cursos.length)
}

// Función principal para filtrar y renderizar los cursos
function filtrarCursos() {
  //console.log("Iniciando filtrado de cursos")
  const cursosSessionStorage = sessionStorage.getItem("cursos")
  if (!cursosSessionStorage) {
    //console.log("No hay cursos en el sessionStorage.")
    return
  }
  const cursos = JSON.parse(cursosSessionStorage)

  const cursosFiltrados = obtenerCursosFiltrados(cursos)
  //console.log("Cursos filtrados:", cursosFiltrados.length)
  renderizarCursos(cursosFiltrados)
  updateActiveFilters()
}

function ordenarCursos(cursos, ordenSeleccionado) {
  const cursosOrdenados = [...cursos] // Make a copy to avoid sorting the original array

  switch (ordenSeleccionado) {
    case "nuevos":
      cursosOrdenados.sort((a, b) => b.nuevo - a.nuevo) // Assuming 'id' is incremental with new courses
      break
    case "date-desc":
      cursosOrdenados.sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime())
      break
    case "date-asc":
      cursosOrdenados.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())
      break
    case "duration-asc":
      cursosOrdenados.sort((a, b) => a.duracion - b.duracion)
      break
    case "duration-desc":
      cursosOrdenados.sort((a, b) => b.duracion - a.duracion)
      break
    case "name-asc":
      cursosOrdenados.sort((a, b) => a.titulo.localeCompare(b.titulo))
      break
    case "name-desc":
      cursosOrdenados.sort((a, b) => b.titulo.localeCompare(a.titulo))
      break
    default:
    // No sorting needed
  }

  return cursosOrdenados
}

document.getElementById("orden-cursos").addEventListener("change", (e) => {
  const ordenSeleccionado = e.target.value
  console.log("Orden seleccionado:", ordenSeleccionado)
  const cursosSessionStorage = sessionStorage.getItem("cursos")
  if (!cursosSessionStorage) {
    console.log("No hay cursos en el sessionStorage.")
    return
  }
  const cursos = JSON.parse(cursosSessionStorage)
  const cursosOrdenados = ordenarCursos(cursos, ordenSeleccionado)
  renderizarCursos(cursosOrdenados)
})
document.getElementById("orden-cursos2").addEventListener("change", (e) => {
  const ordenSeleccionado = e.target.value
  console.log("Orden seleccionado (móvil):", ordenSeleccionado)
  const cursosSessionStorage = sessionStorage.getItem("cursos")
  if (!cursosSessionStorage) {
    console.log("No hay cursos en el sessionStorage.")
    return
  }
  const cursos = JSON.parse(cursosSessionStorage)
  const cursosOrdenados = ordenarCursos(cursos, ordenSeleccionado)
  renderizarCursos(cursosOrdenados)
})

function recoverFilters() {
  console.log("Recuperando filtros")
  const savedFilters = JSON.parse(sessionStorage.getItem("filters"))
  if (savedFilters) {
    filters = savedFilters
    console.log("Filtros recuperados:", filters)
    Object.keys(filters).forEach((key) => {
      const element = document.getElementById(key)
      if (element) {
        element.value = filters[key]
        console.log(`Restaurando filtro ${key}:`, filters[key])
        // Dispara un evento de cambio para que los listeners se activen
        element.dispatchEvent(new Event("change"))
      }
    })
    filtrarCursos()
  } else {
    console.log("No se encontraron filtros guardados")
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, recuperando filtros y cargando cursos")
  recoverFilters()
  cargarCursos().then(() => {
    filtrarCursos()
  })
})

document.getElementById("limpiarFiltros").addEventListener("click", (e) => {
  e.preventDefault() // Prevent default form submission
  console.log("Limpiando todos los filtros")
  // Reset all filter inputs
  document.getElementById("filter-area").value = "todas"
  document.getElementById("filter-tipo").value = ""
  document.getElementById("filter-modalidad").value = ""
  document.getElementById("search-courses").value = ""
  document.getElementById("filter-duration").value = ""

  // Clear filters object
  filters = {}
  updateFiltersInSessionStorage()

  // Re-filter courses
  filtrarCursos()
})

function updateActiveFilters() {
  console.log("Actualizando filtros activos")
  const activeFiltersContainer = document.getElementById("active-filters")
  activeFiltersContainer.innerHTML = ""

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "todas" && value !== "") {
      const filterName = getFilterName(key, value)
      const badge = document.createElement("span")
      badge.className = "badge rounded-pill bg-secondary position-relative me-2 mb-2"
      badge.innerHTML = `
        ${filterName}
        <button class="btn-close btn-close-white" aria-label="Quitar filtro"></button>
      `
      badge.querySelector(".btn-close").onclick = (e) => {
        e.preventDefault()
        removeFilter(key)
      }
      activeFiltersContainer.appendChild(badge)
    }
  })
}

function getFilterName(key, value) {
  switch (key) {
    case "filter-area":
      return document.querySelector(`#filter-area option[value="${value}"]`)?.textContent || "Área desconocida"
    case "filter-duration":
      return {
        "3": "Duración: 3 meses",
        "4": "Duración: 4 meses",
        "5": "Duración: 5 meses",
        "6": "Duración: 6 meses",
      }[value] || `Duración: ${value} meses`
    case "filter-modalidad":
      return (
        document.querySelector(`#filter-modalidad option[value="${value}"]`)?.textContent || "Modalidad desconocida"
      )
    case "filter-tipo":
      return document.querySelector(`#filter-tipo option[value="${value}"]`)?.textContent || "Tipo de curso desconocido"
    case "search-courses":
      return `Búsqueda: ${value}`
    default:
      return `${key}: ${value}`
  }
}

function removeFilter(key) {
  console.log("Removiendo filtro:", key)
  const element = document.getElementById(key)
  if (element) {
    if (element.tagName === "SELECT") {
      element.value = element.options[0].value // Selecciona la primera opción
    } else if (element.tagName === "INPUT" && element.type === "search") {
      element.value = ""
    }
    console.log(`Reseteando elemento ${key} a:`, element.value)
    // Dispara un evento de cambio para que los listeners se activen
    element.dispatchEvent(new Event("change"))
  }
  delete filters[key]
  updateFiltersInSessionStorage()
  filtrarCursos()
}

// Call filtrarCursos() initially to show all courses
filtrarCursos()

