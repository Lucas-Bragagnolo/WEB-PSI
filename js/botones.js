    // Mostrar/ocultar botón volver arriba
    window.onscroll = function() {
        var btnScrollTop = document.querySelector('.btn-scroll-top');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btnScrollTop.style.display = "block";
        } else {
            btnScrollTop.style.display = "none";
        }
    };
    
    // Scroll suave al hacer clic en volver arriba
    document.querySelector('.btn-scroll-top').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });