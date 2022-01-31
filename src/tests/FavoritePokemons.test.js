import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

let history = null;

beforeEach(() => {
  history = renderWithRouter(<App />).history;
});

it(`Teste se é exibido na tela a mensagem No favorite pokemon found, se a pessoa 
não tiver pokémons favoritos`, () => {
  history.push('/favorites');

  expect(
    screen.getByText('No favorite pokemon found'),
  ).toBeInTheDocument();
});

it('Teste se é exibido todos os cards de pokémons favoritados', () => {
  userEvent.click(screen.getByRole('link', { name: 'More details' }));
  userEvent.click(screen.getByLabelText('Pokémon favoritado?'));

  userEvent.click(screen.getByRole('link', { name: 'Home' }));

  userEvent.click(screen.getByRole('button', { name: 'Próximo pokémon' }));
  userEvent.click(screen.getByRole('link', { name: 'More details' }));
  userEvent.click(screen.getByLabelText('Pokémon favoritado?'));

  userEvent.click(screen.getByRole('link', { name: 'Favorite Pokémons' }));

  expect(
    screen.getAllByRole('img', { name: /sprite/g }),
  ).toHaveLength(2);
});
