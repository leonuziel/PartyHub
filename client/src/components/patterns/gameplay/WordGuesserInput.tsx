import React, { useState, useRef } from 'react';
import './WordGuesserInput.css';

interface WordGuesserInputProps {
  wordLength: number;
  correctLetters: { [index: number]: string };
  onGuess: (guess: string) => void;
}

export const WordGuesserInput: React.FC<WordGuesserInputProps> = ({ wordLength, correctLetters, onGuess }) => {
  const [guess, setGuess] = useState(Array(wordLength).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newGuess = [...guess];
    newGuess[index] = e.target.value.slice(-1).toUpperCase();
    setGuess(newGuess);

    // Move to next input
    if (e.target.value && index < wordLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !guess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuess(guess.join(''));
  };

  return (
    <form className="word-guesser-form" onSubmit={handleSubmit} data-testid="word-guesser-form">
      <div className="word-inputs">
        {Array.from({ length: wordLength }).map((_, index) => (
          <div key={index} className="letter-container">
            {correctLetters[index] ? (
              <span className="correct-letter">{correctLetters[index]}</span>
            ) : (
              <input
                ref={el => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={guess[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="guess-input"
              />
            )}
          </div>
        ))}
      </div>
      <button type="submit" className="guess-submit-btn">Guess</button>
    </form>
  );
};
