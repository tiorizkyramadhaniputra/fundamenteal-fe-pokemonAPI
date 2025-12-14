
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151'; 
const dashboardRow = document.getElementById('pokemon-row');
const loadingMessage = document.getElementById('loading-message');


const modalElement = document.getElementById('pokemonModalBootstrap');
const modalDetailBootstrap = document.getElementById('modal-detail-bootstrap');


let pokemonModal; 


// 1. Fungsi Utama: Mengambil daftar Pokémon
async function fetchPokemonList() {
    try {
        const response = await fetch(POKEAPI_URL);
        const data = await response.json();
        
        loadingMessage.style.display = 'none'; 
        
        data.results.forEach(pokemon => {
            renderPokemonCard(pokemon);
        });

    } catch (error) {
        dashboardRow.innerHTML = `<p class="col-12 error-message text-danger">Gagal memuat data Pokémon: ${error.message}</p>`;
    }
}

// 2. Fungsi: Merender Kartu Pokémon di Dashboard
function renderPokemonCard(pokemon) {
    const col = document.createElement('div');
    col.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'col-12', 'mb-4');
    
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

    col.innerHTML = `
        <div class="card pokemon-card shadow-lg h-100" data-url="${pokemon.url}" style="cursor: pointer;">
            <div class="card-body text-center">
                <h5 class="card-title">${name}</h5>
                <p class="card-text text-muted">Klik untuk detail</p>
            </div>
        </div>
    `;
    
    col.querySelector('.card').addEventListener('click', () => {
        fetchPokemonDetail(pokemon.url);
    });

    dashboardRow.appendChild(col);
}

// 3. Fungsi: Mengambil dan Menampilkan Detail di Modal
async function fetchPokemonDetail(url) {
    
    
    pokemonModal.show();
    modalDetailBootstrap.innerHTML = '<h2>Loading Detail...</h2>';

    try {
        const response = await fetch(url);
        const detail = await response.json();

        const name = detail.name.charAt(0).toUpperCase() + detail.name.slice(1);
        const abilities = detail.abilities.map(a => a.ability.name).join(', ');
        const height = detail.height / 10;
        const weight = detail.weight / 10;
        const imageUrl = detail.sprites.front_default;

        modalDetailBootstrap.innerHTML = `
            <div class="text-center">
                <img src="${imageUrl}" alt="${name}" class="pokemon-image mb-3 border border-dark rounded-circle p-2">
                <h3 class="fw-bold">${name} (#${detail.id})</h3>
            </div>
            <hr>
            <div class="row detail-body">
                <div class="col-6"><p><strong>Tinggi:</strong> ${height} m</p></div>
                <div class="col-6"><p><strong>Berat:</strong> ${weight} kg</p></div>
                <div class="col-12"><p><strong>Tipe:</strong> ${detail.types.map(t => t.type.name).join(', ')}</p></div>
                <div class="col-12"><p><strong>Kemampuan:</strong> ${abilities}</p></div>
            </div>
        `;
    } catch (error) {
        modalDetailBootstrap.innerHTML = `<p class="text-danger">Gagal memuat detail: ${error.message}</p>`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    pokemonModal = new bootstrap.Modal(modalElement);
    fetchPokemonList();
});