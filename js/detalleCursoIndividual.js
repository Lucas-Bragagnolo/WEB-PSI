document.addEventListener('DOMContentLoaded', async function() {
    // Obtener el ID del curso de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('idcur');

    if (cursoId) {
        try {
            // Cargar los datos del curso
            const response = await fetch('../data/cursos.json');
            if (!response.ok) throw new Error("Error al cargar el archivo JSON");
            const cursos = await response.json();
            console.log(datosCurso);
            // Buscar el curso por ID
            const curso = cursos.find(c => c.id === parseInt(cursoId));

            if (curso) {
                // Actualizar los elementos HTML con los datos del curso
                
                document.getElementById('introduccion').textContent = curso.introduccion;
                document.getElementById('profesor').textContent = `Profesor/a: ${curso.profesor}`;
                document.getElementById('tipoCurso').textContent = curso.tipoCurso;
                document.getElementById('modalidad').textContent = curso.tipoModalidad;
                document.getElementById('area').textContent = curso.area;
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
                console.log(curso.fechainicio)

                // Actualizar la imagen del banner
                const bannerDesktop = document.querySelector('main img.d-none.d-lg-block');
                const bannerMobile = document.querySelector('main img.d-lg-none');
                if (bannerDesktop) bannerDesktop.src = curso.bannerEscritorio;
                if (bannerMobile) bannerMobile.src = curso.bannerCelular;

                // Actualizar el video (si existe)
                const videoContainer = document.getElementById('video');
                if (videoContainer && curso.video) {
                    videoContainer.innerHTML = `
                        <iframe width="100%" height="315" src="${curso.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `;
                }

                //actualizar El boton inscribirse en el caso de que fecha de inicio no exista
                const inscribirse = document.getElementById('inscripcion');
                console.log(inscribirse)
                if (inscribirse) {
                    if (curso.fechainicio) {
                        inscribirse.href = `inscripcion.html?idcur=${curso.id}`;
                        inscribirse.textContent = 'Inscribirme';
                        inscribirse.removeAttribute('disabled');
                    } else {
                        inscribirse.href = 'javascript:void(0)';
                        inscribirse.textContent = 'Inscripción no disponible';
                        inscribirse.setAttribute('disabled');
                    }
                }
                

                // Actualizar reseñas (si existen)
                const resenasContainer = document.querySelector('#testimoniosCarousel .carousel-inner');
                if (resenasContainer && curso.reseñas) {
                    resenasContainer.innerHTML = curso.reseñas.map((resena, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <div class="d-flex align-items-center mx-auto" style="max-width: 600px;">
                                <div class="me-4 mb-2 mb-sm-0">
                                    <img src="${resena.imagen}" alt="Foto de ${resena.autor}" class="rounded-circle" width="100" height="100">
                                </div>
                                <div class="text-dark">
                                    <p class="card-text lead">"${resena.descripcion}"</p>
                                    <div class="mt-4">
                                        <h5 class="card-title mb-0 fw-bold">${resena.autor}</h5>
                                    </div>
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