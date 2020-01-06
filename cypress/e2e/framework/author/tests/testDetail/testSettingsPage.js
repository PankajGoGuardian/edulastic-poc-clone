export default class TestSettings {
  // Maximum Attempts Allowed
  getMaxAttempt = () => cy.get("#maximum-attempts-allowed").find("input");

  setMaxAttempt = maxAttempt => this.getMaxAttempt().type(`{selectall}${maxAttempt}`);

  // Shuffle Questions
  getShuffleQuestionButton = () => cy.get('[data-cy="shuffleQuestions"]');

  // Shuffle Choice
  getShuffleChoiceButton = () => cy.get('[data-cy="shuffleChoices"]');

  // Check Answer Tries Per Question
  getCheckAnswer = () => cy.get("#check-answer-tries-per-question").find("input");

  setCheckAnswer = checkAns => this.getCheckAnswer().type(`{selectall}${checkAns}`);
}
