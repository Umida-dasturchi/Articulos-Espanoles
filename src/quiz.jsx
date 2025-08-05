import React, { useState } from "react";
import { questions as allQuestions, options } from "./questions.js";

// Перемешивание массива
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(1);
  const [shuffledQuestions, setShuffledQuestions] = useState(
    shuffleArray(allQuestions)
  );

  const questionsPerPage = 40;
  const start = (page - 1) * questionsPerPage;
  const end = page * questionsPerPage;
  const pageQuestions = shuffledQuestions.slice(start, end);

  const handleChange = (index, value) => {
    setAnswers({ ...answers, [start + index]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleNextPage = () => {
    if (page === 1) {
      // Переходим на вторую страницу
      setPage(2);
      setSubmitted(false);
    } else {
      // Конец теста – сброс
      setAnswers({});
      setSubmitted(false);
      setPage(1);
      setShuffledQuestions(shuffleArray(allQuestions));
    }
  };

  const countCorrect = (list, offset) =>
    list.reduce((count, q, i) => {
      const answer = answers[offset + i];
      return count + (answer === q.correct ? 1 : 0);
    }, 0);

  const correctThisPage = countCorrect(pageQuestions, start);
  const correctAll = countCorrect(shuffledQuestions, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto text-deepBlue">
      <h1 className="text-3xl font-bold text-deepBlue mb-6 text-center">
        Artículos Españoles quiz
      </h1>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {pageQuestions.map((q, i) => (
            <div key={q.id} className="mb-4 p-4 bg-aquaSoft rounded-2xl shadow">
              <p className="font-medium mb-2">
                {start + i + 1}. ___ {q.question}
              </p>
              <select
                className="p-2 rounded-xl border border-deepBlue focus:ring-2 focus:ring-orangeAccent outline-none bg-milkWhite text-deepBlue"
                value={answers[start + i] || ""}
                onChange={(e) => handleChange(i, e.target.value)}
              >
                <option value=""> Seleccionar </option>
                {options.map((art) => (
                  <option key={art} value={art}>
                    {art}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-orangeAccent hover:bg-yellowSoft text-milkWhite font-semibold px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Submit Page {page}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-yellowSoft p-8 rounded-2xl shadow-lg text-deepBlue text-center">
          {page === 1 ? (
            <>
              <p className="text-xl font-bold mb-6">
                Result for page 1: {correctThisPage} out of {pageQuestions.length}
              </p>
              <button
                onClick={handleNextPage}
                className="bg-deepBlue text-milkWhite hover:bg-orangeAccent px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Next Page
              </button>
            </>
          ) : (
                              <>
                                  <p className="text-xl font-bold mb-6">
                                      Result for page 2: {correctThisPage} out of {pageQuestions.length}
                                  </p>
                                  <p className="text-xl font-bold mb-6">
                                      Final Result: {correctAll} out of {shuffledQuestions.length}
              </p>
              <button
                onClick={handleNextPage}
                className="bg-deepBlue text-milkWhite hover:bg-orangeAccent px-6 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105"
              >
                Restart Test
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}