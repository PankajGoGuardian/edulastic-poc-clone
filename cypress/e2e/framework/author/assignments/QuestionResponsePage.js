import {
  questionTypeKey as queTypes,
  attemptTypes,
  queColor,
} from '../../constants/questionTypes'
import CypressHelper from '../../util/cypressHelpers'
import Helpers from '../../util/Helpers'

export default class QuestionResponsePage {
  // *** ELEMENTS START ***

  getDropDown = () => cy.get('.ant-select-selection')

  getDropDownMenu = () => cy.get('.ant-select-dropdown-menu')

  getScoreInput = (card) => card.find('[data-cy="scoreInput"]')

  getQuestionMaxScore = (card) => this.getScoreInput(card).next()

  getFeedbackArea = (card) => card.find('[data-cy="feedBackInput"]')

  getOverallFeedback = () => cy.get('[data-cy="overallFeedback"]')

  getTotalScore = () => cy.get('[data-cy="totalScore"]')

  getMaxScore = () => cy.get('[data-cy="totalMaxScore"]')

  getImprovement = () => cy.get('[data-cy="scoreChange"]')

  getQuestionContainer = (cardIndex) =>
    cy
      .get('[data-cy="student-question-container"]')
      // .find('[data-cy="question-container"]')
      .eq(cardIndex)

  getQuestionContainerByStudent = (studentName) =>
    cy
      .get('[data-cy="studentName"]')
      .contains(Helpers.getFormattedFirstLastName(studentName))
      .closest('[data-cy="student-question-container"]')
      .should(($ele) => expect(Cypress.dom.isAttached($ele)).to.be.true)

  // .find('[data-cy="question-container"]');

  getLabels = (qcard) => qcard.find('label')

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnUpdateButton = (card) =>
    card.find('[data-cy="updateButton"]').click({ force: true })

  selectStudent = (studentName) => {
    studentName = Helpers.getFormattedFirstLastName(studentName)
    let index = -1
    cy.server()
    cy.route('GET', '**/test-activity/**').as('test-activity')
    this.getDropDown().eq(0).click({ force: true })

    CypressHelper.getDropDownList((list) => {
      index = list.indexOf(studentName)
    })

    this.getDropDownMenu().contains(studentName).click({ force: true })

    if (index > 0) cy.wait('@test-activity')
    // if (!studentName.includes("Student01")) cy.wait("@test-activity");
    this.getQuestionContainer(0).should('contain', studentName)
    cy.wait(500) // detachment problem
  }

  selectAttempt = (attemptNum) => {
    let index = -1
    const attempt = `Attempt ${attemptNum} `
    cy.server()
    cy.route('GET', '**/test-activity/**').as('test-activity')
    cy.get('[data-cy="attemptSelect"]').click({ force: true })

    CypressHelper.getDropDownList((list) => {
      index = list.indexOf(attempt)
    })

    this.getDropDownMenu().contains(attempt).click({ force: true })
    if (index > 0) cy.wait('@test-activity')
  }

  selectQuestion = (queNum) => {
    // const questionSelect = `Question ${queNum.slice(1)}`;
    cy.server()
    cy.route('GET', '**/item/**').as('item')
    this.getDropDown().click({ force: true })
    this.getDropDownMenu()
      .contains(`Question ${queNum.slice(1)}`)
      .click({ force: true })
    if (queNum !== 'Q1') cy.wait('@item') // .then(xhr => xhr.response.body.result[0].testItemId);
    // else return cy.wait(1);
  }

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  enterOverAllFeedback = (feedback) => {
    cy.server()
    cy.route('PUT', '**overall-feedback**').as('overall-feedback')
    this.getOverallFeedback().click()

    cy.get('[data-cy="feedbackInput"]').type(feedback)
    cy.get('[data-cy="submit"]').click()

    cy.wait('@overall-feedback')
  }

  getScoreByAttempt = (
    attemptData,
    points,
    questionType,
    attemptType,
    penalty = 0
  ) => {
    let score = 0
    const { right, partialCorrect } = attemptData
    switch (questionType) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.TRUE_FALSE:
      case queTypes.MULTIPLE_CHOICE_BLOCK:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
        if (attemptType === attemptTypes.RIGHT) score = points
        else if (attemptType === attemptTypes.PARTIAL_CORRECT) {
          let correctChoices = 0
          let incorrectChoices = 0
          partialCorrect.forEach((ch) => {
            if (right.indexOf(ch) >= 0) correctChoices++
            else incorrectChoices++
          })
          score = Cypress._.round(
            (correctChoices / right.length) * points -
              (incorrectChoices / right.length) * penalty,
            2
          )
          if (score < 0) score = 0
        }
        break

      case queTypes.CHOICE_MATRIX_STANDARD:
      case queTypes.CHOICE_MATRIX_LABEL:
      case queTypes.CHOICE_MATRIX_INLINE:
        if (attemptType === attemptTypes.RIGHT) score = points
        else if (attemptType === attemptTypes.PARTIAL_CORRECT) {
          let correctChoices = 0
          Object.keys(partialCorrect).forEach((ch) => {
            if (partialCorrect[ch] === right[ch]) correctChoices++
          })
          score = Cypress._.round(
            (correctChoices / Object.keys(right).length) * points,
            2
          )
        }
        break

      case queTypes.CLOZE_DROP_DOWN:
      case queTypes.CLOZE_TEXT:
        if (attemptType === attemptTypes.RIGHT) score = points
        else if (attemptType === attemptTypes.PARTIAL_CORRECT) {
          let correctChoices = 0
          partialCorrect.forEach((ch, ind) => {
            if (ch === right[ind]) correctChoices++
          })
          score = Cypress._.round((correctChoices / right.length) * points, 2)
        }
        break

      case queTypes.ESSAY_RICH:
        score =
          attemptType === attemptTypes.RIGHT
            ? points
            : attemptType === attemptTypes.PARTIAL_CORRECT
            ? Cypress._.round(points / 2, 2)
            : 0
        break
      case queTypes.MATH_NUMERIC:
        score = attemptType === attemptTypes.RIGHT ? points : 0
        break
      default:
        break
    }
    return score
  }

  verifyScore = (card, points, attemptData, attemptType, questionType) => {
    const score = this.getScoreByAttempt(
      attemptData,
      points,
      questionType,
      attemptType
    )
    this.verifyScoreAndPointsByCard(card, score, points)
  }

  verifyScoreAndPointsByCard = (card, score, points) => {
    this.getScoreInput(card)
      .as('scoreinputbox')
      .should(($score) => {
        const value = Cypress.$($score).attr('value')
        expect(
          value,
          `verify score on response card, expected-${score}, found-${value}`
        ).to.eq(`${score}`)
      })
    // verify max score
    cy.get('@scoreinputbox').next().should('have.text', points.toString())
  }

  updateScoreAndFeedbackForStudent = (
    studentName,
    score,
    feedback,
    inExpGrader = false
  ) => {
    cy.server()
    const stringAdjust = inExpGrader ? '' : '{esc}'
    this.getScoreInput(this.getQuestionContainerByStudent(studentName)).then(
      ($Currestscore) => {
        const currentScore = Cypress.$($Currestscore).attr('value')
        if (
          !(
            typeof score === 'undefined' ||
            score === '' ||
            `${score}` === currentScore
          )
        ) {
          cy.wait(1000)
          cy.route('PUT', '**/response-entry-and-score').as('scoreEntry')

          this.getScoreInput(
            this.getQuestionContainerByStudent(studentName)
          ).type(`{selectall}{del}${score}${stringAdjust}`, { force: true })
          inExpGrader ? cy.contains('Student Feedback!').click() : undefined
          cy.wait('@scoreEntry').then((xhr) => {
            expect(
              xhr.status,
              `score update ${xhr.status === 200 ? 'success' : 'fialed'}`
            ).to.eq(200)
          })

          this.getScoreInput(
            this.getQuestionContainerByStudent(studentName)
          ).should(($score) => {
            const value = Cypress.$($score).attr('value')
            expect(
              value,
              `verify score on response card, expected-${score}, found-${value}`
            ).to.eq(`${score}`)
          })
        }
      }
    )

    if (feedback) {
      cy.wait(1000)
      cy.route('PUT', '**/feedback').as('feedback')
      this.getFeedbackArea(
        this.getQuestionContainerByStudent(studentName)
      ).type(`{selectall}${feedback}${stringAdjust}`, { force: true })
      inExpGrader ? cy.contains('Student Feedback!').click() : undefined
      cy.wait('@feedback').then((xhr) => {
        expect(
          xhr.status,
          `feed back update ${xhr.status === 200 ? 'success' : 'fialed'}`
        ).to.eq(200)
      })
    }
  }

  verifyScoreRight = (card, points) => {
    this.verifyScore(card, true, points)
  }

  verifyScoreWrong = (card, points) => {
    this.verifyScore(card, false, points)
  }

  verifyTotalScoreAndImprovement = (totalScore, maxScore, improvemnt) => {
    this.getTotalScore().should('have.text', `${totalScore}`)
    this.getMaxScore().should('have.text', `${maxScore}`)
    if (improvemnt)
      this.getImprovement().should(
        'have.text',
        `${Math.sign(improvemnt) == 1 ? '+' : ''}${improvemnt}`
      )
    else this.getImprovement().should('not.be.visible')
  }

  verifyOptionDisabled = (option) => {
    this.getDropDown().eq(0).click()
    this.getDropDownMenu()
      .contains(option)
      .should('have.class', 'ant-select-dropdown-menu-item-disabled')
  }

  // MCQ
  verifyLabelChecked = (quecard, choice) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest('label')
      .find('input')
      .should('be.checked')

  verifyLabelClass = (quecard, choice, classs) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest('label')
      .should('have.class', classs)

  verifyLabelBackgroundColor = (quecard, choice, color) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest('label')
      .should('have.css', 'background-color', color)

  // CHOICE MATRIX

  getMatrixTableRows = (card) =>
    card
      .find('[data-cy="matrixTable"]')
      .eq(0)
      .children()
      .find('tr.ant-table-row')

  verifyAnseredMatrix = (card, answer, steams, attemptType, right) => {
    // TODO : optimise below
    this.getMatrixTableRows(card).then((ele) => {
      Object.keys(answer).forEach((chKey) => {
        cy.wrap(ele)
          .contains(chKey)
          .closest('tr')
          .then((row) => {
            cy.wrap(row)
              .find('input')
              .eq(steams.indexOf(answer[chKey]))
              .should('be.checked')
              .closest('div')
              .should(
                'have.css',
                'background-color',
                attemptType === attemptTypes.RIGHT
                  ? queColor.LIGHT_GREEN
                  : attemptType === attemptTypes.WRONG
                  ? queColor.LIGHT_RED
                  : attemptType === attemptTypes.ALTERNATE
                  ? queColor.LIGHT_GREEN
                  : attemptType === attemptTypes.PARTIAL_CORRECT
                  ? answer[chKey] === right[chKey]
                    ? queColor.LIGHT_GREEN
                    : queColor.LIGHT_RED
                  : queColor.CLEAR_DAY
              )
          })
      })
    })
  }

  verifyCorrectAnseredMatrix = (card, correct, steams) => {
    // TODO : optimise below logic
    card
      .contains('Correct Answer')
      .next()
      .find('[data-cy="matrixTable"]')
      .children()
      .find('tr.ant-table-row')
      .then((ele) => {
        Object.keys(correct).forEach((chKey) => {
          cy.wrap(ele)
            .contains(chKey)
            .closest('tr')
            .then((row) => {
              cy.wrap(row)
                .find('input')
                .eq(steams.indexOf(correct[chKey]))
                .should('be.checked')
                .closest('div')
                .should('have.css', 'background-color', queColor.LIGHT_GREEN)
            })
        })
      })
  }

  verifyAlternateAnswredMatrix = (card, alternate, steams) => {
    // TODO : optimise below logic
    card
      .contains('Alternate Answer 1')
      .next()
      .find('[data-cy="matrixTable"]')
      .children()
      .find('tr.ant-table-row')
      .then((ele) => {
        Object.keys(alternate).forEach((chKey) => {
          cy.wrap(ele)
            .contains(chKey)
            .closest('tr')
            .then((row) => {
              cy.wrap(row)
                .find('input')
                .eq(steams.indexOf(alternate[chKey]))
                .should('be.checked')
                .closest('div')
                .should('have.css', 'background-color', queColor.LIGHT_GREEN)
            })
        })
      })
  }

  verifyCorrectAnswerClozeText = (card, right) => {
    card
      .contains('Correct Answer')
      .siblings()
      .then((ele) => {
        right.forEach((choice, i) => {
          cy.wrap(ele)
            .eq(i)
            .should('have.css', 'background-color', queColor.WHITE)
            .find('[class^="IndexBox"]')
            .should('have.css', 'background-color', queColor.GREY_3)
            .next()
            .should('contain.text', choice)
            .and('have.css', 'color', queColor.BLACK)
        })
      })
  }

  verifyAnswerClozeText = (card, attempt, attemptType, right) => {
    card
      .find('.jsx-parser')
      .find('[class^="AnswerBox"]')
      .each((response, i) => {
        cy.wrap(response).as('responseBox')

        if (attemptType !== attemptTypes.SKIP) {
          cy.get('@responseBox').should('contain.text', attempt[i])

          switch (attemptType) {
            case attemptTypes.RIGHT:
              cy.get('@responseBox')
                .should('have.css', 'background-color', queColor.LIGHT_GREEN)
                .find('svg')
                .should('have.css', 'fill', queColor.GREEN_2)

              break

            case attemptTypes.WRONG:
              cy.get('@responseBox')
                .should('have.css', 'background-color', queColor.LIGHT_RED)
                .find('svg')
                .should('have.css', 'fill', queColor.LIGHT_RED2)

              break

            case attemptTypes.PARTIAL_CORRECT:
              cy.get('@responseBox')
                .should(
                  'have.css',
                  'background-color',
                  right[i] === attempt[i]
                    ? queColor.LIGHT_GREEN
                    : queColor.LIGHT_RED
                )
                .find('svg')
                .should(
                  'have.css',
                  'fill',
                  attempt[i] === right[i]
                    ? queColor.GREEN_2
                    : queColor.LIGHT_RED2
                )

              break

            default:
              break
          }
        } else {
          cy.get('@responseBox').should(
            'have.css',
            'background-color',
            queColor.GREY_4
          )
        }
      })
  }

  // CLOZE_DROP_DOWN
  verifyCorrectAnswerClozeDropDown = (card, right) => {
    card
      .contains('Correct Answer')
      .siblings()
      .find('[data-cy="styled-wrapped-component"]')
      .then((ele) => {
        right.forEach((choice, i) => {
          cy.wrap(ele)
            .eq(i)
            .should('contain.text', choice)
            .should('have.css', 'color', queColor.BLACK)
        })
      })
  }

  verifyAnswerClozeDropDown = (card, attempt, attemptType, right) => {
    card
      .find('.jsx-parser')
      // .find(".response-btn ")
      .find('[data-cy="answer-box"]')
      .each((response, i) => {
        cy.wrap(response).as('responseBox')
        // .should("have.class", "show-answer");

        if (attemptType !== attemptTypes.SKIP) {
          cy.get('@responseBox').should('contain.text', attempt[i])
          // .and("have.class", "check-answer");

          switch (attemptType) {
            case attemptTypes.RIGHT:
              cy.get('@responseBox')
                // .should("have.class", "right")
                .should('have.css', 'background-color', queColor.LIGHT_GREEN)
                .find('svg')
                .should('have.css', 'fill', queColor.GREEN_8)
              break

            case attemptTypes.WRONG:
              cy.get('@responseBox')
                // .should("have.class", "wrong")
                .should('have.css', 'background-color', queColor.LIGHT_RED)
                .find('svg')
                .should('have.css', 'fill', queColor.LIGHT_RED2)

              break

            case attemptTypes.PARTIAL_CORRECT:
              cy.get('@responseBox')
                // .should("have.class", attempt[i] === right[i] ? "right" : "wrong");;
                .should(
                  'have.css',
                  'background-color',
                  attempt[i] === right[i]
                    ? queColor.LIGHT_GREEN
                    : queColor.LIGHT_RED
                )
                .find('svg')
                .should(
                  'have.css',
                  'fill',
                  attempt[i] === right[i]
                    ? queColor.GREEN_8
                    : queColor.LIGHT_RED2
                )
              break

            default:
              break
          }
        } else {
          cy.get('@responseBox')
            // .should("not.have.class", "check-answer")
            // .and("have.class", "wrong");
            .should('have.css', 'background-color', queColor.GREY_4)
        }
      })
  }

  verifyCorrectAnsMathNumeric = (card, right) => {
    card
      .contains('Correct Answer')
      .next()
      .find('.katex-html')
      .first()
      .should('contain.text', right)
  }

  verifyResponseByAttemptMathNumeric = (
    card,
    attempt,
    attemptType,
    itemPreview = false
  ) => {
    if (attemptType !== attemptTypes.SKIP) {
      cy.get('@quecard')
        .find('[class^="MathInputWrapper"]')
        .should('contain.text', attempt)
      cy.get('@quecard')
        .find(`[class^="Icon"]`)
        .first()
        .find('svg')
        .should(
          'have.css',
          'fill',
          attemptType === attemptTypes.RIGHT
            ? queColor.GREEN_8
            : queColor.LIGHT_RED2
        )
    }
    cy.get('@quecard')
      .find('[class^="MathInputWrapper"]')
      .should(
        'have.css',
        'background-color',
        attemptType === attemptTypes.RIGHT
          ? queColor.LIGHT_GREEN
          : attemptType === attemptTypes.WRONG
          ? queColor.LIGHT_RED
          : queColor.GREY_2
      )
  }

  verifyResponseEssayRich = (card, attempt, attemptType) => {
    if (attemptType !== attemptTypes.SKIP)
      card.find('.math-formula-display').should('have.text', attempt)
  }

  verifyNoCorrectAnsEssayType = (card) =>
    card.should('not.contain', 'Correct Answer')

  verifyNoQuestionResponseCard = (studentName) => {
    cy.get('[data-cy="studentName"]')
      .contains(Helpers.getFormattedFirstLastName(studentName))
      .should('not.exist')
  }

  verifyQuestionResponseCardExist = (studentName) => {
    cy.get('[data-cy="studentName"]')
      .contains(Helpers.getFormattedFirstLastName(studentName))
      .should('exist')
  }

  verifyQuestionResponseCard = (
    points,
    queTypeKey,
    attemptType,
    attemptData,
    studentCentric = true,
    findKey
  ) => {
    const queCard = studentCentric
      ? this.getQuestionContainer(findKey).as('quecard')
      : this.getQuestionContainerByStudent(findKey).as('quecard')

    const { right, wrong, partialCorrect } = attemptData
    const attempt =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : undefined

    const questionType = queTypeKey.split('.')[0]

    if (points)
      this.verifyScore(
        cy.get('@quecard'),
        points,
        attemptData,
        attemptType,
        questionType
      )

    switch (questionType) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
      case queTypes.TRUE_FALSE:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right))
              right.forEach((choice) =>
                this.verifyLabelChecked(cy.get('@quecard'), choice)
              )
            else {
              this.verifyLabelChecked(cy.get('@quecard'), right)
            }

            break

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach((choice) => {
                this.verifyLabelChecked(cy.get('@quecard'), choice)
                this.verifyLabelClass(
                  cy.get('@quecard'),
                  choice,
                  attemptTypes.WRONG
                )
              })
            } else {
              this.verifyLabelChecked(cy.get('@quecard'), wrong)
              this.verifyLabelClass(
                cy.get('@quecard'),
                wrong,
                attemptTypes.WRONG
              )
            }
            break

          case attemptTypes.SKIP:
            break

          case attemptTypes.PARTIAL_CORRECT:
            if (Cypress._.isArray(partialCorrect))
              partialCorrect.forEach((choice) =>
                this.verifyLabelChecked(cy.get('@quecard'), choice)
              )
            else {
              this.verifyLabelChecked(cy.get('@quecard'), partialCorrect)
            }
            break

          default:
            break
        }

        if (Cypress._.isArray(right)) {
          right.forEach((choice) =>
            this.verifyLabelClass(
              cy.get('@quecard'),
              choice,
              attemptTypes.RIGHT
            )
          )
        } else {
          this.verifyLabelClass(cy.get('@quecard'), right, attemptTypes.RIGHT)
        }

        break

      case queTypes.MULTIPLE_CHOICE_BLOCK:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right)) {
              right.forEach((choice) =>
                this.verifyLabelBackgroundColor(
                  cy.get('@quecard'),
                  choice,
                  queColor.LIGHT_GREEN
                )
              )
            } else {
              this.verifyLabelBackgroundColor(
                cy.get('@quecard'),
                right,
                queColor.LIGHT_GREEN
              )
            }
            break

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach((choice) => {
                this.verifyLabelBackgroundColor(
                  cy.get('@quecard'),
                  choice,
                  queColor.LIGHT_RED
                )
                this.verifyLabelClass(
                  cy.get('@quecard'),
                  choice,
                  attemptTypes.WRONG
                )
              })
            } else {
              this.verifyLabelBackgroundColor(
                cy.get('@quecard'),
                wrong,
                queColor.LIGHT_RED
              )
              this.verifyLabelClass(
                cy.get('@quecard'),
                wrong,
                attemptTypes.WRONG
              )
            }

            break

          case attemptTypes.SKIP:
            break

          default:
            break
        }
        if (Cypress._.isArray(right)) {
          right.forEach((choice) => {
            this.verifyLabelClass(
              cy.get('@quecard'),
              choice,
              attemptTypes.RIGHT
            )
          })
        } else
          this.verifyLabelClass(cy.get('@quecard'), right, attemptTypes.RIGHT)
        break

      case queTypes.CHOICE_MATRIX_STANDARD:
      case queTypes.CHOICE_MATRIX_INLINE:
      case queTypes.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData
        this.verifyCorrectAnseredMatrix(
          cy.get('@quecard'),
          right,
          steams,
          attemptType
        )
        switch (attemptType) {
          case attemptTypes.RIGHT:
            this.verifyAnseredMatrix(
              cy.get('@quecard'),
              right,
              steams,
              attemptType
            )
            break

          case attemptTypes.WRONG:
            this.verifyAnseredMatrix(
              cy.get('@quecard'),
              wrong,
              steams,
              attemptType
            )
            break

          case attemptTypes.PARTIAL_CORRECT:
            this.verifyAnseredMatrix(
              cy.get('@quecard'),
              partialCorrect,
              steams,
              attemptType,
              right
            )
            break

          default:
            break
        }
        break
      }

      case queTypes.CLOZE_DROP_DOWN:
        this.verifyCorrectAnswerClozeDropDown(cy.get('@quecard'), right)
        this.verifyAnswerClozeDropDown(
          cy.get('@quecard'),
          attempt,
          attemptType,
          right
        )
        break

      case queTypes.CLOZE_TEXT:
        this.verifyCorrectAnswerClozeText(cy.get('@quecard'), right)
        this.verifyAnswerClozeText(
          cy.get('@quecard'),
          attempt,
          attemptType,
          right
        )
        break

      case queTypes.MATH_NUMERIC:
        this.verifyCorrectAnsMathNumeric(cy.get('@quecard'), right)
        this.verifyResponseByAttemptMathNumeric(
          cy.get('@quecard'),
          attempt,
          attemptType
        )
        break

      case queTypes.ESSAY_RICH:
        this.verifyResponseEssayRich(cy.get('@quecard'), attempt, attemptType)
        this.verifyNoCorrectAnsEssayType(cy.get('@quecard'))
        break
      default:
        break
    }
  }

  getDropDownListAsArray = () => {
    this.getDropDown().eq(0).click({ force: true })
    return CypressHelper.getDropDownList()
  }

  getAllStudentName = () =>
    cy.get('[data-cy="studentName"]').then(($ele) => {
      const studentNames = []
      $ele.each((i, s) => {
        studentNames.push(Cypress.$(s).text())
      })
      console.log('studentNames', studentNames)
      return studentNames
      // return studentNames.map(n => n.substr(n.indexOf(" ") + 1));
    })

  // *** APPHELPERS END ***
}
