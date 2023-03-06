<!DOCTYPE html>
<html>
    <head>
        <!-- Reference to styling for webpage -->
        <link rel="stylesheet" href="styles.css">
        <!-- Reference to syling for use of button images -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <!-- Reference to ajax for communicating between php and javascript -->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
        <script src="TechScript.js" type="text/javascript" defer></script>
        <title>TechTrove</title>
        <!-- This is the directory will buttons for navigating screens as long as the search bar -->
        <div class="directory">
            <div class="btn-group"> 
                <button class="home-btn" id = "home"><i class="fa fa-home"></i></button>
                <!-- Can implement if we want a language feature -->
                <!-- <button class="language-btn">Choose Language</button> -->
                <button class="profile-btn" id = "profile"><i class="fa fa-user"></i></button>
                <button class="cart-btn" id = "cart"><i class=" fa fa-shopping-cart"></i></button>
                <button class="orders-btn" id = "orders">O</button>
            </div>
            <!-- Search bar information connects to javascript to use functions for searching -->
            <form class="search-bar">
                <input type="text" id = "search-text" placeholder="Search Products">
                <button type="button" id = "search"><i class="fa fa-search"></i></button>
                <!--Connects to the script javascript file -->
            </form>
        </div>
    </head>
    <body>
        <h1>TechTrove</h1>
        <!-- Commented out but can be used to include php file to html if needed -->
        <!-- <?php include('SQLConnect.php')?> -->
        <!-- <p1 style = "color: black;font-family: fantasy;font-size: 20px;font-style: normal;">Data from database:</p1>
        <p2 style = "color: black;font-family: 'Times New Roman', Times, serif;font-size: small;font-style: normal;"> -->
            <!-- <?php getCustomerData(); ?> -->
        <!-- </p2> -->
        <!-- Gonna add cards here -->
        
    </body>
</html>