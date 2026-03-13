/* ==========================================================================
   CONFIGURAÇÃO INICIAL E CARREGAMENTO DE DADOS
========================================================================== */
const formulario = document.getElementById('form-cadastro');
const dadosSalvos = localStorage.getItem('estoque_master');
const inventario = dadosSalvos ? JSON.parse(dadosSalvos) : [];
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

formulario.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const ItemSelecionado = document.getElementById('tipoItem').value;
    const quantidade = Number(document.getElementById('quantidade').value);

    let novoItem = {};
    
    if (ItemSelecionado === 'broca') {
        let tipoBroca = document.getElementById('tipoBroca').value;
        novoItem = {
            categoria : ItemSelecionado,
            tipo : tipoBroca,
            quantidade : quantidade
        };
    } else if (ItemSelecionado === 'fresa') {
        let tipoFresa = document.getElementById('tipoFresa').value;
        novoItem = {
            categoria : ItemSelecionado,
            tipo : tipoFresa,
            quantidade: quantidade
        };
    } else if (ItemSelecionado === 'material') {
        let tipomaterial = document.getElementById('tipoMaterial').value;
        let diametro = Number(document.getElementById('diametroBarras').value);
        let metros = Number(document.getElementById('metrosBarras').value);
        
        novoItem = {
            categoria: ItemSelecionado,
            tipo: tipomaterial,
            diametro: diametro,
            metros: metros,
            quantidade: quantidade
        };
    }

    // Validação e Salvamento
    if (ItemSelecionado != '') {
        // Adiciona ao Array na memória RAM
        inventario.push(novoItem);
        
        // Salva o Array atualizado no LocalStorage (Transforma em String JSON)
        localStorage.setItem('estoque_master', JSON.stringify(inventario));

        // Limpeza da Interface
        formulario.reset();
        const todosOsGrupos = document.querySelectorAll('[data-grupo="cadastro"]');
        todosOsGrupos.forEach(g => g.classList.add('hidden'));

        console.log("Sucesso! Veja seu inventário:", inventario);
    } else {
        alert("Selecione o que deseja cadastrar!");
    }
});
/* ========================================================================== 
    SISTEMA DE BUSCA E EXIBIÇÃO (CONSULTA) 
========================================================================== */
const btnConsulta = document.getElementById('btn-pesquisar');

btnConsulta.addEventListener('click',()=>{
    const itemConsulta = document.getElementById('consultaItem').value;
    const resultadoInventario = document.getElementById('container-resultados-lista');
    let tipoItem;
    
    resultadoInventario.innerHTML = '';
    
    if(itemConsulta != ''){
        const conteudoResposta = document.querySelector('.conteudo-resposta')
        
        if(itemConsulta === 'broca'){
            tipoItem = document.getElementById('consultaTipoQuantidadeBroca').value
        }else if(itemConsulta === 'fresa'){
            tipoItem = document.getElementById('consultaQuantidadetipoFresa').value
        }else if(itemConsulta ==='material'){
            tipoItem = document.getElementById('consultaTipoQuantidadeMateriaPrima').value
        }
        
        let itemEncontrado = inventario.filter(item => item.categoria === itemConsulta && item.tipo === tipoItem)

        const quantidadeItem = itemEncontrado.reduce((acumulador,itemAtual) => {
            return acumulador + Number(itemAtual.quantidade);
        },0);

    
        resultadoInventario.innerHTML += `
        <p><strong>Item:</strong> ${itemConsulta}</p>
        <p><strong>Tipo:</strong> ${tipoItem}</p>
        <p><strong>Quantidade:</strong> ${quantidadeItem}</p>
        ` 
        conteudoResposta.classList.remove('hidden');

    }else {
        alert("Selecione o que deseja consultar!")
    }

   
});

