import { studentSide } from '../../constants/assignmentStatus'
import { attemptTypes } from '../../constants/questionTypes'
import LiveClassboardPage from './LiveClassboardPage'
import Helpers from '../../util/Helpers'

export default class StandardBasedReportPage extends LiveClassboardPage {
  // *** ELEMENTS START ***

  getStandardRow = (standard) => cy.contains(standard).closest('tr')

  getTableHeader = () => cy.get('.ant-table-thead').eq(0)

  getTableHeaderElements = () => this.getTableHeader().find('th')

  // *** ELEMENTS END ***

  // *** ACTIONS START ***
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  getStandardPerformance = (stuAttemptData, questionTypeMap) => {
    const allStandardPerformance = {}
    const queList = Object.keys(questionTypeMap)

    stuAttemptData
      .filter(
        ({ status }) =>
          status === studentSide.SUBMITTED || status === studentSide.IN_PROGRESS
      )
      .forEach(({ attempt, stuName }) => {
        queList.forEach((queNum) => {
          const { points, standards, attemptData, queKey } = questionTypeMap[
            queNum
          ]
          const attemptType = attempt[queNum]
          standards.forEach(({ standard }) => {
            standard.forEach((std) => {
              // debugger;
              let scoreObtain = 0
              let maxScore = 0
              let perfPerQue = []
              if (!allStandardPerformance[std]) {
                allStandardPerformance[std] = { students: {}, questions: [] }
                allStandardPerformance[std].students[stuName] = {}
              } else if (!allStandardPerformance[std].students[stuName]) {
                allStandardPerformance[std].students[stuName] = {}
              } else if (allStandardPerformance[std].students[stuName].max) {
                scoreObtain =
                  allStandardPerformance[std].students[stuName].obtain
                maxScore = allStandardPerformance[std].students[stuName].max
                perfPerQue =
                  allStandardPerformance[std].students[stuName]
                    .performanceAllQue
              }
              allStandardPerformance[
                std
              ].questions = Cypress._.union(
                allStandardPerformance[std].questions,
                [queNum]
              )
              // if (attemptType === attemptTypes.RIGHT) scoreObtain += points;
              const score = this.questionResponsePage.getScoreByAttempt(
                attemptData,
                points,
                queKey.split('.')[0],
                attemptType
              )
              const performance = score / points
              scoreObtain += score
              maxScore += points
              perfPerQue.push(performance)
              allStandardPerformance[std].students[stuName] = {
                obtain: scoreObtain,
                max: maxScore,
                performanceAllQue: perfPerQue,
              }
            })
          })
        })
      })

    return allStandardPerformance
  }

  verifyStandardPerformance = (attemptData, questionTypeMap) => {
    const performanceData = this.getStandardPerformance(
      attemptData,
      questionTypeMap
    )
    let allStandards = []

    const queList = Object.keys(questionTypeMap)

    queList.forEach((que) => {
      let stdPerQue = []
      const { standards } = questionTypeMap[que]
      standards.forEach(({ standard }) => {
        stdPerQue = Cypress._.union(stdPerQue, standard)
      })
      allStandards = Cypress._.union(allStandards, stdPerQue)
    })

    allStandards.forEach((standard, index) => {
      this.verifyStanadardPerformanceForStandard(
        standard,
        performanceData[standard],
        index
      )
    })
  }

  calculateScoreAndPerfForStandard = (performanceData) => {
    let stdScore = 0
    let stdMax = 0
    let overallAvgStdPerformance = []
    const allStudentPerformance = []

    const { students } = performanceData
    Object.keys(students).forEach((student) => {
      const { obtain, max, performanceAllQue } = students[student]
      overallAvgStdPerformance = overallAvgStdPerformance.concat(
        performanceAllQue
      )
      stdScore += obtain
      stdMax += max
      allStudentPerformance.push(obtain / max)
    })

    return Cypress._.round(
      (Cypress._.sum(allStudentPerformance) / allStudentPerformance.length) *
        100,
      2
    ) // avg of student individual performance
    // return Cypress._.round((Cypress._.sum(overallAvgStdPerformance) / overallAvgStdPerformance.length) * 100, 2); // avg of all student attempts
    // return Cypress._.round((stdScore / stdMax) * 100, 2);
  }

  verifyStudentPerformance = (students) => {
    cy.contains('Student Performance')
      .closest('.ant-card-body')
      .then((ele) => {
        cy.wrap(ele).find('.ant-table-tbody').as('table')
        Object.keys(students).forEach((student) => {
          const { obtain, max, performanceAllQue } = students[student]
          let perfSum = 0
          performanceAllQue.forEach((perf) => {
            perfSum += perf
          })

          cy.contains(Helpers.getFormattedFirstLastName(student))
            .closest('tr')
            .as('studentrow')
            .find('td')
            .last()
            .find('span')
            .eq(0)
            // TODO : below assertions if fails cypress doesn't come out of running loop
            /*  .then(score => {
              expect(score.text(), `verify stadard wise student score for student - ${student}`).to.eq(
                `${obtain}/${max}`
              );
            }); */
            .should('have.text', `${obtain}/${max}`)

          cy.get('@studentrow')
            .find('td')
            .last()
            .find('span')
            .eq(1)
            /* .then(stdPeformance => {
              expect(stdPeformance.text(), `verify stadard wise student peformance for student - ${student}`).to.eq(
                `(${Cypress._.round((obtain / max) * 100, 2)}%)`
              );
            }); */
            // .should("have.text", `(${Cypress._.round((perfSum / performanceAllQue.length) * 100, 2)}%)`);
            .should(
              'have.text',
              `(${Cypress._.round((obtain / max) * 100, 2)}%)`
            )
        })
      })
  }

  verifyStanadardPerformanceForStandard = (
    standard,
    performanceData,
    index
  ) => {
    const stdPerf = this.calculateScoreAndPerfForStandard(performanceData)
    const { questions, students } = performanceData

    this.getStandardRow(standard).as('row')

    cy.get('@row')
      .find('td')
      .eq(1)
      .find('div')
      .then((ele) => {
        questions.forEach((que) => cy.wrap(ele).should('contain', que))
        /* questions.forEach(que =>
          expect(ele.text(), `verify question list for standard ${standard} to contain ${que}`).to.contain(que)
        ); */
      })

    cy.get('@row')
      .find('td')
      .eq(3)
      .then((ele) => {
        cy.wrap(ele).find('div').should('have.text', `${stdPerf}`)
        /* .then(stdperf =>
            expect(stdperf.text(), `verify standard performance for the standard ${standard}`).to.eq(`${stdPerf}`)
          ); */
      })

    if (index > 0) {
      cy.get('@row').find('td').last().click()
    }
    this.verifyStudentPerformance(students)
  }

  verifyClassAndAssignmntId = (classId, assignmnetId) =>
    cy
      .url()
      .should(
        'include',
        `/author/standardsBasedReport/${assignmnetId}/${classId}`
      )

  // *** APPHELPERS END ***
}
