import { useState, useEffect } from 'react';
import { setDailyAnswer, listenForDailyAnswers } from '../chat';

const QUESTIONS = [
  "What's your favorite memory of us?",
  "What made you smile today?",
  "If we could teleport anywhere right now, where?",
  "What song reminds you of me?",
  "What's one thing you love about us?",
  "Describe our perfect day together.",
  "What do you miss most when we're apart?",
  "What's the funniest thing that happened to us?",
  "If we had a theme song, what would it be?",
  "What are you most excited about for our future?",
  "What's the sweetest thing I've ever done for you?",
  "If we could learn something together, what?",
  "What was your first impression of me?",
  "What small moment with me do you treasure?",
  "If we wrote a book about us, what would the title be?",
  "What's your favorite photo of us and why?",
  "What do you think makes us work so well?",
  "What's one adventure you still want us to have?",
  "What did you dream about last night?",
  "What's a secret only you and I know?",
  "If today was our last day, what would we do?",
  "What's the best advice you've ever given me?",
  "What makes you feel most loved?",
  "What's one word that describes how you feel right now?",
  "What would our dream house look like?",
  "What's something new you want to try together?",
  "What made you fall for me?",
  "What's the most romantic thing we've done?",
  "If we could relive one day, which one?",
  "What are you grateful for about us today?",
  "What inside joke always makes you laugh?",
];

function getTodaysQuestion() {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return QUESTIONS[dayOfYear % QUESTIONS.length];
}

export default function DailyQuestion({ userId, otherName }) {
  const [answers, setAnswers] = useState({});
  const [myAnswer, setMyAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const question = getTodaysQuestion();

  useEffect(() => {
    const unsub = listenForDailyAnswers((data) => {
      setAnswers(data);
      const todayData = data[today];
      if (todayData && todayData[userId]) {
        setMyAnswer(todayData[userId].answer);
        setSubmitted(true);
      } else {
        setSubmitted(false);
      }
    });
    return unsub;
  }, [today, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!myAnswer.trim()) return;
    setDailyAnswer(userId, question, myAnswer.trim());
    setSubmitted(true);
  };

  const todayData = answers[today] || {};
  const otherEntry = Object.entries(todayData).find(([key]) => key !== userId);

  return (
    <section className="card glass-card dailyq-section">
      <h3 className="card-title">💭 Daily Question</h3>
      <p className="dailyq-question">{question}</p>

      {!submitted ? (
        <form className="dailyq-form" onSubmit={handleSubmit}>
          <textarea
            className="dailyq-input"
            placeholder="Your answer..."
            value={myAnswer}
            onChange={(e) => setMyAnswer(e.target.value)}
            maxLength={500}
            rows={3}
          />
          <button className="dailyq-btn" type="submit" disabled={!myAnswer.trim()}>
            Share answer
          </button>
        </form>
      ) : (
        <div className="dailyq-answers">
          <div className="dailyq-answer-card mine">
            <span className="dailyq-who">You</span>
            <p className="dailyq-text">{myAnswer}</p>
          </div>
          {otherEntry ? (
            <div className="dailyq-answer-card theirs">
              <span className="dailyq-who">{otherName}</span>
              <p className="dailyq-text">{otherEntry[1].answer}</p>
            </div>
          ) : (
            <p className="dailyq-waiting">{otherName} hasn't answered yet...</p>
          )}
        </div>
      )}
    </section>
  );
}
