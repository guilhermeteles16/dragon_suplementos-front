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