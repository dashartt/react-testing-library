/*
  Como achar palavra específica usando Regex
  Source Link: https://stackoverflow.com/questions/3524993/regular-expression-that-checks-for-2-specific-words
*/

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

const POKEMON_IMAGE_SRC = 'https://cdn2.bulbagarden.net/upload/b/b2/Spr_5b_025_m.png';
const PIKACHU_IS_FAVORITE = 'Pikachu is marked as favorite';
const PIKACHU_SPRITE = 'Pikachu sprite';
const MORE_DETAIS = 'More details';
const PIKACHU_ROUTE_DETAILS = '/pokemons/25';

describe(`Teste se é renderizado um card com as informações de determinado 
pokémon.`, () => {
  beforeEach(() => {
    renderWithRouter(<App />);
  });

  it('O nome correto do Pokémon deve ser mostrado na tela', () => {
    expect(
      screen.getByTestId('pokemon-name'),
    ).toHaveTextContent('Pikachu');
  });

  it('O tipo correto do pokémon deve ser mostrado na tela', () => {
    expect(
      screen.getByTestId('pokemon-type'),
    ).toHaveTextContent('Electric');
  });

  it(`O peso médio do pokémon deve ser exibido com um texto no formato 
  Average weight: <value> <measurementUnit>`, () => {
    expect(
      screen.getByTestId('pokemon-weight'),
    ).toHaveTextContent(/\b6.0 kg\b/);
  });

  it(`A imagem do Pokémon deve ser exibida. Ela deve conter um atributo src com a 
  URL da imagem e um atributo alt com o texto <name> sprite`, () => {
    expect(
      screen.getByRole('img', { name: PIKACHU_SPRITE }),
    ).toHaveAttribute('src', POKEMON_IMAGE_SRC);
  });
});

describe(`Teste se o card do Pokémon, o redirecionamento e
 se foi para a página correta contendo detalhes do pokémon`, () => {
  let history = null;
  let moreDetailsPikachu = null;

  beforeEach(() => {
    history = renderWithRouter(<App />).history;
    moreDetailsPikachu = screen.getByRole('link', { name: MORE_DETAIS });
  });

  it(`Teste se o card do Pokémon indicado na Pokédex contém um link de navegação 
  para exibir detalhes deste Pokémon. O link deve possuir a URL /pokemons/<id>`, () => {
    expect(moreDetailsPikachu).toHaveAttribute('href', PIKACHU_ROUTE_DETAILS);
  });

  it(`Teste se ao clicar no link de navegação do Pokémon, é feito o redirecionamento 
  da aplicação para a página de detalhes de Pokémon`, () => {
    userEvent.click(moreDetailsPikachu);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Pikachu Details' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: PIKACHU_SPRITE }),
    ).toBeInTheDocument();
  });

  it('Teste também se a URL exibida no navegador muda para /pokemon/<id>', () => {
    userEvent.click(moreDetailsPikachu);
    expect(history.location.pathname).toBe(PIKACHU_ROUTE_DETAILS);
  });
});

describe('Teste se existe um ícone de estrela nos Pokémons favoritados', () => {
  let moreDetailsPikachu = null;

  beforeEach(() => {
    renderWithRouter(<App />);
    moreDetailsPikachu = screen.getByRole('link', { name: MORE_DETAIS });
  });

  it(`O ícone deve ser uma imagem com o atributo src contendo o 
  caminho /star-icon.svg
  A imagem deve ter o atributo alt igual a <pokemon> is marked as favorite`, () => {
    userEvent.click(moreDetailsPikachu);
    userEvent.click(
      screen.getByRole('checkbox', { name: 'Pokémon favoritado?' }),
    );

    expect(
      screen.getByRole('img', { name: PIKACHU_IS_FAVORITE }),
    ).toHaveAttribute('src', '/star-icon.svg');
  });
});
