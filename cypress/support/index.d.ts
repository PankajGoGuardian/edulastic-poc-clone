declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Login with user via UI
     * @param {string} role - 'student' or 'teacher' , default:'teacher'
     * @param {string} email - default : default users email based on role
     * @param {string} password - default : "snawpiz"
     * @example
     * cy.login() - will login default teacher
     * cy.login('student') - will login default student
     * cy.login('teacher',"teacher-at-snapwiz.com",'testpassword') - will login with 'teacher-at-snapwiz.com'
     */
    login(role: string, email: string, password: string): Chainable<any>;
  }
}
