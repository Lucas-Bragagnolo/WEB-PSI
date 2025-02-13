function togglePanels(panelToShow) {
  const panels = ["perfilUsuario", "certificados", "areasInteres", "meGusta"]
  const buttons = ["perfilUsu", "cursosCompletos", "areasDeInteres", "likes"]

  panels.forEach((panelId, index) => {
    const panel = document.getElementById(panelId)
    const button = document.getElementById(buttons[index])

    if (panelId === panelToShow) {
      panel.classList.remove("d-none")
      button.classList.add("active")
      button.setAttribute("aria-current", "true")
    } else {
      panel.classList.add("d-none")
      button.classList.remove("active")
      button.removeAttribute("aria-current")
    }
  })
}


  function hexToRGBA(hex, alpha = 1) {
    const r = Number.parseInt(hex.slice(1, 3), 16),
      g = Number.parseInt(hex.slice(3, 5), 16),
      b = Number.parseInt(hex.slice(5, 7), 16)
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }  
// Función para cargar las áreas de interés de forma asíncrona
async function fetchInterestAreas() {
    try {
      const response = await fetch("../data/areas.json")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data.areas
    } catch (error) {
      console.error("Error al cargar las áreas de interés:", error)
      return []
    }
  }
  
  // Función para cargar y mostrar las áreas de interés
  async function loadInterestAreas() {
    const container = document.getElementById("interestAreasContainer");
    
    try {
      // Fetch all interest areas
      const areasResponse = await fetch('../data/areas.json');
      const areasData = await areasResponse.json();
      const areas = areasData.areas || []; // Extraemos el array de áreas
  
      // Fetch clicked areas for the student
      const clickedAreasResponse = await fetch('../data/areasInteres.json');
      const clickedAreasData = await clickedAreasResponse.json();
      const clickedAreas = clickedAreasData.clickedAreas || []; // Extraemos el array de áreas clickeadas
  
      if (areas.length === 0) {
        container.innerHTML = "<p>No se pudieron cargar las áreas de interés. Por favor, intenta de nuevo más tarde.</p>";
        return;
      }
  
      container.innerHTML = "";
  
      areas.forEach((area) => {
        const transparentColor = hexToRGBA(area.color, 0.5);
        const card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";
        
        // Check if this area is in the clicked areas
        const isClicked = clickedAreas.includes(area.id);
        
        card.innerHTML = `
          <div class="form-check custom-card h-100 w-100">
            <input class="form-check-input visually-hidden" type="checkbox" value="${area.id}" id="area${area.id}" ${isClicked ? 'checked' : ''}>
            <label class="form-check-label w-100 h-100" for="area${area.id}">
              <div class="card-body d-flex flex-column align-items-center justify-content-end" 
                   style="background: linear-gradient(${transparentColor},rgba(0,0,0,0.4)), url('${area.imagen}');
                          background-position: center;
                          background-size: cover;
                          background-repeat: no-repeat;
                          height: 200px; 
                          border-radius: 15px;">
                <h3 class="h5 mb-2 text-white text-center">${area.nombre}</h3>
                <p class="text-white text-center small">${area.descripcion}</p>
              </div>
            </label>
          </div>
        `;
        container.appendChild(card);
      });
  
      // Añadir evento para guardar preferencias
      document.getElementById("interestAreasForm").addEventListener("submit", saveInterestPreferences);
  
    } catch (error) {
      console.error('Error loading interest areas:', error);
      container.innerHTML = "<p>Ocurrió un error al cargar las áreas de interés. Por favor, intenta de nuevo más tarde.</p>";
    }
  }
  
  // Función auxiliar para convertir color hex a rgba
  function hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Función para guardar las preferencias de áreas de interés
  function saveInterestPreferences(event) {
    event.preventDefault()
    const selectedAreas = Array.from(
      document.querySelectorAll('#interestAreasContainer input[type="checkbox"]:checked'),
    ).map((checkbox) => Number.parseInt(checkbox.value))
    localStorage.setItem("selectedInterestAreas", JSON.stringify(selectedAreas))
    alert("Preferencias guardadas con éxito")
  }
  
  
  // Inicializar el panel activo y cargar áreas de interés al cargar la página
  document.addEventListener("DOMContentLoaded", () => {
    togglePanels("perfilUsuario")
    loadInterestAreas()
  })
  


//obtengo los datos del alumno dependiendo el token que tengo en localstorage
async function cargarDatosUsuario() {
    const token = sessionStorage.getItem("token");

    try { 
        const response = await fetch("../data/alumno.json", {
            method: "GET"
        });

        if (!response.ok) { 
            throw new Error("Error al obtener datos");
        }

        const usuario = await response.json();
        document.getElementById("userName").innerText = usuario.nombre+" "+usuario.apellido;
        document.getElementById("userEmail").innerHTML = `<i class="bi bi-envelope-fill me-1" aria-hidden="true"></i> ${usuario.email}`;
        document.getElementById("miembroDesde").innerHTML = `<i class="bi bi-calendar-check me-2"></i> ${usuario.fechaIngreso}`;
        document.getElementById("email").value = usuario.email;
        document.getElementById("documento").value = usuario.documento;
        document.getElementById("telefono").value = usuario.telefono;
        document.getElementById("ubicacion").value = usuario.provincia; 
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}
document.addEventListener("DOMContentLoaded", cargarDatosUsuario);

//cursos Actuales (En curso)
async function cargarCursosEnCurso() {
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch("../data/cursosAlumno.json", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error al obtener cursos");
        }

        const { cursos } = await response.json();
        const contenedorCursos = document.getElementById("contenedorCursosActuales");
        contenedorCursos.innerHTML = "";

        cursos.forEach((curso) => {
            const cursoHTML = `
                  <div class="list-group-item border rounded shadow-sm p-3">
                      <div class="d-flex w-100 justify-content-between align-items-center mb-3">
                          <h6 class="mb-0 fw-bold">${curso.nombreCurso}</h6>
                          <span class="badge bg-primary rounded-pill">En curso</span>
                      </div>
                      <div class="progress mb-3" style="height: 10px;" aria-label="Progreso del curso">
                          <div class="progress-bar bg-primary" role="progressbar" style="width: ${curso.progreso};" aria-valuenow="${curso.progreso}" aria-valuemin="0" aria-valuemax="100">
                          </div>
                      </div>
                      <div class="d-flex justify-content-between align-items-center small text-muted mb-3">
                          <span class="fw-semibold">Progreso: ${curso.progreso}</span>
                      </div>
                      <div class="d-flex flex-wrap gap-3 text-muted small mb-3">
                          <span class="bg-light p-2 rounded"><i class="bi bi-calendar3 me-1"></i>${curso.dias.join(", ")}</span>
                          <span class="bg-light p-2 rounded"><i class="bi bi-clock me-1"></i>${curso.horarios}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-2">
                          <div class="text-danger small fw-semibold">
                              <i class="bi bi-exclamation-circle me-1"></i>Vence: ${curso.vencimiento}
                          </div>
                          <button class="btn btn-primary">
                              <i class="bi bi-credit-card me-1"></i>Pagar Cuota
                          </button>
                      </div>
                  </div>`;
            contenedorCursos.innerHTML += cursoHTML;
        });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
    }
}
document.addEventListener("DOMContentLoaded", cargarCursosEnCurso);

//cursos terminados y aprobados para imprimir certificados 
async function cargarCursosTerminados() {
    const token = sessionStorage.getItem("token");
    try {
        const response = await fetch("../data/cursosTerminados.json", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Error al obtener cursos"); 
        }

        const { cursosTerminados } = await response.json();        
        const contenedorCursosTerminados = document.getElementById("cursosTerminados");
        contenedorCursosTerminados.innerHTML = "";

        cursosTerminados.forEach((curso) => {
            const cursoHTML = `
                <div class="col-12 col-lg-4 col-md-4 mb-4">
                    <div class="card h-100 shadow-sm hover-shadow transition">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h3 class="h5 mb-0">${curso.nombre}</h3>
                                <span class="badge bg-success">Completado</span>
                            </div>
                            <div class="mb-3">
                                <div class="progress" style="height: 8px;" aria-label="Progreso del curso">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap gap-2 mb-3 text-muted small">
                                <span><i class="bi bi-calendar-check me-1"></i>Finalizado: ${curso.fecha}</span>
                                <span><i class="bi bi-award me-1"></i>Nota final: ${curso.nota}</span>
                            </div>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" type="button">
                                    <i class="bi bi-download me-2"></i>Descargar Certificado
                                </button>
                                <button class="btn btn-outline-primary" type="button">
                                    <i class="bi bi-eye me-2"></i>Ver Detalles del Curso
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
                contenedorCursosTerminados.innerHTML += cursoHTML;
        });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
    }
}
document.addEventListener("DOMContentLoaded", cargarCursosTerminados); 
//Recursos Guardados
async function cargarRecursosGuardados() {
    const token = sessionStorage.getItem("token");
    try {
            const response = await fetch("../data/recursosGuardados.json", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Error al obtener cursos"); 
            }

            const { recursosGuardados } = await response.json();        
            const contenedorRecursosGuardados = document.getElementById("recursosGuardados");
            contenedorRecursosGuardados.innerHTML = "";

            recursosGuardados.forEach((curso) => {
                const cursoHTML = `
                <div class="col-6 col-md-4">
                    <article class="card h-100 shadow-sm hover-shadow transition rounded-0">
                        <img src="${curso.imagenPortada}" 
                            class="card-img-top object-fit-cover position-relative" 
                            height="240">
                        <div class="position-relative bottom-0 start-0 w-100">
                            <div class="p-1 text-white text-center small" style="background-color: ${curso.colorArea}">
                                ${curso.areas.map((area, index, array) => `${area}${index < array.length - 1 ? ' - ' : ''}`).join('')}
                            </div>
                        </div>
                        <div class="card-body d-flex flex-column p-2">
                            <h6 class="text-center">${curso.titulo}</h6>
                            <time datetime="${curso.fecha}" class="text-muted text-center small">${curso.fecha}</time>
                        </div>
                    </article>
                </div>`;
        contenedorRecursosGuardados.innerHTML += cursoHTML;
            });
    } catch (error) {
        console.error("Error al cargar cursos:", error);
    }
}
document.addEventListener("DOMContentLoaded", cargarRecursosGuardados); 
