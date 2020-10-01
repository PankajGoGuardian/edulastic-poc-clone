import FileHelper from '../framework/util/fileHelper'

const PAGE = ['studentsignup', 'signup', 'adminsignup']
const SCREEN_SIZES = Cypress.config('SCREEN_SIZES')
const BASE_URL = Cypress.config('API_URL')
const userEmail = 'test.teacher.aug13@snapwiz.com'
const userBody = {
  institutionIds: ['5d2884b38532772801a46bd8'],
  districtId: '5d2884b28532772801a46bd5',
  email: userEmail,
  firstName: 'test',
  lastName: 'teacher',
}
let userId
const header = { 'Content-Type': 'application/json' }

function setSignupStatus(signUpState) {
  userBody.currentSignUpState = signUpState
  cy.request({
    url: `${BASE_URL}/user/${userId}`,
    headers: header,
    method: 'PUT',
    body: userBody,
  }).then((res) => {
    expect(res.status).to.eq(200)
  })
}

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before(() => cy.clearToken())
  context(`getStarted page`, () => {
    const page = 'getStarted'
    SCREEN_SIZES.forEach((size) => {
      it(`- when resolution is '${size}'`, () => {
        cy.setResolution(size)
        cy.visit(`/${page}`)
        cy.get('span').should('be.visible')
        cy.matchImageSnapshotWithSize()
      })
    })
  })

  PAGE.forEach((page) => {
    context(`${page} page`, () => {
      SCREEN_SIZES.forEach((size) => {
        it(`- when resolution is '${size}'`, () => {
          cy.setResolution(size)
          cy.visit(`/${page}`)
          cy.get('button').should('be.visible')
          cy.matchImageSnapshotWithSize()
        })
      })
    })
  })

  describe('teacher signup', () => {
    const PAGE = 'signup'
    before('set token', () => {
      cy.setToken(userEmail).then((id) => {
        userId = id
        cy.getToken().then((auth) => {
          header.Authorization = auth
        })
      })
    })

    context(`school`, () => {
      before('set signup status', () => {
        setSignupStatus('SCHOOL_NOT_SELECTED')
      })

      SCREEN_SIZES.forEach((size) => {
        it(`'select page' when resolution is '${size}'`, () => {
          cy.setResolution(size)
          cy.visit(`/${PAGE}`)
          cy.wait('@schoolSearch')
          cy.contains('Collaborate with your colleagues and more').should(
            'be.visible'
          )
          cy.matchImageSnapshotWithSize()
        })

        // skipping below test as option is now hidden temperarely
        it.skip(`'request new school' page when resolution is '${size}'`, () => {
          cy.setResolution(size)
          cy.contains('Request a new School').click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(500)
          cy.get('button').contains('Request a new school')
          cy.matchImageSnapshotWithSize()
        })
      })
    })

    context(`select school page`, () => {
      before('set signup status', () => {
        setSignupStatus('PREFERENCE_NOT_SELECTED')
      })

      SCREEN_SIZES.forEach((size) => {
        it(`'grade-subject preference' page when resolution is '${size}'`, () => {
          cy.setResolution(size)
          cy.visit(`/${PAGE}`)
          cy.get('button').contains('Get Started').should('be.visible')
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(500)
          cy.matchImageSnapshotWithSize()
        })
      })
    })
  })
})
