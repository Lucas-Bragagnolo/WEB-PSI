document.addEventListener("DOMContentLoaded", function () {
    // Cargar el menú dinámicamente
    fetch("./menu_pages.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
            marcarLinkActivo(); // Llamamos a la función después de cargar el menú
            cargarUsuario(); // Cargar info de usuario
        })
        .catch(error => console.error("Error cargando el menú:", error));
});

// Función para marcar el link activo según la página
function marcarLinkActivo() {
    let currentPage = window.location.pathname.split("/").pop() || "index.html"; // Si está en "/", usamos index.html
    let links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        if (link.getAttribute("href").includes(currentPage)) {
            link.classList.add("active");
        }
    });
}

// Función para cargar datos del usuario (simulado)
function cargarUsuario() {
    let userContainer = document.getElementById("user-container");

    // Simulación de datos de usuario obtenidos desde un backend
    let userData = {
        loggedIn: true, // Cambiar a `false` para probar usuario no logueado
        name: "Juan Pérez",
        profileImg: "https://picsum.photos/100"
    };

    if (userData.loggedIn) {
        userContainer.innerHTML = `
            <div class="d-flex align-items-center me-5">
                <div class="nav-item dropdown me-2">
                    <a class="nav-link dropdown-toggle p-0" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="${userData.profileImg}" alt="User Profile" class="rounded-circle" width="40" height="40">
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="./pages/login.html">Mi perfil</a></li>
                        <li><a class="dropdown-item" href="#">Acceso Campus</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
                    </ul>
                </div>
                <a class="btn btn-outline-secondary rounded-pill me-2" href="/pages/login.html">
                    <i class="fas fa-user"></i> Campus Online
                </a>  
            </div>
        `;
    } else {
        userContainer.innerHTML = `
            <a class="btn btn-outline-secondary rounded-pill me-2" href="/pages/login.html">
                <i class="fas fa-user"></i> Iniciar sesión
            </a>
        `;
    }
}
