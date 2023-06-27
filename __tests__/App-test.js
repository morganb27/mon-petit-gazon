import React from 'react';
import { render } from '@testing-library/react-native';
import { PlayerListScreen, PlayerDetailScreen } from '../App';


describe('PlayerListScreen', () => {
  it('renders the Search input', () => {
    const { getByPlaceholderText } = render(<PlayerListScreen />);
    expect(getByPlaceholderText('Search players...')).toBeTruthy();
  });
});


describe('PlayerDetailScreen', () => {
    it('renders the player name', () => {
      const route = {
        params: {
          playerId: '123',
          firstName: 'Lionel',
          lastName: 'Messi',
          clubId: '321',
        },
      };
      const { getByText } = render(<PlayerDetailScreen route={route} />);
      expect(getByText('Lionel Messi')).toBeTruthy();
    });
  });