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

it('Teste se página contém um heading h2 com o texto Encountered pokémons', () => {
  renderWithRouter(<App />);

  const pokedexSubTitle = screen.getByRole(
    'heading', { level: 2, name: 'Encountered pokémons' },
  );

  expect(pokedexSubTitle).toBeInTheDocument();
});

describe('É exibido o próximo Pokémon quando o botão é clicado na Pokedex', () => {
  beforeEach(() => {
    renderWithRouter(<App />);
  });

  it('O botão deve conter o texto Próximo pokémon', () => {
    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
    expect(nextPokemon).toBeInTheDocument();
  });

  it('Os próximos Pokémons devem ser mostrados, um a um, ao clicar no botão', () => {
    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });

    POKEMONS.forEach((pokemon) => {
      expect(screen.getByText(pokemon));
      userEvent.click(nextPokemon);
    });
  });

  it('Quando for o último Pokémon ao clicar no botão mostrar o primeiro Pokemon', () => {
    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
    const [pikachu,,,,,,,, dragonair] = POKEMONS;

    POKEMONS.forEach((pokemon) => {
      if (pokemon !== 'Dragonair') userEvent.click(nextPokemon);
    });
    expect(screen.getByText(dragonair)).toBeInTheDocument();

    userEvent.click(nextPokemon);

    expect(screen.getByText(pikachu)).toBeInTheDocument();
  });
});

it('Teste se é mostrado apenas um Pokémon por vez', () => {
  renderWithRouter(<App />);

  const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });

  POKEMONS.forEach((pokemon) => {
    expect(screen.getByText(pokemon)).toBeInTheDocument();
    userEvent.click(nextPokemon);
  });
});

describe('Teste se a Pokédex tem os botões de filtro', () => {
  beforeEach(() => {
    renderWithRouter(<App />);
  });

  it('existir um botão de filtragem para cada tipo de Pokémon, sem repetição', () => {
    const allPokemonTypes = screen.getAllByTestId('pokemon-type-button');

    allPokemonTypes.forEach((_type, index) => {
      expect(
        screen.getAllByRole('button', { name: POKEMON_TYPES[index] }),
      ).toHaveLength(1);
    });
  });

  it('ao clicar no botão de tipo, deve mostar somente os pokémons daquele tipo', () => {
    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
    userEvent.click(screen.getByRole('button', { name: 'Electric' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Electric');

    userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Charmander');

    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Fire');
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Rapidash');
  });

  it('O texto do botão deve corresponder ao nome do tipo, ex. Psychic', () => {
    const allPokemonTypes = screen.getAllByTestId('pokemon-type-button');

    allPokemonTypes.forEach((_type, index) => {
      expect(
        screen.getByRole('button', { name: POKEMON_TYPES[index] }),
      ).toHaveTextContent(POKEMON_TYPES[index]);
    });
  });

  it('O botão All precisa estar sempre visível', () => {
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Fire' }));
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Bug' }));
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: NEXT_POKEMON }));
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });
});

describe('Teste se a Pokédex contém um botão para resetar o filtro', () => {
  it('texto do botão deve ser All', () => {
    renderWithRouter(<App />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  });

  it('Pokedéx mostra os Pokémons sem filtros quando o botão All é clicado', () => {
    renderWithRouter(<App />);

    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
    userEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByTestId(POKEMON_TYPE_ID)).toHaveTextContent('Electric');
    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_TYPE_ID)).not.toHaveTextContent('Electric');
    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_TYPE_ID)).not.toHaveTextContent('Fire');
  });

  it('Ao carregar a página, o filtro selecionado deverá ser All', () => {
    const { history } = renderWithRouter(<App />);

    history.go(0);

    const nextPokemon = screen.getByRole('button', { name: NEXT_POKEMON });
    userEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Pikachu');
    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Charmander');
    userEvent.click(nextPokemon);
    expect(screen.getByTestId(POKEMON_NAME_ID)).toHaveTextContent('Caterpie');
  });
});
