import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CorrectAnswerOverlay } from '../CorrectAnswerOverlay';

const mockOptions = [
  { id: 'a1', content: 'Answer 1' },
  { id: 'a2', content: 'Answer 2' },
  { id: 'a3', content: 'Answer 3' },
];

const mockPlayers = [
  { id: 'p1', nickname: 'PlayerOne', avatar: '/avatar1.png', answerId: 'a1' },
  { id: 'p2', nickname: 'PlayerTwo', avatar: '/avatar2.png', answerId: 'a2' },
  { id: 'p3', nickname: 'PlayerThree', avatar: '/avatar3.png', answerId: 'a1' },
];

describe('CorrectAnswerOverlay', () => {
    const onComplete = jest.fn();

    beforeEach(() => {
        onComplete.mockClear();
    });

  it('highlights the correct answer', () => {
    render(
      <CorrectAnswerOverlay
        options={mockOptions}
        correctAnswerId="a1"
        players={mockPlayers}
      />
    );

    const answer1Card = screen.getByText('Answer 1').closest('.answer-card');
    const answer2Card = screen.getByText('Answer 2').closest('.answer-card');

    expect(answer1Card).toHaveClass('correct');
    expect(answer2Card).not.toHaveClass('correct');
    expect(answer2Card).toHaveClass('incorrect');
  });

  it('displays player avatars under the answer they chose', () => {
    render(
      <CorrectAnswerOverlay
        options={mockOptions}
        correctAnswerId="a1"
        players={mockPlayers}
      />
    );

    const answer1Card = screen.getByText('Answer 1').closest('.answer-card');
    const answer2Card = screen.getByText('Answer 2').closest('.answer-card');
    const answer3Card = screen.getByText('Answer 3').closest('.answer-card');

    const avatarsInCard1 = answer1Card!.querySelectorAll('.player-avatar-icon');
    const avatarsInCard2 = answer2Card!.querySelectorAll('.player-avatar-icon');
    const avatarsInCard3 = answer3Card!.querySelectorAll('.player-avatar-icon');

    expect(avatarsInCard1.length).toBe(2);
    expect(avatarsInCard2.length).toBe(1);
    expect(avatarsInCard3.length).toBe(0);
  });

  it('calls onComplete when the overlay is clicked', () => {
    render(
        <CorrectAnswerOverlay
          options={mockOptions}
          correctAnswerId="a1"
          players={mockPlayers}
          onComplete={onComplete}
        />
      );

      const overlay = screen.getByTestId('correct-answer-overlay');
      fireEvent.click(overlay);
      expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
