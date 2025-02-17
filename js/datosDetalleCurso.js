document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del curso de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('idcur');

    if (cursoId) {
        try {
            // Cargar los datos del curso
            const response = await fetch('../data/cursos.json');
            if (!response.ok) throw new Error("Error al cargar el archivo JSON");
            const datosCurso = await response.json();

            // Buscar el curso por ID
            const curso = datosCurso.find(c => c.id === parseInt(cursoId));
            console.log(curso);
            if (curso) {
                // Actualizar los elementos HTML con los datos del curso
                //document.getElementById('tituloCurso').textContent = curso.titulo;
                document.getElementById('introduccion').textContent = curso.introduccion;
                document.getElementById('profesor').textContent = `Profesor/a: ${curso.profesor}`;
                document.getElementById('profesorTitulo').textContent = `${curso.profesorTitulo}`;
                document.getElementById('tipoCurso').textContent = curso.tipoCurso;
                document.getElementById('modalidad').textContent = curso.tipoModalidad;
                document.getElementById('area').textContent = curso.area;
                document.getElementById('area').style.backgroundColor = curso.colorArea;
                document.getElementById('clases').textContent = `${curso.cantidadClases} Clases`;
                document.getElementById('horas').textContent = `${curso.horasDeCursada} horas de estudio`;
                document.getElementById('duracion').textContent = `${curso.duracion} meses duración`;
                const inicioElement = document.getElementById('inicio');
                if (curso.fechainicio) {
                    inicioElement.textContent = `Empieza el ${curso.fechainicio}`;
                } else {
                    inicioElement.textContent = `
                        Inicio: No disponible
                    `;
                }
                const inscribirse = document.getElementById('inscripcion');
                if (inscribirse) {
                    inscribirse.classList.add('btn', 'btn-blanco', "rounded-pill", 'd-block', 'mx-auto', 'mt-3');
                    if (!curso.fechainicio) {                        
                        inscribirse.textContent = 'Proximo inicio';
                    } else {
                        inscribirse.href = `inscripcion.html`;
                        inscribirse.textContent = 'Inscribite AHORA';
                    }
                }
                
                document.getElementById('profesorImg').src = curso.profesorImg; // Actualizar la imagen del profesor{curso.precio};
                // Actualizar la imagen del banner
                const bannerDesktop = document.querySelector('main img.d-none.d-lg-block');
                const bannerMobile = document.querySelector('main img.d-lg-none');
                if (bannerDesktop) bannerDesktop.src = curso.bannerEscritorio;
                if (bannerMobile) bannerMobile.src = curso.bannerCelular;

                // Actualizar el video (si existe)
                const videoContainer = document.getElementById('video');
                if (videoContainer && curso.video) {
                    videoContainer.innerHTML = `
                        <iframe width="100%" height="500" src="https://www.youtube.com/embed/E51CnlMSG2o?si=Pq4Iz4Pzy13cfCOh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    `;
                }

                // Actualizar reseñas (si existen)
                const resenasContainer = document.querySelector('#testimoniosCarousel .carousel-inner');
                if (resenasContainer && curso.reseñas) {
                    resenasContainer.innerHTML = curso.reseñas.map((resena, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <div class="d-flex flex-column align-items-center justify-content-center mx-auto" style="max-width: 400px;">
                               
                                <img src="${resena.imagen}" alt="Foto de ${resena.autor}" class="rounded-circle" width="100" height="100">
                                <div class="mt-4">
                                        <h5 class="card-title mb-0 fw-bold">${resena.autor}</h5>
                                </div>
                                <div class="text-dark">
                                    <p class="card-text lead">"${resena.descripcion}"</p>

                                </div>
                            </div>
                        </div>
                    `).join('');
                }
            } else {
                console.error('Curso no encontrado');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        console.error('ID del curso no proporcionado en la URL');
    }
});