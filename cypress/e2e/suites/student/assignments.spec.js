import AssignmentsPage from '../../framework/student/assignmentsPage';

describe('Test Assignment Page', () => {
  before(() => {
    cy.assignAssignment();
    cy.setToken('student');
    cy.visit('/home/assignments');
    cy.wait(5000);
  });
  const assignmentPage = new AssignmentsPage();

  it('(tc_232)verify Assignments presence based on duedate', () => {
    assignmentPage.isVisible();
    assignmentPage.validateAssignment('NOT STARTED', 'START ASSIGNMENT');
  });

  it('verify Assignment attempt', () => {
    const test = assignmentPage.onClickStartAssignment();
    test.onClickQuestion();
    test.onClickQuestion(); // dropdown question selction
    test.onClickRightCheckAnswer();
    test.onClickNext();
    cy.contains('TRUE')
      .should('be.visible')
      .click();
    test.onClickWrongCheckAnswer();
    test.onClickNext();
    test.onClickPrev();
    test.onClickNext();
    cy.contains('False')
      .should('be.visible')
      .click();
    test.onClickRightCheckAnswer();
    test.onClickNext();
    //dropdownselection answer
    test.onClickRightCheckAnswer();
    test.onClickNext();
    test.onClickRightCheckAnswer();
    test.onClickFinishTest();
    test.onClickCancel();
    test.onClickFinishTest();
    test.onClickApply();
    cy.url().should('include', '/home/assignments');
    // test.onClickNext();
    // const report = test.onClickSubmit();
    // report.isVisible();
    // report.validateAssignment();
  });

  it('(tc_232)verify based on no. of max attempt', () => {
    cy.visit('/home/assignments');
    cy.wait(500);
    assignmentPage.validateAssignment('IN PROGRESS', 'RESUME');
    const test = assignmentPage.onClickRetake();
    // cy.contains('Red')
    //   .should('be.visible')
    //   .click();
    // test.onClickWrongCheckAnswer();
    // cy.contains('Violet')
    //   .should('be.visible')
    //   .click();
    test.onClickRightCheckAnswer();
    test.onClickFinishTest();
    test.onClickCancel();
    test.onClickFinishTest();
    test.onClickApply();
    cy.url().should('include', '/home/assignments');
    assignmentPage.validateAssignment('IN PROGRESS', 'RESUME');
    // cy.contains('1/3').should('be.visible');
    // cy.contains('Attempts')
    //   .should('be.visible')
    //   .click();
    const test2 = assignmentPage.onClickRetake();
  });

  after(() => {
    cy.deleteAllAssignments();
  });
});
