import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from '@edulastic/localization'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import produce from 'immer'
import {
  questionType as constantsQuestionType,
  questionType,
} from '@edulastic/constants'
import {
  withWindowSizes,
  AnswerContext,
  ScrollContext,
  notification,
  FlexContainer,
  EduButton,
} from '@edulastic/common'
import { IconClose } from '@edulastic/icons'
import { cloneDeep, get, uniq, intersection, keyBy } from 'lodash'
import { Layout, Button, Pagination, Dropdown, Menu, Spin } from 'antd'
import ItemDetailContext, {
  COMPACT,
  DEFAULT,
} from '@edulastic/common/src/contexts/ItemDetailContext'
import questionTitle from '@edulastic/constants/const/questionTitle'
import UnScored from '@edulastic/common/src/components/Unscored'
import { MAX_MOBILE_WIDTH } from '../../../src/constants/others'
import {
  changeViewAction,
  changePreviewAction,
} from '../../../src/actions/view'
import { getViewSelector } from '../../../src/selectors/view'
import {
  checkAnswerAction,
  showAnswerAction,
  toggleCreateItemModalAction,
  createTestItemAction,
} from '../../../src/actions/testItem'
import {
  getItemDetailByIdAction,
  saveCurrentItemAndRoueToOtherAction,
  setItemDetailDataAction,
  updateItemDetailDimensionAction,
  deleteWidgetAction,
  deleteWidgetFromPassageAction,
  updateTabTitleAction,
  useTabsAction,
  useFlowLayoutAction,
  getItemDetailLoadingSelector,
  getItemDetailRowsSelector,
  getItemDetailSelector,
  getItemDetailUpdatingSelector,
  getItemDetailDimensionTypeSelector,
  getTestItemStatusSelector,
  clearRedirectTestAction,
  setRedirectTestAction,
  setItemLevelScoringAction,
  setMultipartEvaluationSettingAction,
  setItemLevelScoreAction,
  getPassageSelector,
  addWidgetToPassageAction,
  deleteItemAction,
  editMultipartWidgetAction,
} from '../../ducks'
import {
  changeCurrentQuestionAction,
  getIsEditDisbledSelector,
} from '../../../sharedDucks/questions'
import { toggleSideBarAction } from '../../../src/actions/toggleMenu'

import {
  ItemDetailWrapper,
  PreviewContent,
  ButtonClose,
  BackLink,
  ContentWrapper,
  PassageNavigation,
  AddRemoveButtonWrapper,
  TestItemCount,
  SpinContainer,
} from './styled'
import { loadQuestionAction } from '../../../QuestionEditor/ducks'
import ItemDetailRow from '../ItemDetailRow'
import {
  ButtonAction,
  ButtonBar,
  SecondHeadBar,
} from '../../../src/components/common'
import ItemHeader from '../ItemHeader/ItemHeader'
import SettingsBar from '../SettingsBar'
import {
  CLEAR,
  EDIT,
} from '../../../../assessment/constants/constantsForQuestions'
import { clearAnswersAction } from '../../../src/actions/answers'
import { changePreviewTabAction } from '../../../ItemAdd/ducks'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import AuthorTestItemPreview from '../../../src/components/common/PreviewModal/AuthorTestItemPreview'
import { setCreatedItemToTestAction } from '../../../TestPage/ducks'
import QuestionAuditTrailLogs from '../../../../assessment/containers/QuestionAuditTrailLogs'
import {
  allowedToSelectMultiLanguageInTest,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import QuestionManageModal from '../QuestionManageModal'
import PassageDivider from '../../../../common/components/PassageDivider'
import Ctrls from '../ItemDetailRow/components/ItemDetailWidget/Controls'
import LanguageSelectorTab from '../../../../common/components/LanguageSelectorTab'
import { getSearchParams } from '../../../src/utils/util'

const testItemStatusConstants = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

const defaultEmptyItem = {
  rows: [
    {
      tabs: [],
      dimension: '100%',
      widgets: [],
      flowLayout: false,
      content: '',
    },
  ],
}

const { useLanguageFeatureQn } = constantsQuestionType
class Container extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRemovePassageItemPopup: false,
      showSettings: false,
      collapseDirection: '',
      showHints: false,
      showQuestionManageModal: false,
      isEditMultipartQuestion: false,
    }
  }

  editModeContainerRef = React.createRef()

  componentDidMount() {
    const {
      clearAnswers,
      changePreviewTab,
      location,
      changeView,
      item,
      setItemLevelScoring,
    } = this.props
    if (
      item.itemLevelScoring &&
      get(item, ['data', 'questions'], []).some(
        (q) => q.rubrics || q?.validation?.unscored
      )
    ) {
      setItemLevelScoring(false)
    }
    if (location.state && location.state.resetView === false) return
    clearAnswers()
    changeView('edit')
    changePreviewTab(CLEAR)
  }

  componentDidUpdate(prevProps) {
    const {
      getItemDetailById,
      match,
      rows,
      history,
      t,
      loading,
      isTestFlow,
      item,
      location: { state },
      saveItem,
    } = this.props
    const oldId = prevProps.match.params.id
    const newId = match.params.id
    const { itemId, testId } = match.params

    if (newId && oldId !== newId) {
      const hasValidTestId = testId && testId !== 'undefined'
      getItemDetailById(newId, {
        data: true,
        validation: true,
        ...(hasValidTestId && { testId }),
      })
    }
    // State.testAuthoring ?
    // For all test with no edit permission in some cases user can clone item and save it in their own library.
    // For such cases preserve test ID till cloned item authoring is done and on publish navigate back to test review page.
    if (
      state?.testAuthoring === false &&
      !loading &&
      (rows.length === 0 || rows[0].widgets.length === 0) &&
      !item.multipartItem
    ) {
      return history.replace({
        pathname: `/author/items/${match.params.id}/pickup-questiontype`,
        state: {
          backUrl: `/author/tests/${state.testId}/createItem/${itemId}`,
          rowIndex: 0,
          tabIndex: 0,
          testItemId: match.params.id,
          testAuthoring: false,
          testId: state.testId,
        },
      })
    }

    if (
      !loading &&
      (rows.length === 0 || rows[0].widgets.length === 0) &&
      !item.multipartItem
    ) {
      history.replace({
        pathname: isTestFlow
          ? `/author/tests/${testId}/createItem/${itemId}/pickup-questiontype`
          : `/author/items/${match.params.id}/pickup-questiontype`,
        state: {
          backText: t('component.itemDetail.backText'),
          backUrl: isTestFlow
            ? `/author/tests/${testId}/createItem/${itemId}`
            : '/author/items',
          rowIndex: 0,
          tabIndex: 0,
          testItemId: isTestFlow ? itemId : match.params._id,
          testName: state?.testName || '',
          regradeFlow: state?.regradeFlow,
        },
        ...getSearchParams('testType'),
      })
    }

    // We want to call this only one time
    // beside running it trough itPassage method
    if (rows.length === 1 && this.isPassage(rows)) {
      this.handleApplySettings({ type: '50-50' })
    }

    // save testItem on deleting passage
    const { passage: prevPassage } = prevProps
    const { passage: newPassage } = this.props
    const prevNumberOfPassageWidgets = get(prevPassage, 'structure.widgets', [])
      .length
    const newNumberOfPassageWidgets = get(newPassage, 'structure.widgets', [])
      .length
    if (newNumberOfPassageWidgets < prevNumberOfPassageWidgets) {
      saveItem(false)
    }
  }

  isPassage = (rows) =>
    rows[0] &&
    rows[0].widgets &&
    rows[0].widgets.length === 1 &&
    rows[0].widgets[0].type === 'passage' &&
    rows[0].dimension !== '50%'

  getSizes = (type) => {
    switch (type) {
      case '100-100':
        return {
          left: '100%',
          right: '100%',
        }
      case '30-70':
        return {
          left: '30%',
          right: '70%',
        }
      case '70-30':
        return {
          left: '70%',
          right: '30%',
        }
      case '50-50':
        return {
          left: '50%',
          right: '50%',
        }
      case '40-60':
        return {
          left: '40%',
          right: '60%',
        }
      case '60-40':
        return {
          left: '60%',
          right: '40%',
        }
      default:
        return {
          left: '100%',
          right: '100%',
        }
    }
  }

  handleChangeView = (view) => {
    const { changeView } = this.props
    changeView(view)
  }

  handleShowSettings = () => {
    this.setState((state) => ({
      showSettings: !state.showSettings,
    }))
  }

  handleAdd = ({ rowIndex, tabIndex }) => {
    const {
      match,
      history,
      t,
      changeView,
      modalItemId,
      navigateToPickupQuestionType,
      isTestFlow,
      rows,
      item,
      location: { state },
      setCurrentQuestion,
    } = this.props

    changeView('edit')

    if (modalItemId) {
      navigateToPickupQuestionType()
      return
    }

    const isMultiDimensionalLayout = rows.length > 1

    if (item.passageId || item.multipartItem) {
      setCurrentQuestion('')
      this.setState({ showQuestionManageModal: true, rowIndex, tabIndex })
      if (history?.location) {
        const updatedState = {
          ...history.location.state,
          rowIndex,
          isMultiDimensionalLayout,
        }
        history.replace({ ...history.location, state: updatedState })
      }
      return
    }

    const { widgets = [] } = rows[rowIndex]
    const columnHasResource =
      widgets.length > 0 &&
      widgets.some((widget) => widget.widgetType === 'resource')
    // there is 2 col layout, only allow to add questions on the right panel
    // can add only resources/instructions in the left

    const { multipartItem: isMultipartItem } = item
    if (state?.testAuthoring === false) {
      return history.push({
        pathname: `/author/items/${match.params.id}/pickup-questiontype`,
        state: {
          testId: state.testId,
          testAuthoring: false,
          rowIndex,
          tabIndex,
          testItemId: match.params.id,
          columnHasResource:
            rows.length > 1 && rowIndex === 0 && columnHasResource,
          isMultiDimensionalLayout,
          isMultipartItem,
        },
      })
    }
    history.push({
      pathname: isTestFlow
        ? `/author/tests/${match.params.testId}/createItem/${match.params.id}/pickup-questiontype`
        : `/author/items/${match.params.id}/pickup-questiontype`,
      state: {
        backText: t('component.itemDetail.backText'),
        backUrl: match.url,
        rowIndex,
        tabIndex,
        testItemId: isTestFlow ? match.params.itemId : match.params.id,
        columnHasResource:
          rows.length > 1 && rowIndex === 0 && columnHasResource,
        isMultiDimensionalLayout,
        isMultipartItem,
        regradeFlow: state?.regradeFlow,
      },
    })
  }

  handleAddQuestionToPassage = () => {
    const { rows } = this.props
    const rowIndex = (rows?.length || 1) - 1
    this.handleAdd({ rowIndex, tabIndex: 0 })
  }

  handleAddToPassage = (type, tabIndex, rowIndex) => {
    const { isTestFlow, match, addWidgetToPassage } = this.props // , item
    // Checking if current item allows multiple items
    // const { canAddMultipleItems } = item
    /**
     * there are two possibilites for getting item id during test flow
     * route 1: "/author/tests/:testId/createItem/:itemId"
     *  itemId := match.params.itemId
     * route 2: "/author/items/:id/item-detail/test/:testId"
     *  itemId := match.params.id
     */
    addWidgetToPassage({
      isTestFlow,
      itemId:
        isTestFlow && match?.params?.itemId
          ? match.params.itemId
          : match.params.id,
      testId: match.params.testId,
      type,
      // tabIndex,
      // canAddMultipleItems: !!canAddMultipleItems,
    })
    this.setState({ showQuestionManageModal: true, tabIndex, rowIndex })
  }

  handleCancelSettings = () => {
    this.setState({
      showSettings: false,
    })
  }

  handleCancelQuestionToPassage = () => {
    const { changeView } = this.props
    changeView('edit')

    this.setState({
      showQuestionManageModal: false,
      isEditMultipartQuestion: false,
    })
  }

  handleApplySettings = ({ type }) => {
    const { updateDimension } = this.props
    const { left, right } = this.getSizes(type)
    updateDimension(left, right)
  }

  handleApplySource = (data) => {
    const { setItemDetailData } = this.props

    try {
      setItemDetailData(JSON.parse(data))
      this.handleHideSource()
    } catch (err) {
      console.error(err)
    }
  }

  handleEditWidget = (widget) => {
    const {
      loadQuestion,
      changeView,
      editMultipartWidget,
      item: { isPassageWithQuestions, multipartItem },
    } = this.props
    if (isPassageWithQuestions || multipartItem) {
      editMultipartWidget(widget.reference)
      this.setState({
        showQuestionManageModal: true,
        isEditMultipartQuestion: true,
      })
      return
    }
    changeView('edit')
    loadQuestion(widget, 0)
  }

  handleEditPassageWidget = (widget, rowIndex) => {
    const {
      loadQuestion,
      changeView,
      setCurrentQuestion,
      item: { isPassageWithQuestions },
    } = this.props
    if (isPassageWithQuestions) {
      setCurrentQuestion(widget.reference)
      this.setState({
        rowIndex,
        showQuestionManageModal: true,
        isEditMultipartQuestion: true,
      })
      return
    }
    changeView('edit')
    loadQuestion(widget, rowIndex, true)
  }

  handleDeleteWidget = (i) => (widgetIndex) => {
    const { deleteWidget, item = {}, location, match, isTestFlow } = this.props
    const { _id: testItemId } = item
    const { testId } = match.params

    /**
     * trying to replicate data being sent while saveItem
     * src/client/author/ItemDetail/components/Container/index.js
     */
    const updateData = {
      testItemId,
      testId,
      isTestFlow,
      locationState: location?.state,
    }
    deleteWidget(i, widgetIndex, updateData)
  }

  handleDeletePassageWidget = (widgetIndex) => {
    const { passage } = this.props
    const numberOfPassageWidgets = get(passage, 'structure.widgets', []).length
    if (numberOfPassageWidgets === 1) {
      notification({ messageKey: 'thereShouldBeAtleastOnePassageItem' })

      return null
    }
    const { deleteWidgetFromPassage } = this.props
    deleteWidgetFromPassage(widgetIndex)
  }

  handleVerticalDividerChange = () => {
    const { item, setItemDetailData } = this.props
    const newItem = cloneDeep(item)

    newItem.verticalDivider = !newItem.verticalDivider
    setItemDetailData(newItem)
  }

  handleScrollingChange = () => {
    const { item, setItemDetailData } = this.props
    const newItem = cloneDeep(item)

    newItem.scrolling = !newItem.scrolling
    setItemDetailData(newItem)
  }

  handleChangePreviewTab = (previewTab) => {
    const { checkAnswer, showAnswer, changePreview } = this.props

    if (previewTab === 'check') {
      checkAnswer()
    }
    if (previewTab === 'show') {
      showAnswer()
    }

    changePreview(previewTab)
  }

  handlePublishTestItem = () => {
    const { publishTestItem } = this.props
    publishTestItem()
  }

  handleEnableEdit = () => {
    const { setEditable } = this.props
    setEditable(true)
  }

  toggleHints = () => {
    this.setState((prevState) => ({
      showHints: !prevState.showHints,
    }))
  }

  renderPreview = () => {
    const { rows, preview, item: itemProps, passage, view } = this.props
    const item = itemProps || {}
    const allRows = item.passageId ? [passage.structure, ...rows] : rows
    // TODO: check item.data is not defined while saving in preview mode
    let _questions = {
      ...keyBy(item?.data?.questions, 'id'),
      ...keyBy(item?.data?.resources, 'id'),
    }
    if (item.passageId) {
      const _passage = keyBy(passage.data, 'id')
      _questions = { ..._questions, ..._passage }
    }
    return (
      <PreviewContent view={view}>
        <AuthorTestItemPreview
          cols={allRows}
          previewTab={preview}
          preview={preview}
          verticalDivider={item.verticalDivider}
          scrolling={item.scrolling}
          style={{ width: '100%' }}
          questions={_questions}
          item={item}
          isMultipart={item.multipartItem}
          isAnswerBtnVisible={false}
          viewComponent="ItemDetail"
          page="itemAuthoring"
        />
      </PreviewContent>
    )
  }

  renderButtons = () => {
    const {
      item,
      updating,
      testItemStatus,
      changePreview,
      preview,
      view,
      isTestFlow,
      saveItem,
      isEditable,
      rows,
    } = this.props
    const { showHints } = this.state
    let showPublishButton = false

    if (item) {
      const { _id: testItemId } = item
      showPublishButton =
        isTestFlow &&
        ((testItemId &&
          testItemStatus &&
          testItemStatus !== testItemStatusConstants.PUBLISHED) ||
          isEditable)
    }
    const questionsType =
      rows && uniq(rows.flatMap((itm) => itm.widgets.map((i) => i.type)))
    const intersectionCount = intersection(
      questionsType,
      constantsQuestionType.manuallyGradableQn
    ).length
    const isAnswerBtnVisible =
      questionsType && intersectionCount < questionsType.length

    return (
      <ButtonAction
        allowedAttempts
        onShowSource={this.handleShowSource}
        onShowSettings={this.handleShowSettings}
        onChangeView={this.handleChangeView}
        changePreview={changePreview}
        changePreviewTab={this.handleChangePreviewTab}
        handleShowHints={this.toggleHints}
        showHints={showHints}
        onSave={saveItem}
        saving={updating}
        view={view}
        previewTab={preview}
        showPublishButton={showPublishButton}
        isShowAnswerVisible={isAnswerBtnVisible}
        showCheckButton={isAnswerBtnVisible}
      />
    )
  }

  addItemToPassage = () => {
    const {
      passage,
      isTestFlow,
      match,
      setCreatedItemToTest,
      item: previousItem,
      createItem,
    } = this.props
    const { testId } = match.params
    // every test flow add previous item to test and then go for creating new
    if (isTestFlow) setCreatedItemToTest(previousItem)
    /**
     * assuming this method is going to be called only when type is passageWithQuestions
     */
    const item = produce(defaultEmptyItem, (draft) => {
      draft.rows[0].dimension = '50%'
      draft.canAddMultipleItems = true
      draft.isPassageWithQuestions = true
      draft.multipartItem = true
      draft.passageId = passage._id
      draft.data = {
        questions: [],
        resources: [],
      }
    })
    createItem(item, isTestFlow, testId, true)
  }

  handleRemoveItemRequest = () => {
    this.setState({
      showRemovePassageItemPopup: true,
    })
  }

  removeItemAndUpdatePassage = () => {
    const { item, passage, isTestFlow, match, deleteItem } = this.props
    const id = item._id
    const { testItems } = passage
    const originalIndex = testItems.indexOf(id)
    const removedArray = [...testItems].filter((x) => x !== id)
    const redirectId = removedArray[originalIndex]
      ? removedArray[originalIndex]
      : removedArray[removedArray.length - 1]
    this.closeRemovePassageItemPopup()
    deleteItem({
      id: item._id,
      redirectId,
      isTestFlow,
      testId: match.params.testId,
    })
  }

  closeRemovePassageItemPopup = () => {
    this.setState({
      showRemovePassageItemPopup: false,
    })
  }

  goToItem = (page) => {
    const {
      match,
      isTestFlow,
      saveCurrentItemAndRoueToOther,
      item,
      location: { state },
    } = this.props
    const { testId } = match.params
    const _id = this.passageItems[page - 1]

    let redirectData = {}
    if (state?.testAuthoring === false) {
      redirectData = {
        pathname: `/author/items/${_id}/item-detail`,
        state: { resetView: false, testAuthoring: false, testId: state.testId },
      }
    }
    const { previousTestId, fadeSidebar, regradeFlow } = state || {}
    redirectData = {
      // `/author/tests/${tId}/editItem/${item?._id}`
      pathname: isTestFlow
        ? `/author/tests/${testId}/editItem/${_id}`
        : `/author/items/${_id}/item-detail`,
      // To stop view changes, while using pagination buttons
      state: {
        isTestFlow,
        previousTestId,
        fadeSidebar,
        resetView: false,
        regradeFlow,
      },
    }

    saveCurrentItemAndRoueToOther({
      redirectData,
      updateItemData: {
        id: item._id,
        data: item,
        testId,
        addToTest: isTestFlow,
        locationState: state,
        redirect: false,
        redirectOnDeleteQuestion: false,
        updateScoreInQuestionsAsPerItem: false,
      },
    })
  }

  handleCancelEditItem = () => {
    const {
      history,
      match,
      isTestFlow,
      location: { state },
      item,
    } = this.props
    const { testId } = match.params
    const { previousTestId, fadeSidebar, regradeFlow } = state || {}

    const url = isTestFlow
      ? previousTestId
        ? `/author/tests/tab/review/id/${testId}/old/${previousTestId}`
        : `/author/tests/tab/review/id/${testId}`
      : `/author/items/${item._id}/item-detail`

    const newState = {
      isTestFlow,
      fadeSidebar,
      resetView: false,
      regradeFlow,
    }

    history.push({
      pathname: url,
      state: newState,
    })
  }

  handleCollapse = (dir) => {
    this.setState({
      collapseDirection: dir,
    })
  }

  renderCollapseButtons = () => {
    const { collapseDirection } = this.state
    return (
      <PassageDivider
        viewComponent="itemDetail"
        collapseDirection={collapseDirection}
        onChange={this.handleCollapse}
      />
    )
  }

  renderEdit = () => {
    const { collapseDirection } = this.state
    const {
      rows,
      item,
      updateTabTitle,
      windowWidth,
      passage,
      view,
    } = this.props
    const passageWithQuestions = !!item.passageId
    const useTabsLeft = passageWithQuestions
      ? !!get(passage, ['structure', 'tabs', 'length'], 0)
      : !!get(rows, [0, 'tabs', 'length'], 0)
    const collapseLeft = collapseDirection === 'left'
    const collapseRight = collapseDirection === 'right'

    const passageTestItems = get(passage, 'testItems', [])
    const widgetLength = get(rows, [0, 'widgets'], []).length
    const showAddItemButton =
      (!!widgetLength || passageTestItems.length > 1) && view === EDIT

    return (
      <AnswerContext.Provider value={{ isAnswerModifiable: false }}>
        <ScrollContext.Provider
          value={{
            getScrollElement: () =>
              this.editModeContainerRef.current || document.body,
          }}
        >
          <ItemDetailWrapper
            ref={this.editModeContainerRef}
            id="testing 1"
            padding="0px"
          >
            {passageWithQuestions && (
              <ItemDetailRow
                row={passage.structure}
                key="0"
                view={view}
                rowIndex="0"
                itemData={passage}
                count={1}
                isPassageQuestion
                onEditWidget={this.handleEditPassageWidget}
                handleAddToPassage={this.handleAddToPassage}
                onDeleteWidget={this.handleDeletePassageWidget}
                hideColumn={collapseLeft}
                isCollapsed={!!collapseDirection}
                useTabsLeft={useTabsLeft}
                onShowSettings={this.handleShowSettings}
                containerType="passage"
              />
            )}
            {rows.map((row, i) => (
              <>
                {((rows.length > 1 && i === 1) ||
                  (passageWithQuestions && i === 0)) &&
                  this.renderCollapseButtons()}
                <ItemDetailRow
                  key={passage ? i + 1 : i}
                  row={row}
                  view={view}
                  rowIndex={i}
                  previewTab="show"
                  itemData={item}
                  count={rows.length}
                  onAdd={this.handleAdd}
                  windowWidth={windowWidth}
                  onDeleteWidget={this.handleDeleteWidget(i)}
                  onEditWidget={this.handleEditWidget}
                  onEditTabTitle={(tabIndex, value) => {
                    return updateTabTitle({ rowIndex: i, tabIndex, value })
                  }}
                  hideColumn={
                    (collapseLeft && !passageWithQuestions && i === 0) ||
                    (collapseRight && (i === 1 || passageWithQuestions))
                  }
                  isCollapsed={!!collapseDirection}
                  useTabsLeft={useTabsLeft}
                  addItemToPassage={this.addItemToPassage}
                  isPassageWithQuestions={passageWithQuestions}
                  onShowSettings={this.handleShowSettings}
                  containerType="question"
                  showAddItemButton={showAddItemButton}
                />
              </>
            ))}
          </ItemDetailWrapper>
        </ScrollContext.Provider>
      </AnswerContext.Provider>
    )
  }

  renderAuditTrailLogs = () => <QuestionAuditTrailLogs />

  get closeModalButton() {
    const { onModalClose } = this.props
    return (
      <ButtonClose onClick={onModalClose}>
        <IconClose />
      </ButtonClose>
    )
  }

  get breadCrumbs() {
    const { item, isTestFlow, match } = this.props
    if (isTestFlow) {
      const { testId } = match.params
      const testPath = `/author/tests/${testId || 'create'}`

      const breadCrumb = [
        {
          title: 'TEST LIBRARY',
          to: '/author/tests',
        },
        {
          title: 'TEST',
          to: `${testPath}#review`,
        },
      ]

      if (item.isPassageWithQuestions || item.multipartItem) {
        breadCrumb.push({
          title: 'MULTIPART ITEM',
          to: `${testPath}/createItem/${item._id}`,
        })
      }
      return breadCrumb
    }
    return [
      {
        title: 'ITEM BANK',
        to: '/author/items',
      },
      {
        title: 'ADD NEW',
        to: `/author/items/${item._id}/item-detail`,
      },
    ]
  }

  get passageItems() {
    const { passage, isTestFlow } = this.props
    const passageTestItems = isTestFlow
      ? get(passage, 'testItems', [])
      : get(passage, 'activeTestItems', [])
    return passageTestItems
  }

  get passageNavigator() {
    const { t, item, passage, rows, view, itemDeleting } = this.props
    const widgetLength = get(rows, [0, 'widgets'], []).length
    const passageTestItems = this.passageItems
    const isAddFirstPart = widgetLength === 0

    return (
      // isPassageWithQuestions fallback condition to show/hide pagination
      (item.canAddMultipleItems || item.isPassageWithQuestions) &&
      passage &&
      view !== 'metadata' && (
        <PassageNavigation data-cy="questionPagination">
          {passageTestItems.length > 1 && (
            <TestItemCount className="pagination-title">
              {passageTestItems.length} ITEMS
            </TestItemCount>
          )}
          {passageTestItems.length > 1 && (
            <Pagination
              total={passageTestItems.length}
              pageSize={1}
              defaultCurrent={
                passageTestItems.findIndex((i) => i === item._id) + 1
              }
              onChange={this.goToItem}
            />
          )}
          {(widgetLength >= 1 || passageTestItems?.length > 1) &&
            view === EDIT && (
              <AddRemoveButtonWrapper>
                <Dropdown
                  disabled={itemDeleting}
                  overlay={
                    <Menu>
                      {widgetLength >= 1 && (
                        <Menu.Item
                          key="addQuestionToPassage"
                          onClick={this.handleAddQuestionToPassage}
                        >
                          {isAddFirstPart
                            ? t('component.itemDetail.addFirstPart')
                            : t('component.itemDetail.addNew')}
                        </Menu.Item>
                      )}
                      <Menu.Item
                        key="addItemToPassage"
                        onClick={this.addItemToPassage}
                      >
                        {t('component.itemDetail.addNewItemToPassage')}
                      </Menu.Item>
                      {passageTestItems.length > 1 && (
                        <Menu.Item
                          key="removeCurrenItem"
                          onClick={this.handleRemoveItemRequest}
                        >
                          {t('component.itemDetail.removeCurrentItem')}
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  trigger="click"
                >
                  <EduButton isGhost height="30px" data-cy="addOrRemoveButton">
                    {t('component.itemDetail.addRemove')}
                  </EduButton>
                </Dropdown>
              </AddRemoveButtonWrapper>
            )}
        </PassageNavigation>
      )
    )
  }

  render() {
    const {
      showSettings,
      tabIndex,
      rowIndex,
      showRemovePassageItemPopup,
      showQuestionManageModal,
      isEditMultipartQuestion,
    } = this.state
    const {
      match,
      rows,
      item,
      updating,
      type,
      useTabs,
      useFlowLayout,
      changePreview,
      windowWidth,
      modalItemId,
      toggleSideBar,
      history,
      setItemLevelScoring,
      setMultipartEvaluationSetting,
      isTestFlow,
      passage,
      preview,
      saveItem,
      view,
      showPublishButton,
      hasAuthorPermission,
      t,
      allowedToSelectMultiLanguage,
      isPremiumUser,
      isEditFlow,
      itemEditDisabled,
      setItemLevelScore,
    } = this.props
    const {
      itemLevelScoring,
      itemLevelScore,
      data = [],
      isPassageWithQuestions,
      multipartItem,
    } = item
    const { widgets = [] } = rows[0]
    const [isEditDisabled] = itemEditDisabled
    const { testId } = match.params
    let breadCrumbQType = ''
    if (item.passageId && item.canAddMultipleItems) {
      breadCrumbQType = 'Passage with Multiple Questions'
    } else if (item.passageId && !item.canAddMultipleItems) {
      breadCrumbQType = 'Passage with Multiple parts'
    }

    const qLength = rows.flatMap((x) =>
      x.widgets.filter((y) => y.widgetType === 'question')
    ).length

    const isPassageQuestion = !!item.passageId
    const useTabsLeft = isPassageQuestion
      ? !!get(passage, ['structure', 'tabs', 'length'], 0)
      : !!get(rows, [0, 'tabs', 'length'], 0)
    const useTabsRight = isPassageQuestion
      ? !!get(rows, [0, 'tabs', 'length'], 0)
      : !!get(rows, [1, 'tabs', 'length'], 0)

    const isPassage = rows
      .flatMap((row) => row.widgets.map((widget) => widget.type))
      .some((widgetType) => widgetType === questionType.PASSAGE)

    // disable saving item has no questions
    // TODO: if required for passage, will have to handle it differently,
    // since passage doesnt keep it in item rows.
    const disableSave =
      !item.passageId && item.rows.every((row) => row?.widgets?.length === 0)

    const layoutType = isPassage ? COMPACT : DEFAULT
    const disableScoringLevel = get(item, ['data', 'questions'], []).some(
      (q) => q.rubrics || q?.validation?.unscored
    )

    const showLanguageSelector =
      useLanguageFeatureQn.includes(questionType.PASSAGE) ||
      item?.data?.questions?.some((q) => useLanguageFeatureQn.includes(q.type))

    const handleTotalPartScoreChange = (score) => {
      setItemLevelScore(+score)
    }

    const isTotalPointsBlockVisible =
      itemLevelScoring &&
      (widgets?.length > 0 || item?.data?.questions?.length > 0)
    const showMultipartAllPartsScore =
      isTotalPointsBlockVisible && (multipartItem || isPassageWithQuestions)
    const hasNoUnscored =
      data?.questions?.length > 0
        ? data.questions.some((x) => x.validation?.unscored !== true)
        : true

    return (
      <ItemDetailContext.Provider value={{ layoutType }}>
        {isPassageWithQuestions && updating && (
          <SpinContainer>
            <Spin />
          </SpinContainer>
        )}
        <ConfirmationModal
          visible={showRemovePassageItemPopup}
          title="Remove Item"
          onCancel={this.closeRemovePassageItemPopup}
          centered
          footer={[
            <Button key="cancel" onClick={this.closeRemovePassageItemPopup}>
              No, Cancel
            </Button>,
            <Button
              key="submit"
              onClick={this.removeItemAndUpdatePassage}
              type="primary"
            >
              Yes, Remove
            </Button>,
          ]}
        >
          <p>
            You are about to remove the current item from the passage. This
            action cannot be undone.
          </p>
        </ConfirmationModal>
        <Layout>
          {showSettings && (
            <SettingsBar
              type={type}
              onCancel={this.handleCancelSettings}
              onApply={this.handleApplySettings}
              useTabs={useTabs}
              useTabsLeft={useTabsLeft}
              useTabsRight={useTabsRight}
              useFlowLayout={useFlowLayout}
              useFlowLayoutLeft={rows[0].flowLayout}
              useFlowLayoutRight={rows[1] && rows[1].flowLayout}
              onVerticalDividerChange={this.handleVerticalDividerChange}
              onScrollingChange={this.handleScrollingChange}
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              itemLevelScoring={item.itemLevelScoring}
              itemGradingType={item.itemGradingType}
              assignPartialCredit={item.assignPartialCredit}
              setItemLevelScoring={setItemLevelScoring}
              setMultipartEvaluationSetting={setMultipartEvaluationSetting}
              isPassageQuestion={isPassageQuestion}
              questionsCount={qLength}
              isMultiDimensionLayout={rows.length > 1}
              isMultipart={item.multipartItem}
              disableScoringLevel={disableScoringLevel}
              isPremiumUser={isPremiumUser}
            />
          )}
          <ItemHeader
            showIcon
            title={
              item.isPassageWithQuestions
                ? questionTitle.PASSAGE_WITH_QUESTIONS
                : t('header:common.itemDetail')
            }
            reference={match.params._id}
            windowWidth={windowWidth}
            toggleSideBar={toggleSideBar}
            style={{ marginTop: '10px' }}
          >
            <ButtonBar
              onCancel={this.handleCancelEditItem}
              onShowSource={this.handleShowSource}
              onShowSettings={this.handleShowSettings}
              onChangeView={this.handleChangeView}
              changePreview={changePreview}
              changePreviewTab={this.handleChangePreviewTab}
              onSave={saveItem}
              disableSave={disableSave}
              onPublishTestItem={this.handlePublishTestItem}
              saving={updating}
              view={view}
              previewTab={preview}
              isTestFlow={isTestFlow}
              onEnableEdit={this.handleEnableEdit}
              showPublishButton={showPublishButton}
              hasAuthorPermission={hasAuthorPermission}
              itemStatus={item && item.status}
              showAuditTrail={!!item}
              withLabels
              renderExtra={() => modalItemId && this.closeModalButton}
              renderRightSide={view === 'edit' ? this.renderButtons : () => {}}
            />
          </ItemHeader>
          <ContentWrapper data-cy="item-detail-container">
            <BreadCrumbBar justifyContent="space-between">
              {windowWidth > MAX_MOBILE_WIDTH ? (
                <SecondHeadBar
                  itemId={item._id}
                  breadCrumbQType={breadCrumbQType}
                  breadcrumb={this.breadCrumbs}
                />
              ) : (
                <BackLink onClick={history.goBack}>Back to Item List</BackLink>
              )}

              <FlexContainer alignItems="center" justifyContent="flex-end">
                {this.passageNavigator}
                {view !== 'preview' &&
                  view !== 'auditTrail' &&
                  showMultipartAllPartsScore && (
                    <AllPartsPointsWrapper>
                      {hasNoUnscored ? (
                        <Ctrls.TotalPoints
                          value={itemLevelScore}
                          onChange={handleTotalPartScoreChange}
                          data-cy="totalPointUpdate"
                          visible={isTotalPointsBlockVisible}
                          disabled={isEditDisabled}
                          itemLevelScoring={itemLevelScoring}
                          isPassage={isPassageWithQuestions}
                          onShowSettings={this.handleShowSettings}
                        />
                      ) : (
                        <UnScored
                          width="50px"
                          height="32px"
                          top={`${itemLevelScoring ? -80 : -50}px`}
                        />
                      )}
                    </AllPartsPointsWrapper>
                  )}
                {view === 'preview' && (
                  <RightActionButtons>
                    {this.renderButtons()}
                  </RightActionButtons>
                )}
              </FlexContainer>
            </BreadCrumbBar>
            {allowedToSelectMultiLanguage && showLanguageSelector && (
              <LanguageSelectorTab
                isEditView={view === EDIT && showQuestionManageModal}
              />
            )}
            {view === 'edit' && this.renderEdit()}
            {view === 'preview' && this.renderPreview()}
            {view === 'auditTrail' && this.renderAuditTrailLogs()}
          </ContentWrapper>
        </Layout>
        {showQuestionManageModal && (
          <QuestionManageModal
            isTestFlow={isTestFlow}
            isEditFlow={isEditFlow}
            tabIndex={tabIndex}
            rowIndex={rowIndex}
            testId={testId}
            isPassage={isPassageWithQuestions}
            isEditMultipartQuestion={isEditMultipartQuestion}
            onCancel={this.handleCancelQuestionToPassage}
          />
        )}
      </ItemDetailContext.Provider>
    )
  }
}

Container.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  getItemDetailById: PropTypes.func.isRequired,
  rows: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  item: PropTypes.object,
  preview: PropTypes.string.isRequired,
  setItemDetailData: PropTypes.func.isRequired,
  showPublishButton: PropTypes.bool.isRequired,
  hasAuthorPermission: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  deleteItem: PropTypes.func.isRequired,
  updateDimension: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  createItem: PropTypes.func.isRequired,
  deleteWidgetFromPassage: PropTypes.func.isRequired,
  deleteWidget: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setEditable: PropTypes.func.isRequired,
  updateTabTitle: PropTypes.func.isRequired,
  useFlowLayout: PropTypes.func.isRequired,
  useTabs: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  changePreview: PropTypes.func.isRequired,
  setCreatedItemToTest: PropTypes.func.isRequired,
  saveItem: PropTypes.func.isRequired,
  loadQuestion: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  testItemStatus: PropTypes.string,
  publishTestItem: PropTypes.func,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToPickupQuestionType: PropTypes.func,
  toggleSideBar: PropTypes.func.isRequired,
  setItemLevelScoring: PropTypes.func,
  isTestFlow: PropTypes.bool,
  clearAnswers: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  passage: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  view: PropTypes.string.isRequired,
  addWidgetToPassage: PropTypes.func.isRequired,
  itemDeleting: PropTypes.any.isRequired,
  setMultipartEvaluationSetting: PropTypes.func,
}

Container.defaultProps = {
  rows: [],
  publishTestItem: () => {},
  item: {},
  modalItemId: undefined,
  onModalClose: () => {},
  navigateToPickupQuestionType: () => {},
  testItemStatus: '',
  setItemLevelScoring: () => {},
  setMultipartEvaluationSetting: () => {},
  isTestFlow: false,
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  withNamespaces(['author', 'header']),
  connect(
    (state) => ({
      rows: getItemDetailRowsSelector(state),
      loading: getItemDetailLoadingSelector(state),
      item: getItemDetailSelector(state),
      updating: getItemDetailUpdatingSelector(state),
      type: getItemDetailDimensionTypeSelector(state),
      testItemStatus: getTestItemStatusSelector(state),
      passage: getPassageSelector(state),
      preview: state.view.preview,
      currentAuthorId: get(state, ['user', 'user', '_id']),
      itemDeleting: get(state, 'itemDetail.deleting', false),
      view: getViewSelector(state),
      allowedToSelectMultiLanguage: allowedToSelectMultiLanguageInTest(state),
      isPremiumUser: isPremiumUserSelector(state),
      itemEditDisabled: getIsEditDisbledSelector(state),
    }),
    {
      changeView: changeViewAction,
      changePreview: changePreviewAction,
      showAnswer: showAnswerAction,
      checkAnswer: checkAnswerAction,
      getItemDetailById: getItemDetailByIdAction,
      saveCurrentItemAndRoueToOther: saveCurrentItemAndRoueToOtherAction,
      setItemDetailData: setItemDetailDataAction,
      updateDimension: updateItemDetailDimensionAction,
      deleteWidget: deleteWidgetAction,
      updateTabTitle: updateTabTitleAction,
      useTabs: useTabsAction,
      useFlowLayout: useFlowLayoutAction,
      loadQuestion: loadQuestionAction,
      clearRedirectTest: clearRedirectTestAction,
      setRedirectTest: setRedirectTestAction,
      toggleCreateItemModal: toggleCreateItemModalAction,
      toggleSideBar: toggleSideBarAction,
      setItemLevelScoring: setItemLevelScoringAction,
      setMultipartEvaluationSetting: setMultipartEvaluationSettingAction,
      setItemLevelScore: setItemLevelScoreAction,
      clearAnswers: clearAnswersAction,
      changePreviewTab: changePreviewTabAction,
      addWidgetToPassage: addWidgetToPassageAction,
      createItem: createTestItemAction,
      deleteItem: deleteItemAction,
      deleteWidgetFromPassage: deleteWidgetFromPassageAction,
      setCreatedItemToTest: setCreatedItemToTestAction,
      setCurrentQuestion: changeCurrentQuestionAction,
      editMultipartWidget: editMultipartWidgetAction,
    }
  )
)

export default enhance(Container)

const BreadCrumbBar = styled(FlexContainer)`
  padding: 12px 0px 32px;
`

const RightActionButtons = styled(FlexContainer)``

const AllPartsPointsWrapper = styled.div`
  position: relative;
  padding-left: 15px;
  .total-points-wrapper {
    position: static;
    top: unset;
    right: unset;
  }
`
