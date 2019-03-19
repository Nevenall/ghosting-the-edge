const Shell = require('node-powershell')


function getLocation() {
   var ret = {}

   let ps = new Shell({
      executionPolicy: 'Bypass',
      noProfile: true
   })

   ps.addCommand('./geolocation.ps1')
   // create a promise that we can use maybe with async to get the lat long and the google api reverse geo coded address.
   ps.invoke()
      .then(out => {
         var loc = JSON.parse(out.replace(/\bNaN\b/g, 'null'))
         // console.log()
         ps.dispose()
         ret = loc

      })
      .catch(err => {
         console.log(err)
         ps.dispose()
      })
   return ret
}


console.log(getLocation())
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