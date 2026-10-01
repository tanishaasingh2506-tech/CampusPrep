import { defaultQuestions } from "../data/questions";

const STORAGE_KEY = "campusprep_questions";

export function getQuestions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultQuestions)
    );

    return defaultQuestions;
  } catch (error) {
    console.error("Error loading questions:", error);
    return defaultQuestions;
  }
}

export function saveQuestions(questions) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(questions)
    );

    // Tell other CampusPrep pages that questions changed
    window.dispatchEvent(
      new CustomEvent("campusprepQuestionsUpdated")
    );
  } catch (error) {
    console.error("Error saving questions:", error);
  }
}