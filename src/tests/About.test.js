import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from '../helper/renderWithRouter';
import About from '../components/About';

const PARAGRAPHS = [
  'This application simulates a Pokédex, a digital encyclopedia containing all Pokémons',
  'One can filter Pokémons by type, and see more details for each one of them',
];

const IMAGE_POKEDEX = 'https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png';

beforeEach(() => {
  renderWithRouter(<About />);
});

it('Teste se a página contém um heading h2 com o texto About Pokédex', () => {
  expect(
    screen.getByRole('heading', { level: 2, name: 'About Pokédex' }),
  ).toBeInTheDocument();
});

it('Teste se a página contém dois parágrafos com texto sobre a Pokédex', () => {
  expect(
    screen.getByText(PARAGRAPHS[0]),
  ).toBeInTheDocument();

  expect(
    screen.getByText(PARAGRAPHS[1]),
  ).toBeInTheDocument();
});

it(`Teste se a página contém a seguinte imagem de uma Pokédex: 
https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png`, () => {
  expect(
    screen.getByRole('img', { name: 'Pokédex' }),
  ).toHaveAttribute('src', IMAGE_POKEDEX);
});
