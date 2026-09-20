// ==========================================
// CONFIGURAÇÃO
// ==========================================

const USUARIO_ID = 1;


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ==========================================
// CARREGAR CARRINHO
// ==========================================

async function carregarCarrinho() {

    const cartProducts =
        document.querySelector(".cart-products");

    if (!cartProducts) {
        return;
    }

    try {

        console.log("🛒 Buscando carrinho...");

        const resposta = await fetch(
            `${API_URL}/api/carrinho/${USUARIO_ID}`
        );

        console.log(
            "📡 Status do carrinho:",
            resposta.status
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar carrinho."
            );
        }

        // Backend retorna:
        // {
        //     itens: [],
        //     total: 0
        // }

        const dados =
            await resposta.json();

        const itens =
            dados.itens || [];

        console.log(
            "🛒 Itens do carrinho:",
            itens
        );

        cartProducts.innerHTML = "";

        // ==========================================
        // CARRINHO VAZIO
        // ==========================================

        if (itens.length === 0) {

            cartProducts.innerHTML = `
                <div class="cart-empty">

                    <h2>
                        Seu carrinho está vazio.
                    </h2>

                    <p>
                        Adicione alguns produtos para continuar.
                    </p>

                    <a href="produtos.html">
                        VER PRODUTOS
                    </a>

                </div>
            `;

            atualizarResumo([]);

            return;
        }


        // ==========================================
        // CRIAR PRODUTOS
        // ==========================================

        itens.forEach(item => {

            criarItemCarrinho(
                item,
                cartProducts
            );

        });


        // ==========================================
        // ATUALIZAR TOTAL
        // ==========================================

        atualizarResumo(itens);

    }

    catch (erro) {

        console.error(
            "❌ Erro ao carregar carrinho:",
            erro
        );

        cartProducts.innerHTML = `
            <div class="cart-empty">

                <h2>
                    Não foi possível carregar o carrinho.
                </h2>

                <p>
                    Verifique se o servidor está funcionando.
                </p>

            </div>
        `;
    }
}


// ==========================================
// CRIAR ITEM DO CARRINHO
// ==========================================

function criarItemCarrinho(
    item,
    container
) {

    const quantidade =
        Number(item.quantidade) || 1;

    const preco =
        Number(item.preco) || 0;

    const subtotal =
        preco * quantidade;


    const article =
        document.createElement("article");

    article.classList.add(
        "cart-item"
    );


    article.innerHTML = `

        <div class="cart-item-image">

            <img
                src="${item.imagem || "../imgs/product.svg"}"
                alt="${item.nome || "Produto"}"
                onerror="this.src='../imgs/product.svg'"
            >

        </div>


        <div class="cart-item-info">

            <span>
                PRODUTO
            </span>

            <h2>
                ${item.nome || "Produto"}
            </h2>

            <strong>
                ${formatarPreco(preco)}
            </strong>

        </div>


        <div class="cart-item-actions">

            <div class="cart-quantity">

                <button
                    onclick="alterarQuantidade(
                        ${item.id},
                        ${quantidade - 1}
                    )"
                >
                    -
                </button>


                <span>
                    ${quantidade}
                </span>


                <button
                    onclick="alterarQuantidade(
                        ${item.id},
                        ${quantidade + 1}
                    )"
                >
                    +
                </button>

            </div>


            <strong class="cart-item-subtotal">

                ${formatarPreco(subtotal)}

            </strong>


            <button
                class="remove-item"
                onclick="removerDoCarrinho(${item.id})"
            >
                REMOVER
            </button>

        </div>

    `;


    container.appendChild(
        article
    );
}


// ==========================================
// ALTERAR QUANTIDADE
// ==========================================

async function alterarQuantidade(
    itemId,
    novaQuantidade
) {

    if (novaQuantidade < 1) {

        await removerDoCarrinho(
            itemId
        );

        return;
    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${USUARIO_ID}/${itemId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        quantidade:
                            novaQuantidade
                    })
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao atualizar quantidade."
            );
        }


        await carregarCarrinho();

    }

    catch (erro) {

        console.error(
            "❌ Erro ao alterar quantidade:",
            erro
        );

    }
}


// ==========================================
// REMOVER PRODUTO
// ==========================================

async function removerDoCarrinho(
    itemId
) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${USUARIO_ID}/${itemId}`,
                {
                    method: "DELETE"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao remover produto."
            );
        }


        await carregarCarrinho();

    }

    catch (erro) {

        console.error(
            "❌ Erro ao remover produto:",
            erro
        );

    }
}


// ==========================================
// ATUALIZAR RESUMO
// ==========================================

function atualizarResumo(
    itens
) {

    let subtotal = 0;


    itens.forEach(item => {

        const preco =
            Number(item.preco) || 0;

        const quantidade =
            Number(item.quantidade) || 1;

        subtotal +=
            preco * quantidade;

    });


    const elementoSubtotal =
        document.getElementById(
            "cartSubtotal"
        );

    const elementoTotal =
        document.getElementById(
            "cartTotal"
        );


    if (elementoSubtotal) {

        elementoSubtotal.textContent =
            formatarPreco(subtotal);

    }


    if (elementoTotal) {

        elementoTotal.textContent =
            formatarPreco(subtotal);

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    carregarCarrinho
);


// ==========================================
// FINALIZAR COMPRA
// ==========================================

const finalizarCompra = document.getElementById("finalizarCompra");
const checkoutModal = document.getElementById("checkoutModal");
const fecharCheckout = document.getElementById("fecharCheckout");
const confirmarCompra = document.getElementById("confirmarCompra");

const enderecoEntrega = document.getElementById("enderecoEntrega");
const formaPagamento = document.getElementById("formaPagamento");

const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutError = document.getElementById("checkoutError");


// ABRIR FINALIZAÇÃO

if (finalizarCompra) {

    finalizarCompra.addEventListener("click", () => {

        const total = document.getElementById("cartTotal");

        // Não permite finalizar carrinho vazio
        if (!total || total.textContent === "R$ 0,00") {

            alert(
                "Adicione algum produto ao carrinho antes de finalizar a compra."
            );

            return;
        }

        // Mostra o total no modal
        checkoutTotal.textContent = total.textContent;

        checkoutError.textContent = "";

        checkoutModal.classList.add("active");

    });

}


// FECHAR MODAL

if (fecharCheckout) {

    fecharCheckout.addEventListener("click", () => {

        checkoutModal.classList.remove("active");

    });

}


// FECHAR CLICANDO FORA

if (checkoutModal) {

    checkoutModal.addEventListener("click", (evento) => {

        if (evento.target === checkoutModal) {

            checkoutModal.classList.remove("active");

        }

    });

}


// CONFIRMAR PEDIDO

if (confirmarCompra) {

    confirmarCompra.addEventListener("click", async () => {

        const endereco = enderecoEntrega.value.trim();
        const pagamento = formaPagamento.value;

        checkoutError.textContent = "";


        // Validar endereço

        if (!endereco) {

            checkoutError.textContent =
                "Digite o endereço de entrega.";

            enderecoEntrega.focus();

            return;
        }


        // Validar pagamento

        if (!pagamento) {

            checkoutError.textContent =
                "Selecione uma forma de pagamento.";

            formaPagamento.focus();

            return;
        }


        // Processando

        confirmarCompra.disabled = true;

        confirmarCompra.textContent = "PROCESSANDO...";


        // Simulação

        await new Promise(resolve => {
            setTimeout(resolve, 1500);
        });


        // Número fictício do pedido

        const numeroPedido =
            Math.floor(100000 + Math.random() * 900000);


        const formasPagamento = {
            pix: "PIX",
            cartao: "Cartão",
            boleto: "Boleto"
        };


        // Fechar modal

        checkoutModal.classList.remove("active");


        // Mensagem de sucesso

        alert(
            "PEDIDO REALIZADO COM SUCESSO!\n\n" +
            "Pedido nº " + numeroPedido + "\n" +
            "Pagamento: " +
            formasPagamento[pagamento] +
            "\n\n" +
            "Obrigado por comprar na Dragon Suplementos!"
        );


        // Limpar campos

        enderecoEntrega.value = "";
        formaPagamento.value = "";


        // Restaurar botão

        confirmarCompra.disabled = false;

        confirmarCompra.textContent = "CONFIRMAR PEDIDO";

    });

}