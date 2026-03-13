/* ==========================================================================
   CONFIGURAÇÃO INICIAL E CARREGAMENTO DE DADOS
========================================================================== */
const formulario = document.getElementById('form-cadastro');
let inventario = [];
/* ==========================================================================
   NAVEGAÇÃO ENTRE ABAS (CADASTRO VS CONSULTA)
========================================================================== */
const cadastro = document.getElementById('btn-cadastro');
const consulta = document.getElementById('btn-consulta');

cadastro.addEventListener('click', () => {
    document.getElementById('aba-consulta').classList.add('hidden');
    document.getElementById('aba-cadastro').classList.remove('hidden');
    consulta.classList.remove('active');
    cadastro.classList.add('active');
});

consulta.addEventListener('click', () => {
    document.getElementById('aba-cadastro').classList.add('hidden');
    document.getElementById('aba-consulta').classList.remove('hidden');
    cadastro.classList.remove('active');
    consulta.classList.add('active');
});
/* ==========================================================================
   LÓGICA DE EXIBIÇÃO DINÂMICA DE CAMPOS
========================================================================== */

// Mostra campos específicos (Broca, Fresa, etc) na tela de CADASTRO
const mostrarCamposCadastro = () => {
    const valorSelecionado = document.getElementById('tipoItem').value;
    const todosOsGrupos = document.querySelectorAll('[data-grupo="cadastro"]');

    todosOsGrupos.forEach(g => g.classList.add('hidden'));

    if (valorSelecionado) {
        const idParaMostrar = 'cadastro-' + valorSelecionado;
        const elemento = document.getElementById(idParaMostrar);
        if (elemento) elemento.classList.remove('hidden');
    }
};
document.getElementById('tipoItem').addEventListener('change', mostrarCamposCadastro);

// Mostra campos específicos na tela de CONSULTA
const mostraCamposConsulta = () => {
    const consultaItem = document.getElementById('consultaItem').value;
    const todosOsGrupos = document.querySelectorAll('[data-grupo="consulta"]');

    todosOsGrupos.forEach(g => g.classList.add('hidden'));

    if (consultaItem) {
        const consultaItemSelecionado = 'consulta-' + consultaItem;
        const elemento = document.getElementById(consultaItemSelecionado);
        if (elemento) elemento.classList.remove('hidden');
    }
};
document.getElementById('consultaItem').addEventListener('change', mostraCamposConsulta);

/* ==========================================================================
   PROCESSAMENTO DO FORMULÁRIO E PERSISTÊNCIA (SALVAR)
========================================================================== */
formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const ItemSelecionado = document.getElementById('tipoItem').value;
    const quantidade = Number(document.getElementById('quantidade').value);

    let novoItem = {};

    if (ItemSelecionado === 'broca') {
        novoItem = {
            nome_categoria: ItemSelecionado,
            tipo: document.getElementById('tipoBroca').value,
            quantidade: quantidade
        };
    } else if (ItemSelecionado === 'fresa') {
        novoItem = {
            nome_categoria: ItemSelecionado,
            tipo: document.getElementById('tipoFresa').value,
            quantidade: quantidade
        };
    } else if (ItemSelecionado === 'material') {
        novoItem = {
            nome_categoria: ItemSelecionado,
            tipo: document.getElementById('tipoMaterial').value,
            diametro: Number(document.getElementById('diametroBarras').value),
            metro: Number(document.getElementById('metrosBarras').value),
            quantidade: quantidade
        };
    }

    if (ItemSelecionado != '') {
        try {
            const resposta = await fetch('/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoItem)
            });

            if (resposta.ok) {
                alert("Sucesso! Item guardado no estoque.");
                formulario.reset();

                document.querySelectorAll('[data-grupo="cadastro"]').forEach(g => g.classList.add('hidden'));
            } else {
                alert("Erro ao salvar no banco de dados.");
            }
        } catch (error) {
            console.error("Erro na comunicação com o servidor:", error);
            alert("O servidor parece estar desligado.");
        }
    } else {
        alert("Selecione o que deseja cadastrar!");
    }
});

/* ========================================================================== 
    SISTEMA DE BUSCA E EXIBIÇÃO (CONSULTA) 
========================================================================== */
/* ========================================================================== 
    SISTEMA DE BUSCA E EXIBIÇÃO (CONSULTA) 
========================================================================== */
const btnConsulta = document.getElementById('btn-pesquisar');

btnConsulta.addEventListener('click', async () => {
    const itemConsulta = document.getElementById('consultaItem').value;
    const resultadoInventario = document.getElementById('container-resultados-lista');
    let tipoItem;

    resultadoInventario.innerHTML = 'Pesquisando...';

    if (itemConsulta != '') {
        try {

            const resposta = await fetch('/produtos');
            const inventarioDoBanco = await resposta.json();

            const conteudoResposta = document.querySelector('.conteudo-resposta');

            if (itemConsulta === 'broca') {
                tipoItem = document.getElementById('consultaTipoQuantidadeBroca').value;
            } else if (itemConsulta === 'fresa') {
                tipoItem = document.getElementById('consultaQuantidadetipoFresa').value;
            } else if (itemConsulta === 'material') {
                tipoItem = document.getElementById('consultaTipoQuantidadeMateriaPrima').value;
            }

            let itensEncontrados = inventarioDoBanco.filter(item =>
                item.nome_categoria === itemConsulta && item.tipo === tipoItem
            );

            const quantidadeTotal = itensEncontrados.reduce((acumulador, itemAtual) => {
                return acumulador + Number(itemAtual.quantidade);
            }, 0);

            resultadoInventario.innerHTML = `
                <p><strong>Tipo:</strong> ${tipoItem}</p>
                <p><strong>Total em Estoque:</strong> ${quantidadeTotal}</p>
                ${itensEncontrados[0]?.diametro > 0 ? `<p><strong>Diâmetro:</strong> ${itensEncontrados[0].diametro}mm</p>` : ''}
                ${itensEncontrados[0]?.metro > 0 ? `<p><strong>Metros:</strong> ${itensEncontrados[0].metro}m</p>` : ''}
            `;

            conteudoResposta.classList.remove('hidden');

        } catch (error) {
            console.error("Erro na consulta:", error);
            alert("Erro ao buscar dados do servidor.");
        }
    } else {
        alert("Selecione o que deseja consultar!");
    }
});
