const API_KEY = "21c37b3cf3fc437adbbab13394d14186";

async function searchCity() {
  const q = document.getElementById("searchInput").value;
  if (!q) return alert("Enter a place");

  const geo = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=1&appid=${API_KEY}`
  ).then(r => r.json());

  if (!geo[0]) return alert("Place not found");

  loadWeather(geo[0].lat, geo[0].lon, geo[0].name, geo[0].country);
}

function useMyLocation() {
  navigator.geolocation.getCurrentPosition(pos => {
    loadWeather(pos.coords.latitude, pos.coords.longitude, "My Location", "");
  });
}

async function loadWeather(lat, lon, name, country) {

  const weather = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  const daily = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
  ).then(r => r.json());

  // CURRENT
  document.getElementById("place").innerText = `${name} ${country}`;
  document.getElementById("temp").innerText = Math.round(weather.main.temp) + "°C";
  document.getElementById("desc").innerText = weather.weather[0].description;
  document.getElementById("feels").innerText = "Feels: " + weather.main.feels_like + "°C";
  document.getElementById("humidity").innerText = "Humidity: " + weather.main.humidity + "%";
  document.getElementById("wind").innerText = "Wind: " + weather.wind.speed + " km/h";

  document.getElementById("current").classList.remove("hidden");

  // FORECAST
  const days = document.getElementById("days");
  days.innerHTML = "";

  daily.daily.slice(0,7).forEach(d => {
    const day = new Date(d.dt * 1000).toLocaleDateString("en",{weekday:"short"});
    days.innerHTML += `<div>${day} • ${Math.round(d.temp.max)}° / ${Math.round(d.temp.min)}°</div>`;
  });

  document.getElementById("forecast").classList.remove("hidden");

  // MAP
  document.getElementById("map").src =
    `https://maps.google.com/maps?q=${lat},${lon}&z=12&output=embed`;

  document.getElementById("mapBox").classList.remove("hidden");
}

function saveFavourite() {
  localStorage.setItem("fav", document.getElementById("place").innerText);
  alert("Saved as favourite ⭐");
}

function setReminder() {
  alert("Reminder saved (Firebase later)");
}
