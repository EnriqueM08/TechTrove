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
  const cart = document.getElementById("cartDisplay");
  if(cart != null)
    cart.remove();
  const orders = document.getElementById("orderDisplay");
  if(orders != null)
    orders.remove();
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
    },
    error: function(xhr, status, error) {
       alert(JSON.parse(xhr));
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
  const form = document.createElement("form");
  form.className = "shoppingList";
  form.id = "cartDisplay";
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("fieldset");
  const legend = document.createElement("legend");
  legend.textContent = "Shopping cart";
  const item = document.createElement("label");
  item.className = "name";
  // const inputItem = document.createElement("input");
  // inputItem.type = "text";
  // inputItem.name = "data";
  const quantity = document.createElement("label");
  quantity.className = "data";
  // const inputQuantity = document.createElement("input");
  // inputQuantity.type = "text";
  // inputQuantity.name = "data";
  // const save = document.createElement("button");
  // save.textContent = "Save";
  // save.onclick = "SaveItem()";
  // const update = document.createElement("button");
  // update.textContent = "Update";
  // update.onclick = "ModifyItem()";
  // const remove = document.createElement("button");
  // remove.textContent = "Delete";
  // remove.onclick = "RemoveItem()";
  const div = document.createElement("div");
  div.id = "itemsTable";
  const h2 = document.createElement("h2");
  h2.textContent = "Shopping List";
  const table = document.createElement("table");
  table.id = "list";
  const label = document.createElement("label");
  label.textContent="* Delete all items";
  const input = document.createElement("input");
  input.type = "button";
  input.value = "Clear";
  input.onclick = "ClearAll()";
  body.append(form);
  form.append(fieldset);
  fieldset.append(legend);
  fieldset.append(item);
  // item.append(inputItem);
  fieldset.append(quantity);
  // quantity.append(inputQuantity);
  // fieldset.append(save);
  // fieldset.append(update);
  // fieldset.append(remove);
  form.append(div);
  div.append(h2);
  div.append(table);
  div.append(label);
  label.append(input);
  doShowAll();
}

//Function to switch screen to order information page
function switchToOrders() {
  if(isLoggedIn()) {
    const form = document.createElement("form");
    form.className = "orderList";
    form.id = "orderDisplay";
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("fieldset");
    const legend = document.createElement("legend");
    legend.textContent = "Orders";
    const div = document.createElement("div");
    div.id = "orderTable";
    const h2 = document.createElement("h2");
    h2.textContent = "Order List";
    const table = document.createElement("table");
    table.id = "list";
    const label = document.createElement("label");
    label.textContent="* Delete all items";
    const input = document.createElement("input");
    input.type = "button";
    input.value = "Clear";
    input.onclick = "ClearAll()";
    body.append(form);
    form.append(fieldset);
    fieldset.append(legend);
    form.append(div);
    div.append(h2);
    div.append(table);
    div.append(label);
    label.append(input);
    //doShowAll();
  }
  else {
    const h2 = document.createElement("h2");
    h2.textContent = "If you have an account please log in to view orders. Otherwise please enter email and order number below!";
    h2.id = "orderDisplay";
    body.append(h2);
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

function doShowAll() {
  var list = "<tr><th>Item</th><th>Value</th></tr>\n";
  var i = 0;
  for(i = 0; i <= localStorage.length-i; i++) {
    if(localStorage.key(i) == "item") {
      list += "<tr><td>" + key + "</td>\n<td>" + localStorage.getItem(key) + "</td></tr>\n";
    }
  }
  if(list == "<tr><th>Item</th><th>Value</th></tr>\n") {
    list += "<tr><td><i>NO ITEMS!</i></td>\n<td><i>NO ITEMS!</i></td></tr>\n";
  }
  document.getElementById('list').innerHTML = list;
}

function SaveItem() {
  var name = "item";
  var data = document.forms.ShoppingList.data.value;
  localStorage.setItem(name, data);
  doShowAll();
}

function ModifyItem() {
  var name1 = document.forms.ShoppingList.name.value;
  var data1 = document.forms.ShoppingList.data.value;

  if(localStorage.getItem(name1) != null) {
    localStorage.setItem(name1, data1);
    document.forms.ShoppingList.data.value = localStorage.getItem(name1);
  }

  doShowAll();
}

function RemoveItem() {
  var name = document.forms.ShoppingList.name.value;
  document.forms.ShoppingList.data.value = localStorage.removeItem(name);
  doShowAll();
}

function ClearAll() {
  localStorage.clear();
  doShowAll();
}
