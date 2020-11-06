/* eslint-disable default-case */
import QuestionResponsePage from '../assignments/QuestionResponsePage'
import {
  attemptTypes,
  queColor,
  questionTypeKey,
} from '../../constants/questionTypes'
import CypressHelper from '../../util/cypressHelpers'

export default class PreviewItemPopup {
  constructor() {
    this.qrp = new QuestionResponsePage()
  }

  // *** ELEMENTS START ***

  getQueContainer = () => cy.get('[data-cy="question-container"]')

  // Edit and Copy buuton on preview
  getEditOnPreview = () => cy.get('[title="Edit item"]')

  getCopyOnPreview = () => cy.get('[title="Clone"]')

  // text in edit item page
  getTextInEditItem = () =>
    cy.get('[data-cy="tabs"]').next().find('input').eq(0)

  getQueContainerById = (id) =>
    cy.get(`[data-cy="${id}"]`).find('[data-cy="question-container"]')

  getEvaluationMessage = () => cy.get('.ant-message-custom-content')

  getIdOnPreview = () => cy.get('[data-cy="item-id-on-preview"]')

  getTeacherNameOnPreview = () => cy.get('[data-cy="teacher-name-on-preview"]')

  getPointsOnPreview = () => cy.get('[data-cy="points-on-preview"]')

  getDokOnPreview = () => cy.get('[data-cy="dok-on-preview"]')

  getDifficultyOnPreview = () => cy.get('[data-cy="diff-on-preview"]')

  getStandardsOnPreview = () => cy.get('[data-cy="standards-on-preview"]')

  getTagsOnPreview = () => cy.get('[data-cy="tags-on-preview"]')

  getRemoveFromTestButton = () => cy.contains('span', 'Remove from Test')

  getAddToTestButton = () => cy.contains('span', 'Add To Test')

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  closePreiview = () => {
    const eleCount = Cypress.$('[data-cy="close-preview"]').length
    if (eleCount === 1) Cypress.$('[data-cy="close-preview"]').click()
  }

  clickOnShowAnsOnPreview = () =>
    cy.get('[data-cy="show-answers-btn"]').click({ force: true })

  clickOnCheckAnsOnPreview = () =>
    cy.get('[data-cy="check-answer-btn"]').click({ force: true })

  clickOnCopyItemOnPreview = () => {
    cy.server()
    cy.route('POST', '**/testitem/*/duplicate').as('clone-item')
    this.getCopyOnPreview().click({ force: true })
    return cy.wait('@clone-item').then((xhr) => {
      assert(
        xhr.status === 200,
        `item clone ${xhr.status === 200 ? 'success' : 'failed'}`
      )
      return xhr.response.body.result._id
    })
  }

  clickEditOnPreview = () => {
    cy.server()
    cy.route('GET', '**/testitem/*').as('editItem')
    this.getEditOnPreview().click({ force: true })
    return cy.wait('@editItem').then((xhr) => xhr.response.body.result._id)
  }

  clickOnEditItemOnPreview = () => {
    cy.server()
    cy.route('GET', '**/api/testitem/*').as('editItem')
    this.getEditOnPreview().click({ force: true })
    cy.wait('@editItem')
  }

  clickOnDeleteOnPreview = (used = false) => {
    cy.server()
    cy.route('DELETE', '**/api/testitem/*').as('deleteItem')
    cy.get('[title="Delete item"]').click({ force: true })

    if (used) {
      cy.wait('@deleteItem').then((xhr) => expect(xhr.status).eq(403))
      // this.getEvaluationMessage().should("contain", `The item is used in the test`);
    } else {
      cy.wait('@deleteItem').then((xhr) => expect(xhr.status).eq(200))
      // this.getEvaluationMessage().should("contain", `item deleted successfully`);
    }
  }

  clickOnClear = () => cy.get('[data-cy="clear-btn"]').click({ force: true })

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  // When we are edit/copy a item from test its url include test id
  verifyItemUrlWhileEdit = (testId, ItemId) => {
    // cy.url().should("contain", `/author/items/${ItemId}/item-detail/test/${testId}`);
    cy.url().should('contain', `/tests/${testId}/editItem/${ItemId}`)
  }

  verifyItemUrlWhileCopy = (testId, ItemId) => {
    // cy.url().should("contain", `/author/items/${ItemId}/item-detail/test/${testId}`);
    cy.url().should('contain', `/tests/${testId}/editItem/${ItemId}`)
  }

  // *** APPHELPERS END ***

  verifyEvaluationScoreOnPreview = (
    attemptData,
    points,
    questionType,
    attemptType
  ) => {
    const score = this.qrp.getScoreByAttempt(
      attemptData,
      points,
      questionType.split('.')[0],
      attemptType
    )
    // this.getEvaluationMessage()
    const evalText =
      attemptType === attemptTypes.WRONG ? 'Incorrect' : 'Correct'
    cy.get('[data-cy="score"]').should(
      'contain',
      `${evalText} (${score}/${points})`
    )
  }

  verifyEditOption = () => {
    this.getEditOnPreview().should('be.visible')
    this.getCopyOnPreview().should('be.visible')
  }

  verifyNoEditCloneOption = () => {
    this.getEditOnPreview().should('not.be.visible')
    this.getCopyOnPreview().should('be.visible')
  }

  verifyQuestionResponseCard = (
    queTypeKey,
    attemptData,
    attemptType,
    isShowAnswer = false,
    queIndex = 0,
    alternateAnswer = false
  ) => {
    const { right, wrong, partialCorrect, alternate, item } = attemptData
    const attempt =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : attemptType === attemptTypes.ALTERNATE
        ? alternate
        : undefined
    const quest = queTypeKey.split('.')[0]
    if (!item)
      cy.get('[data-cy="question-container"]').eq(queIndex).as('quecard')
    else {
      this.getQueContainerById(item).as('quecard')
    }
    if (attemptData.hasOwnProperty('item')) delete attemptData.item

    switch (quest) {
      case questionTypeKey.MULTIPLE_CHOICE_STANDARD:
      case questionTypeKey.MULTIPLE_CHOICE_MULTIPLE:
      case questionTypeKey.TRUE_FALSE:
      case questionTypeKey.MULTIPLE_CHOICE_BLOCK:
        if (isShowAnswer) {
          if (Cypress._.isArray(right)) {
            right.forEach((choice) => {
              this.qrp.verifyLabelClass(
                cy.get('@quecard'),
                choice,
                attemptTypes.RIGHT
              )
              this.qrp.verifyLabelBackgroundColor(
                cy.get('@quecard'),
                choice,
                queColor.LIGHT_GREEN
              )
            })
          } else {
            this.qrp.verifyLabelClass(
              cy.get('@quecard'),
              right,
              attemptTypes.RIGHT
            )
            this.qrp.verifyLabelBackgroundColor(
              cy.get('@quecard'),
              right,
              queColor.LIGHT_GREEN
            )
          }
        } else {
          switch (attemptType) {
            case attemptTypes.RIGHT:
              if (Cypress._.isArray(right)) {
                right.forEach((choice) => {
                  this.qrp.verifyLabelChecked(cy.get('@quecard'), choice)
                  this.qrp.verifyLabelClass(
                    cy.get('@quecard'),
                    choice,
                    attemptTypes.RIGHT
                  )
                  this.qrp.verifyLabelBackgroundColor(
                    cy.get('@quecard'),
                    choice,
                    queColor.LIGHT_GREEN
                  )
                })
              } else {
                this.qrp.verifyLabelChecked(cy.get('@quecard'), right)
                this.qrp.verifyLabelClass(
                  cy.get('@quecard'),
                  right,
                  attemptTypes.RIGHT
                )
                this.qrp.verifyLabelBackgroundColor(
                  cy.get('@quecard'),
                  right,
                  queColor.LIGHT_GREEN
                )
              }
              break
            case attemptTypes.WRONG:
              if (Cypress._.isArray(wrong)) {
                wrong.forEach((choice) => {
                  this.qrp.verifyLabelChecked(cy.get('@quecard'), choice)
                  this.qrp.verifyLabelClass(
                    cy.get('@quecard'),
                    choice,
                    attemptTypes.WRONG
                  )
                  this.qrp.verifyLabelBackgroundColor(
                    cy.get('@quecard'),
                    choice,
                    queColor.LIGHT_RED
                  )
                })
              } else {
                this.qrp.verifyLabelChecked(cy.get('@quecard'), wrong)
                this.qrp.verifyLabelClass(
                  cy.get('@quecard'),
                  wrong,
                  attemptTypes.WRONG
                )
                this.qrp.verifyLabelBackgroundColor(
                  cy.get('@quecard'),
                  wrong,
                  queColor.LIGHT_RED
                )
              }
              break
          }
        }
        break

      case questionTypeKey.CHOICE_MATRIX_STANDARD:
      case questionTypeKey.CHOICE_MATRIX_INLINE:
      case questionTypeKey.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData
        if (isShowAnswer) {
          this.qrp.verifyCorrectAnseredMatrix(cy.get('@quecard'), right, steams)
          if (alternateAnswer) {
            this.qrp.verifyAlternateAnswredMatrix(
              cy.get('@quecard'),
              alternate,
              steams
            )
          }
        } else {
          switch (attemptType) {
            case attemptTypes.RIGHT:
              this.qrp.verifyAnseredMatrix(
                cy.get('@quecard'),
                right,
                steams,
                attemptType
              )
              break

            case attemptTypes.WRONG:
              this.qrp.verifyAnseredMatrix(
                cy.get('@quecard'),
                wrong,
                steams,
                attemptType
              )
              break

            case attemptTypes.PARTIAL_CORRECT:
              this.qrp.verifyAnseredMatrix(
                cy.get('@quecard'),
                partialCorrect,
                steams,
                attemptType
              )
              break

            case attemptTypes.ALTERNATE:
              this.qrp.verifyAnseredMatrix(
                cy.get('@quecard'),
                alternate,
                steams,
                attemptType
              )
              break

            default:
              break
          }
        }
        break
      }
      case questionTypeKey.CLOZE_DROP_DOWN:
        if (isShowAnswer)
          this.qrp.verifyCorrectAnswerClozeDropDown(cy.get('@quecard'), right)
        else
          this.qrp.verifyAnswerClozeDropDown(
            cy.get('@quecard'),
            attempt,
            attemptType,
            right
          )
        break
      case questionTypeKey.CLOZE_TEXT:
        if (isShowAnswer)
          this.qrp.verifyCorrectAnswerClozeText(cy.get('@quecard'), right)
        else
          this.qrp.verifyAnswerClozeText(
            cy.get('@quecard'),
            attempt,
            attemptType,
            right
          )
        break
      case questionTypeKey.MATH_NUMERIC:
        if (isShowAnswer)
          this.qrp.verifyCorrectAnsMathNumeric(cy.get('@quecard'), right)
        else
          this.qrp.verifyResponseByAttemptMathNumeric(
            cy.get('@quecard'),
            attempt,
            attemptType,
            true
          )
        break
      case questionTypeKey.ESSAY_RICH:
        break
      default:
        assert.fail(1, 2, 'question type did not match in item preview')
        break
    }
  }

  verifyItemIdOnPreview = (id) =>
    this.getIdOnPreview().should('have.text', CypressHelper.getShortId(id))

  verifyTeacherNameOnPreview = (name) =>
    this.getTeacherNameOnPreview().should('have.text', name)

  verifyPointsOnPreview = (points) =>
    this.getPointsOnPreview().should('have.text', points.toString())

  verifyDOkOnPreview = (dok) => this.getDokOnPreview().should('have.text', dok)

  verifyDiffOnPreview = (diff) =>
    this.getDifficultyOnPreview().should('have.text', diff)

  verifyStandardsOnPreview = (standards) => {
    this.getStandardsOnPreview()
      .as('standard-row')
      .find('span')
      .should('have.length', standards.length)

    standards.forEach((standard) =>
      cy.get('@standard-row').find('span').contains(standard)
    )
  }

  verifyTagsOnPreview = (tags) => {
    this.getTagsOnPreview()
      .as('tag-row')
      .find('span')
      .should('have.length', tags.length)

    tags.forEach((tag) => cy.get('@tag-row').find('span').contains(tag))
  }
}
