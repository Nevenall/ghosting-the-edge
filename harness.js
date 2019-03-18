const geo = require('geolocator')

geo.config({
   language: "en",
   google: {
      version: "3",
      key: "YOUR-GOOGLE-API-KEY"
   }
})

var options = {
   enableHighAccuracy: true,
   timeout: 5000,
   maximumWait: 10000,     // max wait time for desired accuracy
   maximumAge: 0,          // disable cache
   desiredAccuracy: 30,    // meters
   fallbackToIP: true,     // fallback to IP if Geolocation fails or rejected
   addressLookup: true,    // requires Google API key if true
   timezone: true,         // requires Google API key if true
   map: "map-canvas",      // interactive map element id (or options object)
   staticMap: true         // get a static map image URL (boolean or options object)
};
geolocator.locate(options, function (err, location) {
   if (err) return console.log(err);
   console.log(location);
});