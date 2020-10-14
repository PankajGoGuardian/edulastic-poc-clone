import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import { COLLECTION } from '../../../../framework/constants/questionTypes'
import {
  grades,
  subject as subjects,
} from '../../../../framework/constants/assignmentStatus'
import { getNumberInRange } from '../../../../framework/constants/constantFunctions'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}>> playlist library / search`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()

  const { _ } = Cypress
  const playlistTags = { 1: 'pl-tag-1', 2: 'pl-tag-2', 3: 'pl-tag-3' }
  const testid = '5f5201e04a208a00084bf63f'
  const moduledata = { module1: [testid] }
  const teacher = 'teacher.playlistsearch@snapwiz.com'
  const metadata = [
    {
      name: 'playlist-1',
      grade: grades.GRADE_10,
      subject: subjects.MATH,
      tags: [playlistTags[1]],
      existingPlaylistId: '5f525e947d61d2000724e68e',
      description: 'this is playlist-1',
    },
    {
      name: 'playlist-2',
      grade: grades.KINDERGARTEN,
      subject: subjects.SOCIAL_STUDIES,
      tags: [playlistTags[2]],
      existingPlaylistId: '5f525eb43b15110008485e7b',
      description: 'this is playlist-2',
    },
    {
      name: 'playlist-3',
      grade: grades.GRADE_4,
      subject: subjects.CS,
      tags: [playlistTags[3]],
      existingPlaylistId: '5f525ee1a474560007b14d6d',
      description: 'this is playlist-3',
    },
  ]
  const usedPlaylists = [metadata[0].existingPlaylistId]

  before('create playlists', () => {
    cy.getAllPlaylistsAndDelete(
      teacher,
      'snapwiz',
      metadata.map(({ existingPlaylistId }) => existingPlaylistId)
    )
    cy.login('teacher', teacher)
    metadata.forEach((data, i) => {
      playlistlibraryPage
        .createPlayListWithTests({ metadata: data, moduledata })
        .then((id) => {
          metadata[i].newPlaylistId = id
          if (!i) {
            /* to verify prev used playlist */
            usedPlaylists.push(id)
            playlistlibraryPage.header.clickOnUseThis()
          }
          playlistlibraryPage.sidebar.clickOnItemBank()
        })
    })
  })

  context('> authored by me', () => {
    context('> list view', () => {
      before('> switch to list view', () => {
        playlistlibraryPage.sidebar.clickOnPlayListLibrary()
        testlibraryPage.clickOnListView()
        playlistlibraryPage.searchFilter.clearAll()
        playlistlibraryPage.searchFilter.typeInSearchBox(
          metadata[2].newPlaylistId
        )
      })

      it('> title, description', () => {
        const { name, description, newPlaylistId } = metadata[2]
        testlibraryPage.verifyDescriptionOnTestCardById(
          newPlaylistId,
          description
        )
        testlibraryPage.verifyNameOnTestCardById(newPlaylistId, name)
      })

      it('> id, author name', () => {
        const { newPlaylistId } = metadata[2]
        testlibraryPage.verifyTestIdOnTestCardById(newPlaylistId)
        testlibraryPage.verifyAuthorNameOnTestCardById(newPlaylistId, 'Teacher')
      })
    })

    context('> tile view', () => {
      before('> switch to list view', () => {
        testlibraryPage.clickOnTileView()
        playlistlibraryPage.searchFilter.clearAll()
        playlistlibraryPage.searchFilter.typeInSearchBox(
          metadata[2].existingPlaylistId
        )
      })

      it('> title, description and tags', () => {
        const { name, description, tags, existingPlaylistId } = metadata[2]
        playlistlibraryPage.verifyDescriptionOnPlaylistById(
          existingPlaylistId,
          description
        )
        testlibraryPage.verifyNameOnTestCardById(existingPlaylistId, name)
        testlibraryPage.verifyTagsOnTestCardById(existingPlaylistId, tags)
      })

      it('> id, author name', () => {
        const { existingPlaylistId } = metadata[2]
        testlibraryPage.verifyTestIdOnTestCardById(existingPlaylistId)
        testlibraryPage.verifyAuthorNameOnTestCardById(
          existingPlaylistId,
          'Teacher'
        )
      })
    })

    context('> search using search bar', () => {
      it("> search by 'name'", () => {
        metadata
          .slice(0, 2)
          .forEach(({ name, existingPlaylistId, newPlaylistId }) => {
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.typeInSearchBox(name)
            ;[existingPlaylistId, newPlaylistId].forEach((_id, i) => {
              playlistlibraryPage.getPlayListCardById(_id).then((ele) => {
                assert.isObject(
                  cy.wrap(ele).should('be.visible'),
                  `search by name for ${i ? 'existing' : 'new'} playlist`
                )
              })
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> search by 'grade'", () => {
        metadata
          .slice(0, 2)
          .forEach(({ grade, existingPlaylistId, newPlaylistId }) => {
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.typeInSearchBox(grade)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> search by 'id'", () => {
        metadata
          .slice(0, 1)
          .forEach(({ existingPlaylistId, newPlaylistId }) => {
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.searchFilter.clearAll()
              playlistlibraryPage.searchFilter.getAuthoredByMe()
              playlistlibraryPage.searchFilter.typeInSearchBox(_id)

              playlistlibraryPage.getPlayListCardById(_id)
              testlibraryPage
                .getAllTestCardsInCurrentPage()
                .should('have.length', 1)
            })
          })
      })

      it("> search by 'tag'", () => {
        metadata
          .slice(0, 2)
          .forEach(({ tags, existingPlaylistId, newPlaylistId }) => {
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.typeInSearchBox(tags[0])
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> search by 'name + tag'", () => {
        metadata
          .slice(0, 2)
          .forEach(({ tags, name, existingPlaylistId, newPlaylistId }) => {
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.typeInSearchBox(tags[0])
            playlistlibraryPage.searchFilter.typeInSearchBox(name)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })
    })

    context('> search using filters', () => {
      // TODO: check if wait for search xhr and cy commands execute in parallel
      it("> using 'grades'", () => {
        metadata
          .slice(1)
          .forEach(({ grade, existingPlaylistId, newPlaylistId }) => {
            const standards = { grade: [grade] }
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.setFilters({ standards }, false)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> using 'subjects'", () => {
        metadata
          .slice(1)
          .forEach(({ subject, existingPlaylistId, newPlaylistId }) => {
            const standards = { subject }
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.setFilters({ standards }, false)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> using 'tags'", () => {
        metadata
          .slice(1)
          .forEach(({ tags, existingPlaylistId, newPlaylistId }) => {
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.setFilters({ tags }, false)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> using collection- 'private library'", () => {
        playlistlibraryPage.searchFilter.clearAll()
        playlistlibraryPage.searchFilter.setFilters(
          { collection: COLLECTION.private },
          false
        )

        metadata.forEach(({ existingPlaylistId, newPlaylistId }) => {
          ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
            playlistlibraryPage.getPlayListCardById(_id)
          })
          testlibraryPage
            .getAllTestCardsInCurrentPage()
            .should('have.length', 6)
        })
      })

      it("> using 'grade+subject'", () => {
        metadata
          .slice(0, 2)
          .forEach(({ grade, subject, existingPlaylistId, newPlaylistId }) => {
            const standards = { grade: [grade], subject }
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.setFilters({ standards }, false)
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
            })
            testlibraryPage
              .getAllTestCardsInCurrentPage()
              .should('have.length', 2)
          })
      })

      it("> using 'tags+subject'", () => {
        metadata
          .slice(1)
          .forEach(({ tags, subject, existingPlaylistId, newPlaylistId }) => {
            const standards = { subject }
            playlistlibraryPage.searchFilter.clearAll()
            playlistlibraryPage.searchFilter.getAuthoredByMe()
            playlistlibraryPage.searchFilter.setFilters(
              { standards, tags },
              false
            )
            ;[existingPlaylistId, newPlaylistId].forEach((_id) => {
              playlistlibraryPage.getPlayListCardById(_id)
              testlibraryPage
                .getAllTestCardsInCurrentPage()
                .should('have.length', 2)
            })
          })
      })
    })
  })

  context('> entire library', () => {
    context('> search using filters', () => {
      before('> navigate to other place', () => {
        playlistlibraryPage.sidebar.clickOnDashboard()
      })
      beforeEach('> clear filter', () => {
        playlistlibraryPage.sidebar.clickOnPlayListLibrary()
        playlistlibraryPage.searchFilter.clearAll()
      })

      it("> using 'grades'", () => {
        const randomGrade = _.shuffle(_.values(grades).slice(0, 11))[0]
        const standards = { grade: [randomGrade] }
        playlistlibraryPage.searchFilter.setFilters({ standards }, false)

        testlibraryPage.getAllTestCardsInCurrentPage().then(($ele) => {
          testlibraryPage
            .getTestIdOfCardInCurrentPageByIndex(
              getNumberInRange(0, $ele.length)
            )
            .then((id) => {
              playlistlibraryPage.clickOnPlayListCardById(id)
              playlistlibraryPage.reviewTab.verifyGradeWhenMultipleGrades(
                randomGrade
              )
              /* to verify prev used playlist */
              playlistlibraryPage.header.clickOnUseThis()
              usedPlaylists.push(id)
            })
        })
      })

      it("> using 'subjects'", () => {
        const standards = { subject: subjects.MATH }
        playlistlibraryPage.searchFilter.setFilters({ standards }, false)

        testlibraryPage.getAllTestCardsInCurrentPage().then(($ele) => {
          testlibraryPage
            .getTestIdOfCardInCurrentPageByIndex(
              getNumberInRange(0, $ele.length)
            )
            .then((id) => {
              playlistlibraryPage.clickOnPlayListCardById(id)
              playlistlibraryPage.reviewTab.verifyPlalistSubject(subjects.MATH)
            })
        })
      })

      it("> using 'grades+subjects'", () => {
        const randomGrade = _.shuffle(_.values(grades).slice(0, 11))[0]
        const standards = { subject: subjects.MATH, grade: [randomGrade] }
        playlistlibraryPage.searchFilter.setFilters({ standards }, false)

        testlibraryPage.getAllTestCardsInCurrentPage().then(($ele) => {
          testlibraryPage
            .getTestIdOfCardInCurrentPageByIndex(
              getNumberInRange(0, $ele.length)
            )
            .then((id) => {
              playlistlibraryPage.clickOnPlayListCardById(id)
              playlistlibraryPage.reviewTab.verifyPlalistSubject(subjects.MATH)
              playlistlibraryPage.reviewTab.verifyGradeWhenMultipleGrades(
                randomGrade
              )
            })
        })
      })
    })
  })

  context('> previously used playlists', () => {
    before('> navigate to previously used playlist', () => {
      playlistlibraryPage.sidebar.clickOnDashboard()
      playlistlibraryPage.sidebar.clickOnPlayListLibrary()

      playlistlibraryPage.searchFilter.clearAll()
      playlistlibraryPage.searchFilter.clickOnPreviouslyUsed()
    })

    it('> existing playlist', () => {
      playlistlibraryPage
        .getPlayListCardById(usedPlaylists[0])
        .should('be.visible')
    })

    it('> new playlist', () => {
      playlistlibraryPage
        .getPlayListCardById(usedPlaylists[1])
        .should('be.visible')
    })

    it('> playlist from entire library', () => {
      playlistlibraryPage
        .getPlayListCardById(usedPlaylists[2])
        .should('be.visible')
    })
  })
})
