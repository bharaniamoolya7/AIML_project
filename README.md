🌧️ RainSense – Smart Rainy Day Route Finder

📌 Overview
RainSense is a web-based application that helps users find the safest route to their destination during rainy weather.

It provides:

-A safe (green) route

-Estimated travel time & arrival time

-Step-by-step directions

-Safety message & traffic hints

-Simple login/register system
_____________________________________________________________________________________________________________________________________________________________________________
🚀 Features

-🔑 User authentication (Register & Login)

-👋 Personalized greeting after login

-📍 Detects current location using Geolocation API

-🎯 Destination search via OpenRouteService (ORS) API

-🛣️ Displays the safest route in green

-⏱️ Shows travel time & estimated arrival time

-🗺️ Step-by-step directions displayed in the center panel

-🌐 Responsive & neat UI
_____________________________________________________________________________________________________________________________________________________________________________
🛠️ Tech Stack

-Frontend: HTML, CSS, JavaScript

-Map Library: Leaflet.js

-Routing & Geocoding: OpenRouteService API

-Data Storage: Browser LocalStorage (for login simulation)
_____________________________________________________________________________________________________________________________________________________________________________
📂 Project Structure

RainSense

├── index.html        # Register page

├── login.html        # Login page

├── home.html         # Home with greeting & rain question

├── location.html     # Detect location + ask destination

├── map.html          # Map with safest route + directions

├── style.css         # Styling

├── script.js         # Main logic (auth, location, routing)
______________________________________________________________________________________________________________________________________________________________________________
🚧 Limitations

-Only shows one safest route (not multiple).

-Uses local storage for login (not secure for production).
______________________________________________________________________________________________________________________________________________________________________________
👩‍💻 Author

-Developed as a project named RainSense ☔ – Smart Route Finder during Rains
