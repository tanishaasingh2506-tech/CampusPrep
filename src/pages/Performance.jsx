import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/api/results`;

function Performance() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load performance data");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error loading performance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();

    const handleUpdate = () => {
      loadResults();
    };

    window.addEventListener(
      "campusprepResultsUpdated",
      handleUpdate
    );

    return () => {
      window.removeEventListener(
        "campusprepResultsUpdated",
        handleUpdate
      );
    };
  }, []);

  const statistics = useMemo(() => {
    const testsCompleted = results.length;

    const totalQuestions = results.reduce(
      (sum, result) =>
        sum + Number(result.totalQuestions || 0),
      0
    );

    const totalCorrect = results.reduce(
      (sum, result) =>
        sum + Number(result.correct || 0),
      0
    );

    const averageScore =
      testsCompleted > 0
        ? Math.round(
            results.reduce(
              (sum, result) =>
                sum + Number(result.percentage || 0),
              0
            ) / testsCompleted
          )
        : 0;

    const accuracy =
      totalQuestions > 0
        ? Math.round(
            (totalCorrect / totalQuestions) * 100
          )
        : 0;

    return {
      testsCompleted,
      totalQuestions,
      totalCorrect,
      averageScore,
      accuracy,
    };
  }, [results]);

  const subjectPerformance = useMemo(() => {
    const grouped = {};

    results.forEach((result) => {
      const subject = result.subject || "Other";

      if (!grouped[subject]) {
        grouped[subject] = {
          subject,
          tests: 0,
          totalCorrect: 0,
          totalQuestions: 0,
          percentageTotal: 0,
        };
      }

      grouped[subject].tests += 1;

      grouped[subject].totalCorrect += Number(
        result.correct || 0
      );

      grouped[subject].totalQuestions += Number(
        result.totalQuestions || 0
      );

      grouped[subject].percentageTotal += Number(
        result.percentage || 0
      );
    });

    return Object.values(grouped)
      .map((item) => ({
        ...item,
        average:
          item.tests > 0
            ? Math.round(
                item.percentageTotal / item.tests
              )
            : 0,
        accuracy:
          item.totalQuestions > 0
            ? Math.round(
                (item.totalCorrect /
                  item.totalQuestions) *
                  100
              )
            : 0,
      }))
      .sort((a, b) => b.average - a.average);
  }, [results]);

  const latestResults = useMemo(() => {
    return [...results]
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt) -
          new Date(a.date || a.createdAt)
      )
      .slice(0, 10);
  }, [results]);

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown date";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="pyq-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            PERFORMANCE ANALYTICS
          </div>

          <h1>Performance</h1>

          <p>
            Track your test results and subject-wise
            progress.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div>⏳</div>

          <h3>Loading performance...</h3>

          <p>
            Getting your results from MongoDB.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>

              <div>
                <span>Tests Completed</span>

                <strong>
                  {statistics.testsCompleted}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>

              <div>
                <span>Average Score</span>

                <strong>
                  {statistics.averageScore}%
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>

              <div>
                <span>Accuracy</span>

                <strong>
                  {statistics.accuracy}%
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>

              <div>
                <span>Questions Attempted</span>

                <strong>
                  {statistics.totalQuestions}
                </strong>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="empty-state">
              <div>📊</div>

              <h3>No performance data yet</h3>

              <p>
                Complete your first test to see your
                performance analytics here.
              </p>
            </div>
          ) : (
            <>
              <div className="question-card">
                <div className="page-label">
                  SUBJECT-WISE PERFORMANCE
                </div>

                <h2>Performance by Subject</h2>

                <div className="subject-progress-list">
                  {subjectPerformance.map(
                    (item) => (
                      <div
                        className="subject-progress"
                        key={item.subject}
                      >
                        <div className="subject-progress-header">
                          <div>
                            <strong>
                              {item.subject}
                            </strong>

                            <span>
                              {item.tests} test
                              {item.tests !== 1
                                ? "s"
                                : ""}
                            </span>
                          </div>

                          <strong>
                            {item.average}%
                          </strong>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(
                                item.average,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="subject-progress-footer">
                          <span>
                            Accuracy:{" "}
                            {item.accuracy}%
                          </span>

                          <span>
                            {item.totalCorrect}/
                            {
                              item.totalQuestions
                            } correct
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="question-card">
                <div className="page-label">
                  TEST HISTORY
                </div>

                <h2>Recent Results</h2>

                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Accuracy</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {latestResults.map(
                        (result, index) => (
                          <tr
                            key={
                              result._id || index
                            }
                          >
                            <td>
                              <strong>
                                {result.subject ||
                                  "Unknown"}
                              </strong>
                            </td>

                            <td>
                              {result.correct || 0}
                              /
                              {
                                result.totalQuestions
                              }
                            </td>

                            <td>
                              <span className="score-badge">
                                {
                                  result.percentage
                                }
                                %
                              </span>
                            </td>

                            <td>
                              {formatDate(
                                result.date ||
                                  result.createdAt
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Performance;