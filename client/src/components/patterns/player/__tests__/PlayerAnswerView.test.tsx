import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayerAnswerView } from '../PlayerAnswerView';

describe('PlayerAnswerView', () => {
  it('renders multiple choice view', () => {
    const onAnswer = jest.fn();
    render(
      <PlayerAnswerView
        questionType="multiple-choice"
        options={['A', 'B']}
        onAnswer={onAnswer}
      />
    );

    fireEvent.click(screen.getByText('A'));
    expect(onAnswer).toHaveBeenCalledWith('A');
  });

  it('renders text input view', () => {
    const onAnswer = jest.fn();
    render(
      <PlayerAnswerView
        questionType="text"
        prompt="Enter your answer"
        onAnswer={onAnswer}
      />
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'My answer' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(onAnswer).toHaveBeenCalledWith('My answer');
  });
});
