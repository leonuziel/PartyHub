import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VotingGrid } from '../VotingGrid';

const mockOptions = [
  { id: 'opt1', content: 'Option 1', type: 'text' as const },
  { id: 'opt2', content: '/image2.png', type: 'image' as const },
];

describe('VotingGrid', () => {
  const onVote = jest.fn();

  beforeEach(() => {
    onVote.mockClear();
  });

  it('renders the options correctly', () => {
    render(<VotingGrid options={mockOptions} onVote={onVote} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('calls onVote with the correct option ID when an option is clicked', () => {
    render(<VotingGrid options={mockOptions} onVote={onVote} />);
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    expect(onVote).toHaveBeenCalledWith('opt1');
    expect(onVote).toHaveBeenCalledTimes(1);
  });

  it('disables the grid and shows a "Voted" indicator after a vote is cast', () => {
    render(<VotingGrid options={mockOptions} onVote={onVote} />);
    const option1Card = screen.getByText('Option 1').closest('.vote-option-card');
    const option2Card = screen.getByRole('img').closest('.vote-option-card');

    fireEvent.click(option1Card!);
    
    // Check for visual feedback
    expect(option1Card).toHaveClass('selected-vote');
    expect(screen.getByText('Voted')).toBeInTheDocument();
    
    // All options should now be visually disabled
    expect(option1Card).toHaveClass('voted');
    expect(option2Card).toHaveClass('voted');

    // Try to vote again
    fireEvent.click(option2Card!);
    expect(onVote).toHaveBeenCalledTimes(1); // Should not have been called again
  });

  it('does not allow voting if disabled prop is true', () => {
    render(<VotingGrid options={mockOptions} onVote={onVote} disabled={true} />);
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    expect(onVote).not.toHaveBeenCalled();
  });
});
