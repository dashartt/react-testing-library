/*
  Especificando o getByLabelText
  Source Link: https://testing-library.com/docs/queries/bylabeltext/
*/

import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

const POKEMON_DETAILS_URL = '/pokemons/25';
const PIKACHU_LOCATION = 'Pikachu location';
const FAVORITE_CHECKBOX_LABEL = 'Pokémon favoritado?';
const LOCATIONS_IMAGE_SRC = [
  'https://cdn2.bulbagarden.net/upload/0/08/Kanto_Route_2_Map.png',
  'https://cdn2.bulbagarden.net/upload/b/bd/Kanto_Celadon_City_Map.png',
];

beforeEach(() => {
  const { history } = renderWithRouter(<App />);
  history.push(POKEMON_DETAILS_URL);
});

describe(`Teste se as informações detalhadas do Pokémon selecionado são 
mostradas na tela`, () => {
  it('A página deve conter um texto <name> Details', () => {
    const pokemonDetails = screen.getByRole(
      'heading', { level: 2, name: 'Pikachu Details' },
    );
    expect(pokemonDetails).toBeInTheDocument();
  });

  it(`Não deve existir o link de navegação para os detalhes do Pokémon 
  selecionado`, () => {
    const moreDetails = screen.queryByRole('link', { name: 'More details' });
    expect(moreDetails).not.toBeInTheDocument();
  });

  it('A seção de detalhes deve conter um heading h2 com o texto Summary', () => {
    const summaryText = screen.getByRole('heading', { level: 2, name: 'Summary' });
    expect(summaryText).toBeInTheDocument();
  });

  it(`A seção de detalhes deve conter um parágrafo com o resumo do Pokémon
   específico sendo visualizado`, () => {
    const resumeText = screen.getByText(
      'This intelligent Pokémon roasts hard berries '
        .concat('with electricity to make them tender enough to eat.'),
    );
    expect(resumeText).toBeInTheDocument();
  });
});

describe(`Teste se existe na página uma seção com os mapas contendo
 as localizações do pokémon`, () => {
  let allImagesLocation = null;

  beforeEach(() => {
    allImagesLocation = screen.getAllByRole('img', { name: PIKACHU_LOCATION });
  });

  it(`Na seção de detalhes deverá existir um heading h2 com o texto 
  Game Locations of <name>`, () => {
    const locationsPokemon = screen.getByRole(
      'heading', { level: 2, name: 'Game Locations of Pikachu' },
    );
    expect(locationsPokemon).toBeInTheDocument();
  });

  it(`Devem ser exibidos, o nome da localização e uma imagem do mapa em cada 
  localização deve ter um atributo src com a URL da localização e
  um atributo alt com o texto <name> location`, () => {
    expect(screen.getByText('Kanto Viridian Forest')).toBeInTheDocument();
    expect(screen.getByText('Kanto Power Plant')).toBeInTheDocument();
    expect(allImagesLocation).toHaveLength(2);
    expect(allImagesLocation[0]).toHaveAttribute('src', LOCATIONS_IMAGE_SRC[0]);
    expect(allImagesLocation[1]).toHaveAttribute('src', LOCATIONS_IMAGE_SRC[1]);
  });
});

describe(`Teste se o usuário pode favoritar um pokémon através da
 página de detalhes`, () => {
  let favoriteOption = null;

  beforeEach(() => {
    favoriteOption = screen.getByRole(
      'checkbox', { name: FAVORITE_CHECKBOX_LABEL },
    );
  });

  it(`A página deve exibir um checkbox que permite favoritar o Pokémon |
  Cliques alternados no checkbox devem adicionar e remover respectivamente
   o Pokémon da lista de favoritos`, () => {
    userEvent.click(favoriteOption);
    expect(
      screen.getByRole('img', { name: 'Pikachu is marked as favorite' }),
    ).toBeInTheDocument();

    userEvent.click(favoriteOption);
    expect(
      screen.queryByRole('img', { name: 'Pikachu is marked as favorite' }),
    ).not.toBeInTheDocument();
  });

  it('O label do checkbox deve conter o texto Pokémon favoritado?', () => {
    expect(
      screen.getByLabelText(FAVORITE_CHECKBOX_LABEL, { selector: 'input' }),
    ).toBeInTheDocument();
  });
});
