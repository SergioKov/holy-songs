<?php 
session_start();

$password = '555555';

//test
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
exit("password input [$password] --- hashedPassword: [$hashedPassword]");

echo password_hash('123456', PASSWORD_DEFAULT);
exit;

$hash = password_hash($password, PASSWORD_DEFAULT);

echo "hash: " . $hash;

echo '<hr>';

var_dump(password_verify($password, $hash));
echo '<hr>';

var_dump($storedHashedPassword);
echo '<hr>';
var_dump(password_verify($password, $storedHashedPassword));                
exit;




?>