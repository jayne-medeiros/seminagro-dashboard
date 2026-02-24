<?php
include 'conexao.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->nome) && isset($data->email) && isset($data->senha)) {
    // Verifica se e-mail já existe
    $check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->execute([$data->email]);
    
    if($check->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "E-mail já cadastrado!"]);
    } else {
        // Criptografa a senha (Segurança)
        $senhaHash = password_hash($data->senha, PASSWORD_DEFAULT);
        
        $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        if($stmt->execute([$data->nome, $data->email, $senhaHash])) {
            echo json_encode(["success" => true, "message" => "Cadastro realizado! Faça login."]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao cadastrar."]);
        }
    }
}
?>