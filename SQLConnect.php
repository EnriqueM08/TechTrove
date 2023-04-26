<?php
    header('Access-Control-Allow-Origin: *');
    //Intializes the necessary login data for the database
    $username = "masterTech";
    $password = "TechTrovePassword";
    $host = "rds-techtrove.cxvqlxygejzi.us-east-2.rds.amazonaws.com";
    $database = "TechTroveDB";
    $port = "3306";
    $aResult;

    //When an ajax call is made will determine which function if any should be ran and have its results
    // returned. 
    if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }

    if( !isset($aResult['error']) ) {

        switch($_POST['functionname']) {
            case 'getProductData':
                $aResult = getProductData($_POST['parameter'], $_POST['parameterTwo']);
                break;
            case 'getCustomerData':
                $aResult = attemptLogin($_POST['user'], $_POST['pass']);
                break;
            case 'attemptAdminLogin':
                $aResult = attemptAdminLogin($_POST['user'], $_POST['pass']);
                break;
            case 'registerNewUser':
                $aResult = registerNewUser($_POST['user'], $_POST['pass'], $_POST['fName'], $_POST['lName'], $_POST['mAddress'], $_POST['mCity'], $_POST['mState'], $_POST['mZipCode'], $_POST['bAddress'], $_POST['pNumber'], $_POST['eMail']);
                break;
            case 'getLastOrder':
                $aResult = getLastOrder();
                break;
            case 'placeOrder':
                $aResult = placeOrder($_POST['orderNm'], $_POST['dateTime'], $_POST['customerID'], $_POST['sub'], $_POST['tax'], $_POST['ship'], $_POST['totl']);
                break;
            case 'orderProducts':
                $aResult = orderProducts($_POST['orderNm'], $_POST['productID'], $_POST['productQuantity']);
                break;
            case 'getCustomerOrders':
                $aResult = getCustomerOrders($_POST['customerID'], $_POST['sortBy']);
                break;
            case 'checkCode':
                $aResult = checkCode($_POST['code']);
                break;
            case 'retrieveUserInfo':
                $aResult = retrieveUserData($_POST['id']);
			break;
		    case 'updateUserInfo':
                $aResult = updateCustomerInformation($_POST['id'],  $_POST['fName'], $_POST['lName'], $_POST['mAddress'], $_POST['mCity'], $_POST['mState'], $_POST['mZipCode'], $_POST['bAddress'], $_POST['pNumber'], $_POST['eMail']);
			    break;
            case 'updateItemInfo':
                $aResult = updateItemInfo($_POST['pID'], $_POST['pName'], $_POST['pDescription'], $_POST['pPrice'], $_POST['pImagePath'], $_POST['pInventory'], $_POST['pCategory']);
                break;
            case 'createDiscount':
                $aResult = createDiscount($_POST['discount'], $_POST['code'], $_POST['valid']);
                break;
            case 'createNewItem':
                $aResult = createNewItem($_POST['pName'], $_POST['pDescription'], $_POST['pPrice'], $_POST['pImagePath'], $_POST['pInventory'], $_POST['pCategory']);
                break;
            case 'retrieveItemInfo':
                $aResult = retrieveItemInfo($_POST['id']);
                break;
            default:
            //    $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
               break;
        }

    }
    echo json_encode($aResult); //Returns results to javaScript in JSON format.

    function getProductData($searched, $filterBy){
        global $host, $username, $password, $database, $port;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database, $port);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        //TODO: Might want to change to parameterized statements to prevent injection attacks.(PROBABLY NOT NECESSARY BUT SOMETHING TO THINK ABOUT SECURITY WISE)
        // Query that will be called to find the products
        $query = "SELECT * FROM products WHERE pName LIKE '%";
        $query .= $searched;
        $query .= "%' OR pDescription LIKE '%";
        $query .= $searched;
        $query .= "%'"; //ORDER BY ";
        switch ($filterBy) {
            case "Price: Low to High":
                $query .= " ORDER BY pPrice ASC";
                break;
            case "Price: High to Low":
                $query .= " ORDER BY pPrice DESC";
                break;
            case "Alphabetical":
                $query .= " ORDER BY pName ASC";
                break;
            case "Newest Arrivals":
                $query .= " ORDER BY pID DESC";
                break;
            case "Availability":
                $query .= " ORDER BY pInventory DESC";
            default:
                break;
        }

        //Calls query and sets results to the returned results
        //TODO: Might add statement to return error again if no results which can then be displayed to screen
        $result = mysqli_query($conn, $query);
        $rows = array();
        
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }

        //Closes database connection
        $conn -> close();

        //Returns the resulting rows
        return json_encode($rows);
    }

    //This function will connect to the database and see if an account exists with the username and password user, pass
    function attemptLogin($user, $pass){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        //TODO: Might want to change to parameterized statements to prevent injection attacks.(PROBABLY NOT NECESSARY BUT SOMETHING TO THINK ABOUT SECURITY WISE)
        // Query that will be called to determine if user and pass exists in database I have already update database to ensure case sensitivity.
        $query = "SELECT * FROM customers WHERE username = '";
        $query .= $user;
        $query .= "' AND password = '";
        $query .= $pass;
        $query .= "'";

        //Runs query and sets results to result
        $result = mysqli_query($conn, $query);
        //If there are no matching users then rows is given an error key to let javaScript know login failed.
        //Can make more detailed if we wish to determine if user exists or such
        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return json_encode($rows);
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_assoc($result);
        
        //Closes database connection
        $conn -> close();

        return json_encode($row);
    }

    function attemptAdminLogin($user, $pass){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        //TODO: Might want to change to parameterized statements to prevent injection attacks.(PROBABLY NOT NECESSARY BUT SOMETHING TO THINK ABOUT SECURITY WISE)
        // Query that will be called to determine if user and pass exists in database I have already update database to ensure case sensitivity.
        $query = "SELECT * FROM admins WHERE username = '";
        $query .= $user;
        $query .= "' AND password = '";
        $query .= $pass;
        $query .= "'";

        //Runs query and sets results to result
        $result = mysqli_query($conn, $query);
        //If there are no matching users then rows is given an error key to let javaScript know login failed.
        //Can make more detailed if we wish to determine if user exists or such
        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return json_encode($rows);
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_assoc($result);
        
        //Closes database connection
        $conn -> close();

        return json_encode($row);
    }

    function registerNewUser($user, $pass, $firstName, $lastName, $mailingAddress, $mailingCity, $mailingState, $mailingZipCode, $billingAddress, $phoneNumber, $email)
    {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO customers VALUES ('";
        $sql .= $user;
        $sql .= "', '";
        $sql .= $pass;
        $sql .= "', NULL, '";
        $sql .= $firstName;
        $sql .= "', '";
        $sql .= $lastName;
        $sql .= "', '";
        $sql .= $mailingAddress;
        $sql .= "', '";
        $sql .= $mailingCity;
        $sql .= "', '";
        $sql .= $mailingState;
        $sql .= "', ";
        $sql .= $mailingZipCode;
        $sql .= ", '";
        $sql .= $billingAddress;
        $sql .= "', '";
        $sql .= $phoneNumber;
        $sql .= "', '";
        $sql .= $email;
        $sql .= "')";
        if($conn->query($sql) === TRUE) {
            $newQ = "SELECT cID from customers WHERE email = '";
            $newQ .= $email;
            $newQ .= "';";
            $result = mysqli_query($conn, $newQ);
            $conn->close();
            $row = $result->fetch_array();
            return $row['cID'];
        } else {
            $conn->close();
            return 'error';
        }
    }

    function getLastOrder() {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM orders ORDER BY orderNum DESC LIMIT 1";

        $result = mysqli_query($conn, $query);
        //If there are no matching users then rows is given an error key to let javaScript know login failed.
        //Can make more detailed if we wish to determine if user exists or such
        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return json_encode($rows);
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_assoc($result);
        
        //Closes database connection
        $conn -> close();

        return json_encode($row);
    }

    function placeOrder($orderNum, $orderDateTime, $cID, $subTotal, $taxes, $shippingCost, $total) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO orders VALUES (";
        $sql .= $orderNum;
        $sql .= ", '";
        $sql .= $orderDateTime;
        $sql .= "', ";
        $sql .= $cID;
        $sql .= ", ";
        $sql .= $subTotal;
        $sql .= ", ";
        $sql .= $taxes;
        $sql .= ", ";
        $sql .= $shippingCost;
        $sql .= ", ";
        $sql .= $total;
        $sql .= ", 'Placed'";
        $sql .= ")";
        if($conn->query($sql) === TRUE) {
            $conn->close();
            return 'Placed';
        } else {
            $conn->close();
            return 'error';
        }
    }
    
    function orderProducts($orderNum, $productID, $productQuantity) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "INSERT INTO orderProducts VALUES (";
        $sql .= $orderNum;
        $sql .= ", ";
        $sql .= $productID;
        $sql .= ", ";
        $sql .= $productQuantity;
        $sql .= ")";
        if($conn->query($sql) === TRUE) {
            $newQ = "SELECT pInventory FROM products WHERE pID = ";
            $newQ .= $productID;
            $newQ .= ";";
            $result = mysqli_query($conn, $newQ);
            $row = $result->fetch_array();
            $newInventory = $row["pInventory"] - $productQuantity;
            $newQ = "UPDATE products SET pInventory = ";
            $newQ .= $newInventory;
            $newQ .= " WHERE pID = ";
            $newQ .= $productID;
            $newQ .= ";";
            mysqli_query($conn, $newQ);
            $conn->close();
            return 'Placed';
        } else {
            $conn->close();
            return 'error';
        }
    }
    
    function getCustomerOrders($cID, $sortBy) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);
        //Conncetion failed
        
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        if ($cID === "admin"){
            $sql = "SELECT r.cID, o.orderID, p.pName, o.pQuantity, r.total, r.orderDateTime, r.status FROM orderProducts o, orders r, products p WHERE o.orderID = r.orderNum AND o.productID = p.pID";
        }else{
            $sql = "SELECT r.cID, o.orderID, p.pName, o.pQuantity, r.total, r.orderDateTime, r.status FROM orderProducts o, orders r, products p WHERE o.orderID = r.orderNum AND o.productID = p.pID AND r.cID = $cID";
        }
        switch ($sortBy) {
            case "Order By Newest Date":
                $sql .= " ORDER BY r.orderDateTime DESC";
                break;
            case "Order By Customer ID":
                $sql .= " ORDER BY r.cID ASC, r.orderNum";
                break;
            case "Order By Total":
                $sql .= " ORDER BY r.total DESC";
                break;
            case "default":
                $sql .= " ORDER BY r.orderDateTime DESC";
                break;
        }
        $result = mysqli_query($conn, $sql);
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        //Closes database connection
        $conn -> close();
        //Returns the resulting rows
        return json_encode($rows);
    }
    
    function checkCode($discountCode){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "SELECT discount FROM discountCodes WHERE code = '";
        $sql .= $discountCode;
        $sql .= "' AND valid = 1;";

        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return "Invalid";
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_column($result);
        
        //Closes database connection
        $conn -> close();

        return $row;
    }

   //Uses the cID to find the matching row and returns that data to populate the account information boxes.
   function retrieveUserData($id){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM customers WHERE cID='$id'";

        //Runs query and sets results to result
        $result = mysqli_query($conn, $query);
        //If there are no matching users then rows is given an error key to let javaScript know login failed.
        //Can make more detailed if we wish to determine if user exists or such
        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return json_encode($rows);
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_assoc($result);
        
        //Closes database connection
        $conn -> close();

        return json_encode($row);
    }

    //Connects to database and updates the old information at the correct row using the cID
    function updateCustomerInformation($cID, $firstName, $lastName, $mailingAddress, $mailingCity, $mailingState, $mailingZipCode, $billingAddress, $phoneNumber, $email){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
		
	      //$newQ = "UPDATE customers SET firstName='$firstName', lastName='$lastName', mailingAddress='$mailingAddress', mailingCity='$mailingCity', 
        //mailingState='$mailingState', mailingZipCode='$mailingZipCode', billingAddress='$billingAddress', phoneNumber='$phoneNumber', email='$email' WHERE cID='$cID'";


		if($firstName != ""){
            $sql = "UPDATE customers SET firstName='$firstName' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
        }
		if($lastName != ""){
            $sql = "UPDATE customers SET lastName='$lastName' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($mailingAddress != ""){
            $sql = "UPDATE customers SET mailingAddress='$mailingAddress' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($mailingCity != ""){
            $sql = "UPDATE customers SET mailingCity='$mailingCity' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($mailingState != ""){
            $sql = "UPDATE customers SET mailingState='$mailingState' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($mailingZipCode != ""){
            $sql = "UPDATE customers SET mailingZipCode='$mailingZipCode' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($billingAddress != ""){
            $sql = "UPDATE customers SET billingAddress='$billingAddress' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($phoneNumber != ""){
            $sql = "UPDATE customers SET phoneNumber='$phoneNumber' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
		if($email != ""){
            $sql = "UPDATE customers SET email='$email' WHERE cID='$cID'";
            mysqli_query($conn, $sql);
		}
        $conn->close();
        return 'Updated';
    }

    function updateItemInfo($pID, $pName, $pDescription, $pPrice, $pImagePath, $pInventory, $pCategory) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
		
	    $newQ = "UPDATE products SET pName='$pName', pDescription='$pDescription', pPrice='$pPrice', pImagePath='$pImagePath', 
        pInventory='$pInventory', pCategory='$pCategory' WHERE pID='$pID'";

        mysqli_query($conn, $newQ);
        $conn->close();
        return 'Updated';
    }

    function createDiscount($discount, $code, $valid) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
		
	    $sql = "INSERT INTO discountCodes VALUES ('";
        $sql .= $discount;
        $sql .= "', '";
        $sql .= $code;
        $sql .= "', ";
        $sql .= $valid;
        $sql .= ")";

        mysqli_query($conn, $sql);
        $conn->close();
        return 'Created';
    }

    function createNewItem($pName, $pDescription, $pPrice, $pImagePath, $pInventory, $pCategory) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
		
	    $sql = "INSERT INTO products VALUES (NULL, '";
        $sql .= $pName;
        $sql .= "', '";
        $sql .= $pDescription;
        $sql .= "', '";
        $sql .= $pPrice;
        $sql .= "', '";
        $sql .= $pImagePath;
        $sql .= "', ";
        $sql .= $pInventory;
        $sql .= ", '";
        $sql .= $pCategory;
        $sql .= "')";

        mysqli_query($conn, $sql);
        $conn->close();
        return 'Created';
    }

    function retrieveItemInfo($pID) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Connection failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM products WHERE pID='$pID'";

        //Runs query and sets results to result
        $result = mysqli_query($conn, $query);
        //If there are no matching users then rows is given an error key to let javaScript know login failed.
        //Can make more detailed if we wish to determine if user exists or such
        if (mysqli_num_rows($result)==0) {
            $rows = array("error" => true);
            return json_encode($rows);
        }
        
        //Otherwise will get the matching row
        $row = mysqli_fetch_assoc($result);
        
        //Closes database connection
        $conn -> close();

        return json_encode($row);
    }
?>