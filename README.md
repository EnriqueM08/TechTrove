# TechTrove
 E-commerce website for tech related products created with, JavaScript, PHP, and SQL.
 -------------------------------------------------------------------------------------------
 GETTING STARTED: 
 This website is still in the development phases and is not being hosted yet.
 For testing and development purposes running in a local server is preferred for now.
 -------------------------------------------------------------------------------------------
 HOW TO HOST LOCALLY:
 There are many ways to host the website locally, for this setup we will use XAMMP and APACHE 
 to create a local server to host the website on. First ensure you have XAMPP downloaded and 
 this can be accomplished by downloading the necessary download at https://www.apachefriends.org/download.html
 where you can select a download for Windows, Linux, or Mac operating systems.
 After downloading run the installer and download required packages and any extra packages you wish.
 Once this is done you can then run the XAMPP controller and start your APACHE web server and MySQL
 database. (NOTE: AT this point if you already have MySQL downloaded you may recieve an error when 
 attempting to start MySQL in XAMPP. To fix this you must change the default MySQL port for more
 information on how to do this follow this link: https://www.quora.com/How-do-I-change-the-port-of-a-MySQL-server-in-XAMPP)
 Once this is completed and both APACHE and MySQL are running you are ready to run the website locally.
 Navigate to where you are storing the downloaded files from this repositroy or if you have not downloaded them
 do so. The needed files for this step are SQLConnect.php, TechScript.js, TechTrove.php and styles.css. Now take these files
 either copying them or moving them to the file htdocs located in the xampp folder. Then open up your preffered web browes and
 go to localhost which should take you to the XAMPP home page if server is running properly. Now to setup the database navigate to
 localhost/phpmyadmin which will take you to the SQL database page. From here click on import and then select the temptrove database.
 This should import the database by running the query to generate the database. From here you can now go to localhost/TechTrove.php 
 which will take you to the website with the necessary database set up and running.

