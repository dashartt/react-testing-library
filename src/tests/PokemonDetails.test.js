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

beforeEach(() => {
  const { history } = renderWithRouter(<App />);
  history.push(POKEMON_DETAILS_URL);
});

describe('As informações detalhadas do Pokémon selecionado são mostradas na tela', () => {
  it('A página deve conter um texto <name> Details', () => {
    const pokemonDetails = screen.getByRole(
      'heading', { level: 2, name: 'Pikachu Details' },
    );
    expect(pokemonDetails).toBeInTheDocument();
  });

  it('Não deve existir o link de navegação para os detalhes do Pokémon', () => {
    const moreDetails = screen.queryByRole('link', { name: 'More details' });
    expect(moreDetails).not.toBeInTheDocument();
  });

  it('A seção de detalhes deve conter um heading h2 com o texto Summary', () => {
    const summaryText = screen.getByRole('heading', { level: 2, name: 'Summary' });
    expect(summaryText).toBeInTheDocument();
  });

  it('Conter um parágrafo com o resumo do Pokémon específico sendo visualizado', () => {
    const resumeText = screen.getByText(
      'This intelligent Pokémon roasts hard berries '
        .concat('with electricity to make them tender enough to eat.'),
    );
    expect(resumeText).toBeInTheDocument();
  });
});

describe('Existe uma seção com os mapas contendo as localizações do pokémon', () => {
  let allImagesLocation = null;

  beforeEach(() => {
    allImagesLocation = screen.getAllByRole('img', { name: PIKACHU_LOCATION });
  });

  it('Na seção de detalhes existir um h2 com o texto Game Locations of <name>', () => {
    const locationsPokemon = screen.getByRole(
      'heading', { level: 2, name: 'Game Locations of Pikachu' },
    );
    expect(locationsPokemon).toBeInTheDocument();
  });

  it('Exibidos, o nome da localização e uma imagem do mapa em cada localização', () => {
    expect(screen.getByText('Kanto Viridian Forest')).toBeInTheDocument();
    expect(screen.getByText('Kanto Power Plant')).toBeInTheDocument();
    expect(allImagesLocation).toHaveLength(2);
    expect(allImagesLocation[0]).toHaveAttribute('src', 'https://cdn2.bulbagarden.net/upload/0/08/Kanto_Route_2_Map.png');
    expect(allImagesLocation[1]).toHaveAttribute('src', 'https://cdn2.bulbagarden.net/upload/b/bd/Kanto_Celadon_City_Map.png');
  });
});

describe('O usuário pode favoritar um pokémon através da página de detalhes', () => {
  let favoriteOption = null;

  beforeEach(() => {
    favoriteOption = screen.getByRole(
      'checkbox', { name: FAVORITE_CHECKBOX_LABEL },
    );
  });

  it('A página deve exibir um checkbox que permite favoritar o Pokémon', () => {
    expect(favoriteOption).toBeInTheDocument();
  });

  it('Alternar o checkbox deve adicionar e remover o Pokémon como favorito', () => {
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
