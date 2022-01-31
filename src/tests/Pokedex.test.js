/*
  Como recarregar uma página usando history com history.go(0)
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
let allTypes = null;

beforeEach(() => {
  renderWithRouter(<App />);
  nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
  allTypes = screen.getByRole('button', { name: 'All' });
});

it('Teste se página contém um heading h2 com o texto Encountered pokémons', () => {
  expect(
    screen.getByRole('heading', { level: 2, name: 'Encountered pokémons' }),
  ).toBeInTheDocument();
});

describe(`Teste se é exibido o próximo Pokémon da lista quando o botão Próximo pokémon 
é clicado`, () => {
  it(`A Pokedéx deverá mostrar os Pokémons normalmente (sem filtros) quando o 
  botão All for clicado |
  Os próximos Pokémons da lista devem ser mostrados, um a um, ao clicar 
  sucessivamente no botão |
  O texto do botão deve ser All |
  Teste se é mostrado apenas um Pokémon por vez
  `, () => {
    userEvent.click(allTypes);

    POKEMONS.forEach((pokemon) => {
      expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent(pokemon);
      expect(screen.getAllByTestId(POKEMON_NAME_ID)).toHaveLength(1);
      userEvent.click(nextPokemon);
    });
  });

  it(`O primeiro Pokémon da lista deve ser mostrado ao clicar no botão, se 
  estiver no último Pokémon da lista`, () => {
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
  it(`Deve existir um botão de filtragem para cada tipo de Pokémon, 
  sem repetição`, () => {
    const allPokemonTypes = screen.getAllByTestId('pokemon-type-button');

    allPokemonTypes.forEach((_type, index) => {
      expect(
        screen.getAllByRole('button', { name: POKEMON_TYPES[index] }),
      ).toHaveLength(1);
    });
  });

  it(`A partir da seleção de um botão de tipo, a Pokédex deve circular somente pelos 
  pokémons daquele tipo | 
  O texto do botão deve corresponder ao nome do tipo, ex. Psychic |
  Ao carregar a página, o filtro selecionado deverá ser All`, () => {
    userEvent.click(screen.getByRole('button', { name: 'Electric' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Electric');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Pikachu');

    userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Charmander');

    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Rapidash');
  });
});
