"use client";

import { useState, type CSSProperties } from "react";
import { L, useLang } from "../../components/LanguageProvider";
import { useSavedQuestions } from "../../lib/store";
import type { QuizQuestion } from "./data";

const QUESTIONS_PER_ROUND = 5;

const SCORE_CELEBRATIONS: Record<number, { icon: string; emojis: string[] }> = {
  5: { icon: "🏆", emojis: ["🎉", "🥳", "🏆", "🎊", "✨"] },
  4: { icon: "🎉", emojis: ["🎉", "👏", "🤩", "🎊", "✨"] },
  3: { icon: "😄", emojis: ["🎉", "😄", "👍", "🌟", "✨"] },
  2: { icon: "🙂", emojis: ["👍", "🙂", "💪", "📖", "✨"] },
  1: { icon: "💪", emojis: ["💪", "💡", "📖", "🔥", "✨"] },
  0: { icon: "😅", emojis: ["😅", "📚", "💡", "💪", "👀"] },
};

// Posisi arah letupan emoji dari tengah ke segala penjuru
const BURST_PARTICLES = [
  { tx: "-180px", ty: "-110px", rot: "-25deg", delay: "0s" },
  { tx: "-120px", ty: "-155px", rot: "18deg", delay: "0.04s" },
  { tx: "-40px", ty: "-170px", rot: "-12deg", delay: "0.08s" },
  { tx: "50px", ty: "-165px", rot: "22deg", delay: "0.02s" },
  { tx: "130px", ty: "-145px", rot: "-18deg", delay: "0.06s" },
  { tx: "190px", ty: "-95px", rot: "28deg", delay: "0.1s" },
  { tx: "210px", ty: "-10px", rot: "-15deg", delay: "0.03s" },
  { tx: "180px", ty: "85px", rot: "20deg", delay: "0.07s" },
  { tx: "110px", ty: "130px", rot: "-22deg", delay: "0.05s" },
  { tx: "20px", ty: "140px", rot: "14deg", delay: "0.09s" },
  { tx: "-85px", ty: "130px", rot: "-16deg", delay: "0.04s" },
  { tx: "-170px", ty: "80px", rot: "24deg", delay: "0.08s" },
  { tx: "-210px", ty: "-15px", rot: "-20deg", delay: "0.02s" },
  { tx: "0px", ty: "-115px", rot: "10deg", delay: "0.12s" },
];

export default function Kuis() {
  const { lang } = useLang();
  const savedQuestions = useSavedQuestions();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [started, setStarted] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);

  const questions = started ? quizQuestions : savedQuestions;

  const copy = (idText: string, enText: string) =>
    lang === "id" ? idText : enText;

  const startQuiz = () => {
    const shuffledQuestions = [...savedQuestions].sort(
      () => Math.random() - 0.5,
    );
    setQuizQuestions(shuffledQuestions.slice(0, QUESTIONS_PER_ROUND));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setStarted(true);
  };

  const pickAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[index].answer) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (selected === null) return;
    setIndex(index + 1);
    setSelected(null);
  };

  const finished = started && index >= questions.length;
  const question = started && !finished ? questions[index] : null;
  const celebration =
    SCORE_CELEBRATIONS[Math.min(5, Math.max(0, score))] ?? SCORE_CELEBRATIONS[0];

  return (
    <section id="quiz" className="page active">
      <div className="section-inner quiz-section">
        <h2 className="page-title">
          <L
            id="Seberapa Kenal Kamu dengan Batagor?"
            en="How Well Do You Know Batagor?"
          />
        </h2>
        <p className="section-intro">
          <L
            id="Jawab 5 pertanyaan singkat tentang Batagor dan lihat skormu."
            en="Answer 5 quick questions about Batagor and see your score."
          />
        </p>

        <div className="quiz-panel card">
          {!started && (
            <div id="quizIntro" className="quiz-state">
              <span className="quiz-mark" aria-hidden="true">
                ?
              </span>
              <h3>
                <L
                  id="Siap menguji pengetahuanmu?"
                  en="Ready to test your knowledge?"
                />
              </h3>
              <p>
                <L
                  id="Kuis ini terdiri dari 5 soal pilihan ganda acak. Semoga berhasil!"
                  en="This quiz has 5 random multiple-choice questions. Good luck!"
                />
              </p>
              <button className="btn btn-primary" type="button" onClick={startQuiz}>
                <L id="Mulai test" en="Start test" />
              </button>
            </div>
          )}

          {question && (
            <div id="quizQuestion" className="quiz-state" aria-live="polite">
              <div className="quiz-progress-row">
                <span>
                  {copy("Pertanyaan ", "Question ")}
                  {index + 1} / {questions.length}
                </span>
                <span>
                  {copy("Skor: ", "Score: ")}
                  {score}
                </span>
              </div>
              <div className="quiz-progress-track">
                <span
                  style={{
                    width: `${((index + 1) / questions.length) * 100}%`,
                  }}
                ></span>
              </div>
              <h3 id="quizQuestionText">{question.question[lang]}</h3>

              <div className="quiz-options">
                {question.options.map((option, optionIndex) => {
                  let status = "";
                  if (selected !== null) {
                    if (optionIndex === question.answer) status = " correct";
                    if (
                      optionIndex === selected &&
                      optionIndex !== question.answer
                    )
                      status = " incorrect";
                  }
                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      className={`quiz-option${status}`}
                      aria-pressed={selected === optionIndex}
                      disabled={selected !== null}
                      onClick={() => pickAnswer(optionIndex)}
                    >
                      {option[lang]}
                    </button>
                  );
                })}
              </div>

              <p
                className={`quiz-feedback${
                  selected !== null
                    ? selected === question.answer
                      ? " is-correct"
                      : " is-incorrect"
                    : ""
                }`}
                role="status"
              >
                {selected === null
                  ? ""
                  : selected === question.answer
                    ? copy(
                        "Benar! Jawabanmu tepat.",
                        "Correct! That is the right answer.",
                      )
                    : copy(
                        "Belum tepat. Jawaban yang benar sudah ditandai.",
                        "Not quite. The correct answer is highlighted.",
                      )}
              </p>

              {selected !== null && (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={nextQuestion}
                >
                  {index === questions.length - 1
                    ? copy("Lihat Hasil", "See Results")
                    : copy("Pertanyaan Berikutnya", "Next Question")}
                </button>
              )}
            </div>
          )}

          {finished && (
            <div id="quizResult" className="quiz-state quiz-result-wrap" aria-live="polite">
              <div className="emoji-burst" aria-hidden="true">
                {BURST_PARTICLES.map((p, i) => (
                  <span
                    key={i}
                    className="emoji-particle"
                    style={
                      {
                        "--tx": p.tx,
                        "--ty": p.ty,
                        "--rot": p.rot,
                        "--delay": p.delay,
                      } as CSSProperties
                    }
                  >
                    {celebration.emojis[i % celebration.emojis.length]}
                  </span>
                ))}
              </div>

              <span className="quiz-mark quiz-result-mark quiz-result-pop" aria-hidden="true">
                {celebration.icon}
              </span>
              <p className="quiz-result-label">
                <L id="Skor Akhir" en="Final Score" />
              </p>
              <h3 id="quizFinalScore">
                {score} / {questions.length}
              </h3>
              <p>
                {score >= 4
                  ? copy(
                      "Pengetahuanmu tentang Batagor mantap!",
                      "You really know your Batagor!",
                    )
                  : score >= 2
                    ? copy(
                        "Bagus! Masih ada hal menarik untuk dipelajari.",
                        "Nice work! There is still more to discover.",
                      )
                    : copy(
                        "Yuk, jelajahi lagi website ini lalu coba sekali lagi.",
                        "Explore the website and give it another try.",
                      )}
              </p>
              <button className="btn btn-primary" type="button" onClick={startQuiz}>
                <L id="Main Lagi" en="Play Again" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}