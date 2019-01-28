import ManagePage from '../../framework/student/managePage';

describe('Test ManageClass Page', () => {
  before(() => {
    cy.setToken();
    cy.visit('/home/manage');
  });
  const managePage = new ManagePage();
  it('Visit manage Page', () => {});
});
