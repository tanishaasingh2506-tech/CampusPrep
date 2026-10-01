const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Question = require("./models/Question");
const Result = require("./models/Result");
const Subject = require("./models/Subject");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const DEFAULT_SUBJECTS = [
  "DBMS",
  "Java OOP",
  "Computer Networks",
  "Software Engineering",
  "Web Programming",
  "Python",
];

/* =====================================================
   ROOT
===================================================== */

app.get("/", (req, res) => {
  res.json({
    message: "CampusPrep Backend API is running",
  });
});

/* =====================================================
   SUBJECTS
===================================================== */

app.get("/api/subjects", async (req, res) => {
  try {
    const subjects = await Subject.find().sort({
      name: 1,
    });

    res.json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
});

app.post("/api/subjects", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();

    if (!name) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const existingSubject = await Subject.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });

    if (existingSubject) {
      return res.status(409).json({
        message: "Subject already exists",
      });
    }

    const subject = new Subject({
      name,
    });

    const savedSubject = await subject.save();

    res.status(201).json(savedSubject);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add subject",
      error: error.message,
    });
  }
});

app.put("/api/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const newName = String(req.body.name || "").trim();

    if (!newName) {
      return res.status(400).json({
        message: "Subject name is required",
      });
    }

    const duplicate = await Subject.findOne({
      _id: {
        $ne: subject._id,
      },
      name: {
        $regex: `^${newName}$`,
        $options: "i",
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Another subject already has this name",
      });
    }

    const oldName = subject.name;

    subject.name = newName;

    const updatedSubject = await subject.save();

    // Also rename the subject in existing questions.
    await Question.updateMany(
      {
        subject: oldName,
      },
      {
        $set: {
          subject: newName,
        },
      }
    );

    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update subject",
      error: error.message,
    });
  }
});

app.delete("/api/subjects/:id", async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    const questionCount = await Question.countDocuments({
      subject: subject.name,
    });

    if (questionCount > 0) {
      return res.status(409).json({
        message:
          "Cannot delete this subject because questions are using it.",
      });
    }

    await Subject.findByIdAndDelete(req.params.id);

    res.json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete subject",
      error: error.message,
    });
  }
});

/* =====================================================
   QUESTIONS
===================================================== */

app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find().sort({
      createdAt: -1,
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
});

app.get("/api/questions/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch question",
      error: error.message,
    });
  }
});

app.post("/api/questions", async (req, res) => {
  try {
    const question = new Question(req.body);

    const savedQuestion = await question.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add question",
      error: error.message,
    });
  }
});

app.put("/api/questions/:id", async (req, res) => {
  try {
    const updatedQuestion =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update question",
      error: error.message,
    });
  }
});

app.delete("/api/questions/:id", async (req, res) => {
  try {
    const deletedQuestion =
      await Question.findByIdAndDelete(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete question",
      error: error.message,
    });
  }
});

/* =====================================================
   RESULTS
===================================================== */

app.get("/api/results", async (req, res) => {
  try {
    const results = await Result.find().sort({
      createdAt: -1,
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch results",
      error: error.message,
    });
  }
});

app.post("/api/results", async (req, res) => {
  try {
    const result = new Result(req.body);

    const savedResult = await result.save();

    res.status(201).json(savedResult);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save result",
      error: error.message,
    });
  }
});

/* =====================================================
   START SERVER
===================================================== */

app.listen(PORT, "0.0.0.0", async () => {
  console.log(
    `CampusPrep backend running on http://localhost:${PORT}`
  );

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    const subjectCount = await Subject.countDocuments();

    if (subjectCount === 0) {
      await Subject.insertMany(
        DEFAULT_SUBJECTS.map((name) => ({
          name,
        }))
      );

      console.log(
        "Default subjects created successfully"
      );
    }
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  }
});