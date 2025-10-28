let debounceTimeout;

const GEOAPIFY_API_KEY = "075fd6c1fd3942bbb87fdd808b1e2272";

function initializeSearch(onCitySelected) {
    const input = document.getElementById("city-search");

    input.addEventListener("input", () => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(async () => {
            const query = input.value.trim();
            if (query.length >= 3) {
                const suggestions = await fetchCitySuggestions(query);
                renderSuggestions(suggestions, onCitySelected);
            }
        }, 300);
    });
}

async function fetchCitySuggestions(query) {
    const API_URL = `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${GEOAPIFY_API_KEY}`;
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.features.map(feature => feature.properties.city).filter(Boolean);
    } catch (error) {
        console.error("Error fetching city suggestions:", error);
        return [];
    }
}

function renderSuggestions(suggestions, onCitySelected) {
    const suggestionsList = document.getElementById("suggestions-list");
    suggestionsList.innerHTML = "";

    suggestions.forEach(city => {
        const item = document.createElement("li");
        item.textContent = city;
        item.addEventListener("click", () => {
            onCitySelected(city);
            document.getElementById("suggestions-list").innerHTML = "";
        });
        suggestionsList.appendChild(item);
    });
}
