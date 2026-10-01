import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

const QUESTIONS_API = `${API_BASE_URL}/api/questions`;
const SUBJECTS_API = `${API_BASE_URL}/api/subjects`;

function PYQLibrary() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] =
    useState("All Subjects");
  const [year, setYear] =
    useState("All Years");
  const [loading, setLoading] =
    useState(true);

  const loadQuestions = async () => {
    try {
      const response =
        await fetch(QUESTIONS_API);

      if (!response.ok) {
        throw new Error(
          "Failed to load questions"
        );
      }

      const data =
        await response.json();

      setQuestions(data);
    } catch (error) {
      console.error(
        "Error loading questions:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response =
        await fetch(SUBJECTS_API);

      if (!response.ok) {
        throw new Error(
          "Failed to load subjects"
        );
      }

      const data =
        await response.json();

      setSubjects(data);
    } catch (error) {
      console.error(
        "Error loading subjects:",
        error
      );
    }
  };

  useEffect(() => {
    loadQuestions();
    loadSubjects();

    const refresh = () => {
      loadQuestions();
      loadSubjects();
    };

    window.addEventListener(
      "campusprepQuestionsUpdated",
      refresh
    );

    window.addEventListener(
      "campusprepSubjectsUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "campusprepQuestionsUpdated",
        refresh
      );

      window.removeEventListener(
        "campusprepSubjectsUpdated",
        refresh
      );
    };
  }, []);

  const toggleImportant = async (
    question
  ) => {
    try {
      const response =
        await fetch(
          `${QUESTIONS_API}/${question._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              important:
                !question.important,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update question"
        );
      }

      const updatedQuestion =
        await response.json();

      setQuestions((previous) =>
        previous.map((item) =>
          item._id ===
          updatedQuestion._id
            ? updatedQuestion
            : item
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "campusprepQuestionsUpdated"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSolved = async (
    question
  ) => {
    try {
      const response =
        await fetch(
          `${QUESTIONS_API}/${question._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              solved:
                !question.solved,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to update solved status"
        );
      }

      const updatedQuestion =
        await response.json();

      setQuestions((previous) =>
        previous.map((item) =>
          item._id ===
          updatedQuestion._id
            ? updatedQuestion
            : item
        )
      );

      window.dispatchEvent(
        new CustomEvent(
          "campusprepSolvedUpdated"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const years = [
    "All Years",
    ...new Set(
      questions
        .map(
          (question) =>
            question.year
        )
        .filter(Boolean)
        .sort(
          (a, b) => b - a
        )
        .map(String)
    ),
  ];

  const filteredQuestions =
    questions.filter(
      (question) => {
        const matchesSearch = (
          question.question || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

        const matchesSubject =
          subject ===
            "All Subjects" ||
          question.subject ===
            subject;

        const matchesYear =
          year === "All Years" ||
          String(
            question.year
          ) === year;

        return (
          matchesSearch &&
          matchesSubject &&
          matchesYear
        );
      }
    );

  return (
    <div className="pyq-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            QUESTION LIBRARY
          </div>

          <h1>
            PYQ Library
          </h1>

          <p>
            Search and practice previous
            year questions.
          </p>
        </div>

        <div className="pyq-count">
          {filteredQuestions.length} Questions
        </div>
      </div>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="🔎 Search questions..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <select
          value={subject}
          onChange={(event) =>
            setSubject(
              event.target.value
            )
          }
        >
          <option value="All Subjects">
            All Subjects
          </option>

          {subjects.map(
            (item) => (
              <option
                key={item._id}
                value={item.name}
              >
                {item.name}
              </option>
            )
          )}
        </select>

        <select
          value={year}
          onChange={(event) =>
            setYear(
              event.target.value
            )
          }
        >
          {years.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="empty-state">
          <div>⏳</div>

          <h3>
            Loading questions...
          </h3>

          <p>
            Getting questions from
            MongoDB.
          </p>
        </div>
      ) : filteredQuestions.length ===
        0 ? (
        <div className="empty-state">
          <div>📚</div>

          <h3>
            No questions found
          </h3>

          <p>
            Add questions from Admin
            or change your filters.
          </p>
        </div>
      ) : (
        <div className="pyq-list">
          {filteredQuestions.map(
            (question, index) => (
              <div
                className="question-card"
                key={question._id}
              >
                <div className="question-top">
                  <div className="question-number">
                    Q{index + 1}
                  </div>

                  <div className="question-meta">
                    <span>
                      {question.subject}
                    </span>

                    <span>
                      {question.year}
                    </span>

                    <span
                      className={`difficulty ${
                        (
                          question.difficulty ||
                          "Easy"
                        ).toLowerCase()
                      }`}
                    >
                      {question.difficulty ||
                        "Easy"}
                    </span>

                    {question.repeated && (
                      <span className="repeated-badge">
                        ↻ Repeated
                      </span>
                    )}
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
                    {question.repeated && (
                      <span>
                        Repeated{" "}
                        {
                          question.frequency ||
                          0
                        }
                        ×
                      </span>
                    )}

                    {question.important && (
                      <span className="important-text">
                        ⭐ Important
                      </span>
                    )}
                  </div>

                  <div className="question-actions">
                    <button
                      className={
                        question.important
                          ? "small-action active"
                          : "small-action"
                      }
                      onClick={() =>
                        toggleImportant(
                          question
                        )
                      }
                    >
                      {question.important
                        ? "★ Important"
                        : "☆ Important"}
                    </button>

                    <button
                      className={
                        question.solved
                          ? "small-action solved"
                          : "small-action"
                      }
                      onClick={() =>
                        toggleSolved(
                          question
                        )
                      }
                    >
                      {question.solved
                        ? "✓ Solved"
                        : "Mark Solved"}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default PYQLibrary;