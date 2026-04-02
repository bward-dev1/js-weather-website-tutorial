// 1. Select the elements I need
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const display = document.getElementById('weather-display');

// --- Helper Function: Get Weather from Coordinates ---
async function fetchWeather(lat, lon, locationName) {
  display.innerHTML = `Loading weather for ${locationName}...`;
  
  // Connects to the Open-Meteo Forecast API
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    const temp = data.current.temperature_2m;
    display.innerHTML = `
      <div style="margin-top: 20px;">
        <h2 style="margin: 0;">${locationName}</h2>
        <p style="font-size: 2rem; margin: 10px 0;">${temp}°C</p>
      </div>
    `;
  } catch (error) {
    display.innerHTML = "Error fetching weather data.";
    console.error(error);
  }
}

// --- Another Awesome Function: Search by City Name. ---
async function handleSearch() {
  const cityName = cityInput.value.trim();
  if (!cityName) return alert("Please enter a city name");

  display.innerHTML = "Finding city...";

  try {
    // Connects to the Open-Meteo Geocoding API to turn our text (the input that the user gives it) into coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      display.innerHTML = "City not found. Try another name.";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    
    // Pass the coordinates to the weather fetcher
    fetchWeather(latitude, longitude, `${name}, ${country}`);
  } catch (error) {
    display.innerHTML = "Error finding city.";
    console.error(error);
  }
}

// --- Event Listeners (these wait for a defined (something) to happen, and then executes an action.) For example, we did this in the
// mindstorms robotics when we did the if function, eg. (IF color = green THEN execute> ( move motor A 50 degrees ) )
// the main difference is, here we use IF button = clicked, THEN handleSearch.
// ---

// Triggers search when user clicks the "Search City" button
searchBtn.addEventListener('click', handleSearch);
