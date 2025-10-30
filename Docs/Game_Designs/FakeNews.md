Here is a detailed UI/UX design for FakeNews, broken down by each distinct phase of the game.
Guiding Principles for FakeNews UI
Mischievous Theme: The color palette might shift to something more playful and deceptive, like deep purples, golds, and electric blues. The typography could be a bit more stylized than QuizClash's straightforward look.
Clarity is Paramount: With multiple layers of deception, the UI must be crystal clear about what the player needs to do at each stage.
The Reveal is Everything: The design will build tension, leading to a multi-stage reveal that maximizes laughter and "I knew it!" moments.
1. STARTING State
This state is kept consistent with QuizClash to maintain a cohesive app experience.
Host View (Large Screen): A "Get Ready!" message, followed by a dramatic 3... 2... 1... countdown. The game's title, "FakeNews," is displayed with a fun, perhaps newspaper-inspired logo.
Player View (Phone): A simple "Get Ready!" screen showing the player's avatar and nickname, with the crucial instruction: "Look at the main screen for the prompt!"
2. WRITING_FAKES State
Objective: Give players a clear prompt and an easy way to secretly write their most convincing lie.
Host View (Large Screen)
This screen sets the stage and builds social pressure.
The Prompt: The question is displayed prominently with a large, clear blank space (e.g., "The original name for Google was actually ________.").
Player Status Grid: The main area of the screen shows a grid of all player avatars. As a player submits their fake answer, their avatar gets a green checkmark or a "Submitted!" banner. This creates a fun sense of urgency for those who are still writing.
Timer: A countdown timer ensures the game keeps moving.
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-host-writing.png)
Player View (Phone)
This is the player's private "lie-writing" canvas.
Prompt Reminder: The question is repeated at the top of the screen for easy reference.
Text Input: A large, clean text input field is the primary focus, with a blinking cursor prompting them to type. A character limit (e.g., 60 characters) is displayed to keep answers concise.
Submit Button: A large, clear button that says "Submit Your Fake".
After Submission: Once the player submits, the input field is replaced with a confirmation message: "Lie submitted! Now, look innocent..."
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-player-writing.png)
3. VOTING_PHASE State
Objective: Display all the lies (and the one truth) anonymously and let players vote for what they think is real.
Host View (Large Screen)
The Options: All the player-submitted fake answers and the single correct answer are displayed in a randomized, numbered list. The design is clean and uniform to give no clues away.
"Who to Believe?": A headline like "One of these is TRUE. The rest are FAKE NEWS." sets the tone.
Timer: A prominent timer rushes the players' decisions.
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-host-voting.png)
Player View (Phone)
Tappable List: The phone screen mirrors the list of answers shown on the host screen, but each one is a large, tappable button.
Disabling Self-Vote: The player's own submitted lie is greyed out and disabled, with a small label saying "Your Lie". This prevents them from voting for themselves.
After Voting: When a player taps their choice, it's highlighted, and all other options are disabled. The screen updates with: "Vote locked in! Let's see who you fooled..."
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-player-voting.png)
4. REVEALING_RESULTS State
This is the dramatic, multi-step payoff. It happens in a sequence on the host screen.
Host View (Large Screen)
Vote Tally: Small player avatars fly in and land next to the answer each person voted for. This creates the first wave of groans and laughter.
The TRUTH Reveal: All fake answers fade to grey. The one correct answer is highlighted brilliantly (e.g., in gold) with a "TRUTH!" stamp. A satisfying "ding!" sound plays.
The LIARS Reveal: Now, for each fake answer, the author's name and avatar fade in next to it. This is the biggest reveal, connecting the lies to the liars.
Points Breakdown: A final animation shows points flying to the players.
"+1000" appears for everyone who guessed the truth.
Crucially, "Fooling Points!" appear above the liars' names, showing how many people they tricked and the bonus points they earned.
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-host-revealing.png)
Player View (Phone)
This screen provides a personalized summary of their performance in the round.
Personal Outcome: A large message declares their result: "You found the TRUTH!" or "You got FOOLED!".
Fooling Score: A dedicated section shows how their lie performed: "Your lie fooled 3 players! +1500 Fooling Points". This is the most important feedback for many players.
Score Update: Their new total score and rank are clearly displayed.
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-player-results.png)
5. FINISHED State
Objective: Celebrate the winner and highlight the most interesting social outcomes of the game.
Host View (Large Screen)
Winners' Podium: The standard 1st, 2nd, and 3rd place podium is shown with celebratory confetti and music.
Special Awards (The "Interesting Statistics"): After the podium, a series of fun, full-screen awards are presented:
MASTER LIAR: Awarded to the player who fooled the most people throughout the game.
TRUTH SEEKER: Awarded to the player who guessed the correct answer most often.
MOST GULLIBLE: A humorous "award" for the player who fell for the most fake answers.
Final Leaderboard & "Play Again" Button: The final scores are shown, along with the call to action for the host.
![alt text](https://storage.googleapis.com/generativeai-assets/fakenews-host-finished.png)
Player View (Phone)
Final Rank: Shows the player's final placement and score.
Personal Awards: If the player won any of the special awards (like "Master Liar"), it is displayed prominently on their screen—a personal trophy.
Re-engagement Buttons: "Play Again" and "Back to Lobby".