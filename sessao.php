<?php
session_start();
if(isset($_SESSION['user_id'])) {
    echo json_encode(["logged" => true, "nome" => $_SESSION['user_nome']]);
} else {
    echo json_encode(["logged" => false]);
}
?>