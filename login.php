<?php
session_start();
include 'conexao.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->senha)) {
    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$data->email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user && password_verify($data->senha, $user['senha'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_nome'] = $user['nome'];
        echo json_encode(["success" => true, "nome" => $user['nome']]);
    } else {
        echo json_encode(["success" => false, "message" => "E-mail ou senha incorretos."]);
    }
}
?>