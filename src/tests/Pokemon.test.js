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
    const pokemonName = screen.getByTestId('pokemon-name');
    expect(pokemonName).toHaveTextContent('Pikachu');
  });

  it('O tipo correto do pokémon deve ser mostrado na tela', () => {
    const pokemonName = screen.getByTestId('pokemon-type');
    expect(pokemonName).toHaveTextContent('Electric');
  });

  it('O peso pokémon é exibido em texto no formato <value> <measurementUnit>', () => {
    const pokemonName = screen.getByTestId('pokemon-weight');
    expect(pokemonName).toHaveTextContent(/\b6.0 kg\b/);
  });

  it('A imagem do Pokémon é exibida. Ela deve conter um atributo src alt', () => {
    const pokemonImage = screen.getByRole('img', { name: PIKACHU_SPRITE });
    expect(pokemonImage).toBeInTheDocument();
    expect(pokemonImage).toHaveAttribute('src', POKEMON_IMAGE_SRC);
  });
});

it('Card do Pokémon contém um link que exibe detalhes deste Pokémon', () => {
  renderWithRouter(<App />);

  const moreDetails = screen.getByRole('link', { name: MORE_DETAIS });
  expect(moreDetails).toHaveAttribute('href', PIKACHU_ROUTE_DETAILS);
});

it('Clicar no link é feito o Redirect para a página de detalhes de Pokémon.', () => {
  const { history } = renderWithRouter(<App />);

  let pokemonName = screen.getByRole('img', { name: PIKACHU_SPRITE });
  expect(pokemonName).toBeInTheDocument();

  userEvent.click(screen.getByRole('link', { name: MORE_DETAIS }));
  expect(history.location.pathname).toBe(PIKACHU_ROUTE_DETAILS);

  pokemonName = screen.getByRole('img', { name: PIKACHU_SPRITE });
  expect(pokemonName).toBeInTheDocument();
});

it('A URL muda para /pokemon/<id> do Pokémon cujos detalhes se deseja ver', () => {
  const { history } = renderWithRouter(<App />);

  const pokemonURL = screen.getByRole('link', { name: MORE_DETAIS });
  expect(pokemonURL).toHaveAttribute('href', PIKACHU_ROUTE_DETAILS);

  userEvent.click(screen.getByRole('link', { name: MORE_DETAIS }));
  expect(history.location.pathname).toBe(PIKACHU_ROUTE_DETAILS);
});

describe('Teste se existe um ícone de estrela nos Pokémons favoritados', () => {
  beforeEach(() => {
    renderWithRouter(<App />);
  });

  it('O fav-icon deve ter o atributo src contendo o caminho /star-icon.svg', () => {
    userEvent.click(screen.getByRole('link', { name: MORE_DETAIS }));
    userEvent.click(screen.getByRole('checkbox', { name: 'Pokémon favoritado?' }));

    const iconFav = screen.getByRole('img', { name: PIKACHU_IS_FAVORITE });
    expect(iconFav).toBeInTheDocument();
    expect(iconFav).toHaveAttribute('src', '/star-icon.svg');
  });

  it('O fav-icon deve ter o atributo alt <pokemon> is marked as favorite', () => {
    userEvent.click(screen.getByRole('link', { name: MORE_DETAIS }));

    const iconFav = screen.getByRole('img', { name: PIKACHU_IS_FAVORITE });
    expect(iconFav).toBeInTheDocument();
    expect(iconFav).toHaveAttribute('alt', PIKACHU_IS_FAVORITE);
  });
});
