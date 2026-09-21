# Dragon Suplementos — Frontend

Frontend do projeto **Dragon Suplementos**, desenvolvido como projeto do curso de Desenvolvimento de Sistemas.

O projeto consiste em uma loja virtual para apresentação e gerenciamento de produtos, com cadastro de usuários, login, produtos, carrinho e integração com uma API desenvolvida em Python/Flask.

## Autores

**Guilherme Teles da Silva**
**Arthur Uezu da Cruz**

### Com auxílio de

**Gustavo Moraes**
**Mateus Valente**

**Etec de Poá — 2026**
**2º DSN**

---

## Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript
* Fetch API
* SVG e imagens para elementos visuais
* Netlify para hospedagem

## Estrutura do projeto

```text
dragon-suplementos-front/
│
├── css/
│   ├── style.css
│   └── outros estilos...
│
├── imgs/
│   ├── logo2.png
│   ├── product.svg
│   ├── person-fill.svg
│   ├── cart4.svg
│   ├── shield-fill.svg
│   └── outros arquivos...
│
├── js/
│   ├── script.js
│   ├── produtos.js
│   └── cadastro-produtos.js
│
├── pages/
│   ├── produtos.html
│   ├── login-cadastro.html
│   ├── carrinho.html
│   └── admin.html
│
└── index.html
```

## Principais páginas

### Página inicial

Apresenta a identidade visual da Dragon Suplementos, informações sobre a loja e acesso às principais áreas do sistema.

### Produtos

Exibe os produtos cadastrados no banco de dados através da API.

A página possui:

* Listagem dinâmica de produtos;
* Pesquisa;
* Filtro por categoria;
* Informações de preço;
* Estoque;
* Detalhes do produto;
* Adição ao carrinho.

### Login e Cadastro

Permite que novos clientes criem uma conta e que usuários cadastrados realizem login.

Após o login, os dados do usuário são armazenados no `localStorage`, permitindo identificar o usuário durante outras operações do sistema.

### Carrinho

Área destinada aos produtos adicionados pelo usuário.

Os produtos são relacionados ao usuário logado através do backend.

### Dashboard Administrativo

Área utilizada para gerenciamento da loja.

Possui:

* Total de produtos;
* Produtos disponíveis;
* Produtos indisponíveis;
* Indicadores financeiros;
* Cadastro de produtos;
* Edição de produtos;
* Exclusão de produtos;
* Lista de produtos cadastrados.

## Integração com o Backend

O frontend se comunica com o backend através de requisições HTTP utilizando a `Fetch API`.

Backend:

```text
https://dragon-suplementos-back-end.onrender.com/
```

Principais endpoints utilizados:

```text
GET  /api/produtos
GET  /api/produtos/<id>
POST /api/produtos
PUT  /api/produtos/<id>
DELETE /api/produtos/<id>

GET  /api/categorias
GET  /api/dashboard

POST /api/usuarios
POST /api/login

POST /api/carrinho/<usuario_id>
```

## Produtos dinâmicos

Os produtos não ficam escritos diretamente no HTML.

O JavaScript realiza uma requisição para:

```text
/api/produtos
```

A API retorna os produtos cadastrados no banco de dados e o frontend cria os cards automaticamente.

Dessa forma, quando um administrador cadastra um novo produto, ele pode aparecer automaticamente na página de produtos.

## Carrinho

O carrinho utiliza o usuário atualmente conectado.

O frontend recupera o usuário armazenado no `localStorage`:

```javascript
localStorage.getItem("usuarioLogado")
```

A partir do `id` do usuário, o produto é enviado para o carrinho através da API.

## Identidade visual

O projeto utiliza principalmente:

* Fundo escuro;
* Verde neon `#39FF14`;
* Elementos minimalistas;
* Ícones em SVG;
* Layout responsivo.

Também existe um sistema de alteração entre tema escuro e claro.

## Responsividade

As páginas foram desenvolvidas para se adaptar a diferentes tamanhos de tela, incluindo:

* Computadores;
* Notebooks;
* Tablets;
* Celulares.

## Hospedagem

O frontend está hospedado na plataforma Netlify.

Site:

```text
https://dragonsuplementos.netlify.app/
```

## Como executar localmente

1. Baixe ou clone o repositório.
2. Abra a pasta do projeto.
3. Execute o projeto utilizando um servidor local, como o **Live Server** do VS Code.
4. Certifique-se de que o backend esteja disponível para que as funcionalidades que dependem da API funcionem corretamente.

## Observação

O frontend depende do backend para operações como:

* Cadastro de usuários;
* Login;
* Cadastro de produtos;
* Consulta de produtos;
* Carrinho;
* Dashboard.

Portanto, algumas funcionalidades não funcionarão corretamente se a API estiver indisponível.

---

## Projeto

**Dragon Suplementos**

Projeto DS — Programação Web | Curso de Desenvolvimento de Sistemas

**Etec de Poá — 2026**
**2º DSN**

**Criado por Guilherme Teles da Silva e Arthur Uezu da Cruz**
**Com auxílio de Gustavo Moraes e Mateus Valente**
