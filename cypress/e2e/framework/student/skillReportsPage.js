class SkillReportsPage {
  // *** ELEMENTS START ***
  // *** ELEMENTS END ***

  // *** ACTIONS START ***
  onRatioClick() {
    cy.get("[data-cy=ratio]")
      .should("be.visible")
      .each($table => {
        cy.wrap($table).click();
      });
  }
  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  isVisible() {
    cy.contains("Skill Report").should("be.visible");
    // cy.get('[data-cy=skillReport]').should('be.visible');
    cy.contains("Skill Summary").should("be.visible");
  }
  // *** APPHELPERS END ***
}
export default SkillReportsPage;
