const peliculasContainer = document.querySelector('main.peliculas');
const modalContainer = document.querySelector('.modal')
let page = 1;
let last = "";
var search = "";
var generos = [];

/* Obtener array de géneros */
fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES')
    .then(res => res.json())
    .then(res => generos = res.genres)

/* Modal */
function openClose() {
    document.querySelector(".fondoModal").classList.toggle('closed');
    document.querySelector(".modal").classList.toggle('closed');
}

async function modal(movieId) {
    let res = await fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES')
    res = await res.json();
    openClose();
    modalContainer.innerHTML = "";
    modalContainer.innerHTML += `
    <h3>Título: ${res.title}</h3>
    <h5>Título original: ${res.original_title}</h5>
    <p>Fecha de publicación: ${res.release_date}</p>
    <br>
    <div class="escription">Descripción:<br>${res.overview}</div>
    <br>
    <button class="boton" onclick="openClose()">Cerrar</button>
    `
}

/* Fondo de inicio */
window.addEventListener("click", quitarHeight);

function quitarHeight(event) {
    event.target.removeEventListener(event.type, quitarHeight);
    document.querySelector(".peliculas").classList.toggle('inicio');
}

/* Meter al DOM las películas */
function printMovies(res) {
    const peliculas = res.results;
    peliculasContainer.innerHTML = '';
    const baseImgUrl = 'https://image.tmdb.org/t/p/w185';
    peliculas.forEach(pelicula => {
        const generosPelicula = generos.filter(genero => pelicula.genre_ids.includes(genero.id)).map(genero => genero.name).join(', ');
        const imagen = pelicula.poster_path ? `<img src="${baseImgUrl}${pelicula.poster_path}" onclick="modal(${pelicula.id})">` : '<img src="./images/none.jpg">'
        peliculasContainer.innerHTML += `
        <div class="pelicula">
        <h3 class="title">${pelicula.title}</h3>
        ${imagen}
        <p>${pelicula.release_date}</p>
        <p>${generosPelicula}</p>
        </div>`
    })
};

/* Paginacion */
function pageAnt() {
    if (page > 1) {
        page--;
        document.querySelector("#pag").innerHTML = `${page}`;
        if (last === "top") {
            getTopRated(page);
        } else if (last === "pop") {
            getPopular(page);
        } else if (last === "now") {
            getNowPlaying(page);
        } else if (last === "search") {
            getSearch(search, page);
        }
    }
}

function pageSig() {
    page++;
    document.querySelector("#pag").innerHTML = `${page}`;
    if (last === "top") {
        getTopRated(page);
    } else if (last === "pop") {
        getPopular(page);
    } else if (last === "now") {
        getNowPlaying(page);
    } else if (last === "search") {
        getSearch(search, page);
    }
}

/* Botones */
function getTopRated(page) {
    if (last !== "top") { page = 1 }
    fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=' + page)
        .then(res => res.json())
        .then(res => printMovies(res))
    last = "top";
}

function getPopular(page) {
    if (last !== "pop") { page = 1 }
    fetch('https://api.themoviedb.org/3/movie/popular?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&page=' + page)
        .then(res => res.json())
        .then(res => printMovies(res))
    last = "pop";
}

function getNowPlaying(page) {
    if (last !== "now") { page = 1 }
    fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&region=ES&page=' + page)
        .then(res => res.json())
        .then(res => printMovies(res))
    last = "now";
}

function getSearch(search, page) {
    if (last !== "search") { page = 1 }
    fetch('https://api.themoviedb.org/3/search/movie?api_key=cea68b520beecac6718820e4ac576c3a&language=es-ES&query=' + search + '&page=' + page)
        .then(res => res.json())
        .then(res => printMovies(res))
    last = "search";
}



/* Buscador */
document.querySelector('.buscarInput')
    .addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            search = event.target.value;
            getSearch(search, 1)
        }
    })