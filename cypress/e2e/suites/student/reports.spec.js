import ReportsPage from '../../framework/student/reportsPage';

describe('Test Reports Page', () => {
  before(() => {
    cy.visit('/home/reports');
  });
  const report = new ReportsPage();
  it('Visit Reports Page', () => {
    report.isVisible();
  });
});
