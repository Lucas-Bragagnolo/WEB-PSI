async function cargarDatosUsuario() {
    const token = sessionStorage.getItem("token");

    try {
        const response = await fetch("https://api.tuservicio.com/perfil", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Error al obtener datos");
        }

        const usuario = await response.json();

        document.getElementById("nombreUsuario").innerText = usuario.nombre;
        document.getElementById("email").value = usuario.email;
        document.getElementById("documento").value = usuario.documento;
        document.getElementById("telefono").value = usuario.telefono;
        document.getElementById("ubicacion").value = usuario.ubicacion;
    } catch (error) {
        console.error("Error al cargar datos:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarDatosUsuario);
