<?php
include 'conexao.php';

// Recebe o ID via JSON
$data = json_decode(file_get_contents("php://input"));

if(isset($data->id)) {
    try {
        $sql = "DELETE FROM anuncios WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$data->id]);
        
        echo json_encode(["success" => true, "message" => "Anúncio excluído!"]);
    } catch(PDOException $e) {
        echo json_encode(["success" => false, "message" => "Erro ao excluir: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID não fornecido."]);
}
?>