import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

const QUESTIONS_API = `${API_BASE_URL}/api/questions`;
const SUBJECTS_API = `${API_BASE_URL}/api/subjects`;

const EMPTY_FORM = {
  question: "",
  subject: "",
  year: new Date().getFullYear(),
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: 0,
  difficulty: "Easy",
  important: false,
  repeated: false,
  repeatedYears: "",
};

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] =
    useState(null);

  const [subjectName, setSubjectName] =
    useState("");

  const [editingSubjectId, setEditingSubjectId] =
    useState(null);

  const [editingSubjectName, setEditingSubjectName] =
    useState("");

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] =
    useState("All Subjects");

  const [loadingQuestions, setLoadingQuestions] =
    useState(true);

  const [loadingSubjects, setLoadingSubjects] =
    useState(true);

  const [savingQuestion, setSavingQuestion] =
    useState(false);

  const [savingSubject, setSavingSubject] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true);

      const response = await fetch(
        QUESTIONS_API
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load questions"
        );
      }

      const data = await response.json();

      setQuestions(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load questions."
      );
    } finally {
      setLoadingQuestions(false);
    }
  };

  const loadSubjects = async () => {
    try {
      setLoadingSubjects(true);

      const response = await fetch(
        SUBJECTS_API
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load subjects"
        );
      }

      const data = await response.json();

      setSubjects(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load subjects."
      );
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    loadSubjects();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 3500);
  };

  const resetQuestionForm = () => {
    setForm({
      ...EMPTY_FORM,
      subject:
        subjects[0]?.name || "",
    });

    setEditingId(null);
  };

  const handleQuestionChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmitQuestion = async (
    event
  ) => {
    event.preventDefault();

    if (!form.question.trim()) {
      showError(
        "Question text is required."
      );
      return;
    }

    if (!form.subject) {
      showError(
        "Please select a subject."
      );
      return;
    }

    const options = [
      form.optionA.trim(),
      form.optionB.trim(),
      form.optionC.trim(),
      form.optionD.trim(),
    ];

    if (options.some((item) => !item)) {
      showError(
        "Please fill all four options."
      );
      return;
    }

    const repeatedYears =
      form.repeatedYears
        .split(",")
        .map((year) => year.trim())
        .filter(Boolean)
        .map(Number)
        .filter(
          (year) => !Number.isNaN(year)
        );

    const payload = {
      question: form.question.trim(),
      subject: form.subject,
      year: Number(form.year),
      options,
      correctAnswer: Number(
        form.correctAnswer
      ),
      difficulty: form.difficulty,
      important: form.important,
      repeated: form.repeated,
      repeatedYears,
      frequency: repeatedYears.length,
    };

    try {
      setSavingQuestion(true);

      const response = await fetch(
        editingId
          ? `${QUESTIONS_API}/${editingId}`
          : QUESTIONS_API,
        {
          method: editingId
            ? "PUT"
            : "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save question"
        );
      }

      await loadQuestions();

      window.dispatchEvent(
        new CustomEvent(
          "campusprepQuestionsUpdated"
        )
      );

      showMessage(
        editingId
          ? "Question updated successfully."
          : "Question added successfully."
      );

      resetQuestionForm();
    } catch (err) {
      console.error(err);

      showError(
        err.message ||
          "Unable to save question."
      );
    } finally {
      setSavingQuestion(false);
    }
  };

  const handleEditQuestion = (
    question
  ) => {
    const options =
      question.options || [];

    setForm({
      question:
        question.question || "",
      subject:
        question.subject || "",
      year:
        question.year ||
        new Date().getFullYear(),
      optionA:
        options[0] || "",
      optionB:
        options[1] || "",
      optionC:
        options[2] || "",
      optionD:
        options[3] || "",
      correctAnswer:
        question.correctAnswer ?? 0,
      difficulty:
        question.difficulty ||
        "Easy",
      important:
        Boolean(question.important),
      repeated:
        Boolean(question.repeated),
      repeatedYears:
        (
          question.repeatedYears || []
        ).join(", "),
    });

    setEditingId(
      question._id
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteQuestion =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this question permanently?"
        );

      if (!confirmed) {
        return;
      }

      try {
        const response = await fetch(
          `${QUESTIONS_API}/${id}`,
          {
            method: "DELETE",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete question"
          );
        }

        await loadQuestions();

        window.dispatchEvent(
          new CustomEvent(
            "campusprepQuestionsUpdated"
          )
        );

        showMessage(
          "Question deleted successfully."
        );

        if (editingId === id) {
          resetQuestionForm();
        }
      } catch (err) {
        console.error(err);

        showError(
          err.message ||
            "Unable to delete question."
        );
      }
    };

  const handleAddSubject = async (
    event
  ) => {
    event.preventDefault();

    const name =
      subjectName.trim();

    if (!name) {
      showError(
        "Enter a subject name."
      );
      return;
    }

    try {
      setSavingSubject(true);

      const response = await fetch(
        SUBJECTS_API,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add subject"
        );
      }

      await loadSubjects();

      setSubjectName("");

      window.dispatchEvent(
        new CustomEvent(
          "campusprepSubjectsUpdated"
        )
      );

      showMessage(
        `"${name}" subject added successfully.`
      );
    } catch (err) {
      console.error(err);

      showError(
        err.message ||
          "Unable to add subject."
      );
    } finally {
      setSavingSubject(false);
    }
  };

  const startSubjectEdit = (
    subject
  ) => {
    setEditingSubjectId(
      subject._id
    );

    setEditingSubjectName(
      subject.name
    );
  };

  const cancelSubjectEdit = () => {
    setEditingSubjectId(null);
    setEditingSubjectName("");
  };

  const saveSubjectEdit =
    async (id) => {
      const name =
        editingSubjectName.trim();

      if (!name) {
        showError(
          "Subject name cannot be empty."
        );
        return;
      }

      try {
        setSavingSubject(true);

        const response = await fetch(
          `${SUBJECTS_API}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update subject"
          );
        }

        await Promise.all([
          loadSubjects(),
          loadQuestions(),
        ]);

        window.dispatchEvent(
          new CustomEvent(
            "campusprepSubjectsUpdated"
          )
        );

        window.dispatchEvent(
          new CustomEvent(
            "campusprepQuestionsUpdated"
          )
        );

        cancelSubjectEdit();

        showMessage(
          "Subject renamed successfully."
        );
      } catch (err) {
        console.error(err);

        showError(
          err.message ||
            "Unable to rename subject."
        );
      } finally {
        setSavingSubject(false);
      }
    };

  const deleteSubject =
    async (subject) => {
      const confirmed =
        window.confirm(
          `Delete "${subject.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setSavingSubject(true);

        const response = await fetch(
          `${SUBJECTS_API}/${subject._id}`,
          {
            method: "DELETE",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete subject"
          );
        }

        await loadSubjects();

        window.dispatchEvent(
          new CustomEvent(
            "campusprepSubjectsUpdated"
          )
        );

        if (
          form.subject ===
          subject.name
        ) {
          setForm((previous) => ({
            ...previous,
            subject:
              subjects.find(
                (item) =>
                  item._id !==
                  subject._id
              )?.name || "",
          }));
        }

        showMessage(
          `"${subject.name}" deleted successfully.`
        );
      } catch (err) {
        console.error(err);

        showError(
          err.message ||
            "Unable to delete subject."
        );
      } finally {
        setSavingSubject(false);
      }
    };

  const filteredQuestions =
    useMemo(() => {
      return questions.filter(
        (question) => {
          const matchesSearch = (
            question.question || ""
          )
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

          const matchesSubject =
            subjectFilter ===
              "All Subjects" ||
            question.subject ===
              subjectFilter;

          return (
            matchesSearch &&
            matchesSubject
          );
        }
      );
    }, [
      questions,
      search,
      subjectFilter,
    ]);

  const importantCount =
    questions.filter(
      (question) =>
        question.important
    ).length;

  const repeatedCount =
    questions.filter(
      (question) =>
        question.repeated
    ).length;

  const difficultCount =
    questions.filter(
      (question) =>
        question.difficulty ===
        "Hard"
    ).length;

  return (
    <div className="pyq-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            ADMIN CONTROL
          </div>

          <h1>
            CampusPrep Admin
          </h1>

          <p>
            Manage questions and subjects
            for the entire platform.
          </p>
        </div>

        <div className="admin-header-badge">
          ADMIN
        </div>
      </div>

      {message && (
        <div className="admin-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="admin-message admin-error-message">
          ! {error}
        </div>
      )}

      {/* =================================================
          QUESTION STATS
      ================================================= */}

      <div className="admin-stats">
        <AdminStat
          icon="📚"
          label="Total Questions"
          value={questions.length}
        />

        <AdminStat
          icon="⭐"
          label="Important"
          value={importantCount}
        />

        <AdminStat
          icon="↻"
          label="Repeated"
          value={repeatedCount}
        />

        <AdminStat
          icon="🔥"
          label="Hard"
          value={difficultCount}
        />
      </div>

      {/* =================================================
          SUBJECT MANAGEMENT
      ================================================= */}

      <div className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <div className="page-label">
              SUBJECT MANAGEMENT
            </div>

            <h2>
              Manage Subjects
            </h2>
          </div>

          <span className="admin-header-badge">
            {subjects.length} Subjects
          </span>
        </div>

        <form
          className="subject-management-form"
          onSubmit={handleAddSubject}
        >
          <input
            type="text"
            value={subjectName}
            placeholder="Enter new subject name..."
            onChange={(event) =>
              setSubjectName(
                event.target.value
              )
            }
          />

          <button
            className="primary-button"
            type="submit"
            disabled={savingSubject}
          >
            {savingSubject
              ? "Saving..."
              : "＋ Add Subject"}
          </button>
        </form>

        <div className="subject-admin-list">
          {loadingSubjects ? (
            <div className="admin-loading">
              Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="admin-loading">
              No subjects found.
            </div>
          ) : (
            subjects.map(
              (subject) => (
                <div
                  className="subject-admin-item"
                  key={subject._id}
                >
                  {editingSubjectId ===
                  subject._id ? (
                    <>
                      <input
                        value={
                          editingSubjectName
                        }
                        onChange={(
                          event
                        ) =>
                          setEditingSubjectName(
                            event.target
                              .value
                          )
                        }
                        autoFocus
                      />

                      <div className="admin-row-actions">
                        <button
                          className="small-action active"
                          type="button"
                          onClick={() =>
                            saveSubjectEdit(
                              subject._id
                            )
                          }
                          disabled={
                            savingSubject
                          }
                        >
                          ✓ Save
                        </button>

                        <button
                          className="small-action"
                          type="button"
                          onClick={
                            cancelSubjectEdit
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="subject-admin-name">
                        <span className="subject-dot" />

                        <strong>
                          {subject.name}
                        </strong>
                      </div>

                      <div className="admin-row-actions">
                        <button
                          className="small-action"
                          type="button"
                          onClick={() =>
                            startSubjectEdit(
                              subject
                            )
                          }
                        >
                          ✎ Rename
                        </button>

                        <button
                          className="small-action delete-action"
                          type="button"
                          onClick={() =>
                            deleteSubject(
                              subject
                            )
                          }
                          disabled={
                            savingSubject
                          }
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            )
          )}
        </div>
      </div>

      {/* =================================================
          ADD / EDIT QUESTION
      ================================================= */}

      <div className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <div className="page-label">
              QUESTION EDITOR
            </div>

            <h2>
              {editingId
                ? "Edit Question"
                : "Add New Question"}
            </h2>
          </div>

          {editingId && (
            <button
              className="admin-cancel-btn"
              type="button"
              onClick={
                resetQuestionForm
              }
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form
          className="admin-form"
          onSubmit={
            handleSubmitQuestion
          }
        >
          <div className="admin-field admin-full">
            <label>
              Question <span>*</span>
            </label>

            <textarea
              name="question"
              value={form.question}
              placeholder="Enter the question..."
              onChange={
                handleQuestionChange
              }
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label>
                Subject <span>*</span>
              </label>

              <select
                name="subject"
                value={form.subject}
                onChange={
                  handleQuestionChange
                }
              >
                <option value="">
                  Select Subject
                </option>

                {subjects.map(
                  (subject) => (
                    <option
                      key={
                        subject._id
                      }
                      value={
                        subject.name
                      }
                    >
                      {subject.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="admin-field">
              <label>
                Year
              </label>

              <input
                type="number"
                name="year"
                value={form.year}
                onChange={
                  handleQuestionChange
                }
              />
            </div>

            <div className="admin-field">
              <label>
                Difficulty
              </label>

              <select
                name="difficulty"
                value={
                  form.difficulty
                }
                onChange={
                  handleQuestionChange
                }
              >
                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>
              </select>
            </div>
          </div>

          <div className="admin-options-title">
            OPTIONS
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label>
                Option A <span>*</span>
              </label>

              <input
                name="optionA"
                value={form.optionA}
                placeholder="Option A"
                onChange={
                  handleQuestionChange
                }
              />
            </div>

            <div className="admin-field">
              <label>
                Option B <span>*</span>
              </label>

              <input
                name="optionB"
                value={form.optionB}
                placeholder="Option B"
                onChange={
                  handleQuestionChange
                }
              />
            </div>

            <div className="admin-field">
              <label>
                Option C <span>*</span>
              </label>

              <input
                name="optionC"
                value={form.optionC}
                placeholder="Option C"
                onChange={
                  handleQuestionChange
                }
              />
            </div>

            <div className="admin-field">
              <label>
                Option D <span>*</span>
              </label>

              <input
                name="optionD"
                value={form.optionD}
                placeholder="Option D"
                onChange={
                  handleQuestionChange
                }
              />
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label>
                Correct Answer
              </label>

              <select
                name="correctAnswer"
                value={
                  form.correctAnswer
                }
                onChange={
                  handleQuestionChange
                }
              >
                <option value={0}>
                  A
                </option>

                <option value={1}>
                  B
                </option>

                <option value={2}>
                  C
                </option>

                <option value={3}>
                  D
                </option>
              </select>
            </div>

            <div className="admin-field">
              <label>
                Repeated Years
              </label>

              <input
                name="repeatedYears"
                value={
                  form.repeatedYears
                }
                placeholder="2022, 2024, 2025"
                onChange={
                  handleQuestionChange
                }
              />
            </div>
          </div>

          <div className="admin-toggle-row">
            <label className="admin-toggle">
              <input
                type="checkbox"
                name="important"
                checked={
                  form.important
                }
                onChange={
                  handleQuestionChange
                }
              />

              <span>
                ⭐ Mark as Important
              </span>
            </label>

            <label className="admin-toggle">
              <input
                type="checkbox"
                name="repeated"
                checked={
                  form.repeated
                }
                onChange={
                  handleQuestionChange
                }
              />

              <span>
                ↻ Mark as Repeated
              </span>
            </label>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={
              savingQuestion ||
              loadingSubjects ||
              subjects.length === 0
            }
          >
            {savingQuestion
              ? "Saving..."
              : editingId
              ? "Update Question"
              : "＋ Add Question"}
          </button>
        </form>
      </div>

      {/* =================================================
          QUESTION LIST
      ================================================= */}

      <div className="admin-panel">
        <div className="admin-panel-title">
          <div>
            <div className="page-label">
              QUESTION DATABASE
            </div>

            <h2>
              Manage Questions
            </h2>
          </div>

          <span className="admin-header-badge">
            {filteredQuestions.length}
          </span>
        </div>

        <div className="filter-panel admin-filter-panel">
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
            value={subjectFilter}
            onChange={(event) =>
              setSubjectFilter(
                event.target.value
              )
            }
          >
            <option value="All Subjects">
              All Subjects
            </option>

            {subjects.map(
              (subject) => (
                <option
                  key={
                    subject._id
                  }
                  value={
                    subject.name
                  }
                >
                  {subject.name}
                </option>
              )
            )}
          </select>
        </div>

        {loadingQuestions ? (
          <div className="empty-state">
            <div>⏳</div>

            <h3>
              Loading questions...
            </h3>

            <p>
              Getting questions from MongoDB.
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
              Add your first question
              above.
            </p>
          </div>
        ) : (
          <div className="admin-question-list">
            {filteredQuestions.map(
              (question, index) => (
                <div
                  className="admin-question-item"
                  key={question._id}
                >
                  <div className="admin-question-main">
                    <div className="question-number">
                      Q{index + 1}
                    </div>

                    <div>
                      <div className="admin-question-meta">
                        <span>
                          {
                            question.subject
                          }
                        </span>

                        <span>
                          {
                            question.year
                          }
                        </span>

                        <span>
                          {
                            question.difficulty
                          }
                        </span>

                        {question.important && (
                          <span>
                            ⭐
                          </span>
                        )}

                        {question.repeated && (
                          <span>
                            ↻
                          </span>
                        )}
                      </div>

                      <h3>
                        {
                          question.question
                        }
                      </h3>
                    </div>
                  </div>

                  <div className="admin-row-actions">
                    <button
                      className="small-action"
                      type="button"
                      onClick={() =>
                        handleEditQuestion(
                          question
                        )
                      }
                    >
                      ✎ Edit
                    </button>

                    <button
                      className="small-action delete-action"
                      type="button"
                      onClick={() =>
                        handleDeleteQuestion(
                          question._id
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default Admin;