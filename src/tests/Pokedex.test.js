/*
  Como recarregar uma página usando history
  Source Link: https://stackoverflow.com/questions/46820682/how-do-i-reload-a-page-with-react-router#:~:text=If%20you%20are%20needing%20an,)%20(it%20wraps%20the%20History.
*/

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

const POKEMONS = [
  'Pikachu', 'Charmander', 'Caterpie', 'Ekans', 'Alakazam',
  'Mew', 'Rapidash', 'Snorlax', 'Dragonair',
];

const POKEMON_TYPES = [
  'Electric', 'Fire', 'Bug', 'Poison',
  'Psychic', 'Normal', 'Dragon',
];

const POKEMON_TYPE_ID = 'pokemon-type';
const POKEMON_NAME_ID = 'pokemon-name';
const NEXT_POKEMON = 'Próximo pokémon';

let nextPokemon = null;

beforeEach(() => {
  renderWithRouter(<App />);
  nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
});

it('Teste se página contém um heading h2 com o texto Encountered pokémons', () => {
  expect(
    screen.getByRole('heading', { level: 2, name: 'Encountered pokémons' }),
  ).toBeInTheDocument();
});

describe('É exibido o próximo Pokémon quando o botão é clicado na Pokedex', () => {
  it('Pokedéx mostra os Pokémons sem filtros quando o botão All é clicado', () => {
    userEvent.click(
      screen.getByRole('button', { name: 'All' }),
    );

    POKEMONS.forEach((pokemon) => {
      expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent(pokemon);
      userEvent.click(nextPokemon);
    });
  });

  it('Quando for o último Pokémon ao clicar no botão mostrar o primeiro Pokemon', () => {
    const [pikachu,,,,,,,, dragonair] = POKEMONS;

    POKEMONS.forEach((pokemon) => {
      if (pokemon !== 'Dragonair') userEvent.click(nextPokemon);
    });
    expect(screen.getByText(dragonair)).toBeInTheDocument();

    userEvent.click(nextPokemon);

    expect(screen.getByText(pikachu)).toBeInTheDocument();
  });
});

describe('Teste se a Pokédex tem os botões de filtro', () => {
  it('existir um botão de filtragem para cada tipo de Pokémon, sem repetição', () => {
    const allPokemonTypes = screen.getAllByTestId('pokemon-type-button');

    allPokemonTypes.forEach((_type, index) => {
      expect(
        screen.getAllByRole('button', { name: POKEMON_TYPES[index] }),
      ).toHaveLength(1);
    });
  });

  it('ao clicar no botão de tipo, deve mostar somente os pokémons daquele tipo', () => {
    userEvent.click(screen.getByRole('button', { name: 'Electric' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Electric');

    userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Charmander');

    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Rapidash');
  });
});
