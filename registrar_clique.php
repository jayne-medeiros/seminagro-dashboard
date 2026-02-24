<?php
include 'conexao.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    // Soma +1 no contador de cliques daquele anúncio específico
    $sql = "UPDATE anuncios SET cliques = cliques + 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$data->id]);
    echo json_encode(["success" => true]);
}
?>