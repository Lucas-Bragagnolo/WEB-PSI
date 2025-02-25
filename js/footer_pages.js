document.addEventListener("DOMContentLoaded", function () {
    // Cargar el menú dinámicamente
    fetch("../pages/footer_pages.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => console.error("Error cargando el menú:", error));
});