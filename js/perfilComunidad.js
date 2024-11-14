function togglePanels(panelToShow) {
    const perfilUsuario = document.getElementById('perfilUsuario');
    const areasInteres = document.getElementById('areasInteres');
    const meGusta = document.getElementById('meGusta');
    const areasIntereses = document.getElementById('areaIntereses');
    const likes = document.getElementById('likes');
    const perfilUsu = document.getElementById('perfilUsu');
    
    // Ocultar todos los paneles primero
    [perfilUsuario, areasInteres, meGusta].forEach(panel => {
        panel.classList.remove('d-block');
        panel.classList.add('d-none');
    });
    
    // Mostrar el panel seleccionado
    if (panelToShow === 'areasInteres') {
        areasInteres.classList.remove('d-none');
        areasInteres.classList.add('d-block');
        perfilUsu.classList.remove('active');
        areasIntereses.classList.add('active');
        likes.classList.remove('active');
    } else if (panelToShow === 'meGustas') {
        meGusta.classList.remove('d-none');
        meGusta.classList.add('d-block');
        perfilUsu.classList.remove('active');
        likes.classList.add('active');
        areasIntereses.classList.remove('active');
    } else {
        perfilUsuario.classList.remove('d-none');
        perfilUsuario.classList.add('d-block');
        perfilUsu.classList.add('active');         
        likes.classList.remove('active');
        areasIntereses.classList.remove('active');

    }
}