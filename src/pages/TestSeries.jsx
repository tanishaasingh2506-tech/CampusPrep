import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const QUESTIONS_API = `${API_BASE_URL}/api/questions`;
const RESULTS_API = `${API_BASE_URL}/api/results`;
const SUBJECTS_API = `${API_BASE_URL}/api/subjects`;

const QUESTIONS_PER_TEST = 5;
const SECONDS_PER_QUESTION = 30;

function TestSeries() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [testQuestions, setTestQuestions] =
    useState([]);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(
    SECONDS_PER_QUESTION
  );

  const [testStarted, setTestStarted] =
    useState(false);

  const [testFinished, setTestFinished] =
    useState(false);

  const [result, setResult] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        questionsResponse,
        subjectsResponse,
      ] = await Promise.all([
        fetch(QUESTIONS_API),
        fetch(SUBJECTS_API),
      ]);

      if (!questionsResponse.ok) {
        throw new Error(
          "Failed to load questions"
        );
      }

      if (!subjectsResponse.ok) {
        throw new Error(
          "Failed to load subjects"
        );
      }

      const questionsData =
        await questionsResponse.json();

      const subjectsData =
        await subjectsResponse.json();

      setQuestions(questionsData);
      setSubjects(subjectsData);

      if (
        !selectedSubject &&
        subjectsData.length > 0
      ) {
        setSelectedSubject(
          subjectsData[0].name
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load test data from MongoDB."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const refresh = () => {
      loadData();
    };

    window.addEventListener(
      "campusprepSubjectsUpdated",
      refresh
    );

    window.addEventListener(
      "campusprepQuestionsUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "campusprepSubjectsUpdated",
        refresh
      );

      window.removeEventListener(
        "campusprepQuestionsUpdated",
        refresh
      );
    };
  }, []);

  useEffect(() => {
    if (
      !testStarted ||
      testFinished
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(
        (previous) =>
          previous - 1
      );
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    timeLeft,
    testStarted,
    testFinished,
  ]);

  const shuffleArray = (array) => {
    const copied = [...array];

    for (
      let i = copied.length - 1;
      i > 0;
      i--
    ) {
      const j =
        Math.floor(
          Math.random() *
            (i + 1)
        );

      [
        copied[i],
        copied[j],
      ] = [
        copied[j],
        copied[i],
      ];
    }

    return copied;
  };

  const startTest = () => {
    setError("");

    const subjectQuestions =
      questions.filter(
        (question) =>
          question.subject ===
          selectedSubject
      );

    if (
      subjectQuestions.length === 0
    ) {
      setError(
        "No questions are available for this subject."
      );
      return;
    }

    const selectedQuestions =
      shuffleArray(
        subjectQuestions
      ).slice(
        0,
        Math.min(
          QUESTIONS_PER_TEST,
          subjectQuestions.length
        )
      );

    setTestQuestions(
      selectedQuestions
    );

    setAnswers({});
    setCurrentQuestion(0);

    setTimeLeft(
      SECONDS_PER_QUESTION
    );

    setResult(null);
    setTestFinished(false);
    setTestStarted(true);
  };

  const handleAnswer = (
    optionIndex
  ) => {
    setAnswers(
      (previous) => ({
        ...previous,
        [currentQuestion]:
          optionIndex,
      })
    );
  };

  const calculateResult =
    async () => {
      let correct = 0;

      testQuestions.forEach(
        (question, index) => {
          const selectedAnswer =
            answers[index];

          if (
            selectedAnswer !==
              undefined &&
            Number(
              selectedAnswer
            ) ===
              Number(
                question.correctAnswer
              )
          ) {
            correct += 1;
          }
        }
      );

      const totalQuestions =
        testQuestions.length;

      const percentage =
        totalQuestions > 0
          ? Math.round(
              (correct /
                totalQuestions) *
                100
            )
          : 0;

      const resultData = {
        subject:
          selectedSubject,
        correct,
        totalQuestions,
        percentage,
        date:
          new Date().toISOString(),
      };

      try {
        const response =
          await fetch(
            RESULTS_API,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                resultData
              ),
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to save result"
          );
        }

        const savedResult =
          await response.json();

        setResult({
          ...savedResult,
          ...resultData,
        });

        window.dispatchEvent(
          new CustomEvent(
            "campusprepResultsUpdated"
          )
        );
      } catch (err) {
        console.error(err);

        setResult(resultData);

        setError(
          "Test completed, but the result could not be saved to MongoDB."
        );
      }

      setTestFinished(true);
      setTestStarted(false);
    };

  const handleNext = () => {
    if (
      currentQuestion <
      testQuestions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setTimeLeft(
        SECONDS_PER_QUESTION
      );
    } else {
      calculateResult();
    }
  };

  const restartTest = () => {
    setTestQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(
      SECONDS_PER_QUESTION
    );
    setTestStarted(false);
    setTestFinished(false);
    setResult(null);
    setError("");
  };

  const selectedSubjectQuestionCount =
    questions.filter(
      (question) =>
        question.subject ===
        selectedSubject
    ).length;

  const current =
    testQuestions[currentQuestion];

  if (
    testFinished &&
    result
  ) {
    return (
      <div className="pyq-page">
        <div className="page-header">
          <div>
            <div className="page-label">
              TEST RESULT
            </div>

            <h1>
              Test Completed 🎉
            </h1>

            <p>
              Here's your performance for{" "}
              {result.subject}.
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              🏆
            </div>

            <div>
              <span>Score</span>

              <strong>
                {result.correct}/
                {
                  result.totalQuestions
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📊
            </div>

            <div>
              <span>Percentage</span>

              <strong>
                {result.percentage}%
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              📚
            </div>

            <div>
              <span>Subject</span>

              <strong>
                {result.subject}
              </strong>
            </div>
          </div>
        </div>

        {error && (
          <div className="admin-message">
            {error}
          </div>
        )}

        <div className="question-card">
          <div className="page-label">
            ANSWER REVIEW
          </div>

          <h2>
            Question-wise Analysis
          </h2>

          <div className="pyq-list">
            {testQuestions.map(
              (
                question,
                index
              ) => {
                const selectedAnswer =
                  answers[index];

                const isCorrect =
                  Number(
                    selectedAnswer
                  ) ===
                  Number(
                    question.correctAnswer
                  );

                return (
                  <div
                    className="question-card"
                    key={
                      question._id ||
                      index
                    }
                  >
                    <div className="question-top">
                      <div className="question-number">
                        Q{index + 1}
                      </div>

                      <div className="question-meta">
                        <span
                          style={{
                            color:
                              isCorrect
                                ? "#79d4a5"
                                : "#f38c8c",
                          }}
                        >
                          {isCorrect
                            ? "✓ Correct"
                            : "✗ Incorrect"}
                        </span>
                      </div>
                    </div>

                    <h3>
                      {question.question}
                    </h3>

                    <div className="options-preview">
                      {(
                        question.options ||
                        []
                      ).map(
                        (
                          option,
                          optionIndex
                        ) => (
                          <div
                            key={
                              optionIndex
                            }
                          >
                            <span>
                              {String.fromCharCode(
                                65 +
                                  optionIndex
                              )}
                            </span>

                            {option}
                          </div>
                        )
                      )}
                    </div>

                    <div className="question-footer">
                      <div className="question-info">
                        <span>
                          Your answer:{" "}
                          {selectedAnswer !==
                          undefined
                            ? String.fromCharCode(
                                65 +
                                  Number(
                                    selectedAnswer
                                  )
                              )
                            : "Not answered"}
                        </span>

                        <span>
                          Correct answer:{" "}
                          {String.fromCharCode(
                            65 +
                              Number(
                                question.correctAnswer
                              )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="quick-actions">
          <button
            className="primary-button"
            onClick={
              restartTest
            }
          >
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  if (
    testStarted &&
    current
  ) {
    const selectedAnswer =
      answers[currentQuestion];

    return (
      <div className="pyq-page">
        <div className="page-header">
          <div>
            <div className="page-label">
              TEST IN PROGRESS
            </div>

            <h1>
              {selectedSubject} Test
            </h1>

            <p>
              Question{" "}
              {currentQuestion +
                1}{" "}
              of{" "}
              {
                testQuestions.length
              }
            </p>
          </div>

          <div className="pyq-count">
            ⏱ {timeLeft}s
          </div>
        </div>

        <div className="question-card">
          <div className="question-top">
            <div className="question-number">
              Q
              {currentQuestion +
                1}
            </div>

            <div className="question-meta">
              <span>
                {current.subject}
              </span>

              <span>
                {current.year}
              </span>

              <span>
                {current.difficulty ||
                  "Easy"}
              </span>
            </div>
          </div>

          <h2>
            {current.question}
          </h2>

          <div className="options-preview">
            {(
              current.options || []
            ).map(
              (
                option,
                index
              ) => (
                <button
                  key={index}
                  type="button"
                  className={
                    selectedAnswer ===
                    index
                      ? "option-button selected"
                      : "option-button"
                  }
                  onClick={() =>
                    handleAnswer(
                      index
                    )
                  }
                >
                  <span>
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  {option}
                </button>
              )
            )}
          </div>

          <div className="question-footer">
            <div className="question-info">
              <span>
                {selectedAnswer !==
                undefined
                  ? "Answer selected"
                  : "Select one option"}
              </span>
            </div>

            <div className="question-actions">
              <button
                className="primary-button"
                onClick={
                  handleNext
                }
              >
                {currentQuestion ===
                testQuestions.length -
                  1
                  ? "Finish Test"
                  : "Next Question →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pyq-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            PRACTICE TESTS
          </div>

          <h1>
            Test Series
          </h1>

          <p>
            Choose any available subject
            and challenge yourself.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            📝
          </div>

          <div>
            <span>
              Questions per Test
            </span>

            <strong>
              {QUESTIONS_PER_TEST}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ⏱
          </div>

          <div>
            <span>
              Time per Question
            </span>

            <strong>
              {SECONDS_PER_QUESTION}s
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            📚
          </div>

          <div>
            <span>
              Available Subjects
            </span>

            <strong>
              {subjects.length}
            </strong>
          </div>
        </div>
      </div>

      <div className="question-card">
        <div className="page-label">
          CHOOSE SUBJECT
        </div>

        <h2>
          Select your challenge
        </h2>

        <p>
          Subjects are controlled by the
          CampusPrep Admin panel.
        </p>

        {loading ? (
          <div className="empty-state">
            <div>⏳</div>

            <h3>
              Loading subjects...
            </h3>

            <p>
              Getting subjects and
              questions from MongoDB.
            </p>
          </div>
        ) : subjects.length ===
          0 ? (
          <div className="empty-state">
            <div>📚</div>

            <h3>
              No subjects available
            </h3>

            <p>
              Add a subject from the
              Admin panel first.
            </p>
          </div>
        ) : (
          <>
            <div className="subject-grid">
              {subjects.map(
                (subject) => {
                  const count =
                    questions.filter(
                      (question) =>
                        question.subject ===
                        subject.name
                    ).length;

                  return (
                    <button
                      key={
                        subject._id
                      }
                      type="button"
                      className={
                        selectedSubject ===
                        subject.name
                          ? "subject-card selected"
                          : "subject-card"
                      }
                      onClick={() =>
                        setSelectedSubject(
                          subject.name
                        )
                      }
                    >
                      <strong>
                        {subject.name}
                      </strong>

                      <span>
                        {count} questions
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            {selectedSubject && (
              <div className="test-ready-card">
                <div>
                  <span>
                    SELECTED SUBJECT
                  </span>

                  <strong>
                    {selectedSubject}
                  </strong>
                </div>

                <div>
                  <span>
                    AVAILABLE
                  </span>

                  <strong>
                    {
                      selectedSubjectQuestionCount
                    }{" "}
                    Questions
                  </strong>
                </div>
              </div>
            )}

            {error && (
              <div className="admin-message">
                {error}
              </div>
            )}

            <div className="quick-actions">
              <button
                className="primary-button"
                disabled={
                  !selectedSubject ||
                  selectedSubjectQuestionCount ===
                    0
                }
                onClick={
                  startTest
                }
              >
                Start Test →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TestSeries;