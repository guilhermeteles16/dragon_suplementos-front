console.log("🟢 produtos.js foi carregado!");


// ==========================================
// PRODUTOS
// ==========================================

let produtos = [];


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutos() {

    console.log("🔎 Buscando produtos na API...");

    const productsGrid =
        document.querySelector(".products-grid");

    if (!productsGrid) {

        console.error(
            "❌ Não encontrei .products-grid"
        );

        return;
    }

    try {

        const resposta =
            await fetch(
                "https://dragon-suplementos-back-end.onrender.com/api/produtos"
            );


        console.log(
            "📡 Status da API:",
            resposta.status
        );


        if (!resposta.ok) {

            throw new Error(
                `API respondeu com status ${resposta.status}`
            );

        }


        produtos =
            await resposta.json();


        console.log(
            "📦 Produtos recebidos:",
            produtos
        );


        if (!Array.isArray(produtos)) {

            console.error(
                "❌ A API não retornou uma lista:",
                produtos
            );

            return;
        }


        aplicarFiltros();


        console.log(
            "✅ Produtos exibidos na página!"
        );


    } catch (erro) {

        console.error(
            "❌ ERRO AO CARREGAR PRODUTOS:",
            erro
        );


        productsGrid.innerHTML = `
            <p>
                Erro ao conectar com o servidor.
            </p>
        `;

    }
}


// ==========================================
// MOSTRAR PRODUTOS
// ==========================================

function mostrarProdutos(lista) {

    const productsGrid =
        document.querySelector(".products-grid");


    if (!productsGrid) {
        return;
    }


    productsGrid.innerHTML = "";


    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        productsGrid.innerHTML = `
            <p class="produtos-sem-resultado">
                Nenhum produto encontrado.
            </p>
        `;

        return;
    }


    lista.forEach(produto => {

        console.log(
            "🛒 Criando card:",
            produto
        );


        const card =
            document.createElement("article");


        card.classList.add(
            "product-card"
        );


        const imagem =
            produto.imagem ||
            "../imgs/product.svg";


        const preco =
            Number(
                produto.preco || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${imagem}"
                    alt="${produto.nome}"
                    onerror="this.src='../imgs/product.svg'"
                >

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${produto.categoria || "PRODUTO"}
                </span>


                <h2>
                    ${produto.nome}
                </h2>


                <p>
                    ${produto.descricao || ""}
                </p>


                <div class="product-bottom">

                    <div class="product-price">

                        <small>
                            POR APENAS
                        </small>

                        <strong>
                            ${preco}
                        </strong>

                    </div>


                    <button
                        class="add-cart"
                        title="Adicionar ao carrinho"
                        onclick="adicionarAoCarrinho(${produto.id})"
                    >
                        +
                    </button>

                </div>

            </div>

        `;

        card.addEventListener("click", (evento) => {

            if (evento.target.closest(".add-cart")) {
                return;
            }

            mostrarDetalhes(produto);

        });


        productsGrid.appendChild(card);

    });

}


// ==========================================
// FILTRO DOS PRODUTOS
// ==========================================

function aplicarFiltros() {

    const campoPesquisa =
        document.getElementById(
            "pesquisaProduto"
        );


    const filtroCategoria =
        document.getElementById(
            "filtroCategoria"
        );


    const termo =
        campoPesquisa
            ? campoPesquisa.value
                .trim()
                .toLowerCase()
            : "";


    const categoriaSelecionada =
        filtroCategoria
            ? filtroCategoria.value
                .trim()
                .toLowerCase()
            : "";


    const produtosFiltrados =
        produtos.filter(produto => {

            const nome =
                String(
                    produto.nome || ""
                ).toLowerCase();


            const descricao =
                String(
                    produto.descricao || ""
                ).toLowerCase();


            // Aceita categoria como texto
            const categoriaProduto =
                String(
                    produto.categoria || ""
                )
                    .trim()
                    .toLowerCase();


            // Também verifica categoria_id
            const categoriaId =
                String(
                    produto.categoria_id || ""
                )
                    .trim()
                    .toLowerCase();


            // ==================================
            // PESQUISA
            // ==================================

            const correspondePesquisa =
                termo === "" ||
                nome.includes(termo) ||
                descricao.includes(termo);


            // ==================================
            // CATEGORIA
            // ==================================

            let correspondeCategoria = true;


            if (categoriaSelecionada !== "") {

                correspondeCategoria =
                    categoriaProduto ===
                    categoriaSelecionada ||

                    categoriaId ===
                    categoriaSelecionada;

            }


            return (
                correspondePesquisa &&
                correspondeCategoria
            );

        });


    console.log(
        "🔎 Pesquisa:",
        termo
    );

    console.log(
        "🏷️ Categoria selecionada:",
        categoriaSelecionada
    );

    console.log(
        "📦 Produtos filtrados:",
        produtosFiltrados
    );


    mostrarProdutos(
        produtosFiltrados
    );

}

// ==========================================
// ADICIONAR PRODUTO AO CARRINHO
// ==========================================

async function adicionarAoCarrinho(produtoId) {

    console.log(
        "🛒 Adicionando produto:",
        produtoId
    );


    const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado")
    );

    if (!usuarioLogado || !usuarioLogado.id) {
        alert("Faça login para adicionar produtos ao carrinho.");
        return;
    }

    const usuarioId = usuarioLogado.id;


    try {

        const resposta =
            await fetch(
                `${API_URL}/api/carrinho/${usuarioId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        produto_id:
                            produtoId,

                        quantidade: 1
                    })
                }
            );


        console.log(
            "📡 Status adicionar ao carrinho:",
            resposta.status
        );


        if (!resposta.ok) {

            const erro =
                await resposta.json();


            console.error(
                "❌ Erro da API:",
                erro
            );


            throw new Error(
                "Não foi possível adicionar o produto."
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "✅ Produto adicionado ao carrinho!",
            dados
        );


        // ==========================================
        // CONTADOR DO CARRINHO
        // ==========================================

        const navCarrinho =
            document.getElementById(
                "navCarrinho"
            );


        if (
            typeof mostrarNotificacaoMaisUm ===
            "function"
        ) {

            mostrarNotificacaoMaisUm(
                navCarrinho
            );

        }


    } catch (erro) {

        console.error(
            "❌ Erro ao adicionar ao carrinho:",
            erro
        );


        alert(
            "Não foi possível adicionar o produto ao carrinho."
        );

    }

}


// ==========================================
// INICIAR PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const campoPesquisa =
            document.getElementById(
                "pesquisaProduto"
            );


        const filtroCategoria =
            document.getElementById(
                "filtroCategoria"
            );


        // ==================================
        // PESQUISA
        // ==================================

        if (campoPesquisa) {

            campoPesquisa.addEventListener(
                "input",
                aplicarFiltros
            );

        }


        // ==================================
        // CATEGORIA
        // ==================================

        if (filtroCategoria) {

            filtroCategoria.addEventListener(
                "change",
                aplicarFiltros
            );

        }


        // ==================================
        // CARREGAR PRODUTOS
        // ==================================

        carregarProdutos();

    }
);


// ==========================================
// DETALHES DO PRODUTO
// ==========================================

function mostrarDetalhes(produto) {

    const modal = document.createElement("div");

    modal.className = "modal-produto";

    modal.innerHTML = `

        <div class="modal-conteudo">

            <button class="fechar-modal">
                ×
            </button>

            <img
                src="${produto.imagem || "../imgs/product.svg"}"
                alt="${produto.nome}"
            >

            <div class="modal-info">

                <span>
                    ${produto.categoria || "PRODUTO"}
                </span>

                <h2>
                    ${produto.nome}
                </h2>

                <p>
                    ${produto.descricao || "Sem descrição."}
                </p>

                <strong>
                    ${Number(produto.preco || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    )}
                </strong>

                <small>
                    Estoque: ${produto.estoque ?? 0}
                </small>

                <button
                    class="btn-modal-carrinho"
                    onclick="adicionarAoCarrinho(${produto.id})"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    // Fechar no X
    modal.querySelector(".fechar-modal").onclick = () => {
        modal.remove();
    };


    // Fechar clicando fora
    modal.addEventListener("click", (evento) => {

        if (evento.target === modal) {
            modal.remove();
        }

    });

}