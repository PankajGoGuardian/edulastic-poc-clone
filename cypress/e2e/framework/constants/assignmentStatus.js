export const teacherSide = {
  NOT_OPEN: "NOT OPEN",
  IN_PROGRESS: "IN PROGRESS",
  IN_GRADING: "IN GRADING",
  NOT_GRADED: "NOT GRADED",
  GRADES_HELD: "GRADES HELD",
  DONE: "DONE",
  REDIRECTED: "Redirected",
  PAUSED: "PAUSED",
  NOT_STARTED: "NOT STARTED"
};

export const openPolicyTypes = {
  AUTO: "Automatically on Start Date",
  MANUAL: "Open Manually in Class"
};

export const studentSide = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  SUBMITTED: "Submitted",
  NOT_GRADED: "Not Graded",
  GRADES_HELD: "Grades Held",
  GRADED: "Graded",
  ABSENT: "Absent",
  IN_GRADING: "In Grading"
};

export const assignmentButtonsText = {
  start: "START ASSIGNMENT",
  retake: "RETAKE",
  resume: "RESUME",
  review: "REVIEW"
};

export const testTypes = {
  PRACTICE_ASSESSMENT: "Practice Assessment",
  COMMON_ASSESSMENT: "Common Assessment",
  CLASS_ASSESSMENT: "Class Assessment",
  PRACTICE: "Practice"
};

export const grades = {
  KINDERGARTEN: "Kindergarten",
  GRADE_1: "Grade 1",
  GRADE_2: "Grade 2",
  GRADE_3: "Grade 3",
  GRADE_4: "Grade 4",
  GRADE_5: "Grade 5",
  GRADE_6: "Grade 6",
  GRADE_7: "Grade 7",
  GRADE_8: "Grade 8",
  GRADE_9: "Grade 9",
  GRADE_10: "Grade 10",
  GRADE_11: "Grade 11",
  GRADE_12: "Grade 12",
  OTHER: "Other"
};

export const subject = {
  MATH: "Mathematics",
  ELA: "ELA",
  SCIENCE: "Science",
  SOCIAL_STUDIES: "Social Studies",
  OTHER: "Other Subjects"
};

export const releaseGradeTypes = {
  DONT_RELEASE: "DONT_RELEASE",
  SCORE_ONLY: "SCORE_ONLY",
  WITH_RESPONSE: "WITH_RESPONSE",
  WITH_ANSWERS: "WITH_ANSWERS"
};

export const redirectType = {
  SCORE_AND_FEEDBACK: "Score & Feedback",
  STUDENT_RESPONSE_AND_FEEDBACK: "Student Response & Feedback",
  FEEDBACK_ONLY: "Feedback only"
};

export const questionDeliveryType = {
  All: "All",
  SKIPPED_AND_WRONG: "Skipped and Wrong"
};

export const releaseGradeTypesDropDown = {
  DONT_RELEASE: "Do not release scores or responses",
  SCORE_ONLY: "Release scores only",
  WITH_RESPONSE: "Release scores and student responses",
  WITH_ANSWERS: "Release scores,student responses and correct answers"
};

export const recommendationType = {
  REVIEW: "REVIEW",
  PRACTICE: "PRACTICE",
  CHALLENGE: "CHALLENGE"
};

export const regradeOptions = {
  edited: {
    NO_POINTS: "no-points",
    FULL_POINTS: "full-points",
    MANUAL_POINTS: "manual-points"
  },
  added: {
    NO_POINTS: "skip-grading",
    AUTO_POINTS: "restore-grading",
    MANUAL_POINTS: "manual-grading"
  },
  deleted: {
    REMOVE: "discard-item"
  }
};
