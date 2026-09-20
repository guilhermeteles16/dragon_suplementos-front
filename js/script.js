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
    if (this.navList) {
      this.navList.classList.toggle(this.activeClass);
    }

    if (this.mobileMenu) {
      this.mobileMenu.classList.toggle(this.activeClass);
    }

    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener(
      "click",
      this.handleClick
    );
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
  ".nav-list li"
);

mobileNavbar.init();


// ==========================================
// TEMA DARK / LIGHT
// ==========================================

const themeButton =
  document.getElementById("themeButton");

if (themeButton) {

  themeButton.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light-theme"
      );

    }
  );

}


// ==========================================
// CONEXÃO COM O BACK-END
// ==========================================

const API_URL = "https://dragon-suplementos-back-end.onrender.com";


// ==========================================
// TESTAR CONEXÃO COM A API
// ==========================================

async function testarAPI() {

  try {

    const resposta =
      await fetch(`${API_URL}/`);

    if (!resposta.ok) {

      throw new Error(
        "API respondeu com erro."
      );

    }

    const dados =
      await resposta.json();

    console.log(
      "✅ API conectada!"
    );

    console.log(
      "Resposta do servidor:",
      dados
    );

    return true;

  } catch (erro) {

    console.error(
      "❌ Não foi possível conectar à API."
    );

    console.error(erro);

    return false;
  }
}


// ==========================================
// BUSCAR PRODUTOS
// ==========================================

async function buscarProdutos() {

  try {

    const resposta =
      await fetch(
        `${API_URL}/api/produtos`
      );

    if (!resposta.ok) {

      throw new Error(
        "Erro ao buscar produtos."
      );

    }

    const produtos =
      await resposta.json();

    console.log(
      "✅ Produtos recebidos da API:"
    );

    console.log(produtos);

    return produtos;

  } catch (erro) {

    console.error(
      "❌ Erro ao buscar produtos:",
      erro
    );

    return [];
  }
}


// ==========================================
// BUSCAR CATEGORIAS
// ==========================================

async function buscarCategorias() {

  try {

    const resposta =
      await fetch(
        `${API_URL}/api/categorias`
      );

    if (!resposta.ok) {

      throw new Error(
        "Erro ao buscar categorias."
      );

    }

    const categorias =
      await resposta.json();

    console.log(
      "✅ Categorias recebidas:"
    );

    console.log(categorias);

    return categorias;

  } catch (erro) {

    console.error(
      "❌ Erro ao buscar categorias:",
      erro
    );

    return [];
  }
}


// ==========================================
// INICIAR CONEXÃO
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "🔌 Conectando ao Dragon Suplementos..."
    );

    const conectado =
      await testarAPI();

    if (conectado) {

      console.log(
        "🔥 FRONT-END conectado ao BACK-END!"
      );

      await buscarProdutos();

      await buscarCategorias();

    } else {

      console.log(
        "⚠️ API não está disponível."
      );

    }

  }
);

// ==========================================
// CONTADOR DE PRODUTOS
// ==========================================

function mostrarNotificacaoMaisUm(elemento) {

    if (!elemento) {
        return;
    }

    if (getComputedStyle(elemento).position === "static") {
        elemento.style.position = "relative";
    }

    let notificacao =
        elemento.querySelector(".nav-notification");

    let quantidade =
        Number(localStorage.getItem("produtosNovos")) || 0;

    quantidade++;

    localStorage.setItem(
        "produtosNovos",
        quantidade
    );

    if (!notificacao) {

        notificacao =
            document.createElement("span");

        notificacao.classList.add(
            "nav-notification"
        );

        elemento.appendChild(
            notificacao
        );
    }

    notificacao.textContent =
        quantidade;
}


// ==========================================
// MOSTRAR CONTADOR AO ABRIR A PÁGINA
// ==========================================

function atualizarContadorProdutos() {

    const navProdutos =
        document.getElementById("navProdutos");

    if (!navProdutos) {
        return;
    }

    const quantidade =
        Number(localStorage.getItem("produtosNovos")) || 0;

    if (quantidade <= 0) {
        return;
    }

    let notificacao =
        navProdutos.querySelector(
            ".nav-notification"
        );

    if (!notificacao) {

        notificacao =
            document.createElement("span");

        notificacao.classList.add(
            "nav-notification"
        );

        navProdutos.appendChild(
            notificacao
        );
    }

    notificacao.textContent =
        quantidade;
}


// ==========================================
// ENTROU NA PÁGINA DE PRODUTOS
// ==========================================

function zerarContadorProdutos() {

    localStorage.removeItem(
        "produtosNovos"
    );

    const navProdutos =
        document.getElementById("navProdutos");

    if (!navProdutos) {
        return;
    }

    const notificacao =
        navProdutos.querySelector(
            ".nav-notification"
        );

    if (notificacao) {
        notificacao.remove();
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        atualizarContadorProdutos();

        const paginaAtual =
            window.location.pathname;

        if (
            paginaAtual.endsWith(
                "/produtos.html"
            )
        ) {
            zerarContadorProdutos();
        }

    }
);

// ==========================================
// ANIMAÇÃO +1
// ==========================================

function mostrarAnimacaoMaisUm() {

    const maisUm =
        document.createElement("div");

    maisUm.classList.add("animacao-mais-um");

    maisUm.textContent = "+1";

    document.body.appendChild(maisUm);

    setTimeout(() => {

        maisUm.remove();

    }, 1000);
}