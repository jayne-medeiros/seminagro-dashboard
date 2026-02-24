<?php
include 'conexao.php';

// Recebe os dados atualizados
$data = json_decode(file_get_contents("php://input"));

if(isset($data->id) && isset($data->titulo)) {
    try {
        $sql = "UPDATE anuncios SET tipo = ?, titulo = ?, localizacao = ?, contato = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data->tipo, $data->titulo, $data->local, $data->contato, $data->id]);
        
        echo json_encode(["success" => true, "message" => "Anúncio atualizado!"]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erro ao atualizar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Dados incompletos."]);
}
?>