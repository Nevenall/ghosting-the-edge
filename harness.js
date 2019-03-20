const Shell = require('node-powershell')
const fetch = require('node-fetch')

async function getLocation() {
   var ret = {}

   let ps = new Shell({
      executionPolicy: 'Bypass',
      noProfile: true
   })

   await ps.addCommand('./geolocation.ps1')

   ret = await ps.invoke()
   ret = JSON.parse(ret.replace(/\bNaN\b/g, 'null'))
   ps.dispose()


   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${ret.Latitude},${ret.Longitude}&key=${process.env.google_api}`

   const loc = await (await fetch(url)).json()
   ret.address = (loc.results[0] || {
      formatted_address: ''
   }).formatted_address
   return ret
}


getLocation().then(loc => console.log(loc))

// const https = require('https')

// https.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=45.47888,-122.71236&key=AIzaSyB6R5V7v-vIB2FFZFhNSGBbWOWvL25DLuo', (res) => {
//    let data = ''

//    res.on('data', (chunk) => {
//       data += chunk
//    })

//    res.on('end', () => {
//       console.log(JSON.parse(data).results[0].formatted_address)
//    })

// }).on('error', (e) => {
//    console.error(e)
// })