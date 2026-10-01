import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

const QUESTIONS_API = `${API_BASE_URL}/api/questions`;
const SUBJECTS_API = `${API_BASE_URL}/api/subjects`;

function RepeatedQuestions() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [subject, setSubject] =
    useState("All Subjects");

  const loadData = async () => {
    try {
      setLoading(true);

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
    } catch (error) {
      console.error(
        "Error loading repeated questions:",
        error
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

  const repeatedQuestions = useMemo(() => {
    return questions
      .filter(
        (question) =>
          question.repeated
      )
      .sort(
        (a, b) =>
          Number(
            b.frequency || 0
          ) -
          Number(
            a.frequency || 0
          )
      );
  }, [questions]);

  const filteredQuestions =
    repeatedQuestions.filter(
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

        return (
          matchesSearch &&
          matchesSubject
        );
      }
    );

  const totalRepeated =
    repeatedQuestions.length;

  const highFrequency =
    repeatedQuestions.filter(
      (question) =>
        Number(
          question.frequency || 0
        ) >= 3
    ).length;

  const importantQuestions =
    repeatedQuestions.filter(
      (question) =>
        question.important
    ).length;

  const subjectCounts =
    useMemo(() => {
      return subjects.map(
        (item) => {
          const count =
            repeatedQuestions.filter(
              (question) =>
                question.subject ===
                item.name
            ).length;

          return {
            name: item.name,
            count,
          };
        }
      );
    }, [
      subjects,
      repeatedQuestions,
    ]);

  return (
    <div className="pyq-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            EXAM ANALYSIS
          </div>

          <h1>
            Repeated Questions
          </h1>

          <p>
            Focus on questions that
            appear again and again.
          </p>
        </div>

        <div className="pyq-count">
          {filteredQuestions.length} Questions
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            ↻
          </div>

          <div>
            <span>
              Total Repeated
            </span>

            <strong>
              {totalRepeated}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🔥
          </div>

          <div>
            <span>
              High Frequency
            </span>

            <strong>
              {highFrequency}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            ⭐
          </div>

          <div>
            <span>
              Important
            </span>

            <strong>
              {importantQuestions}
            </strong>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <div className="page-label">
              SUBJECT BREAKDOWN
            </div>

            <h2>
              Repeated Questions by Subject
            </h2>
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="mini-empty">
            <div>📚</div>

            <strong>
              No subjects available
            </strong>

            <span>
              Add subjects from the Admin panel.
            </span>
          </div>
        ) : (
          <div className="subject-grid">
            <button
              type="button"
              className={
                subject ===
                "All Subjects"
                  ? "subject-card selected"
                  : "subject-card"
              }
              onClick={() =>
                setSubject(
                  "All Subjects"
                )
              }
            >
              <strong>
                All Subjects
              </strong>

              <span>
                {totalRepeated} repeated
                questions
              </span>
            </button>

            {subjectCounts.map(
              (item) => (
                <button
                  type="button"
                  key={item.name}
                  className={
                    subject ===
                    item.name
                      ? "subject-card selected"
                      : "subject-card"
                  }
                  onClick={() =>
                    setSubject(
                      item.name
                    )
                  }
                >
                  <strong>
                    {item.name}
                  </strong>

                  <span>
                    {item.count} repeated
                    {item.count === 1
                      ? " question"
                      : " questions"}
                  </span>
                </button>
              )
            )}
          </div>
        )}
      </div>

      <div className="filter-panel">
        <input
          type="text"
          placeholder="🔎 Search repeated questions..."
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
      </div>

      {loading ? (
        <div className="empty-state">
          <div>⏳</div>

          <h3>
            Loading analysis...
          </h3>

          <p>
            Getting repeated-question
            data from MongoDB.
          </p>
        </div>
      ) : filteredQuestions.length ===
        0 ? (
        <div className="empty-state">
          <div>📊</div>

          <h3>
            No repeated questions found
          </h3>

          <p>
            Mark questions as repeated
            from the Admin panel.
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
                    #{index + 1}
                  </div>

                  <div className="question-meta">
                    <span>
                      {question.subject}
                    </span>

                    <span>
                      {question.year}
                    </span>

                    <span className="repeated-badge">
                      ↻ Repeated{" "}
                      {
                        question.frequency ||
                        0
                      }×
                    </span>

                    {question.important && (
                      <span className="important-text">
                        ⭐ Important
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
                    <span>
                      Asked in:
                    </span>

                    <span>
                      {(
                        question.repeatedYears ||
                        []
                      ).length > 0
                        ? question.repeatedYears.join(
                            " • "
                          )
                        : question.year}
                    </span>
                  </div>

                  <div className="question-actions">
                    <span className="small-action active">
                      Appeared{" "}
                      {
                        question.frequency ||
                        0
                      }×
                    </span>
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

export default RepeatedQuestions;