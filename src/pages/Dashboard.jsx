import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

import PYQLibrary from "./PYQLibrary";
import RepeatedQuestions from "./RepeatedQuestions";
import TestSeries from "./TestSeries";
import Performance from "./Performance";
import Admin from "./Admin";

const QUESTIONS_API = `${API_BASE_URL}/api/questions`;
const RESULTS_API = `${API_BASE_URL}/api/results`;
const SUBJECTS_API = `${API_BASE_URL}/api/subjects`;

function Dashboard({ userRole, onLogout }) {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const isAdmin = userRole === "admin";

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        questionsResponse,
        resultsResponse,
        subjectsResponse,
      ] = await Promise.all([
        fetch(QUESTIONS_API),
        fetch(RESULTS_API),
        fetch(SUBJECTS_API),
      ]);

      if (
        !questionsResponse.ok ||
        !resultsResponse.ok ||
        !subjectsResponse.ok
      ) {
        throw new Error(
          "Failed to load dashboard data"
        );
      }

      const questionsData =
        await questionsResponse.json();

      const resultsData =
        await resultsResponse.json();

      const subjectsData =
        await subjectsResponse.json();

      setQuestions(questionsData);
      setResults(resultsData);
      setSubjects(subjectsData);
    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    const refreshDashboard = () => {
      loadDashboardData();
    };

    window.addEventListener(
      "campusprepQuestionsUpdated",
      refreshDashboard
    );

    window.addEventListener(
      "campusprepResultsUpdated",
      refreshDashboard
    );

    window.addEventListener(
      "campusprepSolvedUpdated",
      refreshDashboard
    );

    window.addEventListener(
      "campusprepSubjectsUpdated",
      refreshDashboard
    );

    return () => {
      window.removeEventListener(
        "campusprepQuestionsUpdated",
        refreshDashboard
      );

      window.removeEventListener(
        "campusprepResultsUpdated",
        refreshDashboard
      );

      window.removeEventListener(
        "campusprepSolvedUpdated",
        refreshDashboard
      );

      window.removeEventListener(
        "campusprepSubjectsUpdated",
        refreshDashboard
      );
    };
  }, []);

  const handleNavigation = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    onLogout();
  };

  return (
    <div className="app-shell">
      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileMenuOpen
            ? "mobile-open"
            : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="brand-logo">
            CP
          </div>

          <div>
            <h2>CampusPrep</h2>

            <span>
              Academic Platform
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">
            MAIN
          </div>

          <NavItem
            icon="⌂"
            label="Dashboard"
            active={
              activePage === "Dashboard"
            }
            onClick={() =>
              handleNavigation("Dashboard")
            }
          />

          <NavItem
            icon="▤"
            label="PYQ Library"
            active={
              activePage ===
              "PYQ Library"
            }
            onClick={() =>
              handleNavigation(
                "PYQ Library"
              )
            }
          />

          <NavItem
            icon="↻"
            label="Repeated Questions"
            active={
              activePage ===
              "Repeated Questions"
            }
            onClick={() =>
              handleNavigation(
                "Repeated Questions"
              )
            }
          />

          <NavItem
            icon="▶"
            label="Test Series"
            active={
              activePage ===
              "Test Series"
            }
            onClick={() =>
              handleNavigation(
                "Test Series"
              )
            }
          />

          <NavItem
            icon="◈"
            label="Performance"
            active={
              activePage ===
              "Performance"
            }
            onClick={() =>
              handleNavigation(
                "Performance"
              )
            }
          />

          <div className="nav-section-title">
            ACCOUNT
          </div>

          <NavItem
            icon="◎"
            label="Profile"
            active={
              activePage === "Profile"
            }
            onClick={() =>
              handleNavigation(
                "Profile"
              )
            }
          />

          {isAdmin && (
            <NavItem
              icon="⚙"
              label="Admin"
              active={
                activePage === "Admin"
              }
              onClick={() =>
                handleNavigation(
                  "Admin"
                )
              }
            />
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="student-mini-profile">
            <div className="profile-avatar">
              {isAdmin
                ? "AD"
                : "TS"}
            </div>

            <div>
              <strong>
                {isAdmin
                  ? "Administrator"
                  : "Tanisha Singh"}
              </strong>

              <span>
                {isAdmin
                  ? "CampusPrep Admin"
                  : "B.Sc. IT • Sem V"}
              </span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
        />
      )}

      {/* MAIN CONTENT */}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
          >
            ☰
          </button>

          <div className="topbar-title">
            <span className="topbar-breadcrumb">
              CampusPrep
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <strong>
              {activePage}
            </strong>
          </div>

          <button
            className="topbar-profile"
            onClick={() =>
              handleNavigation(
                "Profile"
              )
            }
          >
            <div className="profile-avatar small">
              {isAdmin
                ? "AD"
                : "TS"}
            </div>

            <div>
              <strong>
                {isAdmin
                  ? "Administrator"
                  : "Tanisha Singh"}
              </strong>

              <span>
                {isAdmin
                  ? "Admin"
                  : "B.Sc. IT"}
              </span>
            </div>
          </button>
        </header>

        <div className="page-content">
          {activePage ===
            "Dashboard" && (
            <DashboardHome
              questions={questions}
              results={results}
              subjects={subjects}
              loading={loading}
              onNavigate={
                handleNavigation
              }
              isAdmin={isAdmin}
            />
          )}

          {activePage ===
            "PYQ Library" && (
            <PYQLibrary />
          )}

          {activePage ===
            "Repeated Questions" && (
            <RepeatedQuestions />
          )}

          {activePage ===
            "Test Series" && (
            <TestSeries />
          )}

          {activePage ===
            "Performance" && (
            <Performance />
          )}

          {activePage ===
            "Profile" && (
            <ProfilePage
              questions={questions}
              results={results}
              isAdmin={isAdmin}
            />
          )}

          {activePage ===
            "Admin" &&
            isAdmin && <Admin />}
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   NAV ITEM
===================================================== */

function NavItem({
  icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span className="nav-icon">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

/* =====================================================
   DASHBOARD HOME
===================================================== */

function DashboardHome({
  questions,
  results,
  subjects,
  loading,
  onNavigate,
  isAdmin,
}) {
  const solvedQuestions =
    useMemo(
      () =>
        questions.filter(
          (question) =>
            question.solved
        ).length,
      [questions]
    );

  const testsCompleted =
    results.length;

  const averageScore =
    testsCompleted > 0
      ? Math.round(
          results.reduce(
            (sum, result) =>
              sum +
              Number(
                result.percentage ||
                  0
              ),
            0
          ) / testsCompleted
        )
      : 0;

  const studyStreak =
    useMemo(() => {
      const dates = new Set(
        results
          .map(
            (result) =>
              result.date ||
              result.createdAt
          )
          .filter(Boolean)
          .map((date) => {
            const value =
              new Date(date);

            if (
              Number.isNaN(
                value.getTime()
              )
            ) {
              return null;
            }

            return value
              .toISOString()
              .split("T")[0];
          })
          .filter(Boolean)
      );

      let streak = 0;

      const today =
        new Date();

      for (
        let i = 0;
        i < 30;
        i++
      ) {
        const date =
          new Date(today);

        date.setDate(
          today.getDate() - i
        );

        const dateString =
          date
            .toISOString()
            .split("T")[0];

        if (
          dates.has(
            dateString
          )
        ) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    }, [results]);

  /* ===================================================
     DYNAMIC SUBJECT PROGRESS
  =================================================== */

  const subjectProgress =
    useMemo(() => {
      return subjects.map(
        (item) => {
          const subject =
            item.name;

          const subjectQuestions =
            questions.filter(
              (question) =>
                question.subject ===
                subject
            );

          const solved =
            subjectQuestions.filter(
              (question) =>
                question.solved
            ).length;

          const percentage =
            subjectQuestions.length >
            0
              ? Math.round(
                  (solved /
                    subjectQuestions.length) *
                    100
                )
              : 0;

          return {
            subject,
            total:
              subjectQuestions.length,
            solved,
            percentage,
          };
        }
      );
    }, [subjects, questions]);

  /* ===================================================
     XP + BADGES
  =================================================== */

  const gamification =
    useMemo(() => {
      const highScoreTests =
        results.filter(
          (result) =>
            Number(
              result.percentage ||
                0
            ) >= 90
        ).length;

      const uniqueStudyDays =
        new Set(
          results
            .map(
              (result) =>
                result.date ||
                result.createdAt
            )
            .filter(Boolean)
            .map(
              (date) => {
                const value =
                  new Date(
                    date
                  );

                if (
                  Number.isNaN(
                    value.getTime()
                  )
                ) {
                  return null;
                }

                return value
                  .toISOString()
                  .split("T")[0];
              }
            )
            .filter(Boolean)
        ).size;

      const xp =
        solvedQuestions * 5 +
        testsCompleted * 20 +
        highScoreTests * 30 +
        uniqueStudyDays * 10;

      const level =
        Math.floor(
          xp / 100
        ) + 1;

      const currentLevelXP =
        xp % 100;

      const badges = [
        {
          icon: "🚀",
          title: "First Step",
          description:
            "Complete your first test",
          unlocked:
            testsCompleted >= 1,
        },
        {
          icon: "📚",
          title: "PYQ Explorer",
          description:
            "Solve 25 PYQs",
          unlocked:
            solvedQuestions >=
            25,
        },
        {
          icon: "🎯",
          title: "Test Master",
          description:
            "Complete 5 tests",
          unlocked:
            testsCompleted >=
            5,
        },
        {
          icon: "🔥",
          title: "High Scorer",
          description:
            "Score 90% or higher",
          unlocked:
            highScoreTests >= 1,
        },
        {
          icon: "⚡",
          title: "7 Day Streak",
          description:
            "Study for 7 days in a row",
          unlocked:
            studyStreak >= 7,
        },
        {
          icon: "🔁",
          title:
            "Repetition Hunter",
          description:
            "Find 5 repeated questions",
          unlocked:
            questions.filter(
              (question) =>
                question.repeated
            ).length >= 5,
        },
        {
          icon: "🏆",
          title: "Century Club",
          description:
            "Solve 100 PYQs",
          unlocked:
            solvedQuestions >=
            100,
        },
      ];

      return {
        xp,
        level,
        currentLevelXP,
        badges,
      };
    }, [
      solvedQuestions,
      testsCompleted,
      results,
      studyStreak,
      questions,
    ]);

  const focusSubject =
    useMemo(() => {
      const available =
        subjectProgress
          .filter(
            (item) =>
              item.total > 0
          )
          .sort(
            (a, b) =>
              a.percentage -
              b.percentage
          );

      return available[0];
    }, [subjectProgress]);

  const latestTest =
    useMemo(() => {
      return [...results].sort(
        (a, b) =>
          new Date(
            b.date ||
              b.createdAt ||
              0
          ) -
          new Date(
            a.date ||
              a.createdAt ||
              0
          )
      )[0];
    }, [results]);

  const formatDate =
    (value) => {
      if (!value) {
        return "No tests yet";
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "Unknown date";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

  if (loading) {
    return (
      <div className="empty-state">
        <div>⏳</div>

        <h3>
          Loading dashboard...
        </h3>

        <p>
          Connecting to MongoDB.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <div className="page-label">
            {isAdmin
              ? "ADMIN DASHBOARD"
              : "STUDENT DASHBOARD"}
          </div>

          <h1>
            {isAdmin
              ? "Welcome, Administrator 👋"
              : "Welcome back, Tanisha 👋"}
          </h1>

          <p>
            {isAdmin
              ? "Manage CampusPrep questions, subjects and content."
              : "Prepare consistently. Earn XP. Build your streak."}
          </p>
        </div>

        {!isAdmin && (
          <button
            className="primary-button"
            onClick={() =>
              onNavigate(
                "Test Series"
              )
            }
          >
            Start Test →
          </button>
        )}
      </div>

      {/* ADMIN BANNER */}

      {isAdmin && (
        <div className="daily-challenge">
          <div className="challenge-orb">
            ⚙
          </div>

          <div className="challenge-content">
            <div className="challenge-label">
              ADMIN CONTROL CENTER
            </div>

            <h2>
              Manage CampusPrep
            </h2>

            <p>
              Add questions, manage subjects and organize the question bank.
            </p>
          </div>

          <button
            className="challenge-button"
            onClick={() =>
              onNavigate("Admin")
            }
          >
            Open Admin
            <span>→</span>
          </button>
        </div>
      )}

      {/* XP */}

      {!isAdmin && (
        <div className="xp-hero-card">
          <div className="xp-hero-left">
            <div className="level-circle">
              <span>LVL</span>

              <strong>
                {gamification.level}
              </strong>
            </div>

            <div>
              <div className="xp-eyebrow">
                ✦ YOUR PREP LEVEL
              </div>

              <h2>
                Level{" "}
                {gamification.level}
              </h2>

              <p>
                {100 -
                  gamification.currentLevelXP}{" "}
                XP to next level
              </p>
            </div>
          </div>

          <div className="xp-progress-area">
            <div className="xp-numbers">
              <span>
                {
                  gamification.currentLevelXP
                }{" "}
                / 100 XP
              </span>

              <strong>
                {gamification.xp} Total XP
              </strong>
            </div>

            <div className="xp-progress">
              <div
                className="xp-progress-fill"
                style={{
                  width: `${gamification.currentLevelXP}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* STATS */}

      {!isAdmin && (
        <div className="stats-grid">
          <StatCard
            icon="📊"
            label="Average Score"
            value={`${averageScore}%`}
          />

          <StatCard
            icon="✓"
            label="Tests Completed"
            value={
              testsCompleted
            }
          />

          <StatCard
            icon="📚"
            label="PYQs Solved"
            value={
              solvedQuestions
            }
          />

          <StatCard
            icon="🔥"
            label="Study Streak"
            value={`${studyStreak} day${
              studyStreak === 1
                ? ""
                : "s"
            }`}
          />
        </div>
      )}

      {/* STUDENT CONTENT */}

      {!isAdmin && (
        <>
          {/* DAILY CHALLENGE */}

          <div className="daily-challenge">
            <div className="challenge-orb">
              ⚡
            </div>

            <div className="challenge-content">
              <div className="challenge-label">
                TODAY'S CHALLENGE
              </div>

              <h2>
                Can you beat your last score?
              </h2>

              <p>
                5 questions · 3 minutes · earn XP
              </p>
            </div>

            <button
              className="challenge-button"
              onClick={() =>
                onNavigate(
                  "Test Series"
                )
              }
            >
              Take Challenge
              <span>→</span>
            </button>
          </div>

          {/* SUBJECT PROGRESS + LATEST TEST */}

          <div className="dashboard-grid">
            <div className="dashboard-card wide">
              <div className="card-header">
                <div>
                  <div className="page-label">
                    PROGRESS
                  </div>

                  <h2>
                    Subject Progress
                  </h2>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    onNavigate(
                      "PYQ Library"
                    )
                  }
                >
                  View PYQs →
                </button>
              </div>

              {subjectProgress.length ===
              0 ? (
                <div className="mini-empty">
                  <div>📚</div>

                  <strong>
                    No subjects yet
                  </strong>

                  <span>
                    Subjects added by Admin will appear here.
                  </span>
                </div>
              ) : (
                <div className="subject-progress-list">
                  {subjectProgress.map(
                    (item) => (
                      <div
                        className="subject-progress"
                        key={
                          item.subject
                        }
                      >
                        <div className="subject-progress-header">
                          <div>
                            <strong>
                              {
                                item.subject
                              }
                            </strong>

                            <span>
                              {
                                item.solved
                              }
                              /
                              {
                                item.total
                              }{" "}
                              solved
                            </span>
                          </div>

                          <strong>
                            {
                              item.percentage
                            }%
                          </strong>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <div className="page-label">
                    LATEST TEST
                  </div>

                  <h2>
                    Recent Result
                  </h2>
                </div>
              </div>

              {latestTest ? (
                <div className="latest-test">
                  <div className="latest-test-icon">
                    🎯
                  </div>

                  <div>
                    <strong>
                      {
                        latestTest.subject
                      }
                    </strong>

                    <span>
                      {formatDate(
                        latestTest.date ||
                          latestTest.createdAt
                      )}
                    </span>
                  </div>

                  <div className="latest-test-score">
                    <strong>
                      {
                        latestTest.percentage
                      }
                      %
                    </strong>

                    <span>
                      {
                        latestTest.correct
                      }
                      /
                      {
                        latestTest.totalQuestions
                      }
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mini-empty">
                  <div>📝</div>

                  <strong>
                    No test completed yet
                  </strong>

                  <span>
                    Start your first test to unlock XP.
                  </span>

                  <button
                    className="primary-button"
                    onClick={() =>
                      onNavigate(
                        "Test Series"
                      )
                    }
                  >
                    Start Test
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FOCUS + BADGES */}

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <div className="page-label">
                    RECOMMENDED
                  </div>

                  <h2>
                    Your Focus Area
                  </h2>
                </div>

                <span className="focus-badge">
                  SMART PICK
                </span>
              </div>

              {focusSubject ? (
                <div className="focus-card">
                  <div className="focus-icon">
                    🎯
                  </div>

                  <div className="focus-main">
                    <strong>
                      {
                        focusSubject.subject
                      }
                    </strong>

                    <span>
                      Current progress:{" "}
                      {
                        focusSubject.percentage
                      }%
                    </span>

                    <div className="focus-progress">
                      <div
                        style={{
                          width: `${focusSubject.percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      Try 5 more PYQs to improve this subject.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="mini-empty">
                  <div>🎯</div>

                  <strong>
                    No focus area yet
                  </strong>

                  <span>
                    Solve questions to generate your focus area.
                  </span>
                </div>
              )}
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <div>
                  <div className="page-label">
                    ACHIEVEMENTS
                  </div>

                  <h2>
                    Badges
                  </h2>
                </div>

                <span className="badge-count">
                  {
                    gamification.badges.filter(
                      (badge) =>
                        badge.unlocked
                    ).length
                  }{" "}
                  /{" "}
                  {
                    gamification.badges.length
                  }
                </span>
              </div>

              <div className="badge-grid">
                {gamification.badges
                  .slice(0, 6)
                  .map(
                    (badge) => (
                      <div
                        className={`achievement-badge ${
                          badge.unlocked
                            ? "unlocked"
                            : "locked"
                        }`}
                        key={
                          badge.title
                        }
                        title={
                          badge.description
                        }
                      >
                        <div>
                          {
                            badge.icon
                          }
                        </div>

                        <strong>
                          {
                            badge.title
                          }
                        </strong>

                        <span>
                          {badge.unlocked
                            ? "Unlocked"
                            : "Locked"}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>

        <strong>
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =====================================================
   PROFILE
===================================================== */

function ProfilePage({
  questions,
  results,
  isAdmin,
}) {
  const solvedQuestions =
    questions.filter(
      (question) =>
        question.solved
    ).length;

  const highScores =
    results.filter(
      (result) =>
        Number(
          result.percentage ||
            0
        ) >= 90
    ).length;

  const xp =
    solvedQuestions * 5 +
    results.length * 20 +
    highScores * 30;

  const level =
    Math.floor(xp / 100) + 1;

  const badges = [
    {
      icon: "🚀",
      title: "First Step",
      unlocked:
        results.length >= 1,
    },
    {
      icon: "📚",
      title: "PYQ Explorer",
      unlocked:
        solvedQuestions >=
        25,
    },
    {
      icon: "🎯",
      title: "Test Master",
      unlocked:
        results.length >=
        5,
    },
    {
      icon: "🔥",
      title: "High Scorer",
      unlocked:
        highScores >= 1,
    },
    {
      icon: "🏆",
      title: "Century Club",
      unlocked:
        solvedQuestions >=
        100,
    },
  ];

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <div className="page-label">
            ACCOUNT
          </div>

          <h1>
            {isAdmin
              ? "Admin Profile"
              : "Profile"}
          </h1>

          <p>
            {isAdmin
              ? "CampusPrep administrator account."
              : "Your CampusPrep identity and achievements."}
          </p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-main">
          <div className="profile-avatar large">
            {isAdmin
              ? "AD"
              : "TS"}
          </div>

          <div>
            <h2>
              {isAdmin
                ? "CampusPrep Administrator"
                : "Tanisha Singh"}
            </h2>

            <p>
              {isAdmin
                ? "Platform Administrator"
                : "B.Sc. Information Technology"}
            </p>

            <span className="profile-status">
              {isAdmin
                ? "Administrator"
                : "Student"}
            </span>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <span>Name</span>

            <strong>
              {isAdmin
                ? "CampusPrep Admin"
                : "Tanisha Singh"}
            </strong>
          </div>

          <div className="profile-detail">
            <span>Role</span>

            <strong>
              {isAdmin
                ? "Administrator"
                : "Student"}
            </strong>
          </div>

          {!isAdmin && (
            <>
              <div className="profile-detail">
                <span>
                  Course
                </span>

                <strong>
                  B.Sc. Information Technology
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Semester
                </span>

                <strong>
                  Semester V
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  College
                </span>

                <strong>
                  Thakur Shyamnarayan Degree College
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  CampusPrep Level
                </span>

                <strong>
                  Level {level}
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  Total XP
                </span>

                <strong>
                  {xp} XP
                </strong>
              </div>
            </>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="dashboard-card profile-achievement-card">
          <div className="card-header">
            <div>
              <div className="page-label">
                ACHIEVEMENTS
              </div>

              <h2>
                Your Badges
              </h2>
            </div>
          </div>

          <div className="badge-grid large-badges">
            {badges.map(
              (badge) => (
                <div
                  className={`achievement-badge ${
                    badge.unlocked
                      ? "unlocked"
                      : "locked"
                  }`}
                  key={
                    badge.title
                  }
                >
                  <div>
                    {
                      badge.icon
                    }
                  </div>

                  <strong>
                    {
                      badge.title
                    }
                  </strong>

                  <span>
                    {badge.unlocked
                      ? "Unlocked"
                      : "Keep going"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;