import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';
import Favorites from '../components/FavoritePokemons';

it('É exibido a mensagem No favorite pokemon found, não tiver pokémons favoritos', () => {
  renderWithRouter(<Favorites />);

  const noFoundFavorites = screen.getByText(/No favorite pokemon found/i);
  expect(noFoundFavorites).toBeInTheDocument();
});

it('este se é exibido todos os cards de pokémons favoritados', () => {
  renderWithRouter(<App />);

  userEvent.click(screen.getByRole('link', { name: /More details/i }));
  userEvent.click(screen.getByLabelText(/Pokémon favoritado?/i));

  userEvent.click(screen.getByRole('link', { name: 'Home' }));

  userEvent.click(screen.getByRole('button', { name: /Próximo pokémon/i }));
  userEvent.click(screen.getByRole('link', { name: /More details/i }));
  userEvent.click(screen.getByLabelText(/Pokémon favoritado?/i));

  userEvent.click(screen.getByRole('link', { name: /Favorite Pokémons/i }));
  const allFavorites = screen.getAllByRole('img', { name: /sprite/g });
  expect(allFavorites).toHaveLength(2);
});
