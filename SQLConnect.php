<?php
    //Intializes the necessary login data for the database
    $username = "root";
    $password = "";
    $host = "localhost:3307";
    $database = "temptrove";
    $aResult;

    if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }

    if( !isset($aResult['error']) ) {

        switch($_POST['functionname']) {
            case 'getCustomerData':
                $aResult = getCustomerData($_POST['parameter']);
                break;

            default:
               $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
               break;
        }

    }
    echo json_encode($aResult);

    function getCustomerData($searched){
        global $host, $username, $password, $database;
        //Connects to the database and will die and print error if connect fails
        $conn = new mysqli($host, $username, $password, $database);

        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        //Printing that connection was properly made
        // echo "Connected successfully";
        // echo "</br>";

        //TESTING: This code can be used to prepare a query then run and bind the results to the given variables
        // if ($result = $conn ->prepare("SELECT * FROM customers")) {
        //     $result->execute();
        //     //$result->bind_result($cID, $firstName, $lastName, $mailingAddress, $mailingCity, $mailingState, $mailingZipCode, $billingAddress, $phoneNumber, $email);
        // }

        $query = "SELECT * FROM products WHERE pName LIKE '%";
        $query .= $searched;
        $query .= "%' ORDER BY pName";

        $result = mysqli_query($conn, $query);
        $rows = array();
        while($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        //echo json_encode($rows);

        //TESTING: Can be used to test that information is properly gathered from the database and displays to screen
        // while ($result->fetch()) {
        //     echo 'ID: '.$cID.'<br>';
        //     echo 'First Name: '.$firstName.'<br>';
        //     echo 'Last Name: '.$lastName.'<br>';
        //     echo 'Mailing Address: '.$mailingAddress.'<br>';
        //     echo 'Mailing City: '.$mailingCity.'<br>';
        //     echo 'Mailing State: '.$mailingState.'<br>';
        //     echo 'Mailing ZipCode: '.$mailingZipCode.'<br>';
        //     echo 'Billing Address: '.$billingAddress.'<br>';
        //     echo 'Phone Number: '.$phoneNumber.'<br>';
        //     echo 'Email: '.$email.'<br>';
        // }

        //Closes database connection
        $conn -> close();

        return json_encode($rows);
    }
?>