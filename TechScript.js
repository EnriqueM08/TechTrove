"use strict"; //Forces strict JavaScript which will make it easier to catch bugs

// This will handle when the search button is pressed.
let searchBtn = document.getElementById("search");
searchBtn.addEventListener('click', event => {
  clearPage();
  let query = document.getElementById("search-text").value;
  if(query != "")
    //Will call function as long as the search text is not empty
    searchProducts(query);
});

//This will handle when the home button is pressed.
let homeBtn = document.getElementById("home");
homeBtn.addEventListener('click', event => {
  clearPage();
});

//This will handle when the profile button is pressed.
let profBtn = document.getElementById("profile");
profBtn.addEventListener('click', event => {
  clearPage();
  //If the user is logged in will display profile otherwise will prompt to login
  if(isLoggedIn())
    switchToProfile();
  else
    switchToLogin();
});

//This will handle when the cart button is pressed.
let cartBtn = document.getElementById("cart");
cartBtn.addEventListener('click', event => {
  clearPage();
  //Will display current cart
  switchToCart();
})

//This will handle when the orders button is pressed.
let orderBtn = document.getElementById("orders");
orderBtn.addEventListener('click', event => {
  clearPage();
  //Will display previous orders if logged in or ask for order number if not
  switchToOrders();
});

//Will clear the page of all temporary elements
function clearPage() {
  //Only remove elements if they exist
  const grid = document.getElementById("tempGrid");
  if(grid != null)
    grid.remove();
  const login = document.getElementById("tempLogin");
  if(login != null)
    login.remove();
  const loginMsg = document.getElementById("log");
  if(loginMsg != null)
    loginMsg.remove();
}

//Will check if the current user is logged in or not
function isLoggedIn() {
  if(document.body.classList.contains("logged-in"))
    return true;
  return false;
}

//This function will search through the database and find products user is searching for.
function searchProducts(query) {
  //Uses ajax to make request to SQLConnect to connect to database and get data.
  //Currently grabbing all data may switch to only grab pImagePath and pID.
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getProductData', parameter: query},

    success: function (obj) {
      //If successful will create new elemets to display data
      const div = document.createElement("div");
      div.className = "grid";
      div.id = "tempGrid";
      //Parse through returned JSON from SQLConnect function and create values
      var temp = JSON.parse(obj);
      //Will likely be an array so will iterate through getting values and updating areas.
      for (var i = 0; i < temp.length; i++) {
        var object = temp[i];
        //Button will allow for clicking on item to display product information.
        const btn = document.createElement("button");
        btn.className = "card";
        const img = document.createElement("img");
        img.className = "image";
        const body = document.querySelector('body');
        //Appends data to the body displaying results to the screen.
        body.append(div);
        div.append(btn);
        btn.append(img);
        img.setAttribute('src', object["pImagePath"]);
        /* TESTING: Used to test that all propertys are properly being retrieved from the database
        will need to create way to store data or another database call to retrieve data when displaying product info.
        for (var property in object) {
          console.log('item ' + i + ': ' + property + '=' + object[property]);
        }
        */
      }
    }
  }); 
}

//This function will handle updating elements to switch to the profile screen
function switchToProfile() {
  //TODO: ACTUALLY ADD information currentl will just display that user is logged in for testing.
  const txt = document.createElement("h2");
  txt.className = "log-txt";
  txt.id = "log";
  txt.textContent = "ALREADY LOGGED IN!";
  body.append(txt);
  return;
}

//This will switch to the login page allowing for user to login to account
function switchToLogin() {
  const div = document.createElement("div");
  div.className = "login";
  div.id = "tempLogin";
  const username = document.createElement("form");
  username.className = "username";
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "usernameInput";
  usernameInput.placeholder = "Enter Username";
  const password = document.createElement("form");
  password.className = "password";
  const passwordInput = document.createElement("input");
  passwordInput.type = "text";
  passwordInput.id = "passwordInput";
  passwordInput.placeholder = "Enter Password";
  const loginBtn = document.createElement("button");
  loginBtn.className = "login-btn";
  loginBtn.id = "login";
  loginBtn.textContent = "LOGIN";
  body.append(div);
  div.append(username);
  username.append(usernameInput);
  div.append(password);
  password.append(passwordInput);
  div.append(loginBtn);
  loginBtn.addEventListener('click', event => {
    let usernameTxt = document.getElementById("usernameInput").value;
    let passwordTxt = document.getElementById("passwordInput").value;
    if(usernameTxt != "" && passwordTxt != "")
      attemptLogin(usernameTxt, passwordTxt);
  });
  //TODO: Need to add button for creating an account and then function to update page for registering
}

//Function to switch screen to cart information page
function switchToCart() {
  //TODO: Populate page with cart information
}

//Function to switch screen to order information page
function switchToOrders() {
  if(isLoggedIn()) {
    //TODO: Populate page with order information from customers orders
  }
  else {
    //TODO: Prompt user to login to view previous order information or provide info to view a single order
  }
}

//Function to switch to register page
function switchToRegister() {
  //TODO: ADD elements to create regestering screen.
}

//Will use jQuery to make ajax call to connect to database and attempt to login to account
function attemptLogin(username, password) {
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getCustomerData', user: username, pass: password},

    success: function (obj) {
      var temp = JSON.parse(obj);
      //If there is an error value then the login was unsucceful we can display more information if wanted.
      if (temp.error) {
        alert("ERROR LOGGING IN");
      }
      else {
        //Clears the login page and then should eventually return to home page
        clearPage();
        //For testing purposes currently will add new element to screen saying login was successful
        const txt = document.createElement("h2");
        txt.className = "log-txt";
        txt.id = "log";
        txt.textContent = "LOGGED IN SUCCESSFULLY";
        body.append(txt);
        //This will add the logged-in class to the body which will allow the page to know user is logged in
        body.classList.add("logged-in");
        //TODO: Should probably add element or maybe another class to body to keep track of username or userID
      }
    }
  }); 
}