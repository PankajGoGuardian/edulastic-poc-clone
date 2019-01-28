class SidebarPage {
  onClickMenuItems() {
    let menuItems = [
      {
        label: 'Dashboard',
        path: 'home/dashboard'
      },
      {
        label: 'Assignments',
        path: 'home/assignments'
      },
      {
        label: 'Reports',
        path: 'home/reports'
      },
      {
        label: 'Skill Report',
        path: 'home/skill-report'
      },
      {
        label: 'Manage Class',
        path: 'home/manage'
      }
    ];
    menuItems.forEach(data => {
      cy.contains(data.label).click();
      cy.url().should('include', data.path);
    });
  }

  onClickCollapse() {
    // cy.get('.anticon-left').click();
    // cy.get('.anticon-right').click();
  }
  isVisible() {
    cy.contains('Help Center').should('be.visible');
  }

  onClickUserInfo() {
    cy.get('[data-cy=userInfo]').click();
    cy.contains('MY PROFILE').click();
    cy.get('[data-cy=userInfo]').click();
    cy.contains('SIGN OUT').click();
  }
}
export default SidebarPage;
