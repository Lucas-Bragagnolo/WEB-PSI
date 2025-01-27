const areas = JSON.parse(sessionStorage.getItem('areas')) || [];
if (areas.length === 0) {
    fetch('../data/areas.json')
        .then(response => response.json())
        .then(data => {
            areas.push(...data.areas);
            sessionStorage.setItem('areas', JSON.stringify(areas));
        });
}
