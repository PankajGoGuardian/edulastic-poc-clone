export default class TestSettings {
  // Maximum Attempts Allowed
  getMaxAttempt = () => cy.get("#maximum-attempts-allowed").find("input");

  setMaxAttempt = maxAttempt => this.getMaxAttempt().type(`{selectall}${maxAttempt}`);

  // Shuffle Questions
  getShuffleQuestionButton = () => cy.get('[data-cy="shuffleQuestions"]');

  // Shuffle Choice
  getShuffleChoiceButton = () => cy.get('[data-cy="shuffleChoices"]');
}
