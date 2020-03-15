const peliculasContainer = document.querySelector('main.peliculas');
const modalContainer = document.querySelector('.modal');
const preventDefault = event => event.preventDefault();
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
    if (res.overview === "") { res.overview = "No hay descripción disponible." }
    const anno = res.release_date.split("-").reverse().join("/")
    modalContainer.innerHTML = "";
    modalContainer.innerHTML += `
    <h2>${res.title}</h2>
    <h4>Título original: ${res.original_title}</h4>
    <h5>Fecha de publicación: ${anno}</h5>
    <br>
    <div class="escription">Descripción:</div>
    <blockquote><q>${res.overview}</q></blockquote>
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
        const anno = pelicula.release_date.split("-").reverse().join("/")
        peliculasContainer.innerHTML += `
        <div class="pelicula">
        <h3 class="title">${pelicula.title}</h3>
        ${imagen}
        <p>${anno}</p>
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