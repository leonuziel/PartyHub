import React, { useState } from 'react';
import './SubmissionReel.css';

interface Submission {
  id: string;
  author?: string;
  content: string; // Can be text or image URL
  type: 'text' | 'image';
}

interface SubmissionReelProps {
  submissions: Submission[];
  showAuthor: boolean;
}

export const SubmissionReel: React.FC<SubmissionReelProps> = ({ submissions, showAuthor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirst = currentIndex === 0;
    const newIndex = isFirst ? submissions.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLast = currentIndex === submissions.length - 1;
    const newIndex = isLast ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!submissions || submissions.length === 0) {
    return <div className="submission-reel-empty">No submissions yet.</div>;
  }

  const currentSubmission = submissions[currentIndex];

  return (
    <div className="submission-reel">
      <div className="submission-card">
        {currentSubmission.type === 'image' ? (
          <img src={currentSubmission.content} alt={`Submission by ${currentSubmission.author || 'anonymous'}`} />
        ) : (
          <p>{currentSubmission.content}</p>
        )}
        {showAuthor && currentSubmission.author && (
          <span className="author-tag">by {currentSubmission.author}</span>
        )}
      </div>
      <div className="navigation-controls">
        <button onClick={goToPrevious} disabled={submissions.length <= 1}>‹ Prev</button>
        <span>{currentIndex + 1} / {submissions.length}</span>
        <button onClick={goToNext} disabled={submissions.length <= 1}>Next ›</button>
      </div>
    </div>
  );
};
