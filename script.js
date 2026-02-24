// 1. Inicialização (Menu Mobile + Sessão + Carregamento)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO MENU SANDUÍCHE (Essencial para o Mobile) ---
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Troca o ícone de Barras para X
            const icon = menuBtn.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Fecha o menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

// Carregamento principal
window.onload = function() {
    verificarSessao();
    loadAdsFromDB();
    
    // Inicia o Carrossel se houver slides
    const slides = document.querySelectorAll('.slide');
    if(slides.length > 0) {
        setInterval(nextSlide, 5000);
    }
};

let usuarioLogado = false;
let todosAnuncios = []; // Para filtrar localmente sem recarregar banco

// 2. Verificação de Sessão
function verificarSessao() {
    fetch('sessao.php').then(res => res.json()).then(data => {
        const navAuth = document.getElementById('nav-auth');
        const areaLogada = document.getElementById('areaLogada');
        const areaBloqueada = document.getElementById('areaBloqueada');

        if(data.logged) {
            usuarioLogado = true;
            navAuth.innerHTML = `<span>Olá, ${data.nome}</span> <button class="btn-login" onclick="fazerLogout()" style="margin-left:10px; border-color:#d32f2f; color:#d32f2f;">Sair</button>`;
            if(areaLogada) areaLogada.style.display = 'block';
            if(areaBloqueada) areaBloqueada.style.display = 'none';
        } else {
            usuarioLogado = false;
            navAuth.innerHTML = `<button class="btn-login" onclick="abrirLogin()">Entrar / Cadastrar</button>`;
            if(areaLogada) areaLogada.style.display = 'none';
            if(areaBloqueada) areaBloqueada.style.display = 'block';
        }
    });
}

// 3. Autenticação (Login/Cadastro/Logout)
function abrirLogin() { document.getElementById('authModal').style.display = 'flex'; }
function fecharAuth() { document.getElementById('authModal').style.display = 'none'; }
function toggleAuth(modo) {
    if(modo === 'cadastro') {
        document.getElementById('formLogin').style.display = 'none';
        document.getElementById('formCadastro').style.display = 'block';
    } else {
        document.getElementById('formLogin').style.display = 'block';
        document.getElementById('formCadastro').style.display = 'none';
    }
}
function fazerCadastro() {
    const nome = document.getElementById('cadNome').value;
    const email = document.getElementById('cadEmail').value;
    const senha = document.getElementById('cadSenha').value;
    fetch('cadastro.php', { method: 'POST', body: JSON.stringify({nome, email, senha}) })
    .then(res => res.json()).then(data => { alert(data.message); if(data.success) toggleAuth('login'); });
}
function fazerLogin() {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;
    fetch('login.php', { method: 'POST', body: JSON.stringify({email, senha}) })
    .then(res => res.json()).then(data => { if(data.success) { fecharAuth(); verificarSessao(); } else { alert(data.message); } });
}
function fazerLogout() { fetch('logout.php').then(() => verificarSessao()); }

// 4. Ferramentas e Slides
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function nextSlide() {
    if(slides.length > 0) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
}
function showTool(toolId) {
    document.querySelectorAll('.tool-panel').forEach(p => p.style.display = 'none');
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(toolId).style.display = 'block';
    
    const btns = document.querySelectorAll('.tool-btn');
    if(toolId === 'compra-venda') btns[0].classList.add('active');
    if(toolId === 'conhecimento') btns[1].classList.add('active');
    if(toolId === 'apoio') btns[2].classList.add('active');
    if(toolId === 'problemas') btns[3].classList.add('active');
}

// 5. Campos Dinâmicos (Lógica Atualizada)
function updateFormFields() {
    const type = document.getElementById('adType').value;
    const container = document.getElementById('dynamicFields');
    const commonFields = document.getElementById('commonFields');
    
    container.innerHTML = '';
    if (type === "") { commonFields.style.display = 'none'; return; }
    commonFields.style.display = 'block';

    let html = '';
    if (type === 'corte') { 
        html += createSelect('Espécie', ['Bovino', 'Bubalino']);
        html += createInput('Quantidade', 'number', 'id="inputPrincipal"'); 
        html += createSelect('Sexo', ['Macho', 'Fêmea']);
        html += createSelect('Fase', ['Recria', 'Engorda', 'Abate']);
        html += createInput('Idade', 'text');
    } else if (type === 'plantel') {
        html += createSelect('Espécie', ['Bovino', 'Bubalino']);
        html += createSelect('Aptidão', ['Corte', 'Leite']);
        html += createInput('Quantidade', 'number', 'id="inputPrincipal"');
        html += createSelect('Sexo', ['Macho', 'Fêmea']);
        html += createSelect('Categoria', ['Vitela', 'Garrote', 'Novilha', 'Touro']);
        html += createInput('Idade', 'text');
    } else if (type === 'leite') {
        html += createSelect('Espécie', ['Bovino', 'Bubalino']);
        html += createInput('Litros ao dia', 'number', 'id="inputPrincipal"');
    } else if (type === 'silagem') {
        html += createSelect('Tipo', ['Milho', 'Sorgo', 'Capim'], 'id="inputPrincipal"');
        html += createSelect('Embalagem', ['Ensacado', 'A Granel']);
        html += createInput('Preço por KG', 'number', 'step="0.01"');
    }
    
    // Campo Descrição e Título para Fotos
    html += `<label>Descrição Detalhada</label><textarea id="inputDescricao" rows="3"></textarea>`;

    container.innerHTML = html;
}

function createInput(l, t, e='') { return `<label>${l}</label><input type="${t}" ${e} required>`; }
function createSelect(l, o, e='') { return `<label>${l}</label><select ${e}>${o.map(x => `<option value="${x}">${x}</option>`).join('')}</select>`; }

// 6. Salvar Anúncio
document.getElementById('adForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    if(!usuarioLogado) return alert("Faça login para anunciar!");

    const typeSelect = document.getElementById('adType');
    const typeText = typeSelect.options[typeSelect.selectedIndex].text;
    const principalVal = document.getElementById('inputPrincipal').value;
    const title = principalVal + " - " + typeText; 
    
    // Concatena Cidade e UF para salvar no banco atual
    const cidade = document.getElementById('inputMunicipio').value;
    const uf = document.getElementById('inputUF').value;
    const localCompleto = `${cidade} - ${uf}`;

    const dados = {
        tipo: typeText,
        titulo: title,
        local: localCompleto,
        contato: document.getElementById('inputContato').value
    };

    fetch('salvar.php', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(data => {
        alert("Anúncio publicado!");
        document.getElementById('adForm').reset();
        document.getElementById('dynamicFields').innerHTML = '';
        document.getElementById('commonFields').style.display = 'none';
        loadAdsFromDB();
    });
});

// 7. Carregar e Renderizar Mural (Com Rastreamento de Cliques)
function loadAdsFromDB() {
    const mural = document.getElementById('muralGrid');
    mural.innerHTML = '<p>Carregando...</p>';

    fetch('listar.php')
    .then(res => res.json())
    .then(data => {
        todosAnuncios = data; // Salva para filtro local
        renderizarMural(todosAnuncios);
    });
}

function renderizarMural(lista) {
    const mural = document.getElementById('muralGrid');
    mural.innerHTML = '';
    
    if(lista.length === 0) { mural.innerHTML = '<p>Nenhum anúncio encontrado.</p>'; return; }

    lista.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'ad-card';
        // Layout: Foto Esquerda + Conteúdo Direita
        // Botão agora chama a função contarClique()
        card.innerHTML = `
            <div class="ad-img-container">
                <i class="fas fa-camera ad-img-placeholder"></i>
            </div>
            <div class="ad-content">
                <div>
                    <span class="ad-tag">${ad.tipo}</span>
                    <h4 class="ad-title">${ad.titulo}</h4>
                    <p class="ad-price">R$ A Combinar</p>
                </div>
                <div class="ad-location">
                    <i class="fas fa-map-marker-alt"></i> ${ad.localizacao}
                </div>
            </div>
            <div style="padding:15px; display:flex; align-items:center; justify-content:center;">
                 <button onclick="contarClique(${ad.id}, '${ad.contato}')" style="background:var(--primary-green); color:white; border:none; padding:10px; border-radius:50%; cursor:pointer; font-size:1.2rem;" title="Chamar no WhatsApp"><i class="fab fa-whatsapp"></i></button>
            </div>
        `;
        mural.appendChild(card);
    });
}

// 8. NOVA FUNÇÃO: Conta o clique e abre o WhatsApp
function contarClique(id, contato) {
    // Envia o registro para o banco sem travar o usuário
    fetch('registrar_clique.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    });

    // Abre o WhatsApp
    // Remove caracteres não numéricos para garantir que o link funcione
    const numeroLimpo = contato.replace(/\D/g, ''); 
    window.open(`https://wa.me/55${numeroLimpo}`, '_blank');
}

// 9. Filtro em Tempo Real (Busca + UF)
function filtrarMural() {
    const keyword = document.getElementById('filterKeyword').value.toLowerCase();
    const uf = document.getElementById('filterState').value;
    
    // Filtra localmente sem ir ao banco
    const filtrados = todosAnuncios.filter(ad => {
        const matchKey = ad.titulo.toLowerCase().includes(keyword) || ad.localizacao.toLowerCase().includes(keyword);
        const matchUF = uf === "" || ad.localizacao.includes(uf); // Verifica se a UF está na string de localização
        return matchKey && matchUF;
    });

    renderizarMural(filtrados);
}