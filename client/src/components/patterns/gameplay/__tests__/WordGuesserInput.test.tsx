import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { WordGuesserInput } from '../WordGuesserInput';

describe('WordGuesserInput', () => {
  const onGuess = jest.fn();

  beforeEach(() => {
    onGuess.mockClear();
  });

  it('renders the correct number of inputs and correct letters', () => {
    renderWithProviders(
      <WordGuesserInput
        wordLength={5}
        correctLetters={{ 1: 'P', 3: 'L' }}
        onGuess={onGuess}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBe(3); // 5 total, 2 are correct letters

    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('moves focus to the next input when a letter is typed', async () => {
    renderWithProviders(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');

    await userEvent.type(inputs[0], 'A');
    expect(inputs[1]).toHaveFocus();
  });

  it('moves focus to the previous input on backspace', async () => {
    renderWithProviders(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');

    await userEvent.type(inputs[0], 'A');
    await userEvent.type(inputs[1], 'B');

    await userEvent.clear(inputs[1]);
    await userEvent.keyboard('{backspace}');
    
    expect(inputs[0]).toHaveFocus();
  });

  it('calls onGuess with the full word on submit', async () => {
    renderWithProviders(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');
    const form = screen.getByTestId('word-guesser-form');

    await userEvent.type(inputs[0], 'C');
    await userEvent.type(inputs[1], 'A');
    await userEvent.type(inputs[2], 'T');

    form.submit();

    expect(onGuess).toHaveBeenCalledWith('CAT');
  });
});
