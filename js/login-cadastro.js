
// ==========================================
// LOGIN E CADASTRO
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const loginMessage =
    document.getElementById("loginMessage");

const registerMessage =
    document.getElementById("formMessage");


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function mostrarMensagem(
    elemento,
    mensagem,
    tipo
) {

    if (!elemento) {
        return;
    }

    elemento.textContent =
        mensagem;

    elemento.className =
        "form-message";

    if (tipo === "sucesso") {

        elemento.classList.add(
            "success"
        );

    } else {

        elemento.classList.add(
            "error"
        );
    }
}


function limparErro(input) {

    if (!input) {
        return;
    }

    input.classList.remove(
        "input-error"
    );
}


function marcarErro(input) {

    if (!input) {
        return;
    }

    input.classList.add(
        "input-error"
    );
}


// ==========================================
// ANIMAÇÃO DE BOAS-VINDAS
// ==========================================

function mostrarBoasVindas(nome) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "welcome-overlay";

    overlay.innerHTML = `
        <div class="welcome-box">

            <div class="welcome-icon">
                ✓
            </div>

            <h2>
                Bem-vindo!
            </h2>

            <p>
                Olá, <strong>${nome}</strong>!
            </p>

            <span>
                Login realizado com sucesso.
            </span>

        </div>
    `;

    document.body.appendChild(
        overlay
    );


    setTimeout(
        function () {

            overlay.classList.add(
                "welcome-hidden"
            );


            setTimeout(
                function () {

                    overlay.remove();

                },
                400
            );

        },
        1600
    );
}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // CAMPOS
            // ==================================

            const emailInput =
                document.getElementById(
                    "loginEmail"
                );

            const senhaInput =
                document.getElementById(
                    "loginSenha"
                );


            const email =
                emailInput.value.trim();

            const senha =
                senhaInput.value;


            limparErro(
                emailInput
            );

            limparErro(
                senhaInput
            );


            // ==================================
            // LIMPAR MENSAGEM
            // ==================================

            mostrarMensagem(
                loginMessage,
                "",
                "erro"
            );


            // ==================================
            // VALIDAÇÕES
            // ==================================

            if (!email) {

                marcarErro(
                    emailInput
                );

                mostrarMensagem(
                    loginMessage,
                    "Digite seu e-mail.",
                    "erro"
                );

                emailInput.focus();

                return;
            }


            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailValido.test(email)) {

                marcarErro(
                    emailInput
                );

                mostrarMensagem(
                    loginMessage,
                    "Digite um e-mail válido.",
                    "erro"
                );

                emailInput.focus();

                return;
            }


            if (!senha) {

                marcarErro(
                    senhaInput
                );

                mostrarMensagem(
                    loginMessage,
                    "Digite sua senha.",
                    "erro"
                );

                senhaInput.focus();

                return;
            }


            // ==================================
            // LOGIN NA API
            // ==================================

            try {

                mostrarMensagem(
                    loginMessage,
                    "Entrando...",
                    "sucesso"
                );


                const resposta =
                    await fetch(
                        `${API_URL}/api/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email: email,
                                    senha: senha
                                })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "📡 Resposta do login:",
                    dados
                );


                // ==================================
                // ERRO
                // ==================================

                if (!resposta.ok) {

                    throw new Error(
                        dados.erro ||
                        "E-mail ou senha inválidos."
                    );
                }


                // ==================================
                // USUÁRIO
                // ==================================

                const usuario =
                    dados.usuario;


                if (
                    !usuario ||
                    !usuario.id
                ) {

                    throw new Error(
                        "A API não retornou os dados do usuário."
                    );
                }


                // ==================================
                // SALVAR USUÁRIO
                // ==================================

                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(
                        usuario
                    )
                );


                console.log(
                    "✅ Usuário logado:",
                    usuario
                );


                // ==================================
                // MOSTRAR BOAS-VINDAS
                // ==================================

                mostrarBoasVindas(
                    usuario.nome
                );


                // ==================================
                // IR PARA PRODUTOS
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "produtos.html";

                    },
                    2000
                );


            } catch (erro) {

                console.error(
                    "❌ Erro no login:",
                    erro
                );


                mostrarMensagem(
                    loginMessage,
                    erro.message ||
                    "Não foi possível realizar o login.",
                    "erro"
                );
            }

        }
    );

}


// ==========================================
// CADASTRO
// ==========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================
            // CAMPOS
            // ==================================

            const nomeInput =
                document.getElementById(
                    "nome"
                );

            const emailInput =
                document.getElementById(
                    "email"
                );

            const telefoneInput =
                document.getElementById(
                    "telefone"
                );

            const cpfInput =
                document.getElementById(
                    "cpf"
                );

            const dataNascimentoInput =
                document.getElementById(
                    "dataNascimento"
                );

            const categoriaInput =
                document.getElementById(
                    "categoria"
                );

            const senhaInput =
                document.getElementById(
                    "senha"
                );

            const confirmarSenhaInput =
                document.getElementById(
                    "confirmarSenha"
                );


            // ==================================
            // VALORES
            // ==================================

            const nome =
                nomeInput.value.trim();

            const email =
                emailInput.value.trim();

            const telefone =
                telefoneInput.value.trim();

            const cpf =
                cpfInput.value.trim();

            const dataNascimento =
                dataNascimentoInput.value;

            const categoria =
                categoriaInput.value;

            const senha =
                senhaInput.value;

            const confirmarSenha =
                confirmarSenhaInput.value;


            // ==================================
            // LIMPAR ERROS
            // ==================================

            [
                nomeInput,
                emailInput,
                telefoneInput,
                cpfInput,
                dataNascimentoInput,
                categoriaInput,
                senhaInput,
                confirmarSenhaInput
            ].forEach(
                limparErro
            );


            mostrarMensagem(
                registerMessage,
                "",
                "erro"
            );


            // ==================================
            // VALIDAÇÕES
            // ==================================

            if (!nome) {

                marcarErro(
                    nomeInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Digite seu nome.",
                    "erro"
                );

                nomeInput.focus();

                return;
            }


            if (!email) {

                marcarErro(
                    emailInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Digite seu e-mail.",
                    "erro"
                );

                emailInput.focus();

                return;
            }


            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                !emailValido.test(
                    email
                )
            ) {

                marcarErro(
                    emailInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Digite um e-mail válido.",
                    "erro"
                );

                emailInput.focus();

                return;
            }


            if (!telefone) {

                marcarErro(
                    telefoneInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Digite seu telefone.",
                    "erro"
                );

                telefoneInput.focus();

                return;
            }


            if (!cpf) {

                marcarErro(
                    cpfInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Digite seu CPF.",
                    "erro"
                );

                cpfInput.focus();

                return;
            }


            if (!dataNascimento) {

                marcarErro(
                    dataNascimentoInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Informe sua data de nascimento.",
                    "erro"
                );

                dataNascimentoInput.focus();

                return;
            }


            if (!categoria) {

                marcarErro(
                    categoriaInput
                );

                mostrarMensagem(
                    registerMessage,
                    "Selecione uma categoria.",
                    "erro"
                );

                categoriaInput.focus();

                return;
            }


            if (
                senha.length < 6
            ) {

                marcarErro(
                    senhaInput
                );

                mostrarMensagem(
                    registerMessage,
                    "A senha deve ter pelo menos 6 caracteres.",
                    "erro"
                );

                senhaInput.focus();

                return;
            }


            if (
                senha !==
                confirmarSenha
            ) {

                marcarErro(
                    confirmarSenhaInput
                );

                mostrarMensagem(
                    registerMessage,
                    "As senhas não são iguais.",
                    "erro"
                );

                confirmarSenhaInput.focus();

                return;
            }


            // ==================================
            // CADASTRAR NA API
            // ==================================

            try {

                mostrarMensagem(
                    registerMessage,
                    "Criando sua conta...",
                    "sucesso"
                );


                const resposta =
                    await fetch(
                        `${API_URL}/api/usuarios`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    nome:
                                        nome,

                                    email:
                                        email,

                                    telefone:
                                        telefone,

                                    cpf:
                                        cpf,

                                    data_nascimento:
                                        dataNascimento,

                                    categoria:
                                        categoria,

                                    senha:
                                        senha

                                })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "📡 Resposta do cadastro:",
                    dados
                );


                // ==================================
                // ERRO
                // ==================================

                if (!resposta.ok) {

                    throw new Error(
                        dados.erro ||
                        "Não foi possível criar a conta."
                    );
                }


                // ==================================
                // SUCESSO
                // ==================================

                mostrarMensagem(
                    registerMessage,
                    "Conta criada com sucesso! Agora faça login.",
                    "sucesso"
                );


                registerForm.reset();


                // ==================================
                // FOCO NO LOGIN
                // ==================================

                setTimeout(
                    function () {

                        const loginEmail =
                            document.getElementById(
                                "loginEmail"
                            );

                        if (loginEmail) {

                            loginEmail.focus();

                        }

                    },
                    300
                );


            } catch (erro) {

                console.error(
                    "❌ Erro no cadastro:",
                    erro
                );


                mostrarMensagem(
                    registerMessage,
                    erro.message ||
                    "Não foi possível criar a conta.",
                    "erro"
                );
            }

        }
    );

}


// ==========================================
// LIMPAR ERROS AO DIGITAR
// ==========================================

const campos =
    document.querySelectorAll(
        "input, select"
    );


campos.forEach(
    function (campo) {

        campo.addEventListener(
            "input",
            function () {

                limparErro(
                    campo
                );

            }
        );


        campo.addEventListener(
            "change",
            function () {

                limparErro(
                    campo
                );

            }
        );

    }
);
