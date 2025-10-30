import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../utils/renderWithProviders';
import { PlayerAnswerView } from '../PlayerAnswerView';

describe('PlayerAnswerView', () => {
  it('renders multiple choice view', async () => {
    const onAnswer = jest.fn();
    renderWithProviders(
      <PlayerAnswerView
        questionType="multiple-choice"
        options={['A', 'B']}
        onAnswer={onAnswer}
      />
    );

    await userEvent.click(screen.getByText('A'));
    expect(onAnswer).toHaveBeenCalledWith('A');
  });

  it('renders text input view', async () => {
    const onAnswer = jest.fn();
    renderWithProviders(
      <PlayerAnswerView
        questionType="text"
        prompt="Enter your answer"
        onAnswer={onAnswer}
      />
    );

    await userEvent.type(screen.getByRole('textbox'), 'My answer');
    await userEvent.click(screen.getByText('Submit'));
    expect(onAnswer).toHaveBeenCalledWith('My answer');
  });
});
