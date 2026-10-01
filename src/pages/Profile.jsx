function Profile() {
  return (
    <div className="profile-page">

      {/* PAGE HEADER */}
      <div className="page-header">

        <div>
          <div className="page-label">
            STUDENT PROFILE
          </div>

          <h1>
            My Profile
          </h1>

          <p>
            View and manage your academic information.
          </p>
        </div>

      </div>


      {/* PROFILE HEADER CARD */}
      <div className="profile-header-card">

        <div className="profile-avatar">
          TS
        </div>

        <div className="profile-main-info">

          <h2>
            Tanisha Singh
          </h2>

          <p>
            B.Sc. Information Technology
          </p>

          <span>
            Thakur Shyamnarayan Degree College
          </span>

        </div>

        <button className="profile-edit-btn">
          ✎ Edit Profile
        </button>

      </div>


      {/* PROFILE CONTENT */}
      <div className="profile-grid">


        {/* PERSONAL INFORMATION */}
        <div className="profile-panel">

          <div className="profile-panel-header">

            <div>
              <h2>
                Personal Information
              </h2>

              <p>
                Your basic student details
              </p>
            </div>

          </div>


          <div className="profile-details">

            <div className="profile-detail">
              <span>Full Name</span>
              <strong>Tanisha Singh</strong>
            </div>

            <div className="profile-detail">
              <span>College Email</span>
              <strong>
                tanisha@campusprep.com
              </strong>
            </div>

            <div className="profile-detail">
              <span>Course</span>
              <strong>
                B.Sc. Information Technology
              </strong>
            </div>

            <div className="profile-detail">
              <span>Semester</span>
              <strong>
                Semester V
              </strong>
            </div>

          </div>

        </div>


        {/* ACADEMIC INFORMATION */}
        <div className="profile-panel">

          <div className="profile-panel-header">

            <div>
              <h2>
                Academic Information
              </h2>

              <p>
                Your current academic details
              </p>
            </div>

          </div>


          <div className="profile-details">

            <div className="profile-detail">
              <span>Student ID</span>
              <strong>
                CP-2024-001
              </strong>
            </div>

            <div className="profile-detail">
              <span>Academic Year</span>
              <strong>
                2026 – 2027
              </strong>
            </div>

            <div className="profile-detail">
              <span>Department</span>
              <strong>
                Information Technology
              </strong>
            </div>

            <div className="profile-detail">
              <span>Institution</span>
              <strong>
                Thakur Shyamnarayan Degree College
              </strong>
            </div>

          </div>

        </div>

      </div>


      {/* ACADEMIC STATS */}
      <div className="profile-panel">

        <div className="profile-panel-header">

          <div>
            <h2>
              Academic Statistics
            </h2>

            <p>
              Your CampusPrep activity
            </p>
          </div>

        </div>


        <div className="profile-stat-grid">

          <div className="profile-stat">

            <span>
              Average Score
            </span>

            <strong>
              78%
            </strong>

          </div>


          <div className="profile-stat">

            <span>
              Tests Completed
            </span>

            <strong>
              12
            </strong>

          </div>


          <div className="profile-stat">

            <span>
              PYQs Solved
            </span>

            <strong>
              86
            </strong>

          </div>


          <div className="profile-stat">

            <span>
              Study Streak
            </span>

            <strong>
              7 Days
            </strong>

          </div>

        </div>

      </div>


      {/* PROFILE COMPLETION */}
      <div className="profile-panel">

        <div className="profile-panel-header">

          <div>
            <h2>
              Profile Completion
            </h2>

            <p>
              Complete your profile for a better experience.
            </p>
          </div>

          <strong className="completion-percentage">
            85%
          </strong>

        </div>


        <div className="profile-completion-bar">

          <div
            style={{
              width: "85%",
            }}
          />

        </div>

        <small className="completion-text">
          Your profile is 85% complete.
        </small>

      </div>

    </div>
  );
}

export default Profile;