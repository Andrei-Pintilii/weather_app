document.addEventListener("DOMContentLoaded", () => {
    initializeSearch((city) => {
        updateWeather(city).then(() => updateFavoritePanel());
    });
});
