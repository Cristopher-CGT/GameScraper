# ScraperGames

Projeto para coletar e comparar preços de jogos eletrônicos em diferentes plataformas e lojas, permitindo identificar onde cada título está mais barato.

## Objetivo

O ScraperGames deverá consultar fontes públicas de venda de jogos, normalizar os dados encontrados e exibir uma comparação por plataforma. A ideia é facilitar a pesquisa de preços de um mesmo jogo para PC, considerando as lojas Steam, Epic Games Store e GOG, além de PlayStation, Xbox, Nintendo Switch e outras plataformas suportadas.

Exemplo de resultado esperado:

| Jogo | Plataforma | Loja | Preço | Link |
| --- | --- | --- | ---: | --- |
| Exemplo de jogo | PC - Steam | Steam | R$ 99,90 |
| Exemplo de jogo | PC - Epic Games Store | Epic Games Store | R$ 89,90 |
| Exemplo de jogo | PC - GOG | GOG | R$ 109,90 |
| Exemplo de jogo | PlayStation 5 | Loja B | R$ 149,90 |
| Exemplo de jogo | Xbox Series | Loja C | R$ 129,90 |

## Como funcionará

1. O usuário informa o nome de um jogo ou acessa a lista de jogos disponíveis.
2. O scraper consulta as páginas ou APIs das lojas configuradas.
3. Os dados são extraídos, como título, plataforma, preço, moeda, disponibilidade e URL.
4. Os resultados são normalizados para o mesmo formato.
5. O sistema remove duplicidades e registra a data da última coleta.
6. A aplicação agrupa os resultados pelo jogo e pela plataforma.
7. A interface apresenta os preços lado a lado, destacando o menor valor encontrado.

O processo de coleta deve respeitar os termos de uso, o `robots.txt`, os limites de requisições e as políticas de cada fonte. Sempre que uma loja disponibilizar uma API oficial, ela deverá ter prioridade sobre a leitura direta de páginas HTML.

## Stack do projeto

O projeto está em sua fase inicial. Atualmente, o repositório possui apenas a configuração básica de um projeto Node.js com módulos CommonJS. A stack planejada é:

- **Node.js**: execução do scraper e da API.
- **TypeScript**: linguagem principal do projeto.
- **Cheerio**: leitura e extração de dados em páginas HTML, quando necessário.
- **Express**: API para disponibilizar os jogos e os preços coletados.
- **SQL**: armazenamento local simples dos resultados e do histórico de preços.
- **React**: interface para busca, filtros e comparação entre plataformas.
- **CSS**: estilização responsiva da interface.

As dependências serão adicionadas conforme cada parte da aplicação for implementada.

## Arquitetura esperada

```text
Fontes de dados
      |
      v
Coletores por loja/plataforma
      |
      v
Normalização e validação
      |
      v
Banco de dados e histórico
      |
      v
API REST
      |
      v
Interface de comparação
```

Cada fonte deverá ter um coletor isolado. Dessa forma, uma alteração no HTML de uma loja não afeta os demais coletores e novos marketplaces podem ser adicionados com menor impacto.

Nos coletores Epic, Steam, GOG e PlayStation, falhas de consulta são retornadas como `{ error: string }`, em vez de rejeitarem a Promise. Assim, uma dessas fontes indisponível pode ser reportada sem interromper as consultas às demais.

## Modelo de dados básico

Cada preço coletado deverá conter, no mínimo:

- nome do jogo;
- identificador do jogo, quando disponível;
- plataforma;
- loja ou fonte;
- preço atual;
- moeda;
- preço promocional, quando houver;
- disponibilidade;
- URL do produto;
- data e hora da coleta.

## Organização sugerida

```text
ScraperGames/
├── api/
│   ├── collectors/        # Coletores específicos de cada fonte
│   ├── controllers/       # Controladores
│   ├── services/          # Regras de negócio e normalização
│   ├── routes/            # Rotas da API
│   ├── database/          # Conexão e consultas ao banco
│   └── app.js             # Inicialização da aplicação
├── web/                   # Interface de comparação
├── README.md
└── package.json
```

## Execução

Como o projeto ainda está em desenvolvimento, o comando de execução será definido junto com a primeira implementação funcional. A configuração atual do `package.json` utiliza module e ainda não possui dependências de produção.

Quando a base estiver implementada, a execução deverá seguir este fluxo:

```bash
npm install
npm run scraper
npm start
```

Os nomes dos scripts podem ser ajustados conforme a arquitetura final.

## Próximos passos

- Definir as primeiras lojas e plataformas suportadas.
- Implementar um coletor inicial usando uma fonte autorizada.
- Criar o formato normalizado dos preços.
- Persistir os resultados no SQLite.
- Expor os dados por uma API REST.
- Criar a tela de busca e comparação.
- Adicionar cache, tratamento de falhas e atualização periódica.
- Implementar histórico e alertas de queda de preço.

## Observações

Os preços podem mudar a qualquer momento e devem ser tratados como informações coletadas em um determinado instante. O projeto não realiza a venda dos jogos; ele apenas organiza e compara informações disponíveis nas fontes consultadas.
