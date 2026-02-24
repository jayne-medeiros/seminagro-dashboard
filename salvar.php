<?php
include 'conexao.php';

// Recebe os dados do Javascript
$data = json_decode(file_get_contents("php://input"));

if($data) {
    $sql = "INSERT INTO anuncios (tipo, titulo, localizacao, contato) VALUES (?, ?, ?, ?)";
    $stmt= $conn->prepare($sql);
    $stmt->execute([$data->tipo, $data->titulo, $data->local, $data->contato]);
    echo json_encode(["message" => "Sucesso!"]);
}
?>