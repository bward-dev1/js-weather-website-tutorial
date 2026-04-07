const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const resultDiv = document.getElementById('weather-result');

async function searchWeather() {
    const cityName = cityInput.value.trim();
    if (!cityName) return alert("Please enter a city name");

    resultDiv.innerText = "Searching for city...";

    try {
        // Step 1: Get coordinates from Geocoding API
        const geoUrl = `https://open-meteo.com{cityName}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            resultDiv.innerText = "City not found.";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Use those coordinates for the Weather API
        resultDiv.innerText = `Loading weather for ${name}...`;
        const weatherUrl = `https://open-meteo.com{latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`;
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Step 3: Display the results (if it works, that is)
        const temp = weatherData.current.temperature_2m;
        resultDiv.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p>Temperature: ${temp}°C</p>
        `;

    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerText = "An error occurred. Check the console.";
    }
}

// automatically trigger search on button click
searchBtn.addEventListener('click', searchWeather);
