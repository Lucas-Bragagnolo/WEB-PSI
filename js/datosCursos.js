const fetchCursos = async () => {
    const cursos = JSON.parse(sessionStorage.getItem('cursos')) || [];
    if (cursos.length === 0) {
        const response = await fetch('../data/cursos.json');
        const data = await response.json();
        cursos.push(...data.cursos);
        sessionStorage.setItem('cursos', JSON.stringify(cursos));
    }
    return cursos;
}
fetchCursos