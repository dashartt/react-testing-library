/*
  Como colocar texto em variavel e depois usar como Regex
  Source Link: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/RegExp
*/

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

it('Teste se a página contém as informações sobre a Pokédex', () => {
  const aboutTitle = screen.getByRole(
    'heading',
    { level: 2, name: /About Pokédex/i },
  );
  const paragraphOne = screen.getByText(RegExp(PARAGRAPHS[0], 'i'));
  const paragraphTwo = screen.getByText(RegExp(PARAGRAPHS[0], 'i'));
  const imgPokedex = screen.getByRole('img', { name: /Pokédex/i });
  expect(aboutTitle).toBeInTheDocument();
  expect(paragraphOne).toBeInTheDocument();
  expect(paragraphTwo).toBeInTheDocument();
  expect(imgPokedex).toBeInTheDocument();
});

it('Teste se a página contém um heading h2 com o texto About Pokédex', () => {
  const aboutTitle = screen.getByRole(
    'heading',
    { level: 2, name: /About Pokédex/i },
  );
  expect(aboutTitle).toBeInTheDocument();
});

it('Teste se a página contém dois parágrafos com texto sobre a Pokédex', () => {
  const paragraphOne = screen.getByText(RegExp(PARAGRAPHS[0], 'i'));
  expect(paragraphOne).toBeInTheDocument();

  const paragraphTwo = screen.getByText(RegExp(PARAGRAPHS[1], 'i'));
  expect(paragraphTwo).toBeInTheDocument();
  console.log(paragraphTwo);
});

it('Teste se a página contém a seguinte imagem de uma Pokédex: https://cdn2.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png', () => {
  const imgPokedex = screen.getByRole('img', { name: /Pokédex/i });
  expect(imgPokedex).toBeInTheDocument();
  expect(imgPokedex).toHaveAttribute('src', IMAGE_POKEDEX);
});
