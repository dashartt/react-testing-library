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

describe(`Teste se o topo da aplicação contém um conjunto
 fixo de links de navegação`, () => {
  let history;

  beforeEach(() => {
    history = renderWithRouter(<App />).history;
  });

  it(`O primeiro link deve possuir o texto Home e se a aplicação é redirecionada 
  para a página inicial, na URL / ao clicar no link Home da barra de navegação`, () => {
    userEvent.click(
      screen.getByRole('link', { name: 'Home' }),
    );
    expect(history.location.pathname).toBe('/');
  });

  it(`O segundo link deve possuir o texto About e se a aplicação é redirecionada para a 
  página de About, na URL /about, ao clicar no link About da barra de navegação`, () => {
    userEvent.click(
      screen.getByRole('link', { name: 'About' }),
    );

    expect(history.location.pathname).toBe('/about');
  });

  it(`O terceiro link deve possuir o texto Favorite Pokémons e
  é redirecionada para a página de Pokémons Favoritados, na URL /favorites`, () => {
    userEvent.click(
      screen.getByRole('link', { name: 'Favorite Pokémons' }),
    );

    expect(history.location.pathname).toBe('/favorites');
  });

  it(`Teste se a aplicação é redirecionada para a página Not Found ao entrar 
  em uma URL desconhecida`, () => {
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
