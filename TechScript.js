"use strict";
 // Will connect to the php code that will contact the database for queries.
// function getData(){
// fetch("SQLConnect.php")
//     .then((response) => {
//         if(!response.ok){ // Before parsing (i.e. decoding) the JSON data,
//                          // check for any errors.
//                 // In case of an error, throw.
//             throw new Error("Something went wrong!");
//         }

//         return response.json(); // Parse the JSON data.
//     })
//     .then((data) => {
//          // This is where you handle what to do with the response.
//             console.log(data); // Will alert: 42
//     })
//     .catch((error) => {
//             // This is where you handle errors.
//     });
// }

// This will handle when the search button is pressed.
let btn = document.getElementById("search");
btn.addEventListener('click', event => {
  let query = document.getElementById("search-text").value;
  if(query != "")
    searchProducts(query);
});

//This function will search through the database and find products user is searching for.
function searchProducts(query) {
  const element = document.getElementById("tempGrid");
  if(element != null)
    element.remove();
  //Uses ajax to make request to SQLConnect to connect to database and get data.
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getCustomerData', parameter: query},

    success: function (obj) {
      const div = document.createElement("div");
      div.className = "grid";
      div.id = "tempGrid";
      //Parse through returned JSON from SQLConnect function and create values
      var temp = JSON.parse(obj);
      //Will likely be an array so will iterate through getting values and updating areas.
      for (var i = 0; i < temp.length; i++) {
        var object = temp[i];
        const btn = document.createElement("button");
        btn.className = "card";
        const img = document.createElement("img");
        img.className = "image";
        const body = document.querySelector('body');
        body.append(div);
        div.append(btn);
        btn.append(img);
        img.setAttribute('src', object["pImagePath"]);
        for (var property in object) {
          console.log('item ' + i + ': ' + property + '=' + object[property]);
        }
      }
    }
  }); 
}