// ==========================================
// ADMIN - PRODUTOS
// ==========================================



const produtoForm = document.getElementById("produtoForm");

let produtoEditandoId = null;
let imagemAtual = null;

const nomeInput = document.getElementById("nome");
const categoriaInput = document.getElementById("categoria");
const precoInput = document.getElementById("preco");
const estoqueInput = document.getElementById("estoque");
const descricaoInput = document.getElementById("descricao");
const imagemInput = document.getElementById("imagem");

const botaoForm = produtoForm
    ? produtoForm.querySelector("button[type='submit']")
    : null;


// ==========================================
// CARREGAR PRODUTOS
// ==========================================

async function carregarProdutosAdmin() {

    const lista = document.getElementById("listaProdutosAdmin");

    if (!lista) {
        console.error("❌ Não encontrei #listaProdutosAdmin");
        return;
    }

    console.log("🟢 Iniciando carregamento dos produtos...");
    console.log("🌐 URL:", `${API_URL}/api/produtos`);

    lista.innerHTML = `
        <p class="admin-loading">
            Carregando produtos...
        </p>
    `;

    try {

        const resposta = await fetch(
            `${API_URL}/api/produtos`
        );

        console.log("📡 API respondeu:", resposta.status);

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }

        const produtos = await resposta.json();

        console.log("📦 Produtos recebidos:", produtos);

        lista.innerHTML = "";

        if (!Array.isArray(produtos) || produtos.length === 0) {

            lista.innerHTML = `
                <p class="admin-empty">
                    Nenhum produto cadastrado.
                </p>
            `;

            return;
        }

        produtos.forEach(produto => {

            const card = document.createElement("div");

            card.classList.add(
                "admin-product-card"
            );

            const preco = Number(
                produto.preco || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

            const imagem =
                produto.imagem ||
                "../imgs/product.svg";

            card.innerHTML = `

                <div class="admin-product-image">

                    <img
                        src="${imagem}"
                        alt="${produto.nome}"
                        onerror="this.src='../imgs/product.svg'"
                    >

                </div>

                <div class="admin-product-info">

                    <span class="admin-product-category">
                        ${produto.categoria || "PRODUTO"}
                    </span>

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${produto.descricao || "Sem descrição"}
                    </p>

                    <div class="admin-product-details">

                        <strong>
                            ${preco}
                        </strong>

                        <span>
                            ID: ${produto.id}
                        </span>

                    </div>

                </div>

                <div class="admin-product-actions">

                    <button
                        type="button"
                        class="admin-edit-button"
                        onclick="editarProduto(${produto.id})"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        type="button"
                        class="admin-delete-button"
                        onclick="excluirProduto(${produto.id})"
                    >
                        🗑️ Excluir
                    </button>

                </div>
            `;

            lista.appendChild(card);

        });

        console.log("✅ Produtos carregados no admin!");

    } catch (erro) {

        console.error(
            "❌ Erro ao carregar produtos:",
            erro
        );

        lista.innerHTML = `
            <p class="admin-error">
                Não foi possível carregar os produtos.
            </p>
        `;
    }
}


// ==========================================
// CADASTRAR PRODUTO
// ==========================================

if (produtoForm) {

    produtoForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const nome =
                nomeInput.value.trim();

            const categoria =
                categoriaInput.value;

            const preco =
                Number(precoInput.value);

            const estoque =
                Number(estoqueInput.value);

            const descricao =
                descricaoInput.value.trim();


            // ------------------------------
            // VALIDAÇÕES
            // ------------------------------

            if (!nome) {
                alert("Digite o nome do produto.");
                return;
            }

            if (!categoria) {
                alert("Selecione uma categoria.");
                return;
            }

            if (!preco || preco <= 0) {
                alert("Digite um preço válido.");
                return;
            }

            if (isNaN(estoque) || estoque < 0) {
                alert("Digite um estoque válido.");
                return;
            }

            if (!descricao) {
                alert("Digite uma descrição.");
                return;
            }


            // ==================================
            // SE ESTIVER EDITANDO
            // ==================================

            if (produtoEditandoId !== null) {

                await atualizarProduto();

                return;
            }


            // ==================================
            // IMAGEM OBRIGATÓRIA NO CADASTRO
            // ==================================

            if (
                !imagemInput.files ||
                imagemInput.files.length === 0
            ) {

                alert("Selecione uma imagem.");

                return;
            }


            // ==================================
            // FORMDATA
            // ==================================

            const formData = new FormData();

            formData.append(
                "nome",
                nome
            );

            formData.append(
                "categoria",
                categoria
            );

            formData.append(
                "preco",
                preco
            );

            formData.append(
                "estoque",
                estoque
            );

            formData.append(
                "descricao",
                descricao
            );

            formData.append(
                "imagem",
                imagemInput.files[0]
            );


            // ==================================
            // ENVIA PARA API
            // ==================================

            try {

                const resposta = await fetch(
                    `${API_URL}/api/produtos`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const resultado =
                    await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        resultado.erro ||
                        "Erro ao cadastrar produto."
                    );
                }

                alert(
                    "✅ Produto cadastrado com sucesso!"
                );

                limparFormulario();

                await carregarProdutosAdmin();

            } catch (erro) {

                console.error(
                    "❌ Erro ao cadastrar:",
                    erro
                );

                alert(
                    "❌ Não foi possível cadastrar o produto.\n\n" +
                    erro.message
                );
            }

        }
    );

}


// ==========================================
// EDITAR PRODUTO
// ==========================================

async function editarProduto(id) {

    console.log(
        "✏️ Editando produto:",
        id
    );

    try {

        const resposta = await fetch(
            `${API_URL}/api/produtos/${id}`
        );

        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP ${resposta.status}`
            );
        }

        const produto =
            await resposta.json();

        console.log(
            "📦 Produto para editar:",
            produto
        );

        produtoEditandoId = produto.id;

        imagemAtual =
            produto.imagem || null;


        // Preenche formulário

        nomeInput.value =
            produto.nome || "";

        categoriaInput.value =
            produto.categoria || "";

        precoInput.value =
            produto.preco || "";

        estoqueInput.value =
            produto.estoque || 0;

        descricaoInput.value =
            produto.descricao || "";

        // Não limpa a imagem atual
        // caso o usuário não queira trocar

        imagemInput.value = "";


        // Muda botão

        if (botaoForm) {

            botaoForm.textContent =
                "Atualizar Produto";

        }


        mostrarBotaoCancelar();


        // Scroll até formulário

        produtoForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (erro) {

        console.error(
            "❌ Erro ao editar:",
            erro
        );

        alert(
            "❌ Não foi possível carregar o produto."
        );
    }

}


// ==========================================
// ATUALIZAR PRODUTO
// ==========================================

async function atualizarProduto() {

    const dados = {

        nome:
            nomeInput.value.trim(),

        categoria:
            categoriaInput.value,

        preco:
            Number(precoInput.value),

        estoque:
            Number(estoqueInput.value),

        descricao:
            descricaoInput.value.trim(),

        imagem:
            imagemAtual
    };


    console.log(
        "📤 Atualizando produto:",
        dados
    );


    try {

        const resposta = await fetch(
            `${API_URL}/api/produtos/${produtoEditandoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(dados)
            }
        );

        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Erro ao atualizar produto."
            );
        }


        alert(
            "✅ Produto atualizado com sucesso!"
        );


        limparFormulario();

        await carregarProdutosAdmin();


    } catch (erro) {

        console.error(
            "❌ Erro ao atualizar:",
            erro
        );

        alert(
            "❌ Não foi possível atualizar o produto.\n\n" +
            erro.message
        );
    }

}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

async function excluirProduto(id) {

    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );


    if (!confirmar) {
        return;
    }


    console.log(
        "🗑️ Excluindo produto:",
        id
    );


    try {

        const resposta = await fetch(
            `${API_URL}/api/produtos/${id}`,
            {
                method: "DELETE"
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Erro ao excluir produto."
            );
        }


        alert(
            "🗑️ Produto excluído com sucesso!"
        );


        if (produtoEditandoId === id) {

            limparFormulario();

        }


        await carregarProdutosAdmin();


    } catch (erro) {

        console.error(
            "❌ Erro ao excluir:",
            erro
        );

        alert(
            "❌ Não foi possível excluir o produto.\n\n" +
            erro.message
        );
    }

}


// ==========================================
// BOTÃO CANCELAR EDIÇÃO
// ==========================================

function mostrarBotaoCancelar() {

    let botaoCancelar =
        document.getElementById(
            "cancelarEdicao"
        );


    if (botaoCancelar) {
        return;
    }


    botaoCancelar =
        document.createElement("button");


    botaoCancelar.type =
        "button";

    botaoCancelar.id =
        "cancelarEdicao";

    botaoCancelar.className =
        "cancel-edit-button";

    botaoCancelar.textContent =
        "Cancelar edição";


    botaoCancelar.addEventListener(
        "click",
        limparFormulario
    );


    produtoForm.appendChild(
        botaoCancelar
    );

}


// ==========================================
// LIMPAR FORMULÁRIO
// ==========================================

function limparFormulario() {

    if (!produtoForm) {
        return;
    }


    produtoForm.reset();


    produtoEditandoId = null;

    imagemAtual = null;


    if (botaoForm) {

        botaoForm.textContent =
            "Cadastrar Produto";

    }


    const botaoCancelar =
        document.getElementById(
            "cancelarEdicao"
        );


    if (botaoCancelar) {

        botaoCancelar.remove();

    }

}


// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarProdutosAdmin();

    }
);