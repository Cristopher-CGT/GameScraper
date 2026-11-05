import { useMemo, useState } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api/search';
const EXAMPLES = ['Dead by Daylight', 'Hollow Knight', 'Stardew Valley'];
const STORES = ['Steam', 'Epic Games', 'GOG', 'PlayStation', 'Xbox', 'Nintendo'];

function priceValue(price) {
  const normalized = price.replace(/[^\d,.]/g, '');
  if (!normalized) return Number.POSITIVE_INFINITY;

  const decimalValue = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  const parsed = Number(decimalValue);

  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [activePlatform, setActivePlatform] = useState('Todas');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sortedResults = useMemo(
    () => (results || []).slice().sort((a, b) => priceValue(a.price) - priceValue(b.price)),
    [results]
  );
  const platforms = useMemo(
    () => ['Todas', ...new Set(sortedResults.map((game) => game.platform))],
    [sortedResults]
  );
  const visibleResults = sortedResults.filter(
    (game) => activePlatform === 'Todas' || game.platform === activePlatform
  );

  async function searchGames(event) {
    event.preventDefault();
    const name = query.trim();
    if (!name || isLoading) return;

    setIsLoading(true);
    setError('');
    setResults(null);
    setActivePlatform('Todas');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível concluir a busca.');
      }
      if (!Array.isArray(data)) {
        throw new Error('A resposta da busca veio em um formato inesperado.');
      }

      setResults(data.filter(
        (game) => game && typeof game.name === 'string'
          && typeof game.price === 'string'
          && typeof game.platform === 'string'
      ));
    } catch (searchError) {
      setError(searchError.message || 'Não foi possível conectar à API. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const bestPrice = sortedResults[0];

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="GameScout, início">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8.5 11.5h15a4 4 0 0 1 3.8 2.8l1.2 4.1a3 3 0 0 1-4.8 3.2L20.5 19h-9l-3.2 2.6a3 3 0 0 1-4.8-3.2l1.2-4.1a4 4 0 0 1 3.8-2.8Z" />
              <path d="M11 13.5v5m-2.5-2.5h5m8-1h.01m3 3h.01" />
            </svg>
          </span>
          <span>Game<span className="brand-accent">Scraper</span></span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> Preços em um só lugar</div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> COMPARE ANTES DE JOGAR</span>
          <h1 id="hero-title">Seu próximo jogo,<br />pelo <span>melhor preço.</span></h1>
          <p className="hero-description">
            Busque uma vez. Compare em todas as lojas e descubra onde vale mais a pena.
          </p>

          <form className="search-form" onSubmit={searchGames}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
            <input
              aria-label="Nome do jogo"
              type="search"
              placeholder="Qual jogo você está procurando?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? 'Buscando...' : 'Buscar preços'}
              {!isLoading && <span aria-hidden="true">↗</span>}
            </button>
          </form>
          <div className="popular-searches">
            <span>Experimente:</span>
            {EXAMPLES.map((example) => (
              <button
                className="example-button"
                key={example}
                onClick={() => setQuery(example)}
                type="button"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-spark spark-one">✳</div>
          <div className="art-spark spark-two">✦</div>
          <div className="art-card">
            <div className="art-card-top"><span>COMPARE E ECONOMIZE</span><span className="art-dots">•••</span></div>
            <div className="art-game-title">A próxima<br />grande aventura.</div>
            <div className="art-card-bottom"><span className="art-store-icon">g</span><span>Compare ofertas</span><strong>↓ Encontre</strong></div>
          </div>
          <div className="art-badge"><span>↓</span><small>PREÇO<br />BAIXO</small></div>
        </div>
      </section>

      <section className="store-strip" aria-label="Lojas pesquisadas">
        <span className="store-strip-label">BUSCAMOS NAS PRINCIPAIS LOJAS</span>
        <div className="store-list">
          {STORES.map((store, index) => (
            <span className="store-name" key={store}>
              <span className={`store-symbol store-symbol-${index}`} aria-hidden="true">
                {['S', 'E', 'G', 'P', 'X', 'N'][index]}
              </span>
              {store}
            </span>
          ))}
        </div>
      </section>

      <section className="results-section" aria-live="polite" aria-busy={isLoading}>
        {isLoading && (
          <div className="message-panel">
            <span className="loading-spinner" />
            <div><strong>Procurando as melhores ofertas</strong><p>Consultando as lojas para você.</p></div>
          </div>
        )}

        {!isLoading && error && (
          <div className="message-panel error-panel" role="alert">
            <span className="message-icon">!</span>
            <div><strong>Não foi possível buscar agora</strong><p>{error}</p></div>
          </div>
        )}

        {!isLoading && results !== null && !error && (
          <>
            <div className="results-heading">
              <div>
                <span className="eyebrow"><span className="eyebrow-line" /> RESULTADOS DA BUSCA</span>
                <h2>{results.length ? `Ofertas para “${query.trim()}”` : `Nenhuma oferta encontrada`}</h2>
              </div>
              {results.length > 0 && (
                <span className="result-count">{results.length} {results.length === 1 ? 'oferta' : 'ofertas'} encontradas</span>
              )}
            </div>

            {results.length > 0 ? (
              <>
                <div className="filter-row" aria-label="Filtrar por plataforma">
                  {platforms.map((platform) => (
                    <button
                      className={`filter-chip${activePlatform === platform ? ' is-active' : ''}`}
                      key={platform}
                      onClick={() => setActivePlatform(platform)}
                      type="button"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
                <div className="offer-grid">
                  {visibleResults.map((game, index) => (
                    <article className={`offer-card${game === bestPrice ? ' is-best' : ''}`} key={`${game.platform}-${game.name}`}>
                      <div className="offer-card-top">
                        <span className={`platform-avatar platform-${game.platform.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                          {game.platform.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="offer-store"><span>LOJA</span><strong>{game.platform}</strong></div>
                        {game === bestPrice && <span className="best-tag">MENOR PREÇO</span>}
                      </div>
                      <h3>{game.name}</h3>
                      <div className="offer-card-bottom">
                        <span>Preço encontrado</span>
                        <strong>{game.price}</strong>
                      </div>
                    </article>
                  ))}
                </div>
                {visibleResults.length === 0 && <p className="no-filter-results">Nenhuma oferta nesta plataforma.</p>}
                <p className="results-footnote">Os preços podem mudar. Confira as condições diretamente na loja.</p>
              </>
            ) : (
              <div className="empty-results">
                <span className="empty-search-icon">⌕</span>
                <p>Tente conferir a escrita do nome ou buscar outro jogo.</p>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="footer">
        <span>Feito para encontrar seu próximo jogo. <span className="footer-heart">♥</span></span>
        <span>Preços consultados em tempo real</span>
      </footer>
    </main>
  );
}

export default App;
