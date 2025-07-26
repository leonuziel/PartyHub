import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WordGuesserInput } from '../WordGuesserInput';

describe('WordGuesserInput', () => {
  const onGuess = jest.fn();

  beforeEach(() => {
    onGuess.mockClear();
  });

  it('renders the correct number of inputs and correct letters', () => {
    render(
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

  it('moves focus to the next input when a letter is typed', () => {
    render(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    expect(inputs[1]).toHaveFocus();
  });

  it('moves focus to the previous input on backspace', () => {
    render(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');
    
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    fireEvent.change(inputs[1], { target: { value: 'B' } });
    
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });
    // Since the input now has a value, backspace just deletes it.
    fireEvent.change(inputs[1], { target: { value: '' } });
    // Now that it's empty, backspace should move focus.
    fireEvent.keyDown(inputs[1], { key: 'Backspace' });

    expect(inputs[0]).toHaveFocus();
  });

  it('calls onGuess with the full word on submit', () => {
    render(<WordGuesserInput wordLength={3} correctLetters={{}} onGuess={onGuess} />);
    const inputs = screen.getAllByRole('textbox');
    const form = screen.getByTestId('word-guesser-form');
    
    fireEvent.change(inputs[0], { target: { value: 'C' } });
    fireEvent.change(inputs[1], { target: { value: 'A' } });
    fireEvent.change(inputs[2], { target: { value: 'T' } });
    
    fireEvent.submit(form);
    
    expect(onGuess).toHaveBeenCalledWith('CAT');
  });
});
