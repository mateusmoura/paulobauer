var fs = require('fs');
var nxlsx = require('node-xlsx');
var xlsxj = require("xlsx-to-json");
var XLSX = require('./src/js/plugins/xlsx.full.min.js');
var NodeGeocoder = require('node-geocoder');

var url = "src/docs/acoes.xlsx";

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyCzo8lYeB9c_-9VwY5hfl4ooxW4ZjZMaJI', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

// xlsxj({
//   input: url, 
//   output: "src/docs/data.json"
// }, function(err, result) {
//   if(err) {
//     console.error(err);
//   }else {
//     fs.readFile('src/docs/data.json', 'utf-8', function(err, data) {
//       if (err) throw err
    
//       var arrayOfObjects = JSON.parse(data);
//       console.log(arrayOfObjects)
//     })
//   }
// });

fs.readFile('src/docs/data.json', 'utf-8', function(err, data) {
  if (err) throw err

  const arrayOfObjects = JSON.parse(data);
  let counter = 0;
  const max = arrayOfObjects.length;
  let arraySuccess = [];
  let arrayError = [];

  console.log(arrayOfObjects.length);


  const getMore = () => {
    return arrayOfObjects.splice(counter, 10);
  };

  const getLatLog = (item) => {
    geocoder.geocode(`${item.Cidade}, SC`)
      .then(function(res) {
        console.log('Success', counter);
        const newItem = item;

        newItem.lat = res[0].latitude;
        newItem.long = res[0].longitude;

        arraySuccess.push(newItem);
        counter++;

        if (counter < max) {
          if (arrayOfObjects[counter]) {
            getLatLog(arrayOfObjects[counter]);
          }
        } else {
          fs.writeFile('src/docs/success.json', JSON.stringify(arraySuccess), 'utf-8', function(err) {
            if (err) throw err
            console.log('Done!')
          })
        }
      })
      .catch(function(err) {
        console.log('Error', counter);

        arrayError.push(item);
        
        fs.writeFile('src/docs/error.json', JSON.stringify(arrayError), 'utf-8', function(err) {
          if (err) throw err
          console.log('Done!')
        });
      });
  };

  getLatLog(arrayOfObjects[0]);
});
