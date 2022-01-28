import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helper/renderWithRouter';
import App from '../App';

describe('Topo da aplicação contém um conjunto fixo de links de navegação', () => {
  test('O primeiro link deve possuir o texto Home', () => {
    renderWithRouter(<App />);

    const homeLink = screen.getByRole('link', { name: /Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('O segundo link deve possuir o texto About', () => {
    renderWithRouter(<App />);

    const aboutLink = screen.getByRole('link', { name: /About/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  test('O terceiro link deve possuir o texto Favorite Pokémons', () => {
    renderWithRouter(<App />);

    const favoriteLink = screen.getByRole('link', { name: /Favorite Pokémons/i });
    expect(favoriteLink).toBeInTheDocument();
    expect(favoriteLink).toHaveAttribute('href', '/favorites');
  });
});

describe('Redirecionamente ocorre como esperado ao clicar nos links do topo', () => {
  it('É redirecionada para a página inicial, na URL / ao clicar no link Home', () => {
    const { history: { location: { pathname } } } = renderWithRouter(<App />);

    const homeLink = screen.getByRole('link', { name: /Home/i });
    userEvent.click(homeLink);

    expect(pathname).toBe('/');
  });
  it('É redirecionada p/ a página de About na URL /about ao clicar no link About',
    () => {
      const { history } = renderWithRouter(<App />);

      const aboutLink = screen.getByRole('link', { name: /About/i });
      userEvent.click(aboutLink);

      expect(history.location.pathname).toBe('/about');
    });

  it('Ir p/ página de Pokémons Favoritados, ao clicar no link Favorite Pokémons', () => {
    const { history } = renderWithRouter(<App />);

    const favoriteLink = screen.getByRole('link', { name: /Favorite Pokémons/i });
    userEvent.click(favoriteLink);

    expect(history.location.pathname).toBe('/favorites');
  });

  it('Ir p/ página Not Found ao entrar em uma URL desconhecida', () => {
    const { history } = renderWithRouter(<App />);
    history.push('not-exist');

    const notFoundText = screen.getByRole(
      'heading', { level: 2, name: /Page requested not found/i },
    );
    expect(notFoundText).toBeInTheDocument();

    const notFoundImage = screen.getByRole(
      'img',
      { name: /Pikachu crying because the page requested was not found/i },
    );
    expect(notFoundImage).toBeInTheDocument();
    expect(notFoundImage).toHaveAttribute(
      'src',
      'https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif',
    );
  });
});
