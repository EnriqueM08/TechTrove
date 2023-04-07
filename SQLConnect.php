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
                $aResult = getProductData($_POST['parameter']);
                break;
            case 'getCustomerData':
                $aResult = attemptLogin($_POST['user'], $_POST['pass']);
                break;
            case 'attemptAdminLogin':
                $aResult = attemptAdminLogin($_POST['user'], $_POST['pass']);
                break;
            case 'registerNewUser':
                $aResult = registerNewUser($_POST['user'], $_POST['pass'], $_POST['fName'], $_POST['lName'], $_POST['mAddress'], $_POST['mCity'], $_POST['mState'], $_POST['mZipCode'], $_POST['bAddress'], $_POST['pNumber'], $_POST['eMail']);
            default:
            //    $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
               break;
        }

    }
    echo json_encode($aResult); //Returns results to javaScript in JSON format.

    function getProductData($searched){
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
        $query .= "%' ORDER BY pName";

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
            $conn->close();
            return 'added';
        } else {
            $conn->close();
            return 'error';
        }
    }
?>