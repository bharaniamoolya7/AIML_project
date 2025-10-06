document.addEventListener('DOMContentLoaded', () => {

  // ===== REGISTER =====
  const registerBtn = document.getElementById('registerBtn');
  if(registerBtn){
    registerBtn.addEventListener('click', ()=>{
      const user = document.getElementById('regUser').value.trim();
      const pass = document.getElementById('regPass').value.trim();
      if(!user || !pass){ alert('Fill all fields'); return; }
      localStorage.setItem('user', user);
      localStorage.setItem('pass', pass);
      alert('Registered successfully!');
      window.location.href='login.html';
    });
  }

  // ===== LOGIN =====
  const loginBtn = document.getElementById('loginBtn');
  if(loginBtn){
    loginBtn.addEventListener('click', ()=>{
      const u = document.getElementById('loginUser').value.trim();
      const p = document.getElementById('loginPass').value.trim();
      if(u === localStorage.getItem('user') && p === localStorage.getItem('pass')){
        localStorage.setItem('loggedIn', 'true');
        window.location.href='home.html';
      } else alert('Invalid credentials');
    });
  }

  // ===== HOME =====
  const greet = document.getElementById('greet');
  if(greet){
    const name = localStorage.getItem('user');
    greet.innerText = `Hey, ${name} 🌸`;
  }

  const rainYes = document.getElementById('rainYes');
  const rainNo = document.getElementById('rainNo');
  if(rainYes) rainYes.onclick = () => window.location.href='location.html';
  if(rainNo) rainNo.onclick = () => alert('No rain detected');

  // ===== LOCATION =====
  const detectLoc = document.getElementById('detectLoc');
  if(detectLoc){
    detectLoc.onclick = () => {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos => {
          localStorage.setItem('currentLat', pos.coords.latitude);
          localStorage.setItem('currentLng', pos.coords.longitude);
          document.getElementById('destination-container').style.display='block';
        }, err => alert('Could not get location'));
      } else alert('Geolocation not supported');
    }
  }

  const destSubmit = document.getElementById('destSubmit');
  if(destSubmit){
    destSubmit.onclick = () => {
      const dest = document.getElementById('destinationInput').value.trim();
      if(!dest){ alert('Enter destination'); return; }
      localStorage.setItem('destinationName', dest);
      window.location.href='map.html';
    }
  }

  // ===== MAP + ROUTES =====
  const mapDiv = document.getElementById('map');
  if(mapDiv && typeof L !== "undefined"){
    const lat = parseFloat(localStorage.getItem('currentLat'));
    const lng = parseFloat(localStorage.getItem('currentLng'));
    const destName = localStorage.getItem('destinationName');
    if(!lat || !lng || !destName){ alert("Location or destination missing"); return; }

    const map = L.map('map').setView([lat,lng],13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjYxM2U0Yjk0MTM1OTQ0ZTg5ZTMxYzUwOTBiNTM4MjkyIiwiaCI6Im11cm11cjY0In0="; // <-- Replace with your HeiGIT API key

    // 1️⃣ Geocode destination
    fetch(`https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(destName)}`)
      .then(res=>res.json())
      .then(geo=>{
        if(!geo.features || geo.features.length === 0){ alert("Destination not found"); return; }
        const destLat = geo.features[0].geometry.coordinates[1];
        const destLng = geo.features[0].geometry.coordinates[0];

        // 2️⃣ Get routes with alternatives
        const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${lng},${lat}&end=${destLng},${destLat}&alternative_routes[max_alternatives]=2`;

        fetch(url)
          .then(res=>res.json())
          .then(data=>{
            if(!data.features || data.features.length === 0){ alert("No routes found"); return; }

            const colors = ["green","yellow","red"];
            let bestRouteIdx = 0;

            data.features.forEach((route,i)=>{
              const coords = route.geometry.coordinates.map(c=>[c[1],c[0]]);
              const durationMin = route.properties.summary.duration / 60;
              const distanceKm = route.properties.summary.distance / 1000;

              L.polyline(coords,{color:colors[i],weight:5}).addTo(map)
                .bindPopup(`${colors[i].toUpperCase()} Route<br>${distanceKm.toFixed(1)} km<br>${durationMin.toFixed(1)} min`);

              if(i===0) bestRouteIdx = i; // Green route = safest
            });

            L.marker([lat,lng]).addTo(map).bindPopup("Start");
            L.marker([destLat,destLng]).addTo(map).bindPopup(destName);

            const bounds = data.features.flatMap(r=>r.geometry.coordinates.map(c=>[c[1],c[0]]));
            map.fitBounds(bounds);

            // 3️⃣ Safest route message + arrival time
            const bestRoute = data.features[bestRouteIdx];
            const durationGreenMin = bestRoute.properties.summary.duration / 60;
            const distanceGreen = bestRoute.properties.summary.distance / 1000;
            const safeDiv = document.getElementById('safeMessage');
            safeDiv.innerText = `✅ GREEN route is safest (${distanceGreen.toFixed(1)} km, ${Math.round(durationGreenMin)} min)`;

            const arrival = new Date(Date.now() + durationGreenMin*60000);
            const arrivalTime = arrival.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
            const arrivalP = document.createElement('p');
            arrivalP.style.fontWeight = 'bold';
            arrivalP.innerText = `Estimated arrival time: ${arrivalTime}`;
            safeDiv.appendChild(arrivalP);

            // 4️⃣ Directions
            const prompt = document.getElementById('directionPrompt');
            const yesBtn = document.getElementById('yesDir');
            const directionsDiv = document.getElementById('directionsList');
            prompt.innerText = "Would you like step-by-step directions for GREEN route?";
            yesBtn.style.display = "inline-block";

            yesBtn.onclick = ()=>{
              yesBtn.style.display='none';
              prompt.style.display='none';
              const steps = bestRoute.properties.segments[0].steps;
              directionsDiv.innerHTML = "<h3 style='text-align:center;'>Step-by-Step Directions:</h3>";
              const ol = document.createElement('ol');
              ol.style.textAlign = 'center';
              steps.forEach(step=>{
                const li = document.createElement('li');
                li.innerText = `${step.instruction} (${step.distance.toFixed(0)} m, ${Math.round(step.duration/60)} min)`;
                li.style.marginBottom='8px';
                ol.appendChild(li);
              });
              directionsDiv.appendChild(ol);
            }

          }).catch(err=>console.error("Route error:",err));
      }).catch(err=>console.error("Geocode error:",err));
  }
});
