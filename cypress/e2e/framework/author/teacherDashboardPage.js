import CypressHelper from '../util/cypressHelpers'

export default class TeacherDashBoardPage {
  // *** ELEMENTS START ***

  getClasCardByName = (className) => cy.get(`[data-cy="${className}"]`)

  getMeetLauncherButton = () => cy.get('[data-cy="launch-google-meet"]')

  getContentBundle = (attr) => cy.get(`[data-cy="${attr}"]`)

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnCompleteSignupProcess = () =>
    cy.get('[data-cy="completeSignup"]').click()

  clickOnClassDropDown = () => cy.get('[data-cy="select-class"]').click()

  clickOnManageClass = () => cy.get('[data-cy="manageClass"]').click()

  clickOnLaunchGoogleMeet = () => this.getMeetLauncherButton().click()

  selectClassOnMeet = (clas) =>
    CypressHelper.selectDropDownByAttribute('select-class', clas)

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  getClassListOnMeet = () =>
    this.clickOnClassDropDown().then(() =>
      CypressHelper.getDropDownList('select-class')
    )

  verifyLauncherPopupIsShown = () =>
    cy
      .contains(
        'Select the class that you want to invite for the Google Meet session.'
      )
      .should('be.visible')

  verifyClassDetail = (
    className,
    grade,
    subject,
    students,
    assignmentCount = 0,
    assignmentTitle,
    asgnStatus
  ) => {
    this.getClasCardByName(className).as('classCard')
    cy.get('@classCard').find('[data-cy="name"]').should('have.text', className)

    cy.get('@classCard')
      .find('[data-cy="grades"]')
      .parent()
      .should('contain.text', grade)

    cy.get('@classCard')
      .find('[data-cy="subject"]')
      .should('have.text', subject)

    cy.get('@classCard')
      .find('[data-cy="studentCount"]')
      .should(
        'have.text',
        `${students} ${students > 1 ? 'Students' : 'Student'}`
      )

    cy.get('@classCard')
      .find('[data-cy="totalAssignment"]')
      .should('have.text', `${assignmentCount}`)

    cy.get('@classCard')
      .find('[data-cy="assignmentTitle"]')
      .should(
        'contain.text',
        assignmentCount > 0 ? assignmentTitle : 'No Recent Assignments'
      )

    if (assignmentCount > 0) {
      cy.get('@classCard')
        .find('[data-cy="assignmentStatus"]')
        .should('contain.text', asgnStatus)
    }
  }

  // *** APPHELPERS END ***
}

export const DEFAULT_CONTENT_BUNDLES = {
  with_subject: {
    1: {
      collection: 'Edulastic Certified',
      subject: 'Mathematics',
      description: 'Edulastic Certified - Math',
    },
    2: {
      collection: 'Edulastic Certified',
      subject: 'Science',
      description: 'Edulastic Certified - Science',
    },
    3: {
      collection: 'Edulastic Certified',
      subject: 'ELA',
      description: 'Edulastic Certified - ELA',
    },
    4: {
      collection: 'Edulastic Certified',
      subject: 'Social Studies',
      description: 'Edulastic Certified - Social Studies',
    },
    5: {
      collection: 'SmartStart Diagnostics',
      subject: 'Mathematics',
      description: 'Smart Start Diagnostics - Math',
    },
    6: {
      collection: 'SmartStart Diagnostics',
      subject: 'ELA',
      description: 'Smart Start Diagnostics - ELA',
    },
  },
  with_search_string: {
    1: {
      collection: 'Edulastic Certified',
      string: 'PARCC',
      description: 'PARCC Practice Tests',
    },
    2: {
      collection: 'Edulastic Certified',
      string: 'SMARTER BALANCED PRACTICE',
      description: 'Smarter Balanced Tests',
    },
    3: {
      collection: 'Edulastic Certified',
      string: 'ILLUSTRATIVE MATH',
      description: 'Illustrative Math',
    },
    4: {
      collection: 'Edulastic Certified',
      string: 'AZMERIT',
      description: 'AzMERIT',
    },
  },
  others: {
    1: {
      collection: 'Engage NY',
      description: 'Engage NY',
    },
  },
}
