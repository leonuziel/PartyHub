import React from 'react';
import { QuestionDisplay } from '../../../components/display/QuestionDisplay';

interface HostVotingViewProps {
  question: string;
  options: string[];
}

export const HostVotingView: React.FC<HostVotingViewProps> = ({ question, options }) => {
  return (
    <div className="fakenews-host-voting">
      <QuestionDisplay question={question.replace('________', '...')} />
      <h2 className="sub-header">One of these is TRUE. The rest are FAKE NEWS.</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index} className="option-item"><span>{index + 1}.</span> {option}</li>
        ))}
      </ul>
    </div>
  );
};
