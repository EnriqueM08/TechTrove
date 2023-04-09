"use strict"; //Forces strict JavaScript which will make it easier to catch bugs

// This will handle when the search button is pressed.
let searchBtn = document.getElementById("search");
searchBtn.addEventListener('click', event => {
  clearPage();
  let query = document.getElementById("search-text").value;
  if(query != "")
    //Will call function as long as the search text is not empty
    searchProducts(query);
  //alert("CONNECTED REMOTE");
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
  const create = document.getElementById("tempCreate");
  if(create != null)
    create.remove();
  const register = document.getElementById("tempRegister");
  if(register != null)
    register.remove();
  const verticalLine = document.getElementById("verticalLine");
  if(verticalLine != null)
    verticalLine.remove();   
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
      const table = document.createElement("table");
      table.className = "table table-bordered"
      
      //Parse through returned JSON from SQLConnect function and create values
      var temp = JSON.parse(obj);
      const body = document.querySelector('body');
      body.append(div);
      var stringTmp ="";
      stringTmp += "<div class = \"outTable\">";
      stringTmp += "<table> <thead> <tr> <th> IMAGE </th> <th> NAME </th> <th> PRICE </th> </tr> </thead> <tbody> ";
      //Will likely be an array so will iterate through getting values and updating areas.
      for (var i = 0; i < temp.length; i++) {
        var object = temp[i];
        stringTmp += "<tr> <td><img src=\"";
        stringTmp += object["pImagePath"];
        stringTmp += "\" alt=\"NO IMAGE\" width = 100px></td> <td>";
        stringTmp += object["pName"];
        stringTmp += "</td> <td>$";
        stringTmp += object["pPrice"];
        stringTmp += "</td> </tr>";
        /*
        for (var property in object) {
          console.log('item ' + i + ': ' + property + '=' + object[property]);
        }*/
      }
      stringTmp += "</tbody> </table </div> </div> </div>";
      div.innerHTML = stringTmp;
     },
     error: function(xhr, status, error) {
       //alert(xhr);
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

  const verticalLine = document.createElement("div");
  verticalLine.className = "vl";
  verticalLine.id = "verticalLine";

  body.append(verticalLine);

  const loginHeader = document.createElement("h2");
  loginHeader.className = "loginHeader"
  const loginNode = document.createTextNode("Login");
  loginHeader.append(loginNode);

  const createHeader = document.createElement("h2");
  createHeader.className = "createHeader"
  const createNode = document.createTextNode("Create an Account");
  createHeader.append(createNode);

  const loginDiv = document.createElement("div");
  loginDiv.className = "login";
  loginDiv.id = "tempLogin";

  const loginUsername = document.createElement("form");
  loginUsername.className = "username";
  loginUsername.id = "loginUsername";
  const loginUsernameInput = document.createElement("input");
  loginUsernameInput.type = "text";
  loginUsernameInput.id = "loginUsernameInput";
  loginUsernameInput.placeholder = "Enter Username";
  const loginPassword = document.createElement("form");
  loginPassword.className = "password";
  const loginPasswordInput = document.createElement("input");
  loginPasswordInput.type = "password";
  loginPasswordInput.id = "loginPasswordInput";
  loginPasswordInput.placeholder = "Enter Password";
  const loginBtn = document.createElement("button");
  loginBtn.className = "login-btn";
  loginBtn.id = "login";
  loginBtn.textContent = "LOGIN";

  const createDiv = document.createElement("div");
  createDiv.className = "create";
  createDiv.id = "tempCreate";
  
  loginDiv.append(loginHeader);
  createDiv.append(createHeader);

  const createUsername = document.createElement("form");
  createUsername.className = "username"
  createUsername.id = "createUsername";
  const createUsernameInput = document.createElement("input");
  createUsernameInput.type = "text";
  createUsernameInput.id = "createUsernameInput";
  createUsernameInput.placeholder = "Create Username";
  const createPassword = document.createElement("form");
  createPassword.className = "password";
  createPassword.id = "createPassword";
  const createPasswordInput = document.createElement("input");
  createPasswordInput.type = "password";
  createPasswordInput.id = "createPasswordInput";
  createPasswordInput.placeholder = "Create Password";
  const confirmPassword = document.createElement("form");
  confirmPassword.className = "password";
  confirmPassword.id = "confirmPassword";
  const confirmPasswordInput = document.createElement("input");
  confirmPasswordInput.type = "password";
  confirmPasswordInput.id = "confirmPasswordInput";
  confirmPasswordInput.placeholder = "Confirm Password";
  const createBtn = document.createElement("button");
  createBtn.className = "create-btn";
  createBtn.id = "create";
  createBtn.textContent = "CREATE ACCOUNT";

  const adminLoginBtn = document.createElement("button");
  adminLoginBtn.className = "admin-btn";
  adminLoginBtn.id = "admin";
  adminLoginBtn.textContent = "ADMIN LOGIN";

  const wrapDiv = document.createElement("div");
  wrapDiv.className = "wrapper";
  wrapDiv.id = "wrapDiv";

  const registerDiv = document.createElement("div");
  registerDiv.className = "register";
  registerDiv.id = "tempRegister";

  body.append(wrapDiv);

  wrapDiv.appendChild(loginDiv);
  wrapDiv.appendChild(createDiv);
  wrapDiv.appendChild(registerDiv);
  registerDiv.append(adminLoginBtn);

  loginDiv.append(loginUsername);
  loginUsername.append(loginUsernameInput);
  loginDiv.append(loginPassword);
  loginPassword.append(loginPasswordInput);
  loginDiv.append(loginBtn);

  createDiv.append(createUsername);
  createUsername.append(createUsernameInput);
  createDiv.append(createPassword);
  createPassword.append(createPasswordInput);
  createDiv.append(confirmPassword);
  confirmPassword.append(confirmPasswordInput);
  createDiv.append(createBtn);

  loginBtn.addEventListener('click', event => {
    let usernameTxt = document.getElementById("loginUsernameInput").value;
    let passwordTxt = document.getElementById("loginPasswordInput").value;
    if(usernameTxt != "" && passwordTxt != "")
      attemptLogin(usernameTxt, passwordTxt, "getCustomerData");
    else
      alert("PLEASE FILL OUT ALL FIELDS");
  });

  createBtn.addEventListener('click', event => {
    let usernameTxt = document.getElementById("createUsernameInput").value;
    let passwordTxt = document.getElementById("createPasswordInput").value;
    let confirmPasswordTxt = document.getElementById("confirmPasswordInput").value;
    if(passwordTxt != confirmPasswordTxt)
      alert("PLEASE MAKESURE PASSWORDS MATCH!");
    else if(usernameTxt != "" && passwordTxt != "")
      switchToRegister(usernameTxt, passwordTxt);
    else
      alert("PLEASE FILL OUT ALL FIELDS");
  });

  // const div = document.createElement("div");
  // div.className = "login";
  // div.id = "tempLogin";
  // const body = document.querySelector('body');
  // body.append(div);
  // var stringTmp ="<form class=\"username\"><input type=\"text\" id=\"usernameInput\" placeholder=\"Enter Username\"></form><form class=\"password\"><input type=\"text\" id=\"passwordInput\" placeholder=\"Enter Password\"></form><button class=\"login-btn\" id=\"login\">LOGIN</button><button id=\"register\" class=\"register-btn\">REGISTER</button><button id=\"admin\" class=\"admin-btn\">ADMIN LOGIN</button>";
  // div.innerHTML = stringTmp;
  // const loginBtn = document.getElementById("login");
  // loginBtn.addEventListener('click', event => {
  //   let usernameTxt = document.getElementById("usernameInput").value;
  //   let passwordTxt = document.getElementById("passwordInput").value;   
  //   if(usernameTxt != "" && passwordTxt != "")
  //     attemptLogin(usernameTxt, passwordTxt, "getCustomerData");
  // });
  // const registerBtn = document.getElementById("register");
  // registerBtn.addEventListener('click', event => {
  //   switchToRegister();
  // });
  // const adminLoginBtn = document.getElementById("admin")
  adminLoginBtn.addEventListener('click', event => {
    let usernameTxt = document.getElementById("loginUsernameInput").value;
    let passwordTxt = document.getElementById("loginPasswordInput").value;
    if(usernameTxt != "" && passwordTxt != "")
      attemptLogin(usernameTxt, passwordTxt, "attemptAdminLogin");
  });
}

//Function to switch screen to cart information page
function switchToCart() {
  const form = document.createElement("form");
  form.className = "shoppingList";
  form.id = "cartDisplay";
  var stringTmp ="<fieldset class=\"fieldset\"><legend>Shopping cart</legend><label class=\"name\"></label><label class=\"data\"></label></fieldset><div id=\"itemsTable\"><h2>Shopping List</h2><table id=\"list\"><tbody><tr><th>Item</th><th>Value</th></tr> <tr><td><i>NO ITEMS!</i></td> <td><i>NO ITEMS!</i></td></tr></tbody></table><label>* Delete all items<input type=\"button\" value=\"Clear\"></label></div>";
  // const inputItem = document.createElement("input");
  // inputItem.type = "text";
  // inputItem.name = "data";
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
  body.append(form);
  form.innerHTML = stringTmp;
  // item.append(inputItem);
  // quantity.append(inputQuantity);
  // fieldset.append(save);
  // fieldset.append(update);
  // fieldset.append(remove);
  doShowAll();
}

//Function to switch screen to order information page
function switchToOrders() {
  if(isLoggedIn()) {
    const form = document.createElement("form");
    form.className = "orderList";
    form.id = "orderDisplay";
    var stringTmp = "<fieldset class=\"fieldset\"><legend>Orders</legend></fieldset><div id=\"orderTable\"><h2>Order List</h2><table id=\"list\"></table><label>* Delete all items<input type=\"button\" value=\"Clear\"></label></div>";
    body.append(form);
    form.innerHTML = stringTmp;
  }
  else {
    const h2 = document.createElement("h2");
    h2.textContent = "If you have an account please log in to view orders. Otherwise please enter email and order number below!";
    h2.id = "orderDisplay";
    body.append(h2);
  }
}

//Function to switch to register page
// function switchToRegister() {
function switchToRegister(usernameTxt, passwordTxt) {
  const login = document.getElementById("tempLogin");
  if(login != null)
    login.remove();
  const create = document.getElementById("tempCreate");
  if(create != null)
    create.remove();
  const verticalLine = document.getElementById("verticalLine");
  if(verticalLine != null)
    verticalLine.remove();    
   
  // var stringTmp = "<form class=\"username\"><input type=\"text\" id=\"usernameInput\" placeholder=\"Enter Username\"></form><form class=\"password\"><input type=\"text\" id=\"passwordInput\" placeholder=\"Enter Password\"></form><form class=\"pCheck\"><input type=\"text\" id=\"passwordCheck\" placeholder=\"Reenter Password\"></form><form class=\"fName\"><input type=\"text\" id=\"firstName\" placeholder=\"Enter First Name\"></form><form class=\"lName\"><input type=\"text\" id=\"lastName\" placeholder=\"Enter Last Name\"></form><form class=\"mAddress\"><input type=\"text\" id=\"mailingAddress\" placeholder=\"Enter Mailing Address\"></form><form class=\"mCity\"><input type=\"text\" id=\"mailingCity\" placeholder=\"Enter Mailing City\"></form><form class=\"mState\"><input type=\"text\" id=\"mailingState\" placeholder=\"Enter Mailing State\"></form><form class=\"mZipCode\"><input type=\"text\" id=\"mailingZipCode\" placeholder=\"Enter Mailing Zip Code\"></form><form class=\"bAddress\"><input type=\"text\" id=\"billingAddress\" placeholder=\"Enter Billing Address\"></form><form class=\"pNumber\"><input type=\"text\" id=\"phoneNumber\" placeholder=\"Enter Phone Number\"></form><form class=\"eMail\"><input type=\"text\" id=\"email\" placeholder=\"Enter Email\"></form><button id=\"register\" class=\"register-btn\">REGISTER</button>";
  var stringTmp = "<h2 class=\"createHeader\">Registration Almost Complete</h2><form class=\"fName\"><input type=\"text\" id=\"firstName\" placeholder=\"Enter First Name\"></form><form class=\"lName\"><input type=\"text\" id=\"lastName\" placeholder=\"Enter Last Name\"></form><form class=\"mAddress\"><input type=\"text\" id=\"mailingAddress\" placeholder=\"Enter Mailing Address\"></form><form class=\"mCity\"><input type=\"text\" id=\"mailingCity\" placeholder=\"Enter Mailing City\"></form><form class=\"mState\"><input type=\"text\" id=\"mailingState\" placeholder=\"Enter Mailing State\"></form><form class=\"mZipCode\"><input type=\"text\" id=\"mailingZipCode\" placeholder=\"Enter Mailing Zip Code\"></form><form class=\"bAddress\"><input type=\"text\" id=\"billingAddress\" placeholder=\"Enter Billing Address\"></form><form class=\"pNumber\"><input type=\"text\" id=\"phoneNumber\" placeholder=\"Enter Phone Number\"></form><form class=\"eMail\"><input type=\"text\" id=\"email\" placeholder=\"Enter Email\"></form><button id=\"register\" class=\"register-btn\">REGISTER</button>";
            // const pCheck = document.createElement("form");
            // pCheck.className = "pCheck";
            // const passwordCheck = document.createElement("input");
            // passwordCheck.type = "text";
            // passwordCheck.id = "passwordCheck";
            // passwordCheck.placeholder = "Reenter Password";
            // const fName = document.createElement("form");
            // fName.className = "fName";
            // const firstName = document.createElement("input");
            // firstName.type = "text";
            // firstName.id = "firstName";
            // firstName.placeholder = "Enter First Name";
            // const lName = document.createElement("form");
            // lName.className = "lName";
            // const lastName = document.createElement("input");
            // lastName.type = "text";
            // lastName.id = "lastName";
            // lastName.placeholder = "Enter Last Name";
            // const mAddress = document.createElement("form");
            // mAddress.className = "mAddress";
            // const mailingAddress = document.createElement("input");
            // mailingAddress.type = "text";
            // mailingAddress.id = "mailingAddress";
            // mailingAddress.placeholder = "Enter Mailing Address";
            // const mCity = document.createElement("form");
            // mCity.className = "mCity";
            // const mailingCity = document.createElement("input");
            // mailingCity.type = "text";
            // mailingCity.id = "mailingCity";
            // mailingCity.placeholder = "Enter Mailing City";
            // const mState = document.createElement("form");
            // mState.className = "mState";
            // const mailingState = document.createElement("input");
            // mailingState.type = "text";
            // mailingState.id = "mailingState";
            // mailingState.placeholder = "Enter Mailing State";
            // const mZipCode = document.createElement("form");
            // mZipCode.className = "mZipCode";
            // const mailingZipCode = document.createElement("input");
            // mailingZipCode.type = "text";
            // mailingZipCode.id = "mailingZipCode";
            // mailingZipCode.placeholder = "Enter Mailing Zip Code";
            // const bAddress = document.createElement("form");
            // bAddress.className = "bAddress";
            // const billingAddress = document.createElement("input");
            // billingAddress.type = "text";
            // billingAddress.id = "billingAddress";
            // billingAddress.placeholder = "Enter Billing Address";
            // const pNumber = document.createElement("form");
            // pNumber.className = "pNumber";
            // const phoneNumber = document.createElement("input");
            // phoneNumber.type = "text";
            // phoneNumber.id = "phoneNumber";
            // phoneNumber.placeholder = "Enter Phone Number";
            // const eMail = document.createElement("form");
            // eMail.className = "eMail";
            // const email = document.createElement("input");
            // email.type = "text";
            // email.id = "email";
            // email.placeholder = "Enter Email";

  const div = document.getElementById("tempRegister");
  div.innerHTML = stringTmp;
  const register = document.getElementById("register");
            // register.id = "register";
            // register.textContent = "REGISTER";
            // register.className = "register-btn";


  // div.append(pCheck);
  // pCheck.append(passwordCheck);
  
  // div.append(fName);
  // fName.append(firstName);

  // div.append(lName);
  // lName.append(lastName);
  
  // div.append(mAddress);
  // mAddress.append(mailingAddress);
  
  // div.append(mCity);
  // mCity.append(mailingCity);
  
  // div.append(mState);
  // mState.append(mailingState);
  
  // div.append(mZipCode);
  // mZipCode.append(mailingZipCode);
  
  // div.append(bAddress);
  // bAddress.append(billingAddress);
  
  // div.append(pNumber);
  // pNumber.append(phoneNumber);
  
  // div.append(eMail);
  // eMail.append(email);

  // div.append(register);

  register.addEventListener('click', event => {
    // let usernameTxt = document.getElementById("usernameInput").value;
    // let passwordTxt = document.getElementById("passwordInput").value;
    // let passwordCheckTxt = document.getElementById("passwordCheck").value;
    let firstNameTxt = document.getElementById("firstName").value;
    let lastNameTxt = document.getElementById("lastName").value;
    let mailingAddressTxt = document.getElementById("mailingAddress").value;
    let mailingCityTxt = document.getElementById("mailingCity").value;
    let mailingStateTxt = document.getElementById("mailingState").value;
    let mailingZipCodeTxt = document.getElementById("mailingZipCode").value;
    let billingAddressTxt = document.getElementById("billingAddress").value;
    let phoneNumberTxt = document.getElementById("phoneNumber").value;
    let emailTxt = document.getElementById("email").value;
    // if(usernameTxt == "" || passwordTxt == "" || passwordCheckTxt == "" || firstNameTxt == "" || lastNameTxt == "" || mailingAddressTxt == "" || mailingCityTxt == "" || mailingStateTxt == "" || mailingZipCodeTxt == "" || billingAddressTxt == "" || phoneNumberTxt == "" || emailTxt == "")
    if(firstNameTxt == "" || lastNameTxt == "" || mailingAddressTxt == "" || mailingCityTxt == "" || mailingStateTxt == "" || mailingZipCodeTxt == "" || billingAddressTxt == "" || phoneNumberTxt == "" || emailTxt == "")
    {
      alert("PLEASE FILL OUT ALL FIELDS");
    }
    // else if(passwordTxt != passwordCheckTxt) {
    //   alert("PLEASE MAKESURE PASSWORDS MATCH!");
    // }
    else
    {
      const parsed = parseInt(mailingZipCodeTxt);
      if (isNaN(parsed)) { 
        alert("PLEASE ONLY ENTER NUMBERS IN ZIPCODE ENTRY!");
      }
      else{
        registerNewUser(usernameTxt, passwordTxt, firstNameTxt, lastNameTxt, mailingAddressTxt, mailingCityTxt, mailingStateTxt, mailingZipCodeTxt, billingAddressTxt, phoneNumberTxt, emailTxt);
        clearPage();
      }
      //alert("Registered!");
    }
  });
}

function registerNewUser(username, password, firstName, lastName, mailingAddress, mailingCity, mailingState, mailingZipCode, billingAddress, phoneNumber, email)
{
  console.log("RAN NEW USER");
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'text',
    data: {functionname: 'registerNewUser', user: username, pass: password, fName: firstName, lName: lastName, mAddress: mailingAddress, mCity: mailingCity, mState: mailingState, mZipCode: mailingZipCode, bAddress: billingAddress, pNumber: phoneNumber, eMail: email},

    success: function (obj) {
      //If there is an error value then the login was unsucceful we can display more information if wanted.
      if (obj != "\"added\"") {
        alert(obj);
      }
      else {
        body.classList.add("logged-in");
        console.log("SUCCESS!");
        //TODO: Should probably add element or maybe another class to body to keep track of username or userID
      }
    }
  }); 
}

//Will use jQuery to make ajax call to connect to database and attempt to login to account
function attemptLogin(username, password, functionName) {
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: functionName, user: username, pass: password},

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
        if(functionName == "attemptAdminLogin") 
        {
          goToAdminScreen();
        }
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