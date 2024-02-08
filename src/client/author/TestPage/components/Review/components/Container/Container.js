import React, { PureComponent } from 'react'
import { Row, Col, Spin } from 'antd'
import PropTypes from 'prop-types'
import {
  cloneDeep,
  get,
  uniq as _uniq,
  keyBy,
  set,
  findIndex,
  isEmpty,
  flatten,
  isArray,
  groupBy,
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
  EduIf,
} from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
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
  getAutoSelectItemsLoadingStatusSelector,
  showGroupsPanelSelector,
  getTestsUpdatedSelector,
  hasSectionsSelector,
  isDefaultTestSelector,
  getItemGroupsSelector,
  getAllTagsAction,
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
  SecondHeaderWrapper,
} from './styled'
import { clearDictAlignmentAction } from '../../../../../src/actions/dictionaries'
import { getCreateItemModalVisibleSelector } from '../../../../../src/selectors/testItem'
import {
  getUserFeatures,
  getUserRole,
  getIsPowerPremiumAccount,
  getCollectionsSelector,
} from '../../../../../src/selectors/user'
import TestPreviewModal from '../../../../../Assignments/components/Container/TestPreviewModal'
import ReviewItems from '../ReviewItems'
import { resetItemScoreAction } from '../../../../../src/ItemScore/ducks'
import { groupTestItemsByPassageId } from '../helper'
import { getIsPreviewModalVisibleSelector } from '../../../../../../assessment/selectors/test'
import { setIsTestPreviewVisibleAction } from '../../../../../../assessment/actions/test'
import { STATUS } from '../../../../../AssessmentCreate/components/CreateAITest/ducks/constants'
import AddMoreQuestionsPannel from '../AddMoreQuestionsPannel/AddMoreQuestionsPannel'
import AutoSelectScoreChangeModal from '../AutoSelectScoreChangeModal/AutoSelectScoreChangeModel'

class Review extends PureComponent {
  secondHeaderRef = React.createRef()

  containerRef = React.createRef()

  listWrapperRef = React.createRef()

  mutationObserver = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      isCollapse: true,
      isShowSummary: true,
      isModalVisible: false,
      item: [],
      currentTestId: '',
      hasStickyHeader: false,
      indexForPreview: 0,
      groupIndex: 0,
      showAutoSelectScoreChangeModal: false,
      currentGroupId: '',
    }
  }

  componentWillUnmount() {
    if (this.containerRef.current) {
      this.containerRef.current.removeEventListener('scroll', this.handleScroll)
    }

    if (this.mutationObserver.current) {
      this.mutationObserver.current.disconnect()
    }
  }

  componentDidMount() {
    this.containerRef?.current?.addEventListener('scroll', this.handleScroll)
    // url = http://localhost:3001/author/tests/tab/review/id/testId/
    // ?token=value&firebaseToken=value&userId=value&role=teacher&itemBank=cli&showCLIBanner=1
    // &showAssingmentPreview=1
    const { showAssignmentPreview } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })
    if (showAssignmentPreview) {
      const { setIsTestPreviewVisible } = this.props
      setIsTestPreviewVisible(true)
    }
    const { getAllTags, isPlaylistTestReview = false } = this.props
    getAllTags({
      type: isPlaylistTestReview ? 'playlist' : ['test', 'assignment'],
    })

    const { test, history } = this.props

    const locationState = history.location.state

    const scrollToBottomCallback = (mutationList) => {
      if (
        !(
          locationState &&
          locationState.scrollToBottom &&
          test?.itemGroups?.[0]?.items.length
        )
      )
        return
      if (this.containerRef.current === undefined) return
      for (const mutation of mutationList) {
        if (mutation.type !== 'childList') continue

        const found =
          mutation.target.id === 'pageBottom' ||
          mutation.target.querySelector('#pageBottom')
        if (!found) continue

        this.containerRef.current.scrollTo({
          top: this.containerRef.current.scrollHeight,
          left: 0,
          behavior: 'smooth',
        })
        const updatedState = {
          ...history.location.state,
          scrollToBottom: false,
        }
        history.replace({ ...history.location, state: updatedState })
      }
    }

    this.mutationObserver.current = new MutationObserver(scrollToBottomCallback)
    const config = { attributes: true, childList: true, subtree: true }
    this.mutationObserver.current.observe(document.body, config)
  }

  setSelected = (values) => {
    const { test, setData } = this.props
    const newData = cloneDeep(test)
    newData.itemGroups = produce(newData.itemGroups, (itemGroups) => {
      itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .map((item) => {
          if (values.includes(item._id)) {
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
    const { test } = this.props
    const { checked } = e.target
    if (checked) {
      this.setSelected(
        test.itemGroups
          .flatMap((itemGroup) => itemGroup.items || [])
          .map((item) => item._id)
      )
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

  handleRemoveOne = (itemId) => {
    const { test, setData, setTestItems } = this.props
    const newData = cloneDeep(test)

    const itemsSelected = newData.itemGroups
      .flatMap((itemGroup) => itemGroup.items || [])
      .find((item) => item._id === itemId)

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

  handleRemoveMultiple = (itemIds) => {
    if (isEmpty(itemIds)) {
      return notification({
        type: 'warn',
        messageKey: 'pleaseSelectAtleastOneQuestion',
      })
    }
    const { test, setData, setTestItems } = this.props
    const newData = cloneDeep(test)

    newData.itemGroups = newData.itemGroups.map((itemGroup) => ({
      ...itemGroup,
      items: itemGroup.items.filter(
        (testItem) => !itemIds.includes(testItem._id)
      ),
    }))

    newData.scoring.testItems = newData.scoring.testItems.filter((item) => {
      const foundItem = newData.itemGroups
        .flatMap((itemGroup) => itemGroup.items || [])
        .find(({ id }) => id === item._id)

      return !(foundItem && itemIds.includes(foundItem._id))
    })
    const testItems = newData.itemGroups.flatMap(
      (itemGroup) => itemGroup.items || []
    )

    setTestItems(testItems.map((item) => item._id))
    setData(newData)
    notification({
      type: 'success',
      msg: `${itemIds.length} item(s) removed successfully`,
    })
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

  completeMoveTestItems = (items) => {
    const { test, setData } = this.props
    if (test.itemGroups.length > 1) {
      const itemsGroupedByGroupId = groupBy(items, 'groupId')
      const testdata = produce(test, (draft) => {
        draft.itemGroups.forEach((itemGroup) => {
          itemGroup.items = itemsGroupedByGroupId[itemGroup._id] || []
        })
      })
      setData(testdata)
    } else {
      setData(
        produce(test, (draft) => {
          draft.itemGroups[0].items = items
        })
      )
    }
  }

  handleMoveTo = (newIndex) => {
    const { test, setData } = this.props

    setData(
      produce(test, (draft) => {
        draft.itemGroups = draft.itemGroups.map((itemGroup) => {
          const groupedItems = groupTestItemsByPassageId(itemGroup.items)
          const selectedItemIndex = groupedItems.findIndex((item) => {
            if (isArray(item)) {
              return item.some((ite) => ite.selected)
            }
            return item.selected
          })
          if (selectedItemIndex > -1) {
            const totalItemsInAboveGrp = draft.itemGroups.reduce(
              (acc, curr) => {
                if (curr.index < itemGroup.index) {
                  return acc + curr.items.length
                }
                return acc + 0
              },
              0
            )
            const [removed] = groupedItems.splice(selectedItemIndex, 1)
            groupedItems.splice(newIndex - totalItemsInAboveGrp, 0, removed)
            itemGroup.items = flatten(groupedItems)
          }
          return itemGroup
        })
      })
    )
  }

  handleBlur = (testItemId) => {
    const { test } = this.props

    let item = null
    test?.itemGroups?.forEach((itemGroup) => {
      if (!item) {
        item = itemGroup.items?.find(({ _id }) => _id === testItemId)
      }
    })
    if (
      item?.data?.questions.some(
        (question) => question?.validation?.altResponses?.length
      )
    ) {
      notification({
        type: 'info',
        messageKey: 'altResponseAvailableInItem',
      })
    }
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

  getGroupIndex = (itemId) => {
    const { testGroups } = this.props

    const groupIndex = testGroups?.findIndex((group) =>
      group.items?.some((item) => item._id === itemId)
    )
    return groupIndex
  }

  handlePreviewTestItem = (data) => {
    const { resetItemScore, testItems } = this.props
    const indexForPreview = findIndex(testItems, (ite) => ite._id === data)
    const groupIndex = this.getGroupIndex(data)
    this.setState({
      item: { id: data },
      indexForPreview,
      groupIndex,
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
    const itemId = testItems[nextItemIndex]._id
    const groupIndex = this.getGroupIndex(itemId)

    this.setState({
      item: { id: itemId },
      indexForPreview: nextItemIndex,
      groupIndex,
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
    const itemId = testItems?.[prevItemIndex]?._id
    const groupIndex = this.getGroupIndex(itemId)
    this.setState({
      item: { id: testItems?.[prevItemIndex]?._id },
      indexForPreview: prevItemIndex,
      groupIndex,
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
    const { clearAnswer, clearEvaluation, setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(false)
    clearAnswer()
    clearEvaluation()
  }

  showTestPreviewModal = () => {
    const { test, setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(true)
    this.setState({ currentTestId: test._id })
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
    const { setIsTestPreviewVisible } = this.props
    setIsTestPreviewVisible(false)
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
      isPreviewModalVisible,
      playlistId,
      isTestsUpdated,
      orgCollections,
      userId,
      aiTestStatus,
      setData,
      handleNavChange,
      handleNavChangeToAddItems,
      handleSave,
      setSectionsState,
      setCurrentGroupDetails,
      hasSections,
      isDefaultTest,
      setSectionsTestSetGroupIndex,
      setShowSectionsTestSelectGroupIndexModal,
      onSaveTestId,
      updated,
      showSelectGroupIndexModal,
    } = this.props
    const {
      isCollapse,
      isShowSummary,
      isModalVisible,
      item,
      currentTestId,
      hasStickyHeader,
      groupIndex,
      showAutoSelectScoreChangeModal,
      currentGroupId,
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
      .reduce((acc, element) => {
        if (element.selected) {
          acc.push(element._id)
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
      {
        title: test.title,
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
    const groupedItems = groupTestItemsByPassageId(testItems)

    return (
      <MainContentWrapper ref={this.containerRef}>
        {isPlaylistTestReview ? (
          <Row>
            <Col lg={24}>
              <SecondHeader>
                <TestTitle data-cy="testTitle">{test?.title}</TestTitle>
              </SecondHeader>
            </Col>
          </Row>
        ) : (
          <SecondHeaderWrapper>
            <Col lg={24} xl={owner && isEditable ? 24 : 18}>
              <div ref={this.secondHeaderRef}>
                <SecondHeader>
                  <Breadcrumb
                    data={breadcrumbData}
                    style={{ position: 'unset' }}
                  />
                  <HeaderBar
                    onSelectAll={this.handleSelectAll}
                    itemTotal={groupedItems.length}
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
                    hasSections={hasSections}
                    isDefaultTest={isDefaultTest}
                    setData={setData}
                    handleNavChange={handleNavChange}
                    handleSave={handleSave}
                    setSectionsState={setSectionsState}
                    testId={
                      test?._id || get(this.props, 'match.params.id', false)
                    }
                    setCurrentGroupDetails={setCurrentGroupDetails}
                  />
                </SecondHeader>
              </div>
            </Col>
          </SecondHeaderWrapper>
        )}
        <ReviewContentWrapper>
          <ReviewLeftContainer lg={24} xl={18}>
            <Paper
              padding="7px 0px"
              style={{ overflow: 'hidden' }}
              ref={this.listWrapperRef}
            >
              <ReviewItems
                items={groupedItems}
                scoring={test.scoring}
                standards={standards}
                userFeatures={userFeatures}
                isEditable={isEditable}
                isCollapse={isCollapse}
                passagesKeyed={passagesKeyed}
                rows={rows}
                isSmallSize={isSmallSize}
                onChangePoints={this.handleChangePoints}
                blur={this.handleBlur}
                handlePreview={this.handlePreviewTestItem}
                moveTestItems={this.moveTestItems}
                onCompleteMoveItem={this.completeMoveTestItems}
                removeSingle={this.handleRemoveOne}
                removeMultiple={this.handleRemoveMultiple}
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
                isTestsUpdated={isTestsUpdated}
                orgCollections={orgCollections}
                userId={userId}
                hasSections={hasSections}
                setShowAutoSelectScoreChangeModal={(groupId) =>
                  this.setState({
                    showAutoSelectScoreChangeModal: true,
                    currentGroupId: groupId,
                  })
                }
              />
              <AddMoreQuestionsPannel
                onSaveTestId={onSaveTestId}
                test={test}
                handleSave={handleSave}
                updated={updated}
                showSelectGroupIndexModal={showSelectGroupIndexModal}
                handleNavChangeToAddItems={handleNavChangeToAddItems}
                isEditable={isEditable}
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
                testCategory={test?.testCategory}
              />
            </ReviewSummaryWrapper>
          )}
        </ReviewContentWrapper>
        {isModalVisible && (
          <Spin spinning={aiTestStatus === STATUS.INPROGRESS}>
            <PreviewModal
              testId={test?._id || get(this.props, 'match.params.id', false)}
              isTest={!!test}
              isVisible={isModalVisible}
              onClose={this.closeModal}
              showModal
              isEditable={isEditable || userRole === roleuser.EDULASTIC_CURATOR}
              owner={owner}
              groupIndex={groupIndex}
              addDuplicate={this.handleDuplicateItem}
              page="review"
              testStatus={test.status}
              data={item}
              questions={questions}
              checkAnswer={() => checkAnswer(item)}
              showAnswer={() => showAnswer(item)}
              prevItem={this.prevItem}
              nextItem={this.nextItem}
              showEvaluationButtons
              isPlaylistTestReview={isPlaylistTestReview}
              playlistId={playlistId}
              hasSections={hasSections}
              setSectionsTestSetGroupIndex={setSectionsTestSetGroupIndex}
              setShowSectionsTestSelectGroupIndexModal={
                setShowSectionsTestSelectGroupIndexModal
              }
            />
          </Spin>
        )}
        <EduIf condition={showAutoSelectScoreChangeModal}>
          <AutoSelectScoreChangeModal
            visible={showAutoSelectScoreChangeModal}
            closeModal={() =>
              this.setState({
                showAutoSelectScoreChangeModal: false,
                currentGroupId: '',
              })
            }
            currentGroupId={currentGroupId}
            handleSave={handleSave}
          />
        </EduIf>
        <TestPreviewModal
          isModalVisible={isPreviewModalVisible}
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
      testGroups: getItemGroupsSelector(state),
      testItems: getTestItemsSelector(state),
      isFetchingAutoselectItems: getAutoSelectItemsLoadingStatusSelector(state),
      userRole: getUserRole(state),
      isPowerPremiumAccount: getIsPowerPremiumAccount(state),
      showGroupsPanel: showGroupsPanelSelector(state),
      isPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      isTestsUpdated: getTestsUpdatedSelector(state),
      orgCollections: getCollectionsSelector(state),
      aiTestStatus: get(state, 'aiTestDetails.status'),
      hasSections: hasSectionsSelector(state),
      isDefaultTest: isDefaultTestSelector(state),
    }),
    {
      setData: setTestDataAction,
      getAllTags: getAllTagsAction,
      updateDefaultThumbnail: updateDefaultThumbnailAction,
      clearDictAlignment: clearDictAlignmentAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      clearAnswer: clearAnswersAction,
      clearEvaluation: clearEvaluationAction,
      setTestItems: setTestItemsAction,
      resetItemScore: resetItemScoreAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
    }
  )
)

export default enhance(Review)
