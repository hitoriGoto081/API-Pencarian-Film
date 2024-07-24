const searchBtn = document.querySelector('.search-button');

searchBtn.addEventListener('click', async function() {
    try {
        const inputKeyword = document.querySelector('.input-keyword');
        const movies = await getMovies(inputKeyword.value);
        updateUI(movies);
    } catch (err) {
        showErrorAlert('Error fetching movies: ' + err.message);
    }
});

function getMovies(keyword) {
    return fetch('https://www.omdbapi.com/?apikey=76a9a7b5&s=' + keyword)
        .then(response => response.json())
        .then(response => {
            if (response.Response === "False") {
                throw new Error(response.Error);
            }
            return response.Search;
        })
        .catch(err => {
            console.error('Error in getMovies:', err);
            throw err;
        });
}

function updateUI(movies) {
    let cards = '';
    movies.forEach(m => cards += showCards(m));
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.innerHTML = cards;
}

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('modal-detail-button')) {
        try {
            const imdbID = e.target.dataset.imdbid;
            const movieDetail = await getMovieDetail(imdbID);
            updateUIDetail(movieDetail);
        } catch (err) {
            showErrorAlert('Error fetching movie details: ' + err.message);
        }
    }
});

function getMovieDetail(imdbID) {
    return fetch('https://www.omdbapi.com/?apikey=76a9a7b5&i=' + imdbID)
        .then(response => response.json())
        .then(m => {
            if (m.Response === "False") {
                throw new Error(m.Error);
            }
            return m;
        })
        .catch(err => {
            console.error('Error in getMovieDetail:', err);
            throw err;
        });
}

function updateUIDetail(m) {
    const movieDetail = showMovieDetail(m);
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = movieDetail;
}

function showErrorAlert(message) {
    const alertPlaceholder = document.querySelector('.alert-placeholder');
    const alertHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                           ${message}
                           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                       </div>`;
    alertPlaceholder.innerHTML = alertHTML;
}

function showCards(m) {
    return `<div class="col-md-3 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-bs-toggle="modal" 
                            data-bs-target="#movieDetailModal" data-imdbid="${m.imdbID}">
                            Show Details
                        </a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(m) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${m.Poster}" class="img-fluid">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                            <li class="list-group-item"><strong>Director : </strong> ${m.Director}</li>
                            <li class="list-group-item"><strong>Actors : </strong> ${m.Actors}</li>
                            <li class="list-group-item"><strong>Writer : </strong> ${m.Writer}</li>
                            <li class="list-group-item"><strong>Plot : </strong><br> ${m.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}
