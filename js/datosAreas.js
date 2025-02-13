const fetchAreas = async () => {
    const response = await fetch('../data/areas.json');
    const data = await response.json();
    localStorage.setItem('areas', JSON.stringify(data.areas));
    return data.areas;
}

fetchAreas().then(areas => {
    // Do something with the areas
});

