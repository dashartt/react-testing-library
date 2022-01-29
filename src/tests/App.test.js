/*
  Como usar variáveis do beforeEach no testes em Jest
  Source Link: https://stackoverflow.com/questions/48528502/how-to-share-data-between-beforeall-beforeeach-and-tests-in-jest
*/

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

const NOTFOUND_TEXT = /Page requested not found/;
const NOTFOUND_IMAGE_ALT = /Pikachu crying because the page requested was not found/;
const NOTFOUND_IMAGE_SRC = 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif';

describe('Redirecionamente ocorre como esperado ao clicar nos links do topo', () => {
  let history;

  beforeEach(() => {
    history = renderWithRouter(<App />).history;
  });

  it('É redirecionada para a página inicial, na URL / ao clicar no link Home', () => {
    userEvent.click(
      screen.getByRole('link', { name: 'Home' }),
    );
    expect(history.location.pathname).toBe('/');
  });

  it('É redirecionada p/ a página de About ao clicar no link About', () => {
    userEvent.click(
      screen.getByRole('link', { name: 'About' }),
    );

    expect(history.location.pathname).toBe('/about');
  });

  it('Ir p/ página de Pokémons Favoritados, ao clicar no link Favorite Pokémons', () => {
    userEvent.click(
      screen.getByRole('link', { name: 'Favorite Pokémons' }),
    );

    expect(history.location.pathname).toBe('/favorites');
  });

  it('Ir p/ página Not Found ao entrar em uma URL desconhecida', () => {
    history.push('not-exist');

    expect(
      screen.getByRole('heading', { level: 2, name: NOTFOUND_TEXT }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole(
        'img', { name: NOTFOUND_IMAGE_ALT },
      ),
    ).toHaveAttribute('src', NOTFOUND_IMAGE_SRC);
  });
});
