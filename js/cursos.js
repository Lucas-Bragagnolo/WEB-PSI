/* RENDERIZAMOS LAS AREAS */

const areasContainer = document.getElementById("areas")

areas.forEach((area) => {
  const areaHTML = `
        <div class="col-lg-3 col-md-4 col-sm-6 col-6">
            <div class="card card-areas border-secondary rounded-0 d-flex align-items-baseline" style="border-top-right-radius: 0.5rem; border-bottom-right-radius: 0.5rem; position: relative;">
                <div class="position-absolute top-0 end-0 mt-2 me-2" style="width: 18px; height: 18px; background-color: ${area.color}; border-radius: 50%;"></div>
                <div class="card-body d-flex flex-column justify-content-end">
                    <h3 class="h4 mb-3">${area.nombre}</h3>
                    <ul class="list-unstyled">
                        <li>${area.descripcion}</li>
                    </ul>
                </div>
            </div>
        </div>
    `
  areasContainer.insertAdjacentHTML("beforeend", areaHTML)
})

//Renderizamos las areas en el select
const selectAreas = document.getElementById("filter-area")
const optionDefault = document.createElement("option")
optionDefault.value = "todas"
optionDefault.textContent = "Ver todas"
optionDefault.selected = true
selectAreas.appendChild(optionDefault)

areas.forEach((area) => {
  const option = document.createElement("option")
  option.value = area.id // Se usa idarea para la comparación
  option.textContent = area.nombre
  selectAreas.appendChild(option)
})

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
      const cursoArea = curso.idarea
      const colorArea = areas.find((area) => area.id === cursoArea).color
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
                <div class="card-curso hover-scale" style="background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('.${curso.imagen}'); background-size: cover; background-repeat: no-repeat; background-position: bottom;">
                    ${nuevoBadge}
                    ${dispobibleInscripcion}
                    <button type="button" class="btn btn-link p-0 bookmark" title="Guardar curso" aria-label="Guardar curso">
                        ${bookmarkIcon}
                    </button>

                    <h2 class="title">${curso.titulo}</h2>
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
document.getElementById("filter-start-date").addEventListener("change", (e) => {
  filters["filter-start-date"] = e.target.value
  console.log("Filtro de fecha de inicio cambiado:", filters["filter-start-date"])
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
      ? `<span class="destacado mb-2 me-2 rounded-pill bg-danger text-white">Nuevo</span>`
      : '<span class="mb-4">&nbsp;</span>'
    const bookmarkIcon = curso.destacado
      ? `<i class="bi bi-bookmark-fill" aria-hidden="true"></i>`
      : `<i class="bi bi-bookmark-plus" aria-hidden="true"></i>`
    const dispobibleInscripcion = curso.fechainicio
      ? `<span class="destacado mb-2 rounded-pill bg-primary text-white">Inscripciones Abiertas</span>`
      : ""
    const cardHTML = `
            <div class="col mb-2">
                <a href="detalle_curso.html?idcur=${curso.id}" class="card-curso-link" data-curso="${curso.id}">
                    <div class="card-curso hover-scale" style="background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('.${curso.imagen}'); background-size: cover; background-repeat: no-repeat; background-position: bottom;">
                        ${nuevoBadge}
                        ${dispobibleInscripcion}
                        <button type="button" class="btn btn-link p-0 bookmark" title="Guardar curso" aria-label="Guardar curso">
                            ${bookmarkIcon}
                        </button>

                        <h2 class="title">${curso.titulo}</h2>
                    </div>
                </a>
            </div>`
    listaCursos.insertAdjacentHTML("beforeend", cardHTML)
  })
  console.log("Cursos renderizados:", cursos.length)
}

// Función principal para filtrar y renderizar los cursos
function filtrarCursos() {
  console.log("Iniciando filtrado de cursos")
  const cursosSessionStorage = sessionStorage.getItem("cursos")
  if (!cursosSessionStorage) {
    console.log("No hay cursos en el sessionStorage.")
    return
  }
  const cursos = JSON.parse(cursosSessionStorage)

  const cursosFiltrados = obtenerCursosFiltrados(cursos)
  console.log("Cursos filtrados:", cursosFiltrados.length)
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
  document.getElementById("filter-start-date").value = ""

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
    case "filter-start-date":
      const fechasInicio = {
        "30dias": "Próximos 30 días",
        "2meses": "Próximos 2 meses",
        "6meses": "Próximos 6 meses",
        2025: "En 2025",
      }
      return fechasInicio[value] || "Fecha de inicio desconocida"
    case "filter-duration":
      return value === "1" ? "Duración: 1-3 meses" : "Duración: 4-6 meses"
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

