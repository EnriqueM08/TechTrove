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
    url: "https://sqlconnectortech.s3.us-east-2.amazonaws.com/SQLConnect.php?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMiJGMEQCIC4B7G06m5euGxqHDZgG6YhWNNj9uYcdiz5ilji74CLRAiAmXxgi3vS85xXJoP5Y%2FvHRkxfL%2BRRanVF1hYkd21j6TirtAgjE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDcwNzIyMTIzNzE1MSIM1Oa5TT%2FkGZmIZcY6KsECFjkfzpliJu8fYx1hV36s3aP3sXggd3nasRrNolfmBuaPeMxTLkW4Llgm0G965wW%2FHDYiYoHGbt9yu3wZ4McAsuoUZzL%2FyXs9FaGOgSppEWrcFBR2ol%2BUVEAjZYCOQ%2Fqv2vE08Dly3Y7HjTQKfQFaT0es6u9autrHO%2BphDrzpKwDS7bLHg9SEbdSQw903E2B2fHiARTt%2FIsBOEmccnkE2p67AiM3%2BnDKmjSY3oMmxpR5C4mo2T%2FqdwFVwbCl2jyGInm7k1fwxn33uhbryxDIJ6vcPi18yVUtK1OWCL%2BrRUMXoQr1pqVs9Axr5otqTsM0%2FYv5fOHV3fI5nJqEncplLIBYxkIyHGL4Er%2FWFxMfTCTfwBQvjdHK090pjbyN09tVQ%2FnLuEG61%2FBXKqFUh2aq8u8gSAFDl3a69S4isPjJsbK42MJOB8qAGOrQCglgAqlFzSHCbhrXUUjiek4p1x2ZNmZm6sFiI%2F0hKagHFDvdnl9zKZ%2BcYf9QkVlJNtK%2BJjVUuez%2BWVAeTBjaXFsA9kC0FMi1xLxmChlofUSMo06F1E%2BecDUBKcIrNsmscksbRH%2F6ghoEz%2BZ4vosFHGUKAEOa2tM5RhheTcABZTq6LLrx3%2FdxTI3XTiIlWeK4DpD03YWLBENg%2B%2FrQEwtJl4Znw7RbPEJmYmuwxQmPQI%2B2OAl3so2kO5ielCT0MbLPpazZpJ5W7wJAtrf8NH2iuWmAxoshnjI2o4yimKTcgAxqn%2B13UpZw%2FgBFzfVqleHj34xcCUJfcBAxvn1RfhvKsl9%2FzEWT2ccREVJG3iCusgodP%2BjgaoGhCwC1eGP9YHqM9GtQ%2FiJcYx%2FypQDF9OAuSWxXpmjM%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230323T193834Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIA2JKNLVWP56NIBHU5%2F20230323%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=879f4160c2fdfeca3a2c640a702ca27017b5f58dcd4eec662d179ec44199bec8",
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
