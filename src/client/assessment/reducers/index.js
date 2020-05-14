import items from "./items";
import test from "./test";
import answers from "./answers";
import previousAnswers from "./previousAnswers";
import previousQuestionActivity from "./previousQuestionActivity";
import evaluation from "./evaluation";
import userWork from "./userWork";
import questions from "./questions";
import shuffledOptions from "./shuffledOptions";
import graphTools from "./graphTools";
import bookmarks from "../sharedDucks/bookmark";
import testUserWork from "./testUserWork";
import userInteractions from "./userInteractions";
import assessmentPlayer from "./assessmentPlayer";

const assessmentReducers = {
  userWork, // Item/Question level userWork
  testUserWork, // test level userWork
  userInteractions,
  test,
  items,
  answers,
  previousAnswers,
  previousQuestionActivity,
  evaluation,
  assessmentplayerQuestions: questions,
  shuffledOptions,
  graphTools,
  assessmentBookmarks: bookmarks,
  assessmentPlayer
};

export default assessmentReducers;
