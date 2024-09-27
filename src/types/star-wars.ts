// Модуль для работы с API Star Wars. 
// Все методы обращаются к стороннему сервису, запрашивают данные у него.
// Методы асинхронны, они возвращают Promise.

// Есть следующие методы:
// starWars.searchCharacters(query), 
// starWars.searchPlanets(query), 
// starWars.searchSpecies(query).
// starWars.getCharactersById(id), 
// starWars.getPlanetsById(id), 
// starWars.getSpeciesById(id)


// Код ниже разбирать не нужно. 
// Всё, что вам необходимо знать: эти методы умеют получать данные и возвращают промисы.
// Поробуйте запустить их в своем скрипте search.js.

const starWars = {

  // --- Search Methods ---

 searchCharacters: (query: string) => {
    return new Promise((resolve) => {
      fetch(`https://swapi.py4e.com/api/people/?search=${query}`)
        .then(response => response.json())
        .then(characters => resolve(characters))
        .catch(err => console.log('searchCharacters error: ', err));
    });
  },

  searchPlanets: (query: string) => {
    return new Promise((resolve) => {
      fetch(`https://swapi.py4e.com/api/planets/?search=${query}`)
        .then(response => response.json())
        .then(planets => resolve(planets))
        .catch(err => console.log('searchPlanets error: ', err));
    });
  },

  searchSpecies: (query: string) => {
    return new Promise((resolve) => {
      fetch(`https://swapi.py4e.com/api/species/?search=${query}`)
        .then(response => response.json())
        .then(species => resolve(species))
        .catch(err => console.log('searchSpecies error: ', err));
    });
  },

  // --- Get By Id Methods ---

  getCharactersById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/people/${id}`)
  ).json()),
  
  getStarshipsById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/starships/${id}`)
  ).json()),

  getVehiclesById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/vehicles/${id}`)
  ).json()),

  getPlanetsById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/planets/${id}`)
  ).json()),

  getSpeciesById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/species/${id}`)
  ).json()),

  getFilmsById: async (id: string) => (await (
    await fetch(`https://swapi.py4e.com/api/films/${id}`)
  ).json()),
}
