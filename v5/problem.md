# We've hit a roadblock! 
### Unfortunately, we encountered a lot of errors in this phase, and phase six, such as the pesky "⚠️ Network error. Check your connection."
and the "❌ Could not get weather data." I tried a LOT of things, going even as far as deleting all my js, and starting over from scratch! 
(Turns out it was just an error with my computer :) )
I have documented the code I tried during this phase, and it is all supplied below.

# 🚧 Phase 5: The Roadblock
### "If it can go wrong, it will..."

Unfortunately, I encountered a series of persistent errors during this phase and Phase 6 that completely stalled progress:

* **⚠️ Network Error:** "Check your connection."
* **❌ Fetch Failure:** "Could not get weather data."

I went into full "debug mode"—I tried everything from refactoring functions to eventually **deleting all my JavaScript** and starting again from scratch! 

> **The Plot Twist:** After all that troubleshooting, it turns out the code was fine; the issue was just a temporary glitch with my computer! :)

### 📓 Documented Attempts
I’ve preserved the code and logic I attempted during this "Roadblock Phase" below for future reference.
---
VERSION 1:

async function handleSearch() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    display.innerHTML = "Searching...";

    try {
        // Prepare the city name for a URL (handles spaces/commas)
        const safeName = encodeURIComponent(cityName);
        const geoUrl = `https://open-meteo.com{safeName}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) {
            throw new Error(`Server responded with ${geoResponse.status}`);
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            display.innerHTML = `No results found for "${cityName}".`;
            return;
        }

        const { latitude, longitude, name, admin1, country } = geoData.results[0];
        const locationLabel = admin1 ? `${name}, ${admin1}` : `${name}, ${country}`;

        // Proceed to fetch weather
        fetchWeather(latitude, longitude, locationLabel);

    } catch (error) {
        // This will give MUCH more detailed error logs.
        display.innerHTML = "⚠️ Network error. Check console (F12) for details.";
        console.error("DEBUG INFO:", error.message);
    }
}

---

END OF VERSION 1.

***

Version 2:

async function handleSearch() {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    display.innerHTML = "Connecting...";

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Stop after 5 seconds

        const geoUrl = `https://open-meteo.com{encodeURIComponent(cityName)}&count=1`;
        
        const response = await fetch(geoUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        const data = await response.json();
        if (!data.results) {
            display.innerHTML = "City not found.";
            return;
        }

        fetchWeather(data.results[0].latitude, data.results[0].longitude, data.results[0].name);
    } catch (err) {
        display.innerHTML = err.name === 'AbortError' ? "Request timed out." : "Blocked by browser or Ad-blocker.";
        console.error("Full Error:", err);
    }
}



---
