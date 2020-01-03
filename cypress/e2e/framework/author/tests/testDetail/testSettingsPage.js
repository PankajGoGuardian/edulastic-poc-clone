export default class TestSettings {
  // Maximum Attempts Allowed
  getMaxAttempt = () => cy.get("#maximum-attempts-allowed").find("input");

  setMaxAttempt = maxAttempt => this.getMaxAttempt().type(`{selectall}${maxAttempt}`);
}
