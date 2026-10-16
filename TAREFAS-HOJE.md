# Tarefas do front-end

## Objetivo

Criar a interface React do ScraperGames para pesquisar jogos e comparar preços por loja e plataforma. A aplicação será um monólito: front-end e API fazem parte do mesmo projeto e são implantados juntos, sem separar o React em um serviço independente.

## Decisão de renderização: CSR

**Recomendação: usar CSR (Client-Side Rendering) com React.**

O fluxo principal é uma busca iniciada pelo usuário e os resultados dependem de consultas à API existente (`POST /api/search`). Não há, neste momento, requisito de indexação de páginas de resultados por mecanismos de busca ou de conteúdo público que precise aparecer antes da execução do JavaScript. CSR mantém a implementação simples e integra-se bem com a API Express.

No monólito, o Express pode servir os arquivos estáticos da aplicação React e continuar expondo a API no mesmo processo e domínio. CSR não exige que o front-end seja hospedado separadamente.

Reavaliar SSR somente se surgirem requisitos concretos como páginas públicas de jogos que precisem ser indexadas, pré-visualizações de compartilhamento com metadados por jogo ou uma necessidade comprovada de renderizar conteúdo no servidor antes da hidratação. SSR adicionaria complexidade e não é necessário apenas por o projeto ser monolítico.

## Tarefas

### 1. Preparar a aplicação React

- [ ] Definir a estrutura da aplicação em `web/`, mantendo-a no mesmo repositório e ciclo de implantação da API.
- [ ] Configurar React com TypeScript e JSX, incluindo scripts próprios de desenvolvimento e build sem quebrar o build atual do servidor em `src/`.
- [ ] Configurar o Express para servir os arquivos gerados pelo build do front-end e manter as rotas `/api` disponíveis.
- [ ] Definir uma URL-base configurável para a API, usando o mesmo domínio em produção e evitando dependência de origens locais fixas.

### 2. Implementar a experiência de busca

- [ ] Criar a página principal com campo de busca por nome do jogo e ação explícita para pesquisar.
- [ ] Validar que a busca não esteja vazia e impedir envios repetidos enquanto uma consulta estiver em andamento.
- [ ] Enviar `POST /api/search` com corpo JSON no formato `{ "name": "<nome do jogo>" }`.
- [ ] Implementar estados distintos de carregamento, erro, resultado vazio e resultados encontrados, com mensagens claras para o usuário.

### 3. Exibir e comparar resultados

- [ ] Conferir o formato retornado pela API para cada coletor e definir um tipo compartilhado para os dados apresentados pela interface.
- [ ] Exibir os dados disponíveis de cada resultado, incluindo jogo, plataforma/loja, preço, moeda, disponibilidade e link do produto, sem inventar valores ausentes.
- [ ] Agrupar ou identificar resultados por loja/plataforma e destacar o menor preço apenas quando os preços forem comparáveis (mesma moeda e valores válidos).
- [ ] Tratar resultados parciais e erros de coletores sem esconder resultados válidos de outras lojas.
- [ ] Apresentar quando os dados foram coletados, se essa informação estiver disponível na resposta da API.

### 4. Qualidade e usabilidade

- [ ] Criar layout responsivo para celular e desktop, com controles acessíveis por teclado e rótulos associados aos campos.
- [ ] Adicionar testes para validação da busca, estados da interface e apresentação de resultados.
- [ ] Verificar a integração ponta a ponta entre a interface servida pelo Express e `POST /api/search`.
- [ ] Documentar no README como instalar dependências, executar o front-end em desenvolvimento e gerar/executar o build integrado.