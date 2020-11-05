/* eslint-disable default-case */
import TestHeader from './header'
import searchFiltersPage from '../../searchFiltersPage'
import Header from '../../itemList/itemDetail/header'
import QuestionResponsePage from '../../assignments/QuestionResponsePage'
import StudentTestPage from '../../../student/studentTestPage'
import PreviewItemPopup from '../../itemList/itemPreview'

export default class TestReviewTab {
  constructor() {
    this.testheader = new TestHeader()
    this.searchFilters = new searchFiltersPage()
    this.itemHeader = new Header()
    this.qrp = new QuestionResponsePage()
    this.studentTestPage = new StudentTestPage()
    this.previewItemPopUp = new PreviewItemPopup()
  }

  // *** ELEMENTS START ***

  getQueCardByItemIdInCollapsed = (item) =>
    cy.get(`[data-cy="${item}"]`).as('queCard')

  getQueContainerById = (id) =>
    cy.get(`[data-cy="${id}"]`).find('[data-cy="question-container"]')

  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]')

  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]')

  getMoveTo = () => cy.get('[data-cy="moveto"]')

  getPointsOnQueCardByid = (id) =>
    this.getQueCardByItemIdInCollapsed(id).find('.ant-input-lg')

  getAllquestionInReview = () => cy.get('[data-cy="styled-wrapped-component"]')

  getItemIdIdByIndex = (index) =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .eq(index)
      .parent()
      .invoke('attr', 'data-cy')

  getQueContainer = () => cy.get('[data-cy="question-container"]')

  getGroupContainerByGroupIndex = (group) =>
    cy.get('.ant-collapse-header').eq(group - 1)

  getAllQuestionsByGroupIndex = (group) =>
    this.getGroupContainerByGroupIndex(group)
      .next()
      .find('[data-cy="styled-wrapped-component"]')

  getCheckBoxByItemId = (itemId, expanded = false) => {
    if (expanded)
      return this.getQueCardByItemIdInCollapsed(itemId).find(
        '.ant-checkbox-input'
      )

    return this.getQueCardByItemIdInCollapsed(itemId)
      .prev()
      .find('.ant-checkbox-input')
  }

  getDragHandlerByItemId = (itemId) => {
    return this.getQueCardByItemIdInCollapsed(itemId)
      .prev()
      .find('[stroke="currentColor"]')
  }

  getDeleteButtonByItemId = (itemid) =>
    this.getQueCardByItemIdInCollapsed(itemid).find('[data-cy="delete"]')

  getExpandButtonByItemId = (itemId) =>
    this.getQueCardByItemIdInCollapsed(itemId).find('[title="Expand"]')

  getRemoveSelected = () => cy.get('[data-cy="removeSelected"]')
  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  selectGrade = (grade) => {
    this.getTestGradeSelect().click({ force: true })
    cy.get('.ant-select-dropdown-menu-item')
      .contains(grade)
      .click({ force: true })
    this.getTestGradeSelect().find('input').type('{esc}', { force: true })
  }

  selectSubject = (subject) => {
    this.getTestSubjectSelect().click({ force: true })
    cy.get('.ant-select-dropdown-menu-item')
      .contains(subject)
      .click({ force: true })
    cy.focused().blur()
  }

  clickOnCheckBoxByItemId = (itemId) => {
    this.getCheckBoxByItemId(itemId).click({ force: true })
  }

  clickOnRemoveSelected = () => this.getRemoveSelected().click()

  clickOnMoveTo = () => this.getMoveTo().click()

  clickOnExpandRow = () => cy.get('[data-cy="expand-rows"]').click()

  clickExpandByItemId = (id) =>
    this.getExpandButtonByItemId(id).click({ force: true })

  clickOnCollapseRow = () => cy.get('[data-cy="collapse-rows"]').click()

  clickOnPreview = (id) =>
    this.getQueCardByItemIdInCollapsed(id)
      // .contains("Preview")
      .find('[data-cy="preview" ]')
      .click()

  previewQuestById = (id) => {
    this.getQueCardByItemIdInCollapsed(id)
      // .find("span", "Preview")
      .find('[data-cy="preview" ]')
      .click({ force: true })
  }

  updatePointsByID = (id, points) => {
    this.getPointsOnQueCardByid(id)
      .type('{selectall}', { force: true })
      .type(points, { force: true })
  }

  clickOnViewAsStudent = () => {
    cy.wait(3000)
    cy.get('[data-cy="viewAsStudent"]').click()
  }

  closePreiview = () => cy.get('.ant-modal-close').eq(0).click({ force: true })

  moveQuestionByIndex = (index) => {
    this.clickOnMoveTo()
    this.getMoveTo()
      .next()
      .find('input')
      .clear({ force: true })
      .type(index, { force: true })
    this.getMoveTo().next().contains('Reorder').click({ force: true })
  }

  expandGroupByGroupIndex = (group) =>
    this.getGroupContainerByGroupIndex(group).then((ele) => {
      if (ele.attr('aria-expanded') === 'false') cy.wrap(ele).click()
    })

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifySummary = (quetions, points) => {
    cy.get('[data-cy="question"]').should('have.text', `${quetions}`)
    cy.get('[data-cy="points"]').should('have.text', `${points}`)
  }

  verifyGradeSubject = (grade, subject) => {
    this.getTestGradeSelect()
      .find('.ant-select-selection__choice')
      .contains(grade)

    this.getTestSubjectSelect()
      .find('.ant-select-selection__choice')
      .contains(subject)
  }

  verifyGrades = (grades) =>
    this.getTestGradeSelect()
      .find('.ant-select-selection__choice')
      .should('have.length', grades.length)
      .each(($ele, i) => {
        cy.wrap($ele).should('contain', grades[i])
      })

  verifySubjects = (subjects) =>
    this.getTestSubjectSelect()
      .find('.ant-select-selection__choice')
      .should('have.length', subjects.length)
      .each(($ele, i) => {
        cy.wrap($ele).should('contain', subjects[i])
      })

  verifyItemByContent = (question) =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .contains(question)
      .should(
        'be.exist',
        `verify added items - ${question}should appear in review tab`
      )

  asesrtPointsByid = (id, points) => {
    this.getPointsOnQueCardByid(id).should('have.value', points.toString())
  }

  verifyQustionById = (id) => {
    this.getQueCardByItemIdInCollapsed(id).should('exist')
  }

  verifyMovedQuestionById = (id, index) => {
    this.getQueCardByItemIdInCollapsed(id)
      .children()
      .first()
      .should('have.attr', 'data-cy-item-index', (index - 1).toString())
  }

  verifyNoOfItemsInGroupByNo = (group, itemCount) => {
    cy.get(`[data-cy="item-Group ${group}"]`).should('contain', itemCount)
  }

  verifyItemCoutInPreview = (count) =>
    this.getAllquestionInReview().should('have.length', count)

  verifyItemCoutByGroupInPublisherPreview = (
    count,
    group = 1,
    deliveryCount
  ) => {
    this.expandGroupByGroupIndex(group)
    this.getGroupContainerByGroupIndex(group).should(
      'contain',
      `TOTAL ITEMS${count}`
    )
    if (deliveryCount)
      this.getGroupContainerByGroupIndex(group).should(
        'contain',
        `Item to Deliver${deliveryCount}`
      )
    this.getAllQuestionsByGroupIndex(group).should('have.length', count)
  }

  verifyItemIdsByGroupIndex = (items, group) => {
    this.expandGroupByGroupIndex(group)
    this.getAllQuestionsByGroupIndex(group).each((question, index) => {
      cy.wrap(question)
        .parent()
        .invoke('attr', 'data-cy')
        .then((val) => expect(val).to.be.oneOf(items))
    })
  }
  // *** APPHELPERS END ***
}
