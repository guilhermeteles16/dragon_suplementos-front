
console.log("🟢 produtos.js foi carregado!");

async function carregarProdutos() {

    console.log("🔎 Buscando produtos na API...");

    const productsGrid = document.querySelector(".products-grid");

    if (!productsGrid) {
        console.error("❌ Não encontrei .products-grid");
        return;
    }

    try {

        const resposta = await fetch(
            "http://127.0.0.1:5000/api/produtos"
        );

        console.log("📡 Status da API:", resposta.status);

        if (!resposta.ok) {
            throw new Error(
                `API respondeu com status ${resposta.status}`
            );
        }

        const produtos = await resposta.json();

        console.log("📦 Produtos recebidos:", produtos);

        productsGrid.innerHTML = "";

        if (!Array.isArray(produtos)) {

            console.error(
                "❌ A API não retornou uma lista:",
                produtos
            );

            return;
        }

        if (produtos.length === 0) {

            productsGrid.innerHTML = `
                <p>
                    Nenhum produto cadastrado.
                </p>
            `;

            return;
        }


        produtos.forEach(produto => {

            console.log("🛒 Criando card:", produto);


            const card = document.createElement("article");

            card.classList.add("product-card");


            const imagem =
                produto.imagem || "../imgs/product.svg";


            const preco = Number(
                produto.preco
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


            productsGrid.appendChild(card);

        });


        console.log("✅ Produtos exibidos na página!");

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


document.addEventListener(
    "DOMContentLoaded",
    carregarProdutos
);
