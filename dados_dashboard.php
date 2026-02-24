<?php
include 'conexao.php';

// 1. Total de Anúncios
$totalAds = $conn->query("SELECT COUNT(*) as total FROM anuncios")->fetch()['total'];

// 2. Total de Usuários
$totalUsers = $conn->query("SELECT COUNT(*) as total FROM usuarios")->fetch()['total'];

// 3. Total de Cliques (Interesse)
$totalCliques = $conn->query("SELECT SUM(cliques) as total FROM anuncios")->fetch()['total'];

// 4. Anúncios por Categoria (Para o Gráfico)
$porCategoria = $conn->query("SELECT tipo, COUNT(*) as qtd FROM anuncios GROUP BY tipo")->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "total_anuncios" => $totalAds,
    "total_usuarios" => $totalUsers,
    "total_cliques" => $totalCliques ? $totalCliques : 0,
    "categorias" => $porCategoria
]);
?>