/// <reference types="cypress" />

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

    /**
     * Login with user via API
     * @param {string} username - default : default teacher user
     * @param {string} password - default : "snawpiz"
     * @example
     * cy.setToken() - will set default teacher token
     * cy.setToken('teacher-at-snapwiz.com') - will set token with teacher-at-snapwiz.com and 'snapwiz' as password
     * cy.setToken('teacher-at-snapwiz.com','testpassword') - will set token with credential 'teacher-at-snapwiz.com' and 'testpassword'
     */

    setToken(username: string, password: string): Chainable<any>;

    /** set viewport size
     * @param {array} viewport size in [height,width]
     * @param {string} viewport size in default preset values
     * 'macbook-15' = 1440,900
     * 'macbook-13' = 1280,800
     * 'macbook-11' = 1366,768
     * 'ipad-2' = 768,1024
     * 'ipad-mini' = 768,1024
     * 'iphone-6+' = 414,736
     * 'iphone-6' = 375,667
     * 'iphone-5' = 320,568
     * 'iphone-4' = 320,480
     * 'iphone-3' = 320,480
     * @example
     * cy.setResolution([1366,768]) - will set viewport size to 1366 * 768
     * cy.setResolution('macbook-15') - will set viewport size to 1440 * 900
     */

    setResolution(username: string, password: string): Chainable<any>;

    /**
     * scroll down the current page and capture snapshots & compare
     * @param {number} scrollOffset - vertical scroll offset
     * @example
     * cy.scrollPageAndMatchImageSnapshots(50) - will scroll the page down by currentPageClientHeight - 50 px
     */

    scrollPageAndMatchImageSnapshots(scrollOffset: number): Chainable<any>;

    /**
     * scroll down the current page and capture snapshots & compare
     * @param {number} scrollOffset - vertical scroll offset to calculate optimum number of scrolls required to cover complete page
     * @example
     * cy.isPageScrollPresent(40)
     * @returns
     * Object { hasScroll, minScrolls, scrollSize }
     */

    isPageScrollPresent(scrollOffset: number): Chainable<any>;
  }
}
