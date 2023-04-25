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
                $aResult = getCustomerOrders($_POST['customerID']);
                break;
            case 'checkCode':
                $aResult = checkCode($_POST['code']);
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

    function getCustomerOrders($cID) {
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "SELECT o.orderID, p.pName, o.pQuantity, r.total, r.orderDateTime, r.status FROM orderProducts o, orders r, products p WHERE o.orderID = r.orderNum AND o.productID = p.pID AND r.cID = ";
        $sql .= $cID;
        $sql .= " ORDER BY o.orderID;";

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
	
	function editUser($user, $pass, $cID, $firstName, $lastName, $mailingAddress, $mailingCity, $mailingState, $mailingZipCode, $billingAddress, $phoneNumber, $email){
		global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        //Conncetion failed
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
		
		//if statements checking if the value is empty to either replace or leave the existing entry alone.
		$sql = "UPDATE customers SET ";
		if($user != ""){
			$sql .= "`username`='";
			$sql .= $user;
			$sql .= "'";
		}
		if($pass != ""){
			$sql = ", ";
			$sql .= "`password`='";
			$sql .= $pass;
			$sql .= "'";
		}
		if($firstName != ""){
			$sql .= ", ";
			$sql .= "`firstName`='";
			$sql .= $firstName;
			$sql .= "'";
        }
		if($lastName != ""){
			$sql .= ", ";
			$sql .= "`lastName`='";
			$sql .= $lastName;
			$sql .= "'";
		}
		if($mailingAddress != ""){
			$sql .= ", ";
			$sql .= "`mailingAddress`='";
			$sql .= $mailingAddress;
			$sql .= "'";
		}
		if($mailingCity != ""){
			$sql .= ", ";
			$sql .= "`mailingCity`='";
			$sql .= $mailingCity;
			$sql .= "'";
		}
		if($mailingState != ""){
			$sql .= ", ";
			$sql .= "`mailingState`='";
			$sql .= $mailingState;
			$sql .= "'";
		}
		if($mailingZipCode != ""){
			$sql .= ", ";
			$sql .= "`mailingZipCode`='";
			$sql .= $mailingZipCode;
			$sql .= "'";
		}
		if($billingAddress != ""){
			$sql .= ", ";
			$sql .= "`billingAddress`='";
			$sql .= $billingAddress;
			$sql .= "'";
		}
		if($phoneNumber != ""){
			$sql .= ", ";
			$sql .= "`phoneNumber`='";
			$sql .= $phoneNumber;
			$sql .= "'";
		}
		if($email != ""){
			$sql .= ", ";
			$sql .= "`email`='";
			$sql .= $email;
			$sql .= "'";
		}
        $sql .= "' WHERE id="$cID")";
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
?>