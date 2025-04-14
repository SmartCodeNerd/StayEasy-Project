let arr = coordinates.split(',').map(Number);

console.log(typeof map_token);
mapboxgl.accessToken = map_token;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    //center: [77.2088,28.6139], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    center: arr,
    zoom: 7 // starting zoom
});



console.log(typeof(arr));


const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(arr)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML("<p>Exact Location provided after booking</p>"))
        .addTo(map);
marker1.togglePopup();