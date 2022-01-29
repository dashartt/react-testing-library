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

describe('Renderiza um card com as informações de determinado pokémon', () => {
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

  it('O peso pokémon é exibido em texto no formato <value> <measurementUnit>', () => {
    expect(
      screen.getByTestId('pokemon-weight'),
    ).toHaveTextContent(/\b6.0 kg\b/);
  });

  it('A imagem do Pokémon é exibida. Ela deve conter um atributo src alt', () => {
    expect(
      screen.getByRole('img', { name: PIKACHU_SPRITE }),
    ).toHaveAttribute('src', POKEMON_IMAGE_SRC);
  });
});

describe('Verifica o link de mais detalhes e a URL contida nele', () => {
  let history = null;
  let moreDetailsPikachu = null;

  beforeEach(() => {
    history = renderWithRouter(<App />).history;
    moreDetailsPikachu = screen.getByRole('link', { name: MORE_DETAIS });
  });

  it('Card do Pokémon contém um link que exibe detalhes deste Pokémon', () => {
    expect(moreDetailsPikachu).toHaveAttribute('href', PIKACHU_ROUTE_DETAILS);
  });

  it('Clicar no link é feito o Redirect para a página de detalhes de Pokémon.', () => {
    userEvent.click(moreDetailsPikachu);

    expect(
      screen.getByRole('img', { name: PIKACHU_SPRITE }),
    ).toBeInTheDocument();
  });

  it('A URL muda para /pokemon/<id> do Pokémon cujos detalhes se deseja ver', () => {
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

  it('O fav-icon deve ter o atributo src contendo o caminho /star-icon.svg', () => {
    userEvent.click(moreDetailsPikachu);
    userEvent.click(
      screen.getByRole('checkbox', { name: 'Pokémon favoritado?' }),
    );

    expect(
      screen.getByRole('img', { name: PIKACHU_IS_FAVORITE }),
    ).toHaveAttribute('src', '/star-icon.svg');
  });
});
