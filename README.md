# GameScraper

O GameScraper reúne informações de preço de jogos em diferentes lojas e
plataformas para facilitar a consulta em um só lugar. O projeto é dividido em
uma API que busca os dados e uma aplicação web para pesquisar jogos.

## Como funciona

Ao receber o nome de um jogo, a API consulta os catálogos e fontes de preço da
Epic Games, GOG, Nintendo, PlayStation, Steam e Xbox/Microsoft Store. Cada
plataforma tem seu próprio coletor; eles são executados em paralelo e os
resultados disponíveis são reunidos com o nome do jogo, preço e plataforma.

Os preços e a disponibilidade dependem das fontes consultadas e podem mudar.

## Tecnologias

- **API:** Node.js, Express 5 e TypeScript.
- **Interface:** React.
- **Projeto:** npm Workspaces para organizar e executar `api` e `web`.


## Instalação e execução

Na raiz do projeto, instale as dependências:

```bash
npm install
npm build
```

Inicie API:

```bash
npm run start:api
```

A API ficará disponível em `http://localhost:3300`. No desenvolvimento, a interface encaminha as
requisições à API local. Para definir outra URL, configure
`REACT_APP_API_URL` no ambiente da aplicação web.

## Busca

A API oferece o endpoint `POST /api/search`. Envie um objeto JSON com o nome
do jogo:

```json
{
  "name": "Hades"
}
```

## Build e testes

```bash
npm run build
npm test
```

Também é possível executar o build de cada parte separadamente com
`npm run build:api` e `npm run build:web`. `npm test` executa os testes da
interface web (`npm run test:web`).
