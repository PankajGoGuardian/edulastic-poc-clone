describe("cleaning up test data", () => {
  it("dummy test to clean up test data", () => {
    cy.wait(1);
    cy.log("clearing test data created from the execution");
    cy.deleteTestData();
  });
});
