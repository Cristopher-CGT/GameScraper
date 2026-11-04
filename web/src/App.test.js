import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('shows the game search and supported stores', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /seu próximo jogo/i })).toBeInTheDocument();
  expect(screen.getByRole('searchbox', { name: /nome do jogo/i })).toBeInTheDocument();
  expect(screen.getByText('PlayStation')).toBeInTheDocument();
  expect(screen.getByText('Nintendo')).toBeInTheDocument();
});

test('searches the API and sorts offers by price', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => [
      { name: 'Hades', price: 'R$ 99,90', platform: 'Steam' },
      { name: 'Hades', price: 'R$ 49,90', platform: 'Epic Games' },
    ],
  });
  render(<App />);

  fireEvent.change(screen.getByRole('searchbox', { name: /nome do jogo/i }), {
    target: { value: 'Hades' },
  });
  fireEvent.click(screen.getByRole('button', { name: /buscar preços/i }));

  expect(global.fetch).toHaveBeenCalledWith('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Hades' }),
  });
  expect(await screen.findByText('R$ 49,90')).toBeInTheDocument();
  expect(screen.getByText('MENOR PREÇO')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Steam' }));
  await waitFor(() => expect(screen.queryByText('MENOR PREÇO')).not.toBeInTheDocument());
  expect(screen.getByText('R$ 99,90')).toBeInTheDocument();
});

test('shows an actionable error when the API is unavailable', async () => {
  global.fetch.mockRejectedValue(new Error('Network unavailable'));
  render(<App />);

  fireEvent.change(screen.getByRole('searchbox', { name: /nome do jogo/i }), {
    target: { value: 'Hades' },
  });
  fireEvent.click(screen.getByRole('button', { name: /buscar preços/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable');
});
