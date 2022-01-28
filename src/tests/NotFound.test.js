import React from 'react';
import { screen } from '@testing-library/react';
import renderWithRouter from '../helper/renderWithRouter';
import NotFound from '../components/NotFound';

const IMAGE_SRC = 'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif';
const IMAGE_ALT = 'Pikachu crying because the page requested was not found';

beforeEach(() => {
  renderWithRouter(<NotFound />);
});

it('Teste se página contém um heading h2 com o texto Page requested not found', () => {
  const notFoundText = screen.getByRole(
    'heading', { level: 2, name: /Page requested not found/i },
  );
  expect(notFoundText).toBeInTheDocument();
});

it('Teste se página mostra a imagem https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif', () => {
  const notFoundImage = screen.getByRole('img', { name: IMAGE_ALT });
  expect(notFoundImage).toBeInTheDocument();
  expect(notFoundImage).toHaveAttribute('src', IMAGE_SRC);
});
