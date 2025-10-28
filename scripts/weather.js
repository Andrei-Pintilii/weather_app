const WEATHER_API_KEY = "3e32cae672727d914fc5e81f491eaa81";
const PEXELS_API_KEY = "XXfXYLnLF5kTTNq55hc9DytnRNaZoaV5ewVCFGE3fI0fAnyFMcr4a7ro";

async function updateWeather(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.cod !== 200) {
            document.getElementById("weather-panel").innerHTML = `<p>Orasul nu a fost gasit.</p>`;
            return;
        }
        renderWeather(data);
        updateBackground(city);
        fetchForecast(city);
    } catch (error) {
        console.error("Eroare la cautarea datelor:", error);
    }
}

function renderWeather(data) {
    const weatherPanel = document.getElementById("weather-panel");
    const cityName = data.name;

    const isFavorite = favoriteCities.includes(cityName);

    weatherPanel.innerHTML = `
        <h2>${cityName}, ${data.sys.country}</h2>
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Conditii: ${data.weather[0].description}</p>
        <p>Umiditate: ${data.main.humidity}%</p>
        <button class="favorite-btn ${isFavorite ? "active" : ""}" 
                onclick="toggleFavorite('${cityName}')">
            ❤
        </button>
    `;
}

async function updateBackground(city) {
    const API_URL = `https://api.pexels.com/v1/search?query=${city}`;
    try {
        const response = await fetch(API_URL, {
            headers: { Authorization: PEXELS_API_KEY }
        });
        const data = await response.json();
        const imageUrl = data.photos[0]?.src.original || "assets/images/placeholder.jpg";
        document.body.style.backgroundImage = `url('${imageUrl}')`;
    } catch (error) {
        console.error("Eroare la gasirea imaginii de fundal:", error);
    }
}

async function fetchForecast(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        renderForecast(data);
    } catch (error) {
        console.error("Eroare la gasirea prognozei pe 5 zile:", error);
    }
}

function renderForecast(data) {
    const forecastPanel = document.getElementById("forecast-panel");
    forecastPanel.innerHTML = "<h3>Prognoza pe 5 zile</h3>";

    const dailyForecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecast.forEach(day => {
        const date = new Date(day.dt_txt).toLocaleDateString();
        const temp = day.main.temp;
        const description = day.weather[0].description;

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p><strong>${date}</strong></p>
            <p>Temperatura: ${temp}°C</p>
            <p>Conditii: ${description}</p>
        `;

        forecastPanel.appendChild(card);
    });
}

let favoriteCities = [];

function toggleFavorite(city) {
    const index = favoriteCities.indexOf(city);

    if (index === -1) {
        if (favoriteCities.length >= 5) {
            favoriteCities.shift();
        }
        favoriteCities.push(city);
    } else {
        favoriteCities.splice(index, 1);
    }

    updateFavoritePanel();
}

function updateFavoritePanel() {
    const favoritePanel = document.getElementById("favorite-cities");
    favoritePanel.innerHTML = "";

    favoriteCities.forEach(async (city) => {
        const data = await fetchWeather(city);
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <h4>${data.name}</h4>
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Conditii: ${data.weather[0].description}</p>
        `;
        favoritePanel.appendChild(card);
    });

    const currentCity = document.querySelector("#weather-panel h2")?.textContent.split(",")[0];
    const favoriteBtn = document.querySelector(".favorite-btn");
    if (favoriteBtn) {
        favoriteBtn.classList.toggle("active", favoriteCities.includes(currentCity));
    }
}

async function fetchWeather(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${WEATHER_API_KEY}`;
    const response = await fetch(API_URL);
    return response.json();
}
