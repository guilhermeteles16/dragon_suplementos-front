class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`);
    });
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li",
);
mobileNavbar.init();

const themeButton = document.getElementById("themeButton");

themeButton.addEventListener("click", () => {

  document.body.classList.toggle("light-theme");

});

const formulario = document.getElementById("registerForm");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const data = document.getElementById("dataNascimento").value;
    const categoria = document.getElementById("categoria").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const mensagem = document.getElementById("formMessage");


    // 1. Nome obrigatório
    if (nome === "") {
        mensagem.textContent = "Preencha o nome.";
        mensagem.className = "form-message error";
        return;
    }


    // 2. Nome mínimo
    if (nome.length < 3) {
        mensagem.textContent = "O nome deve ter pelo menos 3 caracteres.";
        mensagem.className = "form-message error";
        return;
    }


    // 3. E-mail válido
    if (!email.includes("@") || !email.includes(".")) {
        mensagem.textContent = "Digite um e-mail válido.";
        mensagem.className = "form-message error";
        return;
    }


    // 4. Telefone
    const telefoneNumeros = telefone.replace(/\D/g, "");

    if (telefoneNumeros.length < 10) {
        mensagem.textContent = "Digite um telefone válido.";
        mensagem.className = "form-message error";
        return;
    }


    // 5. CPF
    const cpfNumeros = cpf.replace(/\D/g, "");

    if (cpfNumeros.length !== 11) {
        mensagem.textContent = "Digite um CPF válido.";
        mensagem.className = "form-message error";
        return;
    }


    // 6. Data obrigatória
    if (data === "") {
        mensagem.textContent = "Informe sua data de nascimento.";
        mensagem.className = "form-message error";
        return;
    }


    // 7. Categoria obrigatória
    if (categoria === "") {
        mensagem.textContent = "Selecione uma categoria.";
        mensagem.className = "form-message error";
        return;
    }


    // 8. Senha
    if (senha.length < 8) {
        mensagem.textContent = "A senha deve ter pelo menos 8 caracteres.";
        mensagem.className = "form-message error";
        return;
    }


    // 9. Confirmar senha
    if (senha !== confirmarSenha) {
        mensagem.textContent = "As senhas não são iguais.";
        mensagem.className = "form-message error";
        return;
    }


    // Tudo certo
    mensagem.textContent = "Cadastro realizado com sucesso!";
    mensagem.className = "form-message success";

});

