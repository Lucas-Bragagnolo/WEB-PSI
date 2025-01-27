document.addEventListener('DOMContentLoaded', function() {
    const menuTrigger = document.querySelector('.menu-trigger');
    const megaMenu = document.querySelector('.mega-menu');
    const areaItems = document.querySelectorAll('.area-item');
    const coursesList = document.querySelector('.courses-list');

    const courses = {
        psicologia: ['Introducción a la Psicología', 'Psicología Clínica', 'Psicología Organizacional'],
        autismo: ['Fundamentos del TEA', 'Intervención Temprana', 'Estrategias Educativas para TEA'],
        educacion: ['Metodologías de Enseñanza', 'Tecnología en la Educación', 'Evaluación del Aprendizaje'],
        crecimiento: ['Desarrollo de Habilidades Sociales', 'Gestión del Tiempo', 'Mindfulness y Meditación'],
        gerontologia: ['Cuidado del Adulto Mayor', 'Psicología del Envejecimiento', 'Nutrición en la Tercera Edad'],
        crianza: ['Disciplina Positiva', 'Desarrollo Infantil', 'Comunicación Familiar'],
        coaching: ['Coaching de Vida', 'Coaching Ejecutivo', 'Herramientas de Coaching'],
        terapias: ['Aromaterapia', 'Terapia de Flores de Bach', 'Acupuntura']
    };

    menuTrigger.addEventListener('click', function() {
        megaMenu.classList.toggle('show');
    });

    areaItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            areaItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            updateCourses(this.dataset.area);
        });
    });

    function updateCourses(area) {
        const areaName = area.charAt(0).toUpperCase() + area.slice(1);
        let coursesHtml = `<h3>${areaName}</h3>`;
        courses[area].forEach(course => {
            coursesHtml += `<div class="course-item"><i class="fas fa-book"></i>${course}</div>`;
        });
        coursesList.innerHTML = coursesHtml;
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!megaMenu.contains(event.target) && !menuTrigger.contains(event.target)) {
            megaMenu.classList.remove('show');
        }
    });
});