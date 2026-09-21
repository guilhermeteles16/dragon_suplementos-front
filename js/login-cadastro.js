// ==========================================
// LOGIN E CADASTRO
// DRAGON SUPLEMENTOS
// ==========================================


// ==========================================
// ELEMENTOS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


// ==========================================
// FUNÇÕES DE MENSAGEM
// ==========================================

function mostrarMensagem(elemento, mensagem, tipo) {

    if (!elemento) {
        return;
    }

    elemento.textContent = mensagem;

    if (tipo === "erro") {
        elemento.style.color = "#ff4444";
    }

    if (tipo === "sucesso") {
        elemento.style.color = "#39FF14";
    }

    if (tipo === "info") {
        elemento.style.color = "#aaa";
    }
}


// ==========================================
// FUNÇÃO PARA DESTACAR CAMPO COM ERRO
// ==========================================

function marcarErro(campo) {

    if (!campo) {
        return;
    }

    campo.style.border = "1px solid #ff4444";
    campo.style.boxShadow =
        "0 0 8px rgba(255, 68, 68, 0.25)";
}


// ==========================================
// FUNÇÃO PARA LIMPAR ERRO DO CAMPO
// ==========================================

function limparErro(campo) {

    if (!campo) {
        return;
    }

    campo.style.border = "";
    campo.style.boxShadow = "";
}


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {

    console.log("✅ Login encontrado!");

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("🟢 FORMULÁRIO DE LOGIN ENVIADO!");

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const senha =
                document
                    .getElementById("loginSenha")
                    .value;

            const campoEmail =
                document.getElementById("loginEmail");

            const campoSenha =
                document.getElementById("loginSenha");

            const mensagem =
                document.getElementById("loginMessage");


            // Limpa erros anteriores

            limparErro(campoEmail);
            limparErro(campoSenha);


            // ==========================================
            // VALIDAÇÃO DO E-MAIL
            // ==========================================

            if (!email) {

                marcarErro(campoEmail);

                mostrarMensagem(
                    mensagem,
                    "Digite seu e-mail.",
                    "erro"
                );

                campoEmail.focus();

                return;
            }


            // ==========================================
            // VALIDAÇÃO DO FORMATO DO E-MAIL
            // ==========================================

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailValido.test(email)) {

                marcarErro(campoEmail);

                mostrarMensagem(
                    mensagem,
                    "Digite um e-mail válido.",
                    "erro"
                );

                campoEmail.focus();

                return;
            }


            // ==========================================
            // VALIDAÇÃO DA SENHA
            // ==========================================

            if (!senha) {

                marcarErro(campoSenha);

                mostrarMensagem(
                    mensagem,
                    "Digite sua senha.",
                    "erro"
                );

                campoSenha.focus();

                return;
            }


            // ==========================================
            // ENVIANDO
            // ==========================================

            mostrarMensagem(
                mensagem,
                "Entrando...",
                "info"
            );


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/api/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                senha: senha
                            })
                        }
                    );


                const dados =
                    await resposta.json();


                // ==========================================
                // ERRO DO BACKEND
                // ==========================================

                if (!resposta.ok) {

                    mostrarMensagem(
                        mensagem,
                        dados.erro ||
                        "E-mail ou senha inválidos.",
                        "erro"
                    );

                    marcarErro(campoEmail);
                    marcarErro(campoSenha);

                    return;
                }


                // ==========================================
                // LOGIN REALIZADO
                // ==========================================

                const usuario =
                    dados.usuario;


                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(usuario)
                );


                console.log(
                    "✅ Usuário logado:",
                    usuario
                );


                mostrarMensagem(
                    mensagem,
                    `Bem-vindo, ${usuario.nome}!`,
                    "sucesso"
                );


                // ==========================================
                // REDIRECIONA PARA PRODUTOS
                // ==========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "produtos.html";

                    },
                    800
                );


            } catch (erro) {

                console.error(
                    "❌ Erro no login:",
                    erro
                );

                mostrarMensagem(
                    mensagem,
                    "Não foi possível conectar ao servidor.",
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

    console.log("✅ Cadastro encontrado!");

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "🟢 FORMULÁRIO DE CADASTRO ENVIADO!"
            );


            // ==========================================
            // PEGAR VALORES
            // ==========================================

            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const telefone =
                document
                    .getElementById("telefone")
                    .value
                    .trim();

            const cpf =
                document
                    .getElementById("cpf")
                    .value
                    .trim();

            const dataNascimento =
                document
                    .getElementById("dataNascimento")
                    .value;

            const categoria =
                document
                    .getElementById("categoria")
                    .value;

            const senha =
                document
                    .getElementById("senha")
                    .value;

            const confirmarSenha =
                document
                    .getElementById("confirmarSenha")
                    .value;


            // ==========================================
            // CAMPOS
            // ==========================================

            const campoNome =
                document.getElementById("nome");

            const campoEmail =
                document.getElementById("email");

            const campoTelefone =
                document.getElementById("telefone");

            const campoCpf =
                document.getElementById("cpf");

            const campoData =
                document.getElementById(
                    "dataNascimento"
                );

            const campoCategoria =
                document.getElementById(
                    "categoria"
                );

            const campoSenha =
                document.getElementById("senha");

            const campoConfirmarSenha =
                document.getElementById(
                    "confirmarSenha"
                );

            const mensagem =
                document.getElementById(
                    "formMessage"
                );


            // ==========================================
            // LIMPAR ERROS
            // ==========================================

            [
                campoNome,
                campoEmail,
                campoTelefone,
                campoCpf,
                campoData,
                campoCategoria,
                campoSenha,
                campoConfirmarSenha
            ].forEach(limparErro);


            // ==========================================
            // NOME
            // ==========================================

            if (!nome) {

                marcarErro(campoNome);

                mostrarMensagem(
                    mensagem,
                    "Digite seu nome.",
                    "erro"
                );

                campoNome.focus();

                return;
            }


            // ==========================================
            // E-MAIL
            // ==========================================

            if (!email) {

                marcarErro(campoEmail);

                mostrarMensagem(
                    mensagem,
                    "Digite seu e-mail.",
                    "erro"
                );

                campoEmail.focus();

                return;
            }


            // ==========================================
            // FORMATO DO E-MAIL
            // ==========================================

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailValido.test(email)) {

                marcarErro(campoEmail);

                mostrarMensagem(
                    mensagem,
                    "Digite um e-mail válido.",
                    "erro"
                );

                campoEmail.focus();

                return;
            }


            // ==========================================
            // TELEFONE
            // ==========================================

            if (!telefone) {

                marcarErro(campoTelefone);

                mostrarMensagem(
                    mensagem,
                    "Digite seu telefone.",
                    "erro"
                );

                campoTelefone.focus();

                return;
            }


            // ==========================================
            // CPF
            // ==========================================

            if (!cpf) {

                marcarErro(campoCpf);

                mostrarMensagem(
                    mensagem,
                    "Digite seu CPF.",
                    "erro"
                );

                campoCpf.focus();

                return;
            }


            // ==========================================
            // VALIDAÇÃO SIMPLES DO CPF
            // ==========================================

            const cpfNumeros =
                cpf.replace(/\D/g, "");

            if (cpfNumeros.length !== 11) {

                marcarErro(campoCpf);

                mostrarMensagem(
                    mensagem,
                    "Digite um CPF válido.",
                    "erro"
                );

                campoCpf.focus();

                return;
            }


            // ==========================================
            // DATA DE NASCIMENTO
            // ==========================================

            if (!dataNascimento) {

                marcarErro(campoData);

                mostrarMensagem(
                    mensagem,
                    "Informe sua data de nascimento.",
                    "erro"
                );

                campoData.focus();

                return;
            }


            // ==========================================
            // CATEGORIA
            // ==========================================

            if (!categoria) {

                marcarErro(campoCategoria);

                mostrarMensagem(
                    mensagem,
                    "Selecione uma categoria.",
                    "erro"
                );

                campoCategoria.focus();

                return;
            }


            // ==========================================
            // SENHA
            // ==========================================

            if (!senha) {

                marcarErro(campoSenha);

                mostrarMensagem(
                    mensagem,
                    "Digite uma senha.",
                    "erro"
                );

                campoSenha.focus();

                return;
            }


            if (senha.length < 6) {

                marcarErro(campoSenha);

                mostrarMensagem(
                    mensagem,
                    "A senha deve ter no mínimo 6 caracteres.",
                    "erro"
                );

                campoSenha.focus();

                return;
            }


            // ==========================================
            // CONFIRMAR SENHA
            // ==========================================

            if (!confirmarSenha) {

                marcarErro(campoConfirmarSenha);

                mostrarMensagem(
                    mensagem,
                    "Confirme sua senha.",
                    "erro"
                );

                campoConfirmarSenha.focus();

                return;
            }


            if (senha !== confirmarSenha) {

                marcarErro(campoSenha);
                marcarErro(campoConfirmarSenha);

                mostrarMensagem(
                    mensagem,
                    "As senhas não são iguais.",
                    "erro"
                );

                campoConfirmarSenha.focus();

                return;
            }


            // ==========================================
            // ENVIANDO CADASTRO
            // ==========================================

            mostrarMensagem(
                mensagem,
                "Criando sua conta...",
                "info"
            );


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/api/usuarios`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                nome: nome,

                                email: email,

                                telefone: telefone,

                                cpf: cpf,

                                data_nascimento:
                                    dataNascimento,

                                categoria: categoria,

                                senha: senha

                            })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "📡 Resposta do cadastro:",
                    dados
                );


                // ==========================================
                // ERRO
                // ==========================================

                if (!resposta.ok) {

                    mostrarMensagem(
                        mensagem,
                        dados.erro ||
                        "Não foi possível criar a conta.",
                        "erro"
                    );

                    return;
                }


                // ==========================================
                // CONTA CRIADA
                // ==========================================

                console.log(
                    "✅ Conta criada:",
                    dados
                );


                /*
                    O backend retorna o usuário
                    recém-cadastrado.
                */

                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(dados)
                );


                mostrarMensagem(
                    mensagem,
                    "Conta criada com sucesso!",
                    "sucesso"
                );


                // ==========================================
                // LIMPA FORMULÁRIO
                // ==========================================

                registerForm.reset();


                // ==========================================
                // VAI PARA PRODUTOS
                // ==========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "produtos.html";

                    },
                    1000
                );


            } catch (erro) {

                console.error(
                    "❌ Erro no cadastro:",
                    erro
                );

                mostrarMensagem(
                    mensagem,
                    "Não foi possível conectar ao servidor.",
                    "erro"
                );
            }

        }
    );
}


// ==========================================
// LIMPAR ERRO AO DIGITAR
// ==========================================

const camposFormulario =
    document.querySelectorAll(
        "#loginForm input, #registerForm input, #registerForm select"
    );


camposFormulario.forEach(
    function (campo) {

        campo.addEventListener(
            "input",
            function () {

                limparErro(campo);
            }
        );


        campo.addEventListener(
            "change",
            function () {

                limparErro(campo);
            }
        );

    }
);


// ==========================================
// LOGIN REALIZADO
// ==========================================

const usuario =
    dados.usuario;


localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuario)
);


console.log(
    "✅ Usuário logado:",
    usuario
);


// ==========================================
// MENSAGEM DE BOAS-VINDAS
// ==========================================

mostrarMensagem(
    mensagem,
    `Login realizado com sucesso! Bem-vindo, ${usuario.nome}!`,
    "sucesso"
);


// ==========================================
// REDIRECIONA PARA PRODUTOS
// ==========================================

setTimeout(
    function () {

        window.location.href =
            "produtos.html";

    },
    2000
);

