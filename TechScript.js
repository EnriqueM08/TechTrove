"use strict"; //Forces strict JavaScript which will make it easier to catch bugs

var shippingCost = 10.00;
var subTotal = 0.0;
var taxes = 0.0;
var total = 0.0;
var newSubTotal = 0.0;
var newTaxes = 0.0;
var newTotal = 0.0;

createHomeView();

// This will handle when the search button is pressed.
let searchBtn = document.getElementById("search");
searchBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  let query = document.getElementById("search-text").value;
  if(query != "")
    //Will call function as long as the search text is not empty
    searchProducts(query, "default");
});

//This will handle when the home button is pressed.
let homeBtn = document.getElementById("home");
homeBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  createHomeView();
});

//This will handle when the profile button is pressed.
let profBtn = document.getElementById("profile");
profBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  //If the user is logged in will display profile otherwise will prompt to login
  if(isLoggedIn())
    switchToProfile();
  else
    switchToLogin();
});

//This will handle when the edit button is pressed.
let editBtn = document.getElementById("edit");
editBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  //If the user is logged in, it will display the profile edit page
  if(isLoggedIn())
	switchToEdit();
  else
	switchToLogin();
});

//This will handle when the cart button is pressed.
let cartBtn = document.getElementById("cart");
cartBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  //Will display current cart
  switchToCart();
})

//This will handle when the orders button is pressed.
let orderBtn = document.getElementById("orders");
orderBtn.addEventListener('click', event => {
  clearPage();
  sessionStorage.removeItem("selectedCustomer");
  sessionStorage.removeItem("selectedCustomerID");
  //Will display previous orders if logged in or ask for order number if not
  switchToOrders("default");
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
  const homeView = document.getElementById("homeView");
  if(homeView != null)
    homeView.remove();
  const loginMsg = document.getElementById("log");
  if(loginMsg != null)
    loginMsg.remove();
  const cart = document.getElementById("cartDisplay");
  if(cart != null)
    cart.remove();
  const orders = document.getElementById("orderDisplay");
  if(orders != null)
    orders.remove();
  const productInfo = document.getElementById("leftProductInfo");
  if(productInfo != null){
    productInfo.remove();
    document.getElementById("rightProductInfo").remove();
  }
  const totalD = document.getElementById("totalDisplay");
  if(totalD != null)
    totalD.remove();
  const billing = document.getElementById("billing");
  if(billing != null)
    billing.remove();
  const profileInfo = document.getElementById("logOutBtn");
  if(profileInfo != null)
    profileInfo.remove();
  const wrappper = document.getElementById("wrapDiv");
  if(wrappper != null)
    wrappper.remove();
  const sortOptions = document.getElementById("sortOptions");
  if(sortOptions != null)
    sortOptions.remove();
  const tempAdd = document.getElementById("tempAdd");
  if(tempAdd != null)
    tempAdd.remove();
  const tmpDisable = document.getElementById("tempDisable");
  if(tmpDisable != null)
    tmpDisable.remove();
}

function clearResults() {
  var products = document.getElementsByClassName("product");
  for(var i = 0; i < products.length; i++){
    products[i].remove();
    i--;
  }
}

//Will check if the current user is logged in or not
function isLoggedIn() {
  if(sessionStorage.getItem("ID") != null)
    return true;
  return false;
}

//This function will search through the database and find products user is searching for.
function searchProducts(query, filterName) {
  //Uses ajax to make request to SQLConnect to connect to database and get data.
  //Currently grabbing all data may switch to only grab pImagePath and pID.
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getProductData', parameter: query, parameterTwo: filterName},

    success: function (obj) {
      //If successful will create new elemets to display data
      var div = document.getElementById("tempGrid");
      if(div == null)
      {
        div = document.createElement("div");
        div.className = "grid";
        div.id = "tempGrid";
        const body = document.querySelector('body');
        body.append(div);
      }
      
      //Parse through returned JSON from SQLConnect function and create values
      var temp = JSON.parse(obj);
      const tempFilter = document.getElementsByClassName("filter-group");
      var stringTmp = "";
      if(tempFilter.length == 0)
      {
        stringTmp += "<div class=\"filter-group\"><label>SORT BY: </label> <select class=\"form-control\" id =\"filter\"><option>Default</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Alphabetical</option><option>Newest Arrivals</option><option>Availability</option></select></div>";
      }
  
        //Will likely be an array so will iterate through getting values and updating areas.
      for (var i = 0; i < temp.length; i++) {
        var object = temp[i];
        stringTmp += "<div id = \"pTemp\" class = \"product\"> <div class = \"left\"> <button id =\"";
        stringTmp += object["pID"];
        stringTmp += "\"><img src = \"";
        stringTmp += object["pImagePath"];
        stringTmp += "\" alt=\"NO IMAGE\" width = 200px></button></div> <div class = \"right\"> <p class=\"title\">";
        stringTmp += object["pName"];
        stringTmp += "</p> <p class =\"price\">";
        stringTmp += "$" + object["pPrice"];
        stringTmp += "</p> <p class = \"description\">"
        stringTmp += object["pDescription"]
        stringTmp += "</p> </div> </div>";
      }
      div.insertAdjacentHTML('beforeend', stringTmp);
      for (var i = 0; i < temp.length; i++)
      {
        var object = temp[i];
        let itemBtn = document.getElementById(object["pID"].toString());
        //NEED to fix this still.
        itemBtn.addEventListener('click', event => {
          for(var j = 0; j < temp.length; j++)
          {
            if(temp[j]["pID"] == itemBtn.id)
              var selected = temp[j];
          }
          clearPage();
          //Will display previous orders if logged in or ask for order number if not
          switchToDetailScreen(selected["pName"], selected["pDescription"], selected["pImagePath"], selected["pPrice"], selected["pCategory"], selected["pInventory"], selected);
        });
      }
      const tempP = document.getElementById("pTemp");
      if(tempP == null)
      {
        div.innerHTML = "<label class = \"noResults\">No results found please search again!<lable>";
      }
      else{
        let filterMenu = document.getElementById("filter");
        filterMenu.addEventListener("change", function(e){
          e.stopImmediatePropagation();
          let filterName = filterMenu.value;
          clearResults();
          searchProducts(query, filterName);
        });
      }
     },
     error: function(xhr, status, error) {
       alert(xhr);
     }
  });
}

function switchToDetailScreen(productName, productDescription, productImage, productPrice, productCategory, productInventory, product) {
  const leftDiv = document.createElement("div");
  leftDiv.className = "pInfoLeft";
  leftDiv.id = "leftProductInfo";

  const rightDiv = document.createElement("div");
  rightDiv.className = "pInfoRight";
  rightDiv.id = "rightProductInfo";

  var stringTmp = "<h2 class=\"productName\" id = \"pName\" style=\"margin: 0px\"></h2><h2 class=\"productCategory\" id = \"pCategory\" style=\"position: absolute; top: 330px; color: orange\"></h2>"
  leftDiv.innerHTML = stringTmp;

  var stringTmp ="<h3 class=\"productDesc\" id = \"pDescription\" style=\"color: orange; margin-right: 100px\"></h3><h3 class=\"productPrice\" id = \"pPrice\" style=\"color: orange\"><h3 class=\"productInventory\" id = \"pInventory\" style=\"color: orange\"></h3><button class=\"addCart-btn\" id= \"addBtn\">ADD TO CART</button>";
  rightDiv.innerHTML = stringTmp;

  body.append(leftDiv);
  body.append(rightDiv);

  // const div = document.createElement("div");
  // div.className = "productInfo";
  // div.id = "productInfo";
  // var stringTmp ="<h1 class=\"productName\" id = \"pName\"></h1><h1 class=\"productDesc\" id = \"pDescription\"></h1><img class=\"productImage\" id = \"pImage\">  <img><h1 class=\"productPrice\" id = \"pPrice\"></h1><h1 class=\"productCategory\" id = \"pCategory\"></h1><h1 class=\"productInventory\" id = \"pInventory\"></h1><button className=\"addCart-btn\" id= \"addBtn\">ADD TO CART</button>";
  // body.append(div);
  // div.innerHTML = stringTmp;
  let pName = document.getElementById("pName");
  pName.textContent = "Name: " + productName;

  let pDescription = document.getElementById("pDescription");
  pDescription.textContent = "Description: " + productDescription;

  // let pImage = document.getElementById("pImage");
  // pImage.textContent = "Image: " + productImage;
  
  const productImg = document.createElement("img");
  productImg.className = "productImg";
  productImg.id = "pImage";
  productImg.src = productImage;
  leftDiv.append(productImg);
  
  let pPrice = document.getElementById("pPrice");
  pPrice.textContent = "Price: $" + productPrice;

  let pCategory = document.getElementById("pCategory");
  pCategory.textContent = "Category: " + productCategory;

  checkCart();
  var cart = sessionStorage.getItem("cart");
  var cartObject = JSON.parse(cart);
  var items = cartObject.items;
  for(var i = 0; i < items.length; i++)
  {
    var item = items[i];
    if(product["pID"] == item.pID)
    {
      productInventory -= item.pInventory;
    }
  }
  let pInventory = document.getElementById("pInventory");
  pInventory.textContent = "Inventory: " + productInventory;

  let addBtn = document.getElementById("addBtn");
  addBtn.addEventListener('click', event => {
    addToCart(product);
    productInventory -= 1;
    pInventory.textContent = "Inventory: " + productInventory;
    //Will display previous orders if logged in or ask for order number if not
  });
}

//This function will handle updating elements to switch to the profile screen
function switchToProfile() {
  var stringTmp = "<h2 class=\"createHeader\">Account Information</h2><h1 class=\"profTxt\" id=\"firstName\" ></h1><h1 class=\"profTxt\" id=\"lastName\"></h1><h1 class=\"profTxt\" id=\"mailingAddress\"></h1><h1 class=\"profTxt\" id=\"mailingCity\"></h1><h1 class=\"profTxt\" id=\"mailingState\"></h1><h1 class=\"profTxt\" id=\"mailingZipCode\"></h1><h1 class=\"profTxt\" id=\"billingAddress\"></h1><h1 class=\"profTxt\" id=\"phoneNumber\"></h1><h1 class=\"profTxt\" id=\"email\"></h1>";
  const wrapDiv = document.createElement("div");
  wrapDiv.className = "wrapper";
  wrapDiv.id = "wrapDiv";

  const tempDiv = document.createElement("div");
  tempDiv.className = "profile";
  tempDiv.id = "tempProfile";

  const logoutWrap = document.createElement("div");
  logoutWrap.className = "logout-wrapper";
  logoutWrap.id = "logOutBtn";

  body.append(wrapDiv);

  wrapDiv.appendChild(tempDiv);

	tempDiv.innerHTML = stringTmp;

  if(sessionStorage.getItem("ID") != "admin")
    fillCustomerInfo(sessionStorage.getItem("ID"));
  else {
    tempDiv.innerHTML = "<h2>You are logged in on an Admin Account!</h2>";
  }
  //TODO: ACTUALLY ADD information currentl will just display that user is logged in for testing.

  const logoutBtn = document.createElement("btn");
  logoutBtn.className = "logout-Btn";
  logoutBtn.id = "logOutBtn";
  logoutBtn.textContent = "LOG OUT";
  logoutBtn.addEventListener('click', event => {
    logoutUser();
    clearPage();
    switchToLogin();
  });
  body.append(wrapDiv);
  body.append(logoutWrap);
  logoutWrap.append(logoutBtn);
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
      alert("PLEASE ENSURE PASSWORDS MATCH!");
    else if(usernameTxt != "" && passwordTxt != "")
      switchToRegister(usernameTxt, passwordTxt);
    else
      alert("PLEASE FILL OUT ALL FIELDS");
  });

  adminLoginBtn.addEventListener('click', event => {
    let usernameTxt = document.getElementById("loginUsernameInput").value;
    let passwordTxt = document.getElementById("loginPasswordInput").value;
    if(usernameTxt != "" && passwordTxt != "")
      attemptLogin(usernameTxt, passwordTxt, "attemptAdminLogin");
  });
}

//Function to switch to the edit profile screen
function switchToEdit() {
  var cID = sessionStorage.getItem("ID");
  var selected = sessionStorage.getItem("selectedCustomer");
  var selectedProduct = sessionStorage.getItem("selectedProduct");
  const wrapDiv = document.createElement("div");
  wrapDiv.className = "wrapper";
  wrapDiv.id = "wrapDiv";
  if(cID == "admin" && selected == null)
  {
    const adminDiv = document.createElement("div");
    adminDiv.className = "admin";
    adminDiv.id = "tempAdmin";

    adminDiv.innerHTML = "<form class=\"cID-form\"><input type=\"text\" id=\"cusID\" placeholder=\"Enter Customer Username to Edit\"></form><button id=\"selectCustomer\" class=\"register-btn\">Select Customer</button><h1 class = \"or\">OR</h1><button id=\"addItem\" class=\"register-btn\">Add New Item</button><h1 class = \"or\">OR</h1><form class=\"cID-form\"><input type=\"text\" id=\"pID\" placeholder=\"Enter Product ID to Edit\"></form><button id=\"editItem\" class=\"register-btn\">Edit Item</button><h1 class = \"or\">OR</h1><button id=\"createCoupon\" class=\"register-btn\">Create Coupon</button><h1 class = \"or\">OR</h1><button id=\"disableCouponBtn\" class =\"register-btn\">Disable Coupon</button>";
    body.append(wrapDiv);
    wrapDiv.append(adminDiv);

    const selectBtn = document.getElementById("selectCustomer");
    selectBtn.addEventListener('click', event => {
      let cIDTxt = document.getElementById("cusID").value;
      sessionStorage.setItem("selectedCustomer", cIDTxt);
      clearPage();
      switchToEdit();
    });

    const itemSelectBtn = document.getElementById("addItem");
    itemSelectBtn.addEventListener('click', event => {
      clearPage();
      switchToProductAdd();
    });

    const itemUpdateBtn = document.getElementById("editItem");
    itemUpdateBtn.addEventListener('click', event => {
      let pIDTxt = document.getElementById("pID").value;
      clearPage();
      switchToProductEdit(pIDTxt);
    });

    const createCoupon = document.getElementById("createCoupon");
    createCoupon.addEventListener('click', event => {
      clearPage();
      switchToCouponCreate();
    });

    const disableCouponBtn = document.getElementById("disableCouponBtn");
    disableCouponBtn.addEventListener('click', event => {
      clearPage();
      switchToCouponDisable();
    });
  }
  
  else{
    var stringTmp = "<h2 class=\"createHeader\">Update Account Information</h2><h3 class=\"subHeader\">Make any changes needed, leave any space blank to leave the same</h3><form class=\"fName\"><input type=\"text\" id=\"firstName\" placeholder=\"Enter First Name\"></form><form class=\"lName\"><input type=\"text\" id=\"lastName\" placeholder=\"Enter Last Name\"></form><form class=\"mAddress\"><input type=\"text\" id=\"mailingAddress\" placeholder=\"Enter Mailing Address\"></form><form class=\"mCity\"><input type=\"text\" id=\"mailingCity\" placeholder=\"Enter Mailing City\"></form><form class=\"mState\"><input type=\"text\" id=\"mailingState\" placeholder=\"Enter Mailing State\"></form><form class=\"mZipCode\"><input type=\"text\" id=\"mailingZipCode\" placeholder=\"Enter Mailing Zip Code\"></form><form class=\"bAddress\"><input type=\"text\" id=\"billingAddress\" placeholder=\"Enter Billing Address\"></form><form class=\"pNumber\"><input type=\"text\" id=\"phoneNumber\" placeholder=\"Enter Phone Number\"></form><form class=\"eMail\"><input type=\"text\" id=\"email\" placeholder=\"Enter Email\"></form><button id=\"preview\" class=\"register-btn\">Preview Account Information</button><button id=\"register\" class=\"register-btn\">Update Account Information</button>";

  const registerDiv = document.createElement("div");
  registerDiv.className = "register";
  registerDiv.id = "tempRegister";

  body.append(wrapDiv);

  wrapDiv.appendChild(registerDiv);

	registerDiv.innerHTML = stringTmp;
	const register = document.getElementById("register");

  // else
  //   fillUpdateInfo(sessionStorage.getItem("ID"));
  const preview = document.getElementById("preview");

	var firstNameTxt;
	var lastNameTxt;
	var mailingAddressTxt;
	var mailingCityTxt;
	var mailingStateTxt;
	var mailingZipCodeTxt;
	var billingAddressTxt;
	var phoneNumberTxt
	var emailTxt;
  preview.addEventListener('click', event => {
    if(preview.textContent == "Preview Account Information"){
      preview.textContent = "Hide Account Informatation";
      //Store values of boxes before account information is previewed, so that the user's input isn't overwritten.
      firstNameTxt = document.getElementById("firstName").value;
      lastNameTxt = document.getElementById("lastName").value;
      mailingAddressTxt = document.getElementById("mailingAddress").value;
      mailingCityTxt = document.getElementById("mailingCity").value;
      mailingStateTxt = document.getElementById("mailingState").value;
      mailingZipCodeTxt = document.getElementById("mailingZipCode").value;
      billingAddressTxt = document.getElementById("billingAddress").value;
      phoneNumberTxt = document.getElementById("phoneNumber").value;
      emailTxt = document.getElementById("email").value;
      if(cID == "admin") {
        var tempCID = getCustomerId(sessionStorage.getItem("selectedCustomer"));
        fillUpdateInfo(tempCID);
      }
      else
        fillUpdateInfo(sessionStorage.getItem("ID"));
	//Sets color for the previewed information to orange
	setTimeout(() => { document.getElementById("firstName").style.color = "orange"; 
    document.getElementById("lastName").style.color = "orange"; 
    document.getElementById("mailingAddress").style.color = "orange"; 
    document.getElementById("mailingCity").style.color = "orange"; 
    document.getElementById("mailingState").style.color = "orange"; 
    document.getElementById("mailingZipCode").style.color = "orange"; 
    document.getElementById("billingAddress").style.color = "orange"; 
    document.getElementById("phoneNumber").style.color = "orange"; 
    document.getElementById("email").style.color = "orange"; 
	}, 300);
    }else{
	preview.textContent = "Preview Account Information";
      //Reverts color back to previous-ish
	  document.getElementById("firstName").style.color = "#D3D3D3";
	  document.getElementById("lastName").style.color = "#D3D3D3"; 
	  document.getElementById("mailingAddress").style.color = "#D3D3D3"; 
	  document.getElementById("mailingCity").style.color = "#D3D3D3"; 
	  document.getElementById("mailingState").style.color = "#D3D3D3"; 
	  document.getElementById("mailingZipCode").style.color = "#D3D3D3"; 
	  document.getElementById("billingAddress").style.color = "#D3D3D3"; 
	  document.getElementById("phoneNumber").style.color = "#D3D3D3"; 
	  document.getElementById("email").style.color = "#D3D3D3"; 

      //Sets values that were stored back to their boxes when the information is hidden.
      document.getElementById("firstName").value = firstNameTxt;
      document.getElementById("lastName").value = lastNameTxt;
      document.getElementById("mailingAddress").value = mailingAddressTxt;
      document.getElementById("mailingCity").value = mailingCityTxt;
      document.getElementById("mailingState").value = mailingStateTxt;
      document.getElementById("mailingZipCode").value = mailingZipCodeTxt;
      document.getElementById("billingAddress").value = billingAddressTxt;
      document.getElementById("phoneNumber").value = phoneNumberTxt;
      document.getElementById("email").value = emailTxt;
    }
  });

	register.addEventListener('click', event => {
    let firstNameTxt = document.getElementById("firstName").value;
    let lastNameTxt = document.getElementById("lastName").value;
    let mailingAddressTxt = document.getElementById("mailingAddress").value;
    let mailingCityTxt = document.getElementById("mailingCity").value;
    let mailingStateTxt = document.getElementById("mailingState").value;
    let mailingZipCodeTxt = document.getElementById("mailingZipCode").value;
    let billingAddressTxt = document.getElementById("billingAddress").value;
    let phoneNumberTxt = document.getElementById("phoneNumber").value;
    let emailTxt = document.getElementById("email").value;
    
    
    const parsed = parseInt(mailingZipCodeTxt);

    if(mailingZipCodeTxt != "" && isNaN(parsed)) { 
      alert("PLEASE ONLY ENTER NUMBERS IN ZIPCODE ENTRY!");
    }
    else{
      //Calls updateAccountInfo to update the database
      updateAccountInfo(firstNameTxt, lastNameTxt, mailingAddressTxt, mailingCityTxt, mailingStateTxt, mailingZipCodeTxt, billingAddressTxt, phoneNumberTxt, emailTxt);
    }  
  });
  }
}

//Function to switch screen to cart information page
function switchToCart() {
  const form = document.createElement("form");
  form.className = "shoppingList";
  form.id = "cartDisplay";
  var stringTmp ="<div id=\"itemsTable\"><h2>Shopping Cart</h2><table class = \"cartTable\" id=\"list\"><tbody id=\"cartBody\"></tbody></table><label>* Remove all items<input class = \"clearBtn\"id = \"clearBtn\" type=\"button\" value=\"Clear Cart\"></label></div>";
  body.append(form);
  form.innerHTML = stringTmp;
  checkCart();
  doShowAll();
  const div = document.createElement("div");
  div.className = "totalScreen";
  div.id = "totalDisplay";
  var cart = JSON.parse(sessionStorage.getItem("cart"));
  var items = cart.items;
  subTotal = 0;
  for(var i = 0.0; i < items.length; i++) {
    subTotal += parseFloat(parseFloat(items[i].pPrice * items[i].pInventory).toFixed(2));
  }
  taxes = subTotal * 0.0825;
  total = subTotal + taxes + shippingCost;
  var totalTemp = "<form class = \"discount-Code-Form\" id=\"discountCode\"><input class = \"discount-Code\"type=\"text\" id=\"discountCodeInput\" placeholder=\"Enter Discount Code\"></form><btn class = \"discountBtn\" id =\"applyCode\">Apply Code</btn><h1 id = \"subTotalTxt\" class = \"totalScreenTxt\">Subtotal: $";
  totalTemp += subTotal.toFixed(2);
  totalTemp += "</h1><h1 id = \"taxesTxt\" class = \"totalScreenTxt\">Taxes: $";
  totalTemp += taxes.toFixed(2);
  totalTemp += "</h1><h1 class = \"totalScreenTxt\">Shipping and Handling Fees: $";
  totalTemp += shippingCost.toFixed(2);
  totalTemp += "</h1><h1 id = \"totalTxt\" class = \"totalScreenTxt\">Total: $";
  if(subTotal != 0.0)
    totalTemp += total.toFixed(2);
  else 
    totalTemp += subTotal.toFixed(2);
  totalTemp += "</h1> <div class = \"horizontal-centering\"><button class = \"order-Btn\" id = \"orderBtn\">PLACE ORDER</btn></div>";
  body.append(div);
  div.innerHTML = totalTemp;
  const orderBtn = document.getElementById("orderBtn");
  orderBtn.addEventListener('click', event => {
    getBillingInfo();
  });
  const discountBtn = document.getElementById("applyCode");
  discountBtn.addEventListener('click', event => {
    var discountInput = document.getElementById("discountCodeInput").value;
    if(discountInput != "" && subTotal != 0) {
      checkAndApplyCode(discountInput);
    }
  });
}

//Function to switch screen to order information page
function switchToOrders(sortByTxt) {
  if(isLoggedIn()) {
    const div = document.createElement("div");
    div.className = "py-5";
    div.id = "orderDisplay";
    //var stringTmp = "<h2>Order List</h2><fieldset class=\"fieldset\" id = \"orderField\"><legend>Orders</legend><</fieldset><div id=\"orderTable\"><table id=\"list\"></table></div>";
    var stringTmp = "";
    var cID = sessionStorage.getItem("ID");
    if(cID != "admin")
      stringTmp = "<div class=\"containter\"><div class =\"\"><div class =\"row\"><div class=\"col-md-12\"><table class=\"table\"><thead><tr><th>Order Number</th><th>ITEMS</th><th>Quantity</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody id = \"tableBody\"><tr>";
    else
      stringTmp = "<div class=\"containter\"><div class =\"\"><div class =\"row\"><div class=\"col-md-12\"><table class=\"table\"><thead><tr><th>Customer ID</th><th>Order Number</th><th>ITEMS</th><th>Quantity</th><th>Total</th><th>Date</th><th>Status</th></tr></thead><tbody id = \"tableBody\"><tr>";
    jQuery.ajax({
      type: "POST",
      url: 'SQLConnect.php',
      dataType: 'JSON',
      data: {functionname: 'getCustomerOrders', customerID: cID, sortBy: sortByTxt},
  
      success: function (obj) {
        var temp = JSON.parse(obj);
        //Will likely be an array so will iterate through getting values and updating areas.
        var curOrderNum = 0;
        var orderTmp = "";
        var orderedItems = "";
        var orderedQuant = "";
        var orderedTotal = "";
        var orderedDate = "";
        var orderStatus = "";
        for (var i = 0; i < temp.length; i++) {
          var object = temp[i];
          if(i == 0)
            curOrderNum = object["orderID"];
          if(curOrderNum == object["orderID"]) {
            orderedItems += "<label class =\"testClass\">" + object["pName"] + "</label>";
            orderedQuant += "<label class =\"testClass\">" + object["pQuantity"] + "</label>";
            if(orderedTotal == ""){
              orderedTotal += "<label class =\"testClass\">$" + object["total"] + "</label>";
              orderedDate += "<label class =\"testClass\">" + object["orderDateTime"] + "</label>";
              orderStatus += "<label class =\"testClass\">" + object["status"] + "</label>";
            }
          }
          else{
            if(cID == "admin")
              orderTmp += "<td>" + object["cID"] + "</td>" + "<td>" + curOrderNum + "</td> <td>" + orderedItems + '</td><td>' + orderedQuant + "</td><td>" + orderedTotal + "</td><td>" + orderedDate + "</td><td>" + orderStatus + "</td></tr>";
            else
            orderTmp += "<td>" + curOrderNum + "</td> <td>" + orderedItems + '</td><td>' + orderedQuant + "</td><td>" + orderedTotal + "</td><td>" + orderedDate + "</td><td>" + orderStatus + "</td></tr>";
            orderedItems = "<label class =\"testClass\">" + object["pName"] + "</label>";
            orderedQuant = "<label class =\"testClass\">" + object["pQuantity"] + "</label>";
            orderedTotal = "<label class =\"testClass\">$" + object["total"] + "</label>";
            orderedDate = "<label class =\"testClass\">" + object["orderDateTime"] + "</label>";
            orderStatus = "<label class =\"testClass\">" + object["status"] + "</label>";
            curOrderNum = object["orderID"];
          }
          if(i == temp.length-1) {
            if(cID == "admin")
              orderTmp += "<td>" + object["cID"] + "</td>" + "<td>" + curOrderNum + "</td><td>" + orderedItems + '</td><td>' + orderedQuant + "</td><td>" + orderedTotal + "</td><td>" + orderedDate + "</td><td>" + orderStatus + "</td></tr>";
            else
              orderTmp += "<td>" + curOrderNum + "</td><td>" + orderedItems + '</td><td>' + orderedQuant + "</td><td>" + orderedTotal + "</td><td>" + orderedDate + "</td><td>" + orderStatus + "</td></tr>";
          }
        }
        var select = document.getElementById("sortOptions");
        if(select == null) {
          select = document.createElement("select");
          select.id = "sortOptions";
          var options;
          if(cID == "admin")
            options = ["Order By Newest Date", "Order By Customer ID", "Order By Total"];
          else
            options = ["Order By Newest Date", "Order By Total"]; 
          for (var i = 0; i < options.length; i++) {
            var option = document.createElement("option");
            option.value = options[i];
            option.text = options[i];
            select.appendChild(option);
          }
          body.appendChild(select);
        }
        body.append(div);
        div.innerHTML = stringTmp;
        const tableBody = document.getElementById("tableBody");
        tableBody.insertAdjacentHTML('beforeend', orderTmp);
        select.addEventListener("change", function(e){
          e.stopImmediatePropagation();
          let filterName = select.value;
          clearOrderResults();
          switchToOrders(filterName);
        });
      }
    }); 
  }
  else {
    const h2 = document.createElement("h2");
    h2.className = "productName";
    h2.textContent = "If you have an account please log in to view orders.";
    h2.id = "orderDisplay";
    body.append(h2);
    //ADD OPTION TO DISPLAY ORDER WITH EMAIL AND ORDER NUMBER WITHOUT LOGGING IN
  }
}

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
   
  var stringTmp = "<h2 class=\"createHeader\">Registration Almost Complete</h2><form class=\"fName\"><input type=\"text\" id=\"firstName\" placeholder=\"Enter First Name\"></form><form class=\"lName\"><input type=\"text\" id=\"lastName\" placeholder=\"Enter Last Name\"></form><form class=\"mAddress\"><input type=\"text\" id=\"mailingAddress\" placeholder=\"Enter Mailing Address\"></form><form class=\"mCity\"><input type=\"text\" id=\"mailingCity\" placeholder=\"Enter Mailing City\"></form><form class=\"mState\"><input type=\"text\" id=\"mailingState\" placeholder=\"Enter Mailing State\"></form><form class=\"mZipCode\"><input type=\"text\" id=\"mailingZipCode\" placeholder=\"Enter Mailing Zip Code\"></form><form class=\"bAddress\"><input type=\"text\" id=\"billingAddress\" placeholder=\"Enter Billing Address\"></form><form class=\"pNumber\"><input type=\"text\" id=\"phoneNumber\" placeholder=\"Enter Phone Number\"></form><form class=\"eMail\"><input type=\"text\" id=\"email\" placeholder=\"Enter Email\"></form><button id=\"register\" class=\"register-btn\">REGISTER</button>";
  const div = document.getElementById("tempRegister");
  div.innerHTML = stringTmp;
  const register = document.getElementById("register");

  

  register.addEventListener('click', event => {
    let firstNameTxt = document.getElementById("firstName").value;
    let lastNameTxt = document.getElementById("lastName").value;
    let mailingAddressTxt = document.getElementById("mailingAddress").value;
    let mailingCityTxt = document.getElementById("mailingCity").value;
    let mailingStateTxt = document.getElementById("mailingState").value;
    let mailingZipCodeTxt = document.getElementById("mailingZipCode").value;
    let billingAddressTxt = document.getElementById("billingAddress").value;
    let phoneNumberTxt = document.getElementById("phoneNumber").value;
    let emailTxt = document.getElementById("email").value;
    
    if(firstNameTxt == "" || lastNameTxt == "" || mailingAddressTxt == "" || mailingCityTxt == "" || mailingStateTxt == "" || mailingZipCodeTxt == "" || billingAddressTxt == "" || phoneNumberTxt == "" || emailTxt == "")
    {
      alert("PLEASE FILL OUT ALL FIELDS");
    }
    else
    {
      const parsed = parseInt(mailingZipCodeTxt);
      if (isNaN(parsed)) { 
        alert("PLEASE ONLY ENTER NUMBERS IN ZIPCODE ENTRY!");
      }
      else{
        sessionStorage.setItem("firstName", firstNameTxt);
        registerNewUser(usernameTxt, passwordTxt, firstNameTxt, lastNameTxt, mailingAddressTxt, mailingCityTxt, mailingStateTxt, mailingZipCodeTxt, billingAddressTxt, phoneNumberTxt, emailTxt);
        alert("Registered!");
      }
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
      if (obj == "\"error\"") {
        alert("ERROR CREATING ACCOUNT");
        sessionStorage.removeItem("firstName");
      }
      else {
        sessionStorage.setItem("ID", obj.substring(1, obj.length-1));
        clearPage();
        createHomeView();
        //TODO: Should probably add element or maybe another class to body to keep track of username or userID
      }
    }
  }); 
}

function registerNewItem(pID, pName, pDescription, pPrice, pImagePath, pInventory, pCategory) {
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'text',
    data: {
      functionname: "registerItem",
      productID: pID,
      productName: pName,
      productDescription: pDescription,
      productPrice: pPrice,
      productImagePath: pImagePath,
      productInventory: pInventory,
      productCategory: pCategory
    },
    success: function (obj) {
      if (obj == "\"Registered\"") {
        // You can perform any required actions after a successful registration here
        alert("New item registered.");
      } else {
        alert("COULD NOT REGISTER NEW ITEM. ERROR: " + obj);
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
        const txt = document.createElement("h3");
        txt.className = "log-txt";
        txt.id = "log";
        txt.textContent = "LOGGED IN SUCCESSFULLY";
        body.append(txt);
        //This will add the logged-in class to the body which will allow the page to know user is logged in
        
        //TODO: Should probably add element or maybe another class to body to keep track of username or userID
        if(functionName == "attemptAdminLogin") 
        {
          sessionStorage.setItem("ID", "admin");
          sessionStorage.setItem("firstName", "admin");
          //goToAdminScreen();
        } else {
          sessionStorage.setItem("ID", temp.cID);
          sessionStorage.setItem("firstName", temp.firstName);
        }
        createHomeView();
      }
    }
  }); 
}

function doShowAll() {
  checkCart();
  var list = "<tr><th>Item</th><th>Price</th><th>Quantity</th><th>REMOVE</th></tr>\n";
  var cart = JSON.parse(sessionStorage.getItem("cart"));
  var items = cart.items;
  var tableCartBody = document.getElementById("cartBody");
  for(var i = 0; i < items.length; i++) {
    var item = items[i];
    list += "<tr><td>" + item.pName + "</td><td>" + "$" + item.pPrice + "</td><td id = \"quantity" + item.pID + "\">" + item.pInventory +"</td><td><button class = \"removeItem\" id = " + item.pID + " type = \"button\">Remove item</button></tr>";
  }
  if(list == "<tr><th>Item</th><th>Value</th></tr>") {
    list += "<tr><td><i>NO ITEMS!</i></td><td><i>NO ITEMS!</i></td></tr>";
  }
  tableCartBody.innerHTML = list;
  for(var i = 0; i < items.length; i++) {
    var item = items[i];
    const rmvBtn = document.getElementById(item.pID);
    rmvBtn.addEventListener('click', event => {
      for(var j = 0; j < items.length; j++)
      {
        if(items[j].pID == rmvBtn.id.toString())
        {
          removeFromCart(items[j]);
        }
      }
      //removeFromCart(items);
      doShowAll();
    });
  }
  var clearBtn = document.getElementById("clearBtn");
  clearBtn.addEventListener('click', event => {
    ClearAll();
  })
}

function ClearAll() {
  sessionStorage.removeItem("cart");
  checkCart();
  doShowAll();
}

function addToCart(object) {
  var cart = sessionStorage.getItem("cart");
  var cartObject = JSON.parse(cart);
  var cartCopy = cartObject;
  var items = cartCopy.items;
  for( var i = 0; i < items.length; ++i ) {
    var item = items[i];
    if(object["pID"] == item.pID)
    {
      item.pInventory += 1;
      alert("UPDATED QUANTITY: " + item.pInventory);
      sessionStorage.setItem("cart", JSON.stringify(cartCopy));
      return;
    }
  }
  object["pInventory"] = 1;
  items.push(object);
  sessionStorage.setItem("cart", JSON.stringify(cartCopy));
  alert("ADDED TO CART!");
}

function removeFromCart(object) {
  var cart = sessionStorage.getItem("cart");
  var cartObject = JSON.parse(cart);
  var itemList = cartObject.items;
  var newCart = {};
  newCart.items = [];
  for( var i = 0; i < itemList.length; ++i ) {
    var item = itemList[i];
    if(object["pID"] == item.pID)
    {
      item.pInventory -= 1;
    }
    if(item.pInventory > 0)
      newCart.items.push(item);
  }
  sessionStorage.setItem("cart", JSON.stringify(newCart));
  alert("REMOVED ITEM!");
}

function checkCart() {
  if(sessionStorage.getItem("cart") == null)
  {
    var c = {};
    c.items = [];
    sessionStorage.setItem("cart", JSON.stringify(c));
  }
}

function placeOrder() {
  var orderNum;
  var cID;
  if(sessionStorage.getItem("ID") == null) {
    //TODO: ADD METHOD TO ALLOW INFORMATION TO BE INPUT FOR GUESTS
    return;
  }
  else {
    cID = parseInt(sessionStorage.getItem("ID"));
  }
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getLastOrder'},

    success: function (obj) {
      var temp = JSON.parse(obj);
      if (temp.error) {
        orderNum = 1;
      }
      else {
        orderNum = parseInt(temp.orderNum) + 1;
      }
      var currentDate = new Date();
      var orderDateTime = currentDate.getFullYear() + "-" + (currentDate.getMonth()+1)  + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
      var cart = JSON.parse(sessionStorage.getItem("cart"));
      var items = cart.items;
      jQuery.ajax({
        type: "POST",
        url: 'SQLConnect.php',
        dataType: 'text',
        data: {functionname: 'placeOrder', orderNm: orderNum, dateTime: orderDateTime, customerID: cID, sub: subTotal.toFixed(2), tax: taxes.toFixed(2), ship: shippingCost.toFixed(2), totl: total.toFixed(2)},

        success: function (obj) {
          if (obj != "\"Placed\"") {
            alert("Error Placing Order");
          }
          else {
            for(var i = 0; i < items.length; i++) {
              var pID = items[i].pID;
              var pQuantity = items[i].pInventory;
              jQuery.ajax({
                type: "POST",
                url: 'SQLConnect.php',
                dataType: 'text',
                data: {functionname: 'orderProducts', orderNm: orderNum, productID: pID, productQuantity: pQuantity},
        
                success: function (obj) {
                  if (obj != "\"Placed\"") {
                    alert("Error Placing Order");
                  }
                }
              });
            }
            sessionStorage.removeItem("cart");
            alert("ORDER PLACED! YOUR ORDER NUMBER IS: " + orderNum);
            clearPage();
            switchToOrders();
          }
        }
      });
    }
  });
}

function getBillingInfo() {
  // const label = document.createElement("label");
  // label.textContent = "BILLING INFORMATION: "
  if(newTotal != 0.0) {
    subTotal = newSubTotal;
    taxes = newTaxes;
    total = newTotal;
  }
  const div = document.createElement("div");
  div.id = "billing";
  if(sessionStorage.getItem("ID") != null) {
    clearPage();
    div.innerHTML = "<label>BILLING INFORMATION:</label><form class=\"billingName\" id=\"billName\"><input type=\"text\" id=\"billNameInput\" placeholder=\"Full name (First and Last name)\"></form> <form class=\"streetAddress\" id=\"streetAddress\"><input type=\"text\" id=\"streetAddressInput\" placeholder=\"Street address or P.O. Box\"></form> <form class=\"billingCity\" id=\"billCity\"><input type=\"text\" id=\"billCityInput\" placeholder=\"City\"></form> <form class=\"billingState\" id=\"billState\"><input type=\"text\" id=\"billStateInput\" placeholder=\"State\"></form> <form class=\"billingZipCode\" id=\"billZipCode\"><input type=\"text\" id=\"billZipCodeInput\" placeholder=\"ZIP Code\"></form> <form id=\"cardNum\"><input type=\"text\" id=\"cardNumInput\" placeholder=\"Card number\"></form> <form id=\"cardName\"><input type=\"text\" id=\"cardNameInput\" placeholder=\"Name on card\"></form> <form id=\"cardExpDate\"><input type=\"text\" id=\"cardExpDateInput\" placeholder=\"Expiration date (as mm/yyyy)\"></form> <button id = \"placeOrderBtn\">PLACE ORDER</btn>";
    const body = document.querySelector('body');
    //body.append(label);
    body.append(div);
    const orderBtn = document.getElementById("placeOrderBtn");
    orderBtn.addEventListener('click', event => {
      var billNameInput = document.getElementById("billNameInput").value;
      var streetAddressInput = document.getElementById("streetAddressInput").value;
      var billCityInput = document.getElementById("billCityInput").value;
      var billStateInput = document.getElementById("billStateInput").value;
      var billZipCodeInput = document.getElementById("billZipCodeInput").value;
      var cardNum = document.getElementById("cardNumInput").value;
      var cardName = document.getElementById("cardNameInput").value;
      var cardExpDate = document.getElementById("cardExpDateInput").value;
      if(billNameInput == "" || streetAddressInput == "" || billCityInput == "" || billStateInput == "" || billZipCodeInput == "" || cardNum == "" || cardName == "" || cardExpDate == "") {
        alert("PLEASE ENSURE ALL FIELDS ARE FILLED OUT!")
      }
      else
        placeOrder();
    });
  }
  else {
    alert("PLEASE LOGIN TO PLACE ORDER!");
    //TODO: ALLOW FOR PLACING ORDER AS GUEST IF WE WANT
  }
}

function checkAndApplyCode(discountCode) {
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'text',
    data: {functionname: 'checkCode', code: discountCode},

    success: function (obj) {
      if (obj == "\"Invalid\"") {
        alert(discountCode + " is not a valid discount code!");
      }
      else {
        if(obj[1] == "$")
        {
          newSubTotal = subTotal - parseInt(obj.substring(2, obj.length-1));
          newTaxes = newSubTotal * 0.0825;
          newTotal = newSubTotal + newTaxes + shippingCost;
        }
        else if(obj[1] == "%")
        {
          newSubTotal = subTotal * (1.0 - (parseFloat(obj.substring(2, obj.length-1)) / 100));
          newTaxes = newSubTotal * 0.0825;
          newTotal = newSubTotal + newTaxes + shippingCost;
        }
        updatePrices();
      }
    }
  });
}

function updatePrices() {
  const subTotalTxt = document.getElementById("subTotalTxt");
  const discountTxt = document.getElementById("discountTxt");
  const taxesTxt = document.getElementById("taxesTxt");
  const totalTxt = document.getElementById("totalTxt");
  subTotalTxt.textContent = "Subtotal: $" + newSubTotal.toFixed(2);
  taxesTxt.textContent = "Taxes: $" + newTaxes.toFixed(2);
  totalTxt.textContent = "Total: $" + newTotal.toFixed(2);
  if(discountTxt == null) {
    const discountTxt = document.createElement("h1");
    discountTxt.className = "totalScreenTxt";
    discountTxt.id = "discountTxt";
    discountTxt.textContent = "Discount: ($" + (subTotal-newSubTotal).toFixed(2) + ")";
    taxesTxt.before(discountTxt);
  }
}

function logoutUser() {
  sessionStorage.removeItem("ID");
  sessionStorage.removeItem("firstName");
}

function createHomeView(){
  const div = document.createElement("div");
  div.className = "homeView";
  div.id = "homeView";

  const h2 = document.createElement("h2");
  h2.className = "productName";

  if(isLoggedIn())
    h2.textContent = "Welcome, " + sessionStorage.getItem("firstName") + "!";
  else
    h2.textContent = "Welcome, Guest!";

  const homeProductBtn = document.createElement("button");
  homeProductBtn.className = "homeProduct-btn";
  homeProductBtn.id = "homeProduct";
  homeProductBtn.textContent = "Browse Products";

  const homeLoginBtn = document.createElement("button");
  homeLoginBtn.className = "homeLogin-btn";
  homeLoginBtn.id = "homeLogin";

  if(isLoggedIn())
     homeLoginBtn.textContent = "View Profile"
  else
     homeLoginBtn.textContent = "Login/Sign-up";

  body.append(div)
  div.append(h2);
  div.append(homeProductBtn);
  div.append(homeLoginBtn);

  let loginBtn = document.getElementById("homeLogin");
  loginBtn.addEventListener('click', event => {
    clearPage();
    if(isLoggedIn())
      switchToProfile();
    else
      switchToLogin();
  });
  
  let productsBtn = document.getElementById("homeProduct");
  productsBtn.addEventListener('click', event => {
    clearPage();
    searchProducts(" ", "default");
  });
}

function fillCustomerInfo(cID){
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: "retrieveUserInfo", id: cID},

    success: function (obj) {
      var temp = JSON.parse(obj);
      //If there is an error value then the login was unsucceful we can display more information if wanted.
      if (temp.error) {
        alert("ERROR RETRIEVING ACCOUNT INFORMATION");
      }
      //Else, fill input fields with the user's account information
      else {
        var firstName = document.getElementById("firstName");
        firstName.textContent = "FIRST NAME: " + temp.firstName;

        var lastName = document.getElementById("lastName");
        lastName.textContent = "LAST NAME: " + temp.lastName;

        var mailingAddress = document.getElementById("mailingAddress");
        mailingAddress.textContent = "MAILING ADDRESS: " + temp.mailingAddress;

        var mailingCity = document.getElementById("mailingCity");
        mailingCity.textContent = "MAILING CITY: " + temp.mailingCity;

        var mailingState = document.getElementById("mailingState");
        mailingState.textContent = "MAILING STATE: " + temp.mailingState;

        var mailingZipCode = document.getElementById("mailingZipCode");
        mailingZipCode.textContent = "MAILING ZIP CODE: " + temp.mailingZipCode;

        var billingAddress = document.getElementById("billingAddress");
        billingAddress.textContent = "BILLING ADDRESS: " + temp.billingAddress;

        var phoneNumber = document.getElementById("phoneNumber");
        phoneNumber.textContent = "PHONE NUMBER: " + temp.phoneNumber;

        var email = document.getElementById("email");
        email.textContent = "EMAIL: " + temp.email;
      }
    }
  }); 
}

//Function autofills account info text boxes with the current data
function fillUpdateInfo(cID){
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: "retrieveUserInfo", id: cID},

    success: function (obj) {
      var temp = JSON.parse(obj);
      //If there is an error value then the login was unsucceful we can display more information if wanted.
      if (temp.error) {
        alert(cID);
        alert("ERROR RETRIEVING ACCOUNT INFORMATION");
        if(sessionStorage.getItem("selectedCustomer") != null) {
          sessionStorage.removeItem("selectedCustomer");
          clearPage();
          switchToEdit();
        }
      }
      //Else, fill input fields with the user's account information
      else {
        var firstName = document.getElementById("firstName");
        firstName.value = temp.firstName

        var lastName = document.getElementById("lastName");
        lastName.value = temp.lastName

        var mailingAddress = document.getElementById("mailingAddress");
        mailingAddress.value = temp.mailingAddress

        var mailingCity = document.getElementById("mailingCity");
        mailingCity.value = temp.mailingCity

        var mailingState = document.getElementById("mailingState");
        mailingState.value = temp.mailingState

        var mailingZipCode = document.getElementById("mailingZipCode");
        mailingZipCode.value = temp.mailingZipCode

        var billingAddress = document.getElementById("billingAddress");
        billingAddress.value = temp.billingAddress

        var phoneNumber = document.getElementById("phoneNumber");
        phoneNumber.value = temp.phoneNumber

        var email = document.getElementById("email");
        email.value = temp.email
      }
    }
  }); 
}

//Function updates the old account information on the database using the user's ID
function updateAccountInfo(firstName, lastName, mailingAddress, mailingCity, mailingState, mailingZipCode, billingAddress, phoneNumber, email){
  var cID = sessionStorage.getItem("ID");
  if(cID == "admin")
    cID = sessionStorage.getItem("selectedCustomerID");
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'text',
    data: {functionname: "updateUserInfo", id: cID, fName: firstName, lName: lastName, mAddress: mailingAddress, mCity: mailingCity, mState: mailingState, mZipCode: mailingZipCode, bAddress: billingAddress, pNumber: phoneNumber, eMail: email},

    success: function (obj) {
        if (obj == "\"Updated\"") {
          if(sessionStorage.getItem("ID") == "admin")
          {
            sessionStorage.removeItem("selectedCustomer");
            sessionStorage.removeItem("selectedCustomerID");
          }
          else {
            if(firstName != "")
              sessionStorage.setItem("firstName", firstName);
          }
          clearPage();
    	    alert("Updated!");
          createHomeView();
        }
        else{
          alert("COULD NOT UPDATE ACCOUNT INFORMATION. ERROR: " + obj);
        }
	}
  }); 
}

function searchProducts(query, filterName) {
  //Uses ajax to make request to SQLConnect to connect to database and get data.
  //Currently grabbing all data may switch to only grab pImagePath and pID.
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: 'getProductData', parameter: query, parameterTwo: filterName},

    success: function (obj) {
      //If successful will create new elemets to display data
      var div = document.getElementById("tempGrid");
      if(div == null)
      {
        div = document.createElement("div");
        div.className = "grid";
        div.id = "tempGrid";
        const body = document.querySelector('body');
        body.append(div);
      }
      
      //Parse through returned JSON from SQLConnect function and create values
      var temp = JSON.parse(obj);
      const tempFilter = document.getElementsByClassName("filter-group");
      var stringTmp = "";
      if(tempFilter.length == 0)
      {
        stringTmp += "<div class=\"filter-group\"><label>SORT BY: </label> <select class=\"form-control\" id =\"filter\"><option>Default</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Alphabetical</option><option>Newest Arrivals</option><option>Availability</option></select></div>";
      }
  
        //Will likely be an array so will iterate through getting values and updating areas.
      for (var i = 0; i < temp.length; i++) {
        var object = temp[i];
        stringTmp += "<div id = \"pTemp\" class = \"product\"> <div class = \"left\"> <button id =\"";
        stringTmp += object["pID"];
        stringTmp += "\"><img src = \"";
        stringTmp += object["pImagePath"];
        stringTmp += "\" alt=\"NO IMAGE\" width = 200px></button></div> <div class = \"right\"> <p class=\"title\">";
        stringTmp += object["pName"];
        stringTmp += "</p> <p class =\"price\">";
        stringTmp += "$" + object["pPrice"];
        stringTmp += "</p> <p class = \"description\">"
        stringTmp += object["pDescription"]
        stringTmp += "</p> </div> </div>";
      }
      div.insertAdjacentHTML('beforeend', stringTmp);
      for (var i = 0; i < temp.length; i++)
      {
        var object = temp[i];
        let itemBtn = document.getElementById(object["pID"].toString());
        //NEED to fix this still.
        itemBtn.addEventListener('click', event => {
          for(var j = 0; j < temp.length; j++)
          {
            if(temp[j]["pID"] == itemBtn.id)
              var selected = temp[j];
          }
          clearPage();
          //Will display previous orders if logged in or ask for order number if not
          switchToDetailScreen(selected["pName"], selected["pDescription"], selected["pImagePath"], selected["pPrice"], selected["pCategory"], selected["pInventory"], selected);
        });
      }
      const tempP = document.getElementById("pTemp");
      if(tempP == null)
      {
        div.innerHTML = "<label class = \"noResults\">No results found please search again!<lable>";
      }
      else{
        let filterMenu = document.getElementById("filter");
        filterMenu.addEventListener("change", function(e){
          e.stopImmediatePropagation();
          let filterName = filterMenu.value;
          clearResults();
          searchProducts(query, filterName);
        });
      }
     },
     error: function(xhr, status, error) {
       alert(xhr);
     }
  });
}

function clearOrderResults() {
  const toRemove = document.getElementById("orderDisplay");
  toRemove.remove();
}

function switchToProductAdd() {
  const div = document.createElement("div");
  div.id = "tempAdd";
  div.className = "tmpAdd";
  body.append(div);
  div.innerHTML = "<h2 class=\"createHeader\">Fill out Item Info</h2><form class=\"pName\"><input type=\"text\" id=\"pNameInput\" placeholder=\"Enter Product Name\"></form><form class=\"pDescription\"><input type=\"text\" id=\"pDescriptionInput\" placeholder=\"Enter Product Description\"></form><form class=\"pPrice\"><input type=\"text\" id=\"pPriceInput\" placeholder=\"Enter Product Price\"></form><form class=\"pImagePath\"><input type=\"text\" id=\"pImagePathInput\" placeholder=\"Enter Product Image Path\"></form><form class=\"pInventory\"><input type=\"text\" id=\"pInventoryInput\" placeholder=\"Enter Product Inventory\"></form><form class=\"pCategory\"><input type=\"text\" id=\"pCategoryInput\" placeholder=\"Enter Product Category\"></form><button id=\"addItemBtn\" class=\"register-btn\">Confirm and Add Item</button>";
  const addBtn = document.getElementById("addItemBtn"); 

  addBtn.addEventListener('click', event => {
    let pNameTxt = document.getElementById("pNameInput").value;
    let pDescriptionTxt = document.getElementById("pDescriptionInput").value;
    let pPriceTxt = document.getElementById("pPriceInput").value;
    let pImagePathTxt = document.getElementById("pImagePathInput").value;
    let pInventoryTxt = document.getElementById("pInventoryInput").value;
    let pCategoryTxt = document.getElementById("pCategoryInput").value;
    
    if(pNameTxt == "" || pDescriptionTxt == "" || pPriceTxt == "" || pInventoryTxt == "" || pCategoryTxt == "")
    {
      alert("PLEASE FILL OUT ALL FIELDS (You may leave the image path blank)");
    }
    else
    {
      const parsed = parseInt(pInventoryTxt);
      if (isNaN(parsed)) { 
        alert("PLEASE ONLY ENTER NUMBERS IN inventory ENTRY!");
      }
      else{
        if(pImagePathTxt == ""){
          pImagePathTxt = "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";
        }
        jQuery.ajax({
          type: "POST",
          url: 'SQLConnect.php',
          dataType: 'text',
          data: {functionname: 'createNewItem', pName: pNameTxt, pDescription: pDescriptionTxt, pPrice: pPriceTxt, pImagePath: pImagePathTxt, pInventory: pInventoryTxt, pCategory: pCategoryTxt},
      
          success: function (obj) {
            //If there is an error value then the login was unsucceful we can display more information if wanted.
            if (obj != "\"Created\"") {
              alert("ERROR CREATING ITEM");
            }
            else {
              alert("Item added!");
              //TODO: Should probably add element or maybe another class to body to keep track of username or userID
            }
          }
        }); 
        clearPage();
        switchToEdit();
      }
    }
  });
}

function switchToProductEdit(pID) {
  const div = document.createElement("div");
  div.id = "tempAdd";
  div.className = "tmpAdd";
  body.append(div);
  div.innerHTML = "<h2 class=\"createHeader\">Fill out Item Info</h2><form class=\"pName\"><input type=\"text\" id=\"pNameInput\" placeholder=\"Enter Product Name\"></form><form class=\"pDescription\"><input type=\"text\" id=\"pDescriptionInput\" placeholder=\"Enter Product Description\"></form><form class=\"pPrice\"><input type=\"text\" id=\"pPriceInput\" placeholder=\"Enter Product Price\"></form><form class=\"pImagePath\"><input type=\"text\" id=\"pImagePathInput\" placeholder=\"Enter Product Image Path\"></form><form class=\"pInventory\"><input type=\"text\" id=\"pInventoryInput\" placeholder=\"Enter Product Inventory\"></form><form class=\"pCategory\"><input type=\"text\" id=\"pCategoryInput\" placeholder=\"Enter Product Category\"></form><button id=\"editItemBtn\" class=\"register-btn\">Confirm and Edit Item</button>";
  const eBtn = document.getElementById("editItemBtn"); 

  fillItemUpdateInfo(pID);

  eBtn.addEventListener('click', event => {
    let pNameTxt = document.getElementById("pNameInput").value;
    let pDescriptionTxt = document.getElementById("pDescriptionInput").value;
    let pPriceTxt = document.getElementById("pPriceInput").value;
    let pImagePathTxt = document.getElementById("pImagePathInput").value;
    let pInventoryTxt = document.getElementById("pInventoryInput").value;
    let pCategoryTxt = document.getElementById("pCategoryInput").value;
    
    if(pNameTxt == "" || pDescriptionTxt == "" || pPriceTxt == "" || pInventoryTxt == "" || pCategoryTxt == "")
    {
      alert("PLEASE FILL OUT ALL FIELDS (You may leave the image path blank)");
    }
    else
    {
      const parsed = parseInt(pInventoryTxt);
      if (isNaN(parsed)) { 
        alert("PLEASE ONLY ENTER NUMBERS IN inventory ENTRY!");
      }
      else{
        if(pImagePathTxt == ""){
          pImagePathTxt = "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";
        }
        jQuery.ajax({
          type: "POST",
          url: 'SQLConnect.php',
          dataType: 'text',
          data: {functionname: 'updateItemInfo', pID: pID, pName: pNameTxt, pDescription: pDescriptionTxt, pPrice: pPriceTxt, pImagePath: pImagePathTxt, pInventory: pInventoryTxt, pCategory: pCategoryTxt},
      
          success: function (obj) {
            //If there is an error value then the login was unsucceful we can display more information if wanted.
            if (obj != "\"Updated\"") {
              alert("ERROR UPDATING ITEM");
            }
            else {
              alert("Item edited!");
              //TODO: Should probably add element or maybe another class to body to keep track of username or userID
            }
          }
        }); 
        clearPage();
        switchToEdit();
      }
    }
  });
}

function fillItemUpdateInfo(pID){
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'JSON',
    data: {functionname: "retrieveItemInfo", id: pID},

    success: function (obj) {
      var temp = JSON.parse(obj);
      //If there is an error value then the login was unsucceful we can display more information if wanted.
      if (temp.error) {
        alert("ERROR RETRIEVING ITEM INFORMATION");
        clearPage();
        switchToEdit();
      }
      //Else, fill input fields with the user's account information
      else {
        var pNameTxt = document.getElementById("pNameInput");
        pNameTxt.value = temp.pName;
        var pDescriptionTxt = document.getElementById("pDescriptionInput");
        pDescriptionTxt.value = temp.pDescription;
        var pPriceTxt = document.getElementById("pPriceInput");
        pPriceTxt.value = temp.pPrice;
        var pImagePathTxt = document.getElementById("pImagePathInput");
        pImagePathTxt.value = temp.pImagePath;
        var pInventoryTxt = document.getElementById("pInventoryInput");
        pInventoryTxt.value = temp.pInventory;
        var pCategoryTxt = document.getElementById("pCategoryInput");
        pCategoryTxt.value = temp.pCategory;
      }
    }
  }); 
}

function switchToCouponCreate() {
  const div = document.createElement("div");
  div.id = "tempAdd";
  div.className = "tmpAdd";
  body.append(div);
  div.innerHTML = "<h2 class=\"createHeader\">Fill out Discount Info</h2><form class=\"discount\"><input type=\"text\" id=\"discountInput\" placeholder=\"Enter Discount(Format: $int or %int):\"></form><form class=\"discountCode\"><input type=\"text\" id=\"discountCodeInput\" placeholder=\"Enter Discount Code: \"></form></form><button id=\"addCouponBtn\" class=\"register-btn\">Confirm and Add Coupon</button>";
  const couponBtn = document.getElementById("addCouponBtn");
  couponBtn.addEventListener('click', event=> {
    let discountTxt = document.getElementById("discountInput").value;
    let codeTxt = document.getElementById("discountCodeInput").value;

    //alert("DISCOUNT TXT: " + discountTxt + " CODE TXT: " + codeTxt);
    jQuery.ajax({
      type: "POST",
      url: 'SQLConnect.php',
      dataType: 'text',
      data: {functionname: "createDiscount", discount: discountTxt, code:codeTxt, valid: 1},
  
      success: function (obj) {
        if (obj != "\"Created\"") {
          alert("ERROR CREATING DISCOUNT");
        }
        //Else, fill input fields with the user's account information
        else {
          alert("Discount Created Successfully!");
          clearPage();
          switchToEdit();
        }
      }
    }); 
  }); 
}

function switchToCouponDisable() {
  const div = document.createElement("div");
  div.id = "tempDisable";
  div.className = "tmpDisable";
  body.append(div);
  div.innerHTML = "<h2 class=\"disableHeader\">Disable Discount</h2><form class=\"disableCode\"><input type=\"text\" id=\"disableCodeInput\" placeholder=\"Enter Discount Code to Disable:\"></form><button id=\"disableCouponBtn\" class=\"register-btn\">Disable Coupon</button>";

  const disableCouponBtn = document.getElementById("disableCouponBtn");
  disableCouponBtn.addEventListener('click', event => {
    let codeTxt = document.getElementById("disableCodeInput").value;

    //("CODE TXT: " + codeTxt);
    jQuery.ajax({
      type: "POST",
      url: 'SQLConnect.php',
      dataType: 'text',
      data: {functionname: "disableDiscount", code: codeTxt},
  
      success: function (obj) {
        if (obj != "\"Disabled\"") {
          alert("ERROR DISABLING DISCOUNT");
        }
        //Else, fill input fields with the user's account information
        else {
          //alert(obj);
          alert("Discount Disabled Successfully!");
          clearPage();
          switchToEdit();
        }
      }
    }); 
  });
}

function getCustomerId(username) {
  var test;
  jQuery.ajax({
    type: "POST",
    url: 'SQLConnect.php',
    dataType: 'text',
    data: {functionname: "getCID", userName: username},

    success: function (obj) {
      if (obj == "\"Error\"") {
        alert("Username not found");
      }
      //Else, fill input fields with the user's account information
      else {
        sessionStorage.setItem("selectedCustomerID", obj.substring(1, obj.length-1));
        fillUpdateInfo(obj.substring(1, obj.length-1));
      }
    }
  }); 
}