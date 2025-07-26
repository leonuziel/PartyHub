import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SubmissionReel } from '../SubmissionReel';

const mockSubmissions = [
  { id: 's1', author: 'PlayerOne', content: 'This is submission 1.', type: 'text' as const },
  { id: 's2', author: 'PlayerTwo', content: '/image.png', type: 'image' as const },
  { id: 's3', author: 'PlayerThree', content: 'This is submission 3.', type: 'text' as const },
];

describe('SubmissionReel', () => {
  it('renders the first submission by default', () => {
    render(<SubmissionReel submissions={mockSubmissions} showAuthor={false} />);
    expect(screen.getByText('This is submission 1.')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('navigates to the next and previous submissions', () => {
    render(<SubmissionReel submissions={mockSubmissions} showAuthor={false} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /prev/i });

    // Go to next
    fireEvent.click(nextButton);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/image.png');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();

    // Go to next again
    fireEvent.click(nextButton);
    expect(screen.getByText('This is submission 3.')).toBeInTheDocument();
    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    // Go to previous
    fireEvent.click(prevButton);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/image.png');
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('wraps around when navigating', () => {
    render(<SubmissionReel submissions={mockSubmissions} showAuthor={false} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    const prevButton = screen.getByRole('button', { name: /prev/i });

    // Go to previous from the first item
    fireEvent.click(prevButton);
    expect(screen.getByText('This is submission 3.')).toBeInTheDocument();
    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    // Go to next from the last item
    fireEvent.click(nextButton);
    expect(screen.getByText('This is submission 1.')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('shows author when showAuthor is true', () => {
    render(<SubmissionReel submissions={mockSubmissions} showAuthor={true} />);
    expect(screen.getByText('by PlayerOne')).toBeInTheDocument();
  });

  it('hides author when showAuthor is false', () => {
    render(<SubmissionReel submissions={mockSubmissions} showAuthor={false} />);
    expect(screen.queryByText('by PlayerOne')).not.toBeInTheDocument();
  });

  it('renders an empty state message if there are no submissions', () => {
    render(<SubmissionReel submissions={[]} showAuthor={false} />);
    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('disables navigation buttons if there is only one submission', () => {
    render(<SubmissionReel submissions={[mockSubmissions[0]]} showAuthor={false} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });
});
