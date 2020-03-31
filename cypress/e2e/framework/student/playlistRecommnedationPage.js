export class PlayListRecommendation {
  // *** ELEMENTS START ***

  constructor() {
    this.recommendedType = {
      REVIEW: "Review",
      PRACTICE: "Practice",
      CHALLENGE: "Challenge"
    };
  }

  getRecommendationRowByAssignmentName = assignmentName =>
    cy
      .get('[data-cy="assignmentName"]')
      .contains(assignmentName)
      .closest('[data-cy="recommendation"]');

  getRecommendationRowById = resourceId => cy.get(`[data-test="${resourceId}"]`);

  getPracticeButtonByAssignmentName = assignmentName =>
    this.getRecommendationRowByAssignmentName(assignmentName).find('[data-cy="practice"]');

  getPracticeButtonById = resourceId => this.getRecommendationRowById(resourceId).find('[data-cy="practice"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnRecommendation = () => cy.get("[data-cy=recommendations]").click();

  clickOnPracticeById = resourceId => this.getPracticeButtonById(resourceId).click();

  clickOnPracticeByAssignmentName = assignmentName => {
    cy.server();
    cy.route("GET", "**/test/**").as("practiceTest");
    this.getPracticeButtonByAssignmentName(assignmentName).click();
    return cy.wait("@practiceTest").then(xhr => {
      expect(xhr.status).to.eq(200);
      let itemGroupArray = xhr.response.body.result.itemGroups;
      let testItems = [];
      itemGroupArray.forEach(obj => {
        const group = [];
        obj.items.forEach(itm => {
          group.push(itm._id);
        });
        testItems.push(group);
      });
      return testItems;
    });
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  // @testId - to be passed when test is added from manage content
  veryRecommendationRow = ({
    assignmentName,
    testId,
    type,
    recommendationNumber = 1,
    standardIds,
    attempted = false,
    mastery,
    score
  }) => {
    const masteryText = `${mastery || "0"}%`;
    testId
      ? this.getRecommendationRowById(testId).as("recommendedRow")
      : this.getRecommendationRowByAssignmentName(assignmentName).as("recommendedRow");

    // title
    cy.get("@recommendedRow")
      .find('[data-cy="assignmentName"]')
      .should(
        "have.text",
        testId ? assignmentName : `${this.recommendedType[type]} #${recommendationNumber} - ${assignmentName}`
      );

    // work type
    cy.get("@recommendedRow")
      .find('[data-cy="recommendationType"]')
      .should("have.text", type);
    // standardIds
    if (!testId && standardIds) {
      standardIds.forEach(std => {
        cy.get("@recommendedRow")
          .find('[data-cy="assignmentName"]')
          .next()
          .find(".ant-tag")
          .should("contain.text", std);
      });
    }
    // progress text
    cy.get("@recommendedRow")
      .find(".ant-progress-text")
      .should("have.text", `${attempted ? masteryText : ""}`);
    // score
    cy.get("@recommendedRow")
      .find('[data-cy="score"]')
      .should("have.text", `${attempted ? score : "-"}`);
    // practice button
    cy.get("@recommendedRow")
      .find('[data-cy="practice"]')
      .should("have.text", "START PRACTICE");
    // review button

    if (attempted)
      cy.get("@recommendedRow")
        .find('[data-cy="review"]')
        .should("exist");
    else
      cy.get("@recommendedRow")
        .find('[data-cy="review"]')
        .should("not.exist");
  };

  // *** APPHELPERS END ***
}
