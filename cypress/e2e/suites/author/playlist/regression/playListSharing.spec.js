import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import { COLLECTION as collection } from '../../../../framework/constants/questionTypes'
import CypressHelper from '../../../../framework/util/cypressHelpers'

const userData = require('../../../../../fixtures/users')

// const { dis1: dist1, dis2: dist2 } = userData.playListSharing
const { dis1: dist1 } = userData.playListSharing

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}>>play list sharing`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()

  let playlistid
  // const testToCreate = ['search_1', 'search_1']
  const originalTestIds = [
    '5f8014d8d4fda900088beb95',
    '5f801527d4fda900088bebaf',
  ]
  const playlistdata = {
    metadata: {
      name: 'Play List for sharing',
      grade: 'Grade 10',
      subject: 'Math',
    },
    moduledata: {},
  }

  const email = 'email'
  const pass = 'pass'
  const name = 'name'
  const school1 = 'school1'
  const school2 = 'school2'
  const teacher1 = 'Teacher1'
  const teacher2 = 'Teacher2'
  const teacher3 = 'Teacher3'

  const dist1_school1 = dist1[school1]
  // const dist2_school1 = dist2[school1]
  const dist1_school2 = dist1[school2]

  const Author = dist1_school1[teacher1]
  /* before('create tests', () => {
    cy.login('teacher', Author.email, Author.pass)
    testToCreate.forEach((test, i) => {
      testlibraryPage.createTest(test).then((id) => {
        originalTestIds[i] = id
      })
    })
  }) */
  before('>login as author and creat playlist', () => {
    cy.login('teacher', Author.email, Author.pass)
    playlistdata.moduledata.module1 = originalTestIds
    playlistlibraryPage.createPlayListWithTests(playlistdata).then((id) => {
      playlistid = id
    })
  })
  context(
    `> playlist sharing to individual person with 'edit' and 'viewonly' permissions`,
    () => {
      context("> with giving 'edit' permission", () => {
        before('> publish and share the published test', () => {
          playlistlibraryPage.header.clickOnShare()
          testlibraryPage.selectPeopletoshare(
            dist1_school1[teacher2][email],
            true
          )
        })

        it("> assert the shared playlist 'by non owner'", () => {
          cy.login(
            'teacher',
            dist1_school1[teacher2][email],
            dist1_school1[teacher2][pass]
          )
          playlistlibraryPage.sidebar.clickOnPlayListLibrary()
          playlistlibraryPage.searchFilter.clearAll()

          playlistlibraryPage.searchFilter.clickOnGetCoAuthor()
          playlistlibraryPage
            .getPlayListCardById(playlistid)
            .should('be.visible')

          playlistlibraryPage.searchFilter.sharedWithMe()
          playlistlibraryPage
            .getPlayListCardById(playlistid)
            .should('be.visible')

          playlistlibraryPage.clickOnPlayListCardById(playlistid)
          playlistlibraryPage.verifyEditPermission(playlistid)
        })

        it("> edit the playlist 'by non-owner'", () => {
          playlistlibraryPage.header.clickOnEdit()
          playlistlibraryPage.header.clickOnReview()

          playlistlibraryPage.reviewTab.clickExpandByModule(1)
          playlistlibraryPage.reviewTab.clickOnDeleteByTestByModule(1, 2)
          playlistlibraryPage.header.clickOnPublish()
        })

        it("> verify edit 'by owner'", () => {
          cy.login('teacher', Author[email], Author[pass])
          playlistlibraryPage.seachAndClickPlayListById(playlistid)
          playlistlibraryPage.reviewTab.clickExpandByModule(1)

          playlistlibraryPage.reviewTab.getTestByTestByModule(1, 1)
          playlistlibraryPage.reviewTab
            .getTestByTestByModule(1, 2)
            .should('not.exist')
        })
      })

      context("> without giving 'view only' permission", () => {
        before('> login as author and get playlist', () => {
          cy.login('teacher', Author[email], Author[pass])
          playlistlibraryPage.seachAndClickPlayListById(playlistid)
        })
        before('> publish and share the playlist', () => {
          playlistlibraryPage.header.clickOnShare()
          testlibraryPage.removeShare()
          testlibraryPage.selectPeopletoshare(
            dist1_school1[teacher2][email],
            false
          )
        })

        it("> assert the shared playlist 'by non onwner'", () => {
          cy.login(
            'teacher',
            dist1_school1[teacher2][email],
            dist1_school1[teacher2][pass]
          )
          playlistlibraryPage.sidebar.clickOnPlayListLibrary()
          playlistlibraryPage.searchFilter.clearAll()

          playlistlibraryPage.searchFilter.sharedWithMe()
          playlistlibraryPage.searchFilter.typeInSearchBox(
            CypressHelper.getShortId(playlistid)
          )

          playlistlibraryPage.clickOnPlayListCardById(playlistid)
          playlistlibraryPage.reviewTab.clickExpandByModule(1)
          playlistlibraryPage.verifyViewOnlyPermission(playlistid)
        })
      })

      context("> multi share 'individual', sharing to multiple people", () => {
        before('> login as author and get playlist', () => {
          cy.login('teacher', Author[email], Author[pass])
          playlistlibraryPage.seachAndClickPlayListById(playlistid)
        })
        before('> share playlist', () => {
          playlistlibraryPage.header.clickOnShare()
          testlibraryPage.removeShare()

          testlibraryPage.selectPeopletoshare(
            dist1_school1[teacher2][email],
            false
          )
          testlibraryPage.selectPeopletoshare(
            dist1_school1[teacher3][email],
            true
          )
        })

        it("> assert the shared playlist 'by non onwer 1'", () => {
          cy.login(
            'teacher',
            dist1_school1[teacher2][email],
            dist1_school1[teacher2][pass]
          )
          playlistlibraryPage.sidebar.clickOnPlayListLibrary()

          playlistlibraryPage.searchFilter.clearAll()
          playlistlibraryPage.searchFilter.sharedWithMe()

          playlistlibraryPage.searchFilter.typeInSearchBox(
            CypressHelper.getShortId(playlistid)
          )
          playlistlibraryPage.clickOnPlayListCardById(playlistid)

          playlistlibraryPage.reviewTab.clickExpandByModule(1)
          playlistlibraryPage.verifyViewOnlyPermission(playlistid)
        })

        it(">assert the shared playlist 'by non owner 2'", () => {
          cy.login(
            'teacher',
            dist1_school1[teacher3][email],
            dist1_school1[teacher2][pass]
          )
          playlistlibraryPage.sidebar.clickOnPlayListLibrary()

          playlistlibraryPage.searchFilter.clearAll()
          playlistlibraryPage.searchFilter.sharedWithMe()

          playlistlibraryPage.searchFilter.typeInSearchBox(
            CypressHelper.getShortId(playlistid)
          )
          playlistlibraryPage
            .getPlayListCardById(playlistid)
            .should('be.visible')

          playlistlibraryPage.searchFilter.clickOnGetCoAuthor()
          playlistlibraryPage
            .getPlayListCardById(playlistid)
            .should('be.visible')

          playlistlibraryPage.clickOnPlayListCardById(playlistid)
          playlistlibraryPage.verifyEditPermission(playlistid)
        })
      })
    }
  )
  context('> sharing school,district and public levels', () => {
    context('> school level share', () => {
      before('> login as author and get playlist', () => {
        cy.login('teacher', Author[email], Author[pass])
        playlistlibraryPage.seachAndClickPlayListById(playlistid)
      })

      it('> sharing at school level', () => {
        playlistlibraryPage.header.clickOnShare()
        testlibraryPage.removeShare()

        testlibraryPage.getSchoolRadio().click({ force: true })
        testlibraryPage.clickSharePop()
      })

      it(`> for ${dist1_school1[teacher2][name]} from same school`, () => {
        cy.login(
          'teacher',
          dist1_school1[teacher2][email],
          dist1_school1[teacher2][pass]
        )
        playlistlibraryPage.searchByCollection(collection.school)
        playlistlibraryPage.clickOnPlayListCardById(playlistid)

        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.verifyViewOnlyPermission()
      })
    })

    context('> district level share', () => {
      before('>login as author and get playlist', () => {
        cy.login('teacher', Author[email], Author[pass])
        playlistlibraryPage.seachAndClickPlayListById(playlistid)
      })

      it('> sharing at district level', () => {
        playlistlibraryPage.header.clickOnShare()
        testlibraryPage.removeShare()

        testlibraryPage.getDistrictRadio().click({ force: true })
        testlibraryPage.clickSharePop()
      })

      it(`> for ${dist1_school2[teacher1][name]} from other school`, () => {
        cy.login(
          'teacher',
          dist1_school2[teacher1][email],
          dist1_school2[teacher1][pass]
        )
        playlistlibraryPage.searchByCollection(collection.district)
        playlistlibraryPage.clickOnPlayListCardById(playlistid)

        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.verifyViewOnlyPermission()
      })
    })

    // public share is disabled in app
    /*  context('> public level share', () => {
      before('>login as author and get playlist', () => {
        cy.login('teacher', Author[email], Author[pass])
        playlistlibraryPage.seachAndClickPlayListById(playlistid)
      })

      it('> sharing at public level', () => {
        playlistlibraryPage.header.clickOnShare()
        testlibraryPage.removeShare()

        testlibraryPage.getPublicRadio().click({ force: true })
        testlibraryPage.clickSharePop()
      })

      it(`> for ${dist1_school2[teacher2][name]} from other district`, () => {
        cy.login(
          'teacher',
          dist2_school1[teacher1][email],
          dist2_school1[teacher1][pass]
        )
        playlistlibraryPage.searchByCollection(collection.public)
        playlistlibraryPage.clickOnPlayListCardById(playlistid)

        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.verifyViewOnlyPermission()
      })

      it(`> for ${dist1_school2[teacher1][name]}from other school`, () => {
        cy.login(
          'teacher',
          dist1_school2[teacher1][email],
          dist1_school2[teacher1][pass]
        )
        playlistlibraryPage.searchByCollection(collection.public)

        playlistlibraryPage.clickOnPlayListCardById(playlistid)
        playlistlibraryPage.reviewTab.clickExpandByModule(1)
        playlistlibraryPage.verifyViewOnlyPermission()
      })
    }) */
  })
})
