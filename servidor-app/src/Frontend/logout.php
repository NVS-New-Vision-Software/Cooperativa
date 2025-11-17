<?php
session_start();
session_destroy();
header("Location: /Cooperativa/Frontend/login.php");
exit;
?>
