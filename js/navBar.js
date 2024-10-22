document.addEventListener("DOMContentLoaded", function () {
    var dropdownLink = document.querySelector('#navbarDropdown');
    var slidebar = document.querySelector('.slidebar');
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    dropdownLink.addEventListener('click', function (e) {
        // Solo activar el slidebar en pantallas pequeñas
        if (window.innerWidth <= 991.98) {
            e.preventDefault();
            slidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        }
    });

    // Cerrar el slidebar al hacer clic en el overlay
    overlay.addEventListener('click', function () {
        slidebar.classList.remove('show');
        overlay.classList.remove('show');
    });
});
