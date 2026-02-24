const SENHA_ADMIN = "admin2025"; 

function checkLogin() {
    const input = document.getElementById('adminPassword').value;
    if(input === SENHA_ADMIN) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        carregarAnuncios();
        carregarDashboard(); // Carrega as métricas ao entrar
    } else {
        alert("Senha incorreta!");
    }
}

// --- Carrega os Indicadores e Gráfico (NOVO) ---
function carregarDashboard() {
    fetch('dados_dashboard.php')
    .then(res => res.json())
    .then(data => {
        // Preenche os cartões
        document.getElementById('dashTotalAds').innerText = data.total_anuncios;
        document.getElementById('dashTotalUsers').innerText = data.total_usuarios;
        document.getElementById('dashTotalClicks').innerText = data.total_cliques;

        // Gera o gráfico de barras simples
        const chartDiv = document.getElementById('categoriaBars');
        chartDiv.innerHTML = '';
        
        if(data.categorias.length > 0) {
            data.categorias.forEach(cat => {
                // Calcula porcentagem simples para a barra (evita divisão por zero)
                let total = data.total_anuncios > 0 ? data.total_anuncios : 1;
                let percent = (cat.qtd / total) * 100;
                
                chartDiv.innerHTML += `
                    <div class="bar-item">
                        <span class="bar-label">${cat.tipo}</span>
                        <div class="bar-track">
                            <div class="bar-fill" style="width: ${percent}%">${cat.qtd}</div>
                        </div>
                    </div>
                `;
            });
        } else {
            chartDiv.innerHTML = '<p style="color:#999; font-size:0.9rem;">Nenhum dado para o gráfico.</p>';
        }
    })
    .catch(error => console.error('Erro no dashboard:', error));
}

function carregarAnuncios() {
    const tbody = document.getElementById('listaAnuncios');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Carregando...</td></tr>';

    fetch('listar.php')
    .then(response => response.json())
    .then(data => {
        tbody.innerHTML = '';
        
        if(data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Nenhum anúncio encontrado.</td></tr>';
            return;
        }

        data.forEach(ad => {
            // Cria um objeto JSON escondido no botão para facilitar a edição
            const adString = JSON.stringify(ad).replace(/"/g, '&quot;');
            
            const row = `
                <tr>
                    <td>#${ad.id}</td>
                    <td>${ad.tipo}</td>
                    <td><strong>${ad.titulo}</strong></td>
                    <td style="text-align:center;">
                        <span style="background:#e0f2f1; padding:2px 8px; border-radius:10px; color:#00695c; font-weight:bold;">
                            ${ad.cliques || 0}
                        </span>
                    </td>
                    <td>${ad.localizacao}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="abrirModal(${adString})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="excluirAnuncio(${ad.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    })
    .catch(error => console.error('Erro:', error));
}

// --- Funções de Exclusão ---
function excluirAnuncio(id) {
    if(confirm("Tem certeza que deseja excluir este anúncio permanentemente?")) {
        fetch('excluir.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                carregarAnuncios();
                carregarDashboard(); // Atualiza os números
            } else {
                alert("Erro: " + data.message);
            }
        });
    }
}

// --- Funções de Edição ---
function abrirModal(ad) {
    document.getElementById('editId').value = ad.id;
    document.getElementById('editTipo').value = ad.tipo; 
    document.getElementById('editTitulo').value = ad.titulo;
    document.getElementById('editLocal').value = ad.localizacao;
    document.getElementById('editContato').value = ad.contato;
    
    document.getElementById('editModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('editModal').style.display = 'none';
}

function salvarEdicao() {
    const dados = {
        id: document.getElementById('editId').value,
        tipo: document.getElementById('editTipo').value,
        titulo: document.getElementById('editTitulo').value,
        local: document.getElementById('editLocal').value,
        contato: document.getElementById('editContato').value
    };

    fetch('editar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            alert("Anúncio atualizado com sucesso!");
            fecharModal();
            carregarAnuncios(); 
        } else {
            alert("Erro ao atualizar: " + data.message);
        }
    })
    .catch(error => console.error('Erro:', error));
}