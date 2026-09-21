// ==========================================
// CONFIGURAÇÃO DO USUÁRIO
// ==========================================

function obterUsuarioId() {

    const usuarioSalvo =
        localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
        return null;
    }

    try {

        const usuario =
            JSON.parse(usuarioSalvo);

        return usuario.id || null;

    } catch (erro) {

        return null;

    }
}


// ==========================================
// FORMATAR PREÇO
// ==========================================

function formatarPreco(valor) {

    return Number(valor || 0).toLocaleString(
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


    const usuarioId =
        obterUsuarioId();


    // ==========================================
    // USUÁRIO NÃO LOGADO
    // ==========================================

    if (!usuarioId) {

        cartProducts.innerHTML = `

            <div class="cart-empty">

                <h2>
                    Entre na sua conta.
                </h2>

                <p>
                    Faça login para acessar seu carrinho.
                </p>

                <a href="login-cadastro.html">
                    ENTRAR NA CONTA
                </a>

            </div>

        `;

        atualizarResumo([]);

        return;

    }


    try {

        console.log(
            "🛒 Buscando carrinho do usuário:",
            usuarioId
        );


        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${usuarioId}`
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


    } catch (erro) {

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
                    type="button"
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
                    type="button"
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
                type="button"
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


    const usuarioId =
        obterUsuarioId();


    if (!usuarioId) {

        alert(
            "Você precisa entrar na sua conta."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${usuarioId}/${itemId}`,
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

            const dados =
                await resposta.json();

            throw new Error(
                dados.erro ||
                "Erro ao atualizar quantidade."
            );

        }


        await carregarCarrinho();


    } catch (erro) {

        console.error(
            "❌ Erro ao alterar quantidade:",
            erro
        );


        alert(
            erro.message
        );

    }

}


// ==========================================
// REMOVER PRODUTO
// ==========================================

async function removerDoCarrinho(
    itemId
) {

    const usuarioId =
        obterUsuarioId();


    if (!usuarioId) {

        alert(
            "Você precisa entrar na sua conta."
        );

        return;

    }


    try {

        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${usuarioId}/${itemId}`,
                {
                    method: "DELETE"
                }
            );


        if (!resposta.ok) {

            const dados =
                await resposta.json();

            throw new Error(
                dados.erro ||
                "Erro ao remover produto."
            );

        }


        await carregarCarrinho();


    } catch (erro) {

        console.error(
            "❌ Erro ao remover produto:",
            erro
        );


        alert(
            erro.message
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
// INICIAR CARRINHO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    carregarCarrinho
);


// ==========================================
// FINALIZAR COMPRA
// ==========================================

const finalizarCompra =
    document.getElementById(
        "finalizarCompra"
    );


const checkoutModal =
    document.getElementById(
        "checkoutModal"
    );


const fecharCheckout =
    document.getElementById(
        "fecharCheckout"
    );


const confirmarCompra =
    document.getElementById(
        "confirmarCompra"
    );


const enderecoEntrega =
    document.getElementById(
        "enderecoEntrega"
    );


const formaPagamento =
    document.getElementById(
        "formaPagamento"
    );


const checkoutTotal =
    document.getElementById(
        "checkoutTotal"
    );


const checkoutError =
    document.getElementById(
        "checkoutError"
    );


// ==========================================
// ABRIR FINALIZAÇÃO
// ==========================================

if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        async () => {

            const usuarioId =
                obterUsuarioId();


            // ==================================
            // USUÁRIO NÃO LOGADO
            // ==================================

            if (!usuarioId) {

                alert(
                    "Você precisa entrar na sua conta para finalizar a compra."
                );


                window.location.href =
                    "login-cadastro.html";


                return;

            }


            try {

                // ==================================
                // BUSCAR CARRINHO ATUALIZADO
                // ==================================

                const resposta =
                    await fetch(
                        `${API_URL}/api/carrinho/${usuarioId}`
                    );


                if (!resposta.ok) {

                    throw new Error(
                        "Não foi possível verificar o carrinho."
                    );

                }


                const dados =
                    await resposta.json();


                const itens =
                    dados.itens || [];


                // ==================================
                // CARRINHO VAZIO
                // ==================================

                if (itens.length === 0) {

                    alert(
                        "Adicione algum produto ao carrinho antes de finalizar a compra."
                    );


                    return;

                }


                // ==================================
                // CARRINHO COM PRODUTOS
                // ==================================

                checkoutTotal.textContent =
                    formatarPreco(
                        dados.total || 0
                    );


                checkoutError.textContent =
                    "";


                checkoutModal.classList.add(
                    "active"
                );


            } catch (erro) {

                console.error(
                    "❌ Erro ao verificar carrinho:",
                    erro
                );


                alert(
                    "Não foi possível verificar seu carrinho."
                );

            }

        }
    );

}


// ==========================================
// FECHAR MODAL
// ==========================================

if (fecharCheckout) {

    fecharCheckout.addEventListener(
        "click",
        () => {

            checkoutModal.classList.remove(
                "active"
            );

        }
    );

}


// ==========================================
// FECHAR CLICANDO FORA
// ==========================================

if (checkoutModal) {

    checkoutModal.addEventListener(
        "click",
        (evento) => {

            if (
                evento.target ===
                checkoutModal
            ) {

                checkoutModal.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ==========================================
// CONFIRMAR PEDIDO
// ==========================================

if (confirmarCompra) {

    confirmarCompra.addEventListener(
        "click",
        async () => {

            const endereco =
                enderecoEntrega.value.trim();


            const pagamento =
                formaPagamento.value;


            checkoutError.textContent =
                "";


            // ==================================
            // VALIDAR ENDEREÇO
            // ==================================

            if (!endereco) {

                checkoutError.textContent =
                    "Digite o endereço de entrega.";


                enderecoEntrega.focus();


                return;

            }


            // ==================================
            // VALIDAR PAGAMENTO
            // ==================================

            if (!pagamento) {

                checkoutError.textContent =
                    "Selecione uma forma de pagamento.";


                formaPagamento.focus();


                return;

            }


            // ==================================
            // PROCESSANDO
            // ==================================

            confirmarCompra.disabled =
                true;


            confirmarCompra.textContent =
                "PROCESSANDO...";


            // ==================================
            // SIMULAÇÃO
            // ==================================

            await new Promise(
                resolve => {

                    setTimeout(
                        resolve,
                        1500
                    );

                }
            );


            // ==================================
            // NÚMERO FICTÍCIO DO PEDIDO
            // ==================================

            const numeroPedido =
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                );


            const formasPagamento = {

                pix:
                    "PIX",

                cartao:
                    "Cartão",

                boleto:
                    "Boleto"

            };


            // ==================================
            // FECHAR MODAL
            // ==================================

            checkoutModal.classList.remove(
                "active"
            );


            // ==================================
            // MENSAGEM DE SUCESSO
            // ==================================

            alert(

                "PEDIDO REALIZADO COM SUCESSO!\n\n" +

                "Pedido nº " +
                numeroPedido +

                "\n" +

                "Pagamento: " +

                formasPagamento[pagamento] +

                "\n\n" +

                "Obrigado por comprar na Dragon Suplementos!"

            );


            // ==================================
            // LIMPAR CAMPOS
            // ==================================

            enderecoEntrega.value =
                "";


            formaPagamento.value =
                "";


            // ==================================
            // RESTAURAR BOTÃO
            // ==================================

            confirmarCompra.disabled =
                false;


            confirmarCompra.textContent =
                "CONFIRMAR PEDIDO";

        }
    );

}
