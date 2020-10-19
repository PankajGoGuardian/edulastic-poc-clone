import React, { PureComponent } from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import {
  cloneDeep,
  get,
  uniq as _uniq,
  keyBy,
  set,
  findIndex,
  isEmpty,
} from 'lodash'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import produce from 'immer'
import qs from 'qs'
import {
  Paper,
  withWindowSizes,
  notification,
  MainContentWrapper,
} from '@edulastic/common'
import { test as testConstants, roleuser } from '@edulastic/constants'
import PreviewModal from '../../../../../src/components/common/PreviewModal'
import HeaderBar from '../HeaderBar/HeaderBar'
import {
  getItemsSubjectAndGradeSelector,
  setTestItemsAction,
} from '../../../AddItems/ducks'
import { getStandardsSelector } from '../../ducks'
import {
  setTestDataAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  getDefaultThumbnailSelector,
  updateDefaultThumbnailAction,
  getTestItemsSelector,
  addItemsToAutoselectGroupsRequestAction,
  getAutoSelectItemsLoadingStatusSelector,
  showGroupsPanelSelector,
} from '../../../../ducks'
import { clearAnswersAction } from '../../../../../src/actions/answers'
import { clearEvaluationAction } from '../../../../../../assessment/actions/evaluation'
import { getSummarySelector } from '../../../Summary/ducks'
import { getQuestionsSelectorForReview } from '../../../../../sharedDucks/questions'
import Breadcrumb from '../../../../../src/components/Breadcrumb'
import ReviewSummary from '../ReviewSummary/ReviewSummary'
import {
  SecondHeader,
  ReviewSummaryWrapper,
  ReviewContentWrapper,
  ReviewLeftContainer,
  TestTitle,
} from './styled'
import { clearDictAlignmentAction } from '../../../../../src/actions/dictionaries'
import { getCreateItemModalVisibleSelector } from '../../../../../src/selectors/testItem'
import {
  getUserFeatures,
  getUserRole,
  getIsPowerPremiumAccount,
} from '../../../../../src/selectors/user'
import TestPreviewModal from '../../../../../Assignments/components/Container/TestPreviewModal'
import ReviewItems from '../ReviewItems'
import { resetItemScoreAction } from '../../../../../src/ItemScore/ducks'

class Review extends PureComponent {
  secondHeaderRef = React.createRef()

  containerRef = React.createRef()

  listWrapperRef = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      isCollapse: true,
      isShowSummary: true,
      isModalVisible: false,
      item: [],
      isTestPreviewModalVisible: false,
      currentTestId: '',
      hasStickyHeader: false,
      indexForPreview: 0,
    }
  }

  componentWillUnmount() {
    if (this.containerRef.current) {
      this.containerRef.current.removeEventListener('scroll', this.handleScroll)
    }
  }

  componentDidMount() {
    this.containerRef?.current?.addEventListener('scroll', this.handleScroll)
    const { test, addItemsToAutoselectGroupsRequest } = this.props
    const hasAutoSelectItems = test.itemGroups.some(
      (g) => g.type === testConstants.ITEM_GROUP_TYPES.AUTOSELECT
    )
    if (hasAutoSelectItems) {
      addItemsToAutoselectGroupsRequest(test)
    }

    // url = http://localhost:3001/author/tests/tab/review/id/testId/
    // ?token=value&firebaseToken=value&userId=value&role=teacher&itemBank=cli&showCLIBanner=1
    // &showAssingmentPreview=1
    const { showAssignmentPreview } = qs.parse(window.location.search)
    if (showAssignmentPreview) {
      this.setState({
        isTestPreviewModalVisible: true,
      })
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // const element = this.listWrapperRef?.current;
  //   // const { testItems } = this.props;
  //   // const { items, isCollapse } = prevState;
  //   // if (element.offsetHeight < window.innerHeight && items.length < testItems.length) {
  //   //   // eslint-disable-next-line react/no-did-update-set-state
  //   //   this.setState({ items: testItems.slice(0, items.length + (isCollapse ? 10 : 3)) });
  //   // }
  // }

  setSelected = (values) => {
    const { test, setData } = this.props
    const newData = cloneDeep(test)
    newData.itemGroups = produce(newData.itemGroups, (itemGroups) => {
      itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .map((item, i) => {
          if (values.includes(i)) {
            item.selected = true
          } else {
            item.selected = false
          }
          return null
        })
    })
    setData(newData)
  }

  handleSelectAll = (e) => {
    const { rows } = this.props
    const { checked } = e.target

    if (checked) {
      this.setSelected(rows.map((row, i) => i))
    } else {
      this.setSelected([])
    }
  }

  handleRemoveSelected = () => {
    const { test, setData, setTestItems } = this.props
    const newData = cloneDeep(test)
    const itemsSelected = test.itemGroups
      .flatMap((itemGroup) => itemGroup.items || [])
      .filter((item) => item.selected)
      .map((item) => item._id)
    if (!itemsSelected.length) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseSelectAtleastOneQuestion',
      })
    }
    newData.itemGroups = newData.itemGroups.map((itemGroup) => ({
      ...itemGroup,
      items: itemGroup.items.filter(
        (testItem) => !itemsSelected.includes(testItem._id)
      ),
    }))

    newData.scoring.testItems = newData.scoring.testItems.filter((item) => {
      const foundItem = newData.itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .find(({ id }) => id === item._id)
      return !(foundItem && foundItem.selected)
    })
    const testItems = newData.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )

    setTestItems(testItems.map((item) => item._id))
    this.setSelected([])
    setData(newData)
    notification({
      type: 'success',
      messageKey: 'selectedItemRemovedSuccessfully',
    })
  }

  handleRemoveOne = (indx) => {
    const { test, setData, setTestItems } = this.props
    const newData = cloneDeep(test)

    const itemsSelected = newData.itemGroups
      .flatMap((itemGroup) => itemGroup.items || [])
      .filter((_, index) => index === indx)
      .find((item) => item._id)

    if (!itemsSelected) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseSelectAtleastOneQuestion',
      })
    }

    newData.itemGroups = newData.itemGroups.map((itemGroup) => ({
      ...itemGroup,
      items: itemGroup.items.filter(
        (testItem) => testItem._id !== itemsSelected._id
      ),
    }))

    newData.scoring.testItems = newData.scoring.testItems.filter((item) =>
      newData.itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .find(({ id }) => id === item._id && itemsSelected._id !== id)
    )

    const testItems = newData.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )

    setTestItems(testItems.map((item) => item._id))
    setData(newData)
  }

  handleCollapse = () => {
    const { isCollapse } = this.state
    this.setState({ isCollapse: !isCollapse })
  }

  toggleSummary = () => {
    const { isShowSummary } = this.state
    this.setState({
      isShowSummary: !isShowSummary,
    })
  }

  moveTestItems = ({ oldIndex, newIndex }) => {
    const { test, setData } = this.props
    if (test.itemGroups.length > 1) {
      let itemCounter = 0
      let [newGroupIndex, newItemIndex] = [0, 0]
      let [oldGroupIndex, oldItemIndex] = [0, 0]
      test.itemGroups.forEach((group, i) => {
        group.items.forEach((_, j) => {
          if (itemCounter === newIndex) {
            ;[newGroupIndex, newItemIndex] = [i, j]
          }
          if (itemCounter === oldIndex) {
            ;[oldGroupIndex, oldItemIndex] = [i, j]
          }
          itemCounter++
        })
      })
      setData(
        produce(test, (draft) => {
          const tempItem = test.itemGroups[oldGroupIndex].items[oldItemIndex]
          delete tempItem.selected
          draft.itemGroups[oldGroupIndex].items[oldItemIndex] =
            draft.itemGroups[newGroupIndex].items[newItemIndex]
          draft.itemGroups[newGroupIndex].items[newItemIndex] = tempItem
        })
      )
    } else {
      setData(
        produce(test, (draft) => {
          draft.itemGroups[0].items = draft.itemGroups[0].items.map(
            ({ selected, ...item }) => ({
              ...item,
            })
          )
          const [removed] = draft.itemGroups[0].items.splice(oldIndex, 1)
          draft.itemGroups[0].items.splice(newIndex, 0, removed)
        })
      )
    }
  }

  handleMoveTo = (newIndex) => {
    const { test } = this.props
    const oldIndex = test.itemGroups
      .flatMap(({ items }) => items)
      .findIndex((item) => item.selected)
    this.moveTestItems({ oldIndex, newIndex })
  }

  handleChangePoints = (testItemId, itemScore, questionLevelScore) => {
    /**
     * prevent zero or less
     */
    if (!(itemScore > 0)) {
      return
    }
    const { test, setData } = this.props
    const newData = cloneDeep(test)

    if (!newData.scoring) newData.scoring = {}
    newData.scoring[testItemId] = itemScore
    if (questionLevelScore) {
      set(newData, `scoring.questionLevel.${testItemId}`, questionLevelScore)
    }

    setData(newData)
  }

  setModalVisibility = (value) => {
    this.setState({
      isModalVisible: value,
    })
  }

  handleDuplicateItem = (duplicateTestItemId) => {
    const {
      onSaveTestId,
      test: { title, _id: testId },
      clearDictAlignment,
      history,
    } = this.props
    if (!title) {
      notification({ messageKey: 'nameShouldNotEmpty' })
    }
    clearDictAlignment()
    onSaveTestId()
    history.push(`/author/tests/${testId}/createItem/${duplicateTestItemId}`)
  }

  handlePreviewTestItem = (data) => {
    const { resetItemScore, testItems } = this.props
    const indexForPreview = findIndex(testItems, (ite) => ite._id === data)
    this.setState({
      item: { id: data },
      indexForPreview,
    })
    // clear the item score in the store, if while adding item, check/show answer was clicked
    // EV-12256
    resetItemScore()
    this.setModalVisibility(true)
  }

  nextItem = () => {
    const { indexForPreview } = this.state
    const { testItems, resetItemScore } = this.props
    const nextItemIndex = indexForPreview + 1
    if (nextItemIndex > testItems.length - 1) {
      return
    }
    resetItemScore()
    this.setState({
      item: { id: testItems[nextItemIndex]._id },
      indexForPreview: nextItemIndex,
    })
  }

  prevItem = () => {
    const { indexForPreview } = this.state
    const { testItems, resetItemScore } = this.props
    const prevItemIndex = indexForPreview - 1
    if (prevItemIndex < 0) {
      return
    }
    resetItemScore()
    this.setState({
      item: { id: testItems[prevItemIndex]._id },
      indexForPreview: prevItemIndex,
    })
  }

  closeModal = () => {
    const { clearEvaluation } = this.props
    this.setModalVisibility(false)
    clearEvaluation()
  }

  // changing this
  handleChangeField = (field, value) => {
    const { setData, updateDefaultThumbnail } = this.props
    if (field === 'thumbnail') {
      updateDefaultThumbnail('')
    }
    setData({ [field]: value })
  }

  hidePreviewModal = () => {
    const { clearAnswer, clearEvaluation } = this.props
    this.setState({ isTestPreviewModalVisible: false }, () => {
      clearAnswer()
      clearEvaluation()
    })
  }

  showTestPreviewModal = () => {
    const { test } = this.props
    this.setState({ isTestPreviewModalVisible: true, currentTestId: test._id })
  }

  handleScroll = (e) => {
    const element = e.target
    const { hasStickyHeader } = this.state
    if (this.secondHeaderRef.current) {
      if (element.scrollTop > 50 && !hasStickyHeader) {
        this.secondHeaderRef.current.classList.add('fixed-second-header')
        this.setState({ hasStickyHeader: true })
      } else if (element.scrollTop <= 50 && hasStickyHeader) {
        this.secondHeaderRef.current.classList.remove('fixed-second-header')
        this.setState({ hasStickyHeader: false })
      }
    }
  }

  closeTestPreviewModal = () => {
    this.setState({ isTestPreviewModalVisible: false })
  }

  render() {
    const {
      test,
      current,
      windowWidth,
      rows,
      standards,
      onChangeGrade,
      onChangeSubjects,
      onChangeSkillIdentifiers,
      onChangeCollection,
      questions,
      owner,
      defaultThumbnail,
      isEditable = false,
      itemsSubjectAndGrade,
      checkAnswer,
      showAnswer,
      showCancelButton,
      userFeatures,
      testItems,
      isPlaylistTestReview = false,
      isFetchingAutoselectItems = false,
      userRole,
      isPowerPremiumAccount,
      showGroupsPanel,
    } = this.props
    const {
      isCollapse,
      isShowSummary,
      isModalVisible,
      item,
      isTestPreviewModalVisible,
      currentTestId,
      hasStickyHeader,
    } = this.state

    // when redirected from other pages, sometimes, test will only be having
    // ids in its testitems, which could create issues.
    if (
      test?.itemGroups?.[0]?.items &&
      test?.itemGroups?.[0]?.items?.some((i) => typeof i === 'string')
    ) {
      return <div />
    }

    const selected = test?.itemGroups
      ?.flatMap((itemGroup) => itemGroup?.items || [])
      .reduce((acc, element, i) => {
        if (element.selected) {
          acc.push(i)
        }
        return acc
      }, [])
    const breadcrumbData = [
      {
        title: showCancelButton ? 'ASSIGNMENTS / EDIT TEST' : 'TESTS',
        to: showCancelButton ? '/author/assignments' : '/author/tests',
      },
      {
        title: current,
        to: '',
      },
    ]

    const isSmallSize = windowWidth > 993 ? 1 : 0
    const grades = _uniq([
      ...(test.grades || []),
      ...itemsSubjectAndGrade.grades,
    ]).filter((grade) => !isEmpty(grade))
    const subjects = _uniq([
      ...(test.subjects || []),
      ...itemsSubjectAndGrade.subjects,
    ]).filter((grade) => !isEmpty(grade))
    const collections = get(test, 'collections', [])
    const passages = get(test, 'passages', [])
    const passagesKeyed = keyBy(passages, '_id')
    const isPublishers =
      userFeatures.isPublisherAuthor || userFeatures.isCurator

    return (
      <MainContentWrapper ref={this.containerRef}>
        {isPlaylistTestReview ? (
          <Row>
            <Col lg={24}>
              <SecondHeader>
                <TestTitle>{test?.title}</TestTitle>
              </SecondHeader>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col lg={24} xl={owner && isEditable ? 24 : 18}>
              <div ref={this.secondHeaderRef}>
                <SecondHeader>
                  <Breadcrumb
                    data={breadcrumbData}
                    style={{ position: 'unset' }}
                    hasStickyHeader={hasStickyHeader}
                  />
                  <HeaderBar
                    onSelectAll={this.handleSelectAll}
                    itemTotal={testItems.length}
                    selectedItems={selected}
                    onRemoveSelected={this.handleRemoveSelected}
                    onCollapse={this.handleCollapse}
                    onMoveTo={this.handleMoveTo}
                    owner={owner}
                    isEditable={isEditable}
                    windowWidth={windowWidth}
                    setCollapse={isCollapse}
                    toggleSummary={this.toggleSummary}
                    isShowSummary={isShowSummary}
                    onShowTestPreview={this.showTestPreviewModal}
                    hasStickyHeader={hasStickyHeader}
                    itemGroups={test.itemGroups}
                  />
                </SecondHeader>
              </div>
            </Col>
          </Row>
        )}
        <ReviewContentWrapper>
          <ReviewLeftContainer lg={24} xl={18}>
            <Paper
              padding="7px 0px"
              style={{ overflow: 'hidden' }}
              ref={this.listWrapperRef}
            >
              <ReviewItems
                items={testItems}
                scoring={test.scoring}
                standards={standards}
                userFeatures={userFeatures}
                isEditable={isEditable}
                isCollapse={isCollapse}
                passagesKeyed={passagesKeyed}
                rows={rows}
                isSmallSize={isSmallSize}
                onChangePoints={this.handleChangePoints}
                handlePreview={this.handlePreviewTestItem}
                moveTestItems={this.moveTestItems}
                removeTestItem={this.handleRemoveOne}
                getContainer={() => this.containerRef.current}
                setSelected={this.setSelected}
                selected={selected}
                questions={questions}
                owner={owner}
                itemGroups={test.itemGroups}
                isPublishers={isPublishers}
                isFetchingAutoselectItems={isFetchingAutoselectItems}
                userRole={userRole}
                isPowerPremiumAccount={isPowerPremiumAccount}
                showGroupsPanel={showGroupsPanel}
              />
            </Paper>
          </ReviewLeftContainer>
          {isShowSummary && (
            <ReviewSummaryWrapper lg={24} xl={6}>
              <ReviewSummary
                grades={grades}
                subjects={subjects}
                collections={collections}
                owner={owner}
                isEditable={isEditable}
                onChangeField={this.handleChangeField}
                thumbnail={defaultThumbnail || test.thumbnail}
                onChangeGrade={onChangeGrade}
                onChangeSubjects={onChangeSubjects}
                onChangeSkillIdentifiers={onChangeSkillIdentifiers}
                onChangeCollection={onChangeCollection}
                windowWidth={windowWidth}
                isPublishers={isPublishers}
              />
            </ReviewSummaryWrapper>
          )}
        </ReviewContentWrapper>
        {isModalVisible && (
          <PreviewModal
            testId={get(this.props, 'match.params.id', false)}
            isTest={!!test}
            isVisible={isModalVisible}
            onClose={this.closeModal}
            showModal
            isEditable={isEditable || userRole === roleuser.EDULASTIC_CURATOR}
            owner={owner}
            addDuplicate={this.handleDuplicateItem}
            page="review"
            data={item}
            questions={questions}
            checkAnswer={() => checkAnswer(item)}
            showAnswer={() => showAnswer(item)}
            prevItem={this.prevItem}
            nextItem={this.nextItem}
            showEvaluationButtons
          />
        )}
        <TestPreviewModal
          isModalVisible={isTestPreviewModalVisible}
          testId={currentTestId}
          test={test}
          showStudentPerformance
          closeTestPreviewModal={this.hidePreviewModal}
        />
      </MainContentWrapper>
    )
  }
}

Review.propTypes = {
  test: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  clearEvaluation: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  standards: PropTypes.object.isRequired,
  current: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired,
  addItemsToAutoselectGroupsRequest: PropTypes.func.isRequired,
  clearDictAlignment: PropTypes.func.isRequired,
  owner: PropTypes.bool,
  onSaveTestId: PropTypes.func,
  history: PropTypes.any.isRequired,
  clearAnswer: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  updateDefaultThumbnail: PropTypes.func.isRequired,
  onChangeCollection: PropTypes.func.isRequired,
  questions: PropTypes.object.isRequired,
  itemsSubjectAndGrade: PropTypes.any.isRequired,
  isEditable: PropTypes.bool.isRequired,
  defaultThumbnail: PropTypes.any.isRequired,
  setTestItems: PropTypes.func.isRequired,
  showCancelButton: PropTypes.bool.isRequired,
  userFeatures: PropTypes.object.isRequired,
  testItems: PropTypes.array.isRequired,
}

Review.defaultProps = {
  owner: false,
  onSaveTestId: () => {},
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state) => ({
      standards: getStandardsSelector(state),
      summary: getSummarySelector(state),
      createTestItemModalVisible: getCreateItemModalVisibleSelector(state),
      questions: getQuestionsSelectorForReview(state),
      defaultThumbnail: getDefaultThumbnailSelector(state),
      itemsSubjectAndGrade: getItemsSubjectAndGradeSelector(state),
      userFeatures: getUserFeatures(state),
      testItems: getTestItemsSelector(state),
      isFetchingAutoselectItems: getAutoSelectItemsLoadingStatusSelector(state),
      userRole: getUserRole(state),
      isPowerPremiumAccount: getIsPowerPremiumAccount(state),
      showGroupsPanel: showGroupsPanelSelector(state),
    }),
    {
      setData: setTestDataAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      clearDictAlignment: clearDictAlignmentAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      clearAnswer: clearAnswersAction,
      clearEvaluation: clearEvaluationAction,
      setTestItems: setTestItemsAction,
      addItemsToAutoselectGroupsRequest: addItemsToAutoselectGroupsRequestAction,
      resetItemScore: resetItemScoreAction,
    }
  )
)

export default enhance(Review)
