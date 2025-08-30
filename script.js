document.addEventListener('DOMContentLoaded', () => {
    const vendaForm = document.getElementById('vendaForm');
    const listaVendas = document.getElementById('listaVendas');
    const vendaIdInput = document.getElementById('vendaId');
    
    // Modal da Nota Fiscal
    const modal = document.getElementById('modalNotaFiscal');
    const closeButton = document.querySelector('.close-button');
    const notaFiscalContent = document.getElementById('notaFiscalContent');

    // Função para buscar as vendas do localStorage
    const getVendas = () => {
        return JSON.parse(localStorage.getItem('vendas')) || [];
    };

    // Função para salvar as vendas no localStorage
    const saveVendas = (vendas) => {
        localStorage.setItem('vendas', JSON.stringify(vendas));
    };

    // READ: Função para renderizar (mostrar) as vendas na tela
    const renderVendas = () => {
        const vendas = getVendas();
        listaVendas.innerHTML = ''; // Limpa a lista antes de recriar

        if (vendas.length === 0) {
            listaVendas.innerHTML = '<li>Nenhuma venda registrada.</li>';
            return;
        }
        
        vendas.forEach(venda => {
            const li = document.createElement('li');
            const valorTotal = (venda.produtoQtd * venda.produtoValor).toFixed(2);

            li.innerHTML = `
                <div>
                    <strong>Cliente:</strong> ${venda.clienteNome} <br>
                    <strong>Produto:</strong> ${venda.produtoNome} | <strong>Total:</strong> R$ ${valorTotal}
                </div>
                <div class="botoes-acao">
                    <button onclick="viewNotaFiscal('${venda.id}')">Nota</button>
                    <button onclick="editVenda('${venda.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteVenda('${venda.id}')">Excluir</button>
                </div>
            `;
            listaVendas.appendChild(li);
        });
    };

    // CREATE / UPDATE: Lógica para adicionar ou atualizar uma venda
    vendaForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que a página recarregue

        const id = vendaIdInput.value;
        const novaVenda = {
            clienteNome: document.getElementById('clienteNome').value,
            clienteContato: document.getElementById('clienteContato').value,
            clienteCpf: document.getElementById('clienteCpf').value,
            produtoNome: document.getElementById('produtoNome').value,
            produtoQtd: parseFloat(document.getElementById('produtoQtd').value),
            produtoValor: parseFloat(document.getElementById('produtoValor').value),
            formaPagamento: document.getElementById('formaPagamento').value,
        };

        let vendas = getVendas();

        if (id) { // Se tem um ID, é uma atualização (UPDATE)
            vendas = vendas.map(venda => venda.id === id ? { ...venda, ...novaVenda } : venda);
        } else { // Se não tem ID, é uma criação (CREATE)
            novaVenda.id = Date.now().toString(); // Cria um ID único baseado no tempo
            vendas.push(novaVenda);
        }

        saveVendas(vendas);
        vendaForm.reset(); // Limpa o formulário
        vendaIdInput.value = ''; // Garante que o campo de ID oculto seja limpo
        document.querySelector('button[type="submit"]').textContent = 'Adicionar Venda'; // Restaura o texto do botão
        renderVendas();
    });

    // UPDATE (Parte 1): Prepara o formulário para edição
    window.editVenda = (id) => {
        const vendas = getVendas();
        const vendaParaEditar = vendas.find(venda => venda.id === id);

        if (vendaParaEditar) {
            vendaIdInput.value = vendaParaEditar.id;
            document.getElementById('clienteNome').value = vendaParaEditar.clienteNome;
            document.getElementById('clienteContato').value = vendaParaEditar.clienteContato;
            document.getElementById('clienteCpf').value = vendaParaEditar.clienteCpf;
            document.getElementById('produtoNome').value = vendaParaEditar.produtoNome;
            document.getElementById('produtoQtd').value = vendaParaEditar.produtoQtd;
            document.getElementById('produtoValor').value = vendaParaEditar.produtoValor;
            document.getElementById('formaPagamento').value = vendaParaEditar.formaPagamento;
            
            document.querySelector('button[type="submit"]').textContent = 'Atualizar Venda';
        }
    };
    
    // DELETE: Função para excluir uma venda
    window.deleteVenda = (id) => {
        if (confirm('Tem certeza que deseja excluir esta venda?')) {
            let vendas = getVendas();
            vendas = vendas.filter(venda => venda.id !== id);
            saveVendas(vendas);
            renderVendas();
        }
    };

    // Função para mostrar a Nota Fiscal (conforme solicitado)
    window.viewNotaFiscal = (id) => {
        const vendas = getVendas();
        const venda = vendas.find(v => v.id === id);

        if (venda) {
            const valorTotal = (venda.produtoQtd * venda.produtoValor);
            notaFiscalContent.innerHTML = `
                <p><strong>Cliente:</strong> ${venda.clienteNome}</p>
                <p><strong>Contato:</strong> ${venda.clienteContato}</p>
                <p><strong>CPF:</strong> ${venda.clienteCpf}</p>
                <hr>
                <h4>Detalhes da Compra</h4>
                <p><strong>Produto:</strong> ${venda.produtoNome}</p>
                <p><strong>Quantidade:</strong> ${venda.produtoQtd}</p>
                <p><strong>Valor Unitário:</strong> R$ ${venda.produtoValor.toFixed(2)}</p>
                <hr>
                <h3>Valor Final: R$ ${valorTotal.toFixed(2)}</h3>
                <p><strong>Forma de Pagamento:</strong> ${venda.formaPagamento}</p>
            `;
            modal.style.display = 'block';
        }
    };

    // Lógica para fechar o modal
    closeButton.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Chama a renderização inicial ao carregar a página
    renderVendas();
});