/* eslint-disable react/prop-types */
import { passageApi, segmentApi, testItemsApi } from '@edulastic/api'
import { red, themeColor, white, title } from '@edulastic/colors'
import {
  EduIf,
  EduButton,
  FlexContainer,
  notification,
  withWindowSizes,
  CustomModalStyled,
} from '@edulastic/common'
import {
  questionType,
  roleuser,
  collections as collectionConst,
  test as testConstants,
} from '@edulastic/constants'
import {
  IconClose,
  IconCollapse,
  IconCopy,
  IconExpand,
  IconPencilEdit,
  IconTrash,
  IconClear,
} from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Icon, Modal, Spin, Popover, Tooltip } from 'antd'
import { cloneDeep, get, intersection, isEmpty, keyBy, uniq } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import styled, { css } from 'styled-components'
import IconMagicWand from '@edulastic/icons/src/IconMagicWand'
import { QUE_TYPE_BY_TITLE } from '@edulastic/constants/const/questionType'
import SelectGroupModal from '../../../../TestPage/components/AddItems/SelectGroupModal'
import { SMALL_DESKTOP_WIDTH } from '../../../../../assessment/constants/others'
import { Nav } from '../../../../../assessment/themes/common'
import FeaturesSwitch from '../../../../../features/components/FeaturesSwitch'
import { getAssignmentsSelector } from '../../../../AssignTest/duck'
import {
  clearItemDetailAction,
  deleteItemAction,
  getItemDeletingSelector,
} from '../../../../ItemDetail/ducks'
import {
  addItemToCartAction,
  approveOrRejectSingleItem as approveOrRejectSingleItemAction,
} from '../../../../ItemList/ducks'
import {
  getSelectedItemSelector,
  setTestItemsAction,
} from '../../../../TestPage/components/AddItems/ducks'
import {
  getTestSelector,
  setNextPreviewItemAction,
  setTestDataAndUpdateAction,
  updateTestAndNavigateAction,
  setPassageItemsAction,
  setAndSavePassageItemsAction,
  setCurrentGroupIndexAction,
  setTestDataAction,
  isDynamicTestSelector,
} from '../../../../TestPage/ducks'
import { clearAnswersAction } from '../../../actions/answers'
import { changePreviewAction, changeViewAction } from '../../../actions/view'
import {
  getCollectionsSelector,
  getUserFeatures,
  getWritableCollectionsSelector,
} from '../../../selectors/user'
import {
  allowDuplicateCheck,
  allowContentEditCheck,
  isContentOfCollectionEditable,
} from '../../../utils/permissionCheck'
import ScoreBlock from '../ScoreBlock'
import AuthorTestItemPreview from './AuthorTestItemPreview'
import {
  addPassageAction,
  archivedItemsSelector,
  clearPreviewAction,
  duplicateTestItemPreviewRequestAction,
  editNonAuthoredItemAction,
  getItemDetailSelectorForPreview,
  getPassageSelector,
  setPrevewItemAction,
  setQuestionsForPassageAction,
  passageItemIdsSelector,
} from './ducks'
import ReportIssue from './ReportIssue'
import { ButtonsWrapper, RejectButton } from './styled'
import { aiTestActions } from '../../../../AssessmentCreate/components/CreateAITest/ducks'
import { AiEduButton } from '../../../../AssessmentCreate/components/CreateAITest/styled'
import {
  fetchTTSTextAction,
  setTTSTextStateAction,
  updateTTSTextAction,
} from '../../../actions/ttsText'
import {
  getTTSTextAPIStatusSelector,
  getTTSTextResultSelector,
  updateTTSTextAPIStatusSelector,
} from '../../../selectors/ttsText'
import SpeakableText from '../SpeakableText'

const {
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  testCategoryTypes,
} = testConstants

const pageType = {
  itemList: 'itemList',
  addItems: 'addItems',
  review: 'review',
  itemAuthoring: 'itemAuthoring',
}

class PreviewModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      flag: false,
      passageLoading: false,
      showHints: false,
      showReportIssueField: false,
      fullModal: false,
      isRejectMode: false,
      showSelectGroupModal: false,
      showTTSTextModal: false,
      isAddingSinglePassageItem: false,
    }
  }

  notificationStringConst = {
    enterValidPassword: 'enterValidPassword',
    itemCantBeAdded: 'itemCantBeAdded',
    nameShouldNotEmpty: 'nameShouldNotEmpty',
    itemAddedTest: 'itemAddedTest',
    itemRemovedTest: 'itemRemovedTest',
  }

  componentDidMount() {
    const { item } = this.props
    if (item.passageId) {
      this.loadPassage(item.passageId)
    }

    this.setIsAddingSinglePassageItem(false)

    const { ttsTextAPIStatus, setTTSTextState } = this.props

    if (ttsTextAPIStatus) {
      setTTSTextState({
        apiStatus: false,
        result: [],
        TTSUpdateData: {
          apiStatus: false,
        },
      })
    }
  }

  loadPassage(passageId) {
    /**
     * FIXME: move this to redux-saga
     */
    const { addPassage, setPassageTestItems } = this.props
    this.setState({ passageLoading: true })
    try {
      passageApi.getById(passageId).then((response) => {
        addPassage(response)
        this.setState({ passageLoading: false })
      })
      testItemsApi.getPassageItems(passageId).then((passageItems) => {
        passageItems = passageItems.filter((item) => item?.active)
        setPassageTestItems(passageItems)
      })
    } catch (e) {
      this.setState({ passageLoading: false })
    }
  }

  componentDidUpdate(prevProps) {
    const {
      item: newItem,
      archivedItems: oldArchivedItems,
      updateCurrentItemFromPassagePagination,
      passage,
      clearPreview,
      updateTTSAPIStatus,
    } = this.props
    const { item: oldItem, archivedItems: newArchivedItems } = prevProps
    if (oldItem?.passageId !== newItem?.passageId && newItem?.passageId) {
      this.loadPassage(newItem.passageId)
    }
    /** Watching changes in "testsAddItems.archivedItems"
     * and updating testItemPreview for passages
     * */
    if (oldArchivedItems?.length !== newArchivedItems?.length) {
      const { testItems = [] } = passage || {}
      if (testItems.length) {
        updateCurrentItemFromPassagePagination(testItems[0])
      } else {
        clearPreview()
      }
    }

    if (
      prevProps?.updateTTSAPIStatus !== updateTTSAPIStatus &&
      updateTTSAPIStatus === 'SUCCESS'
    ) {
      this.toggleTTSTextModal()
    }
  }

  componentWillUnmount() {
    const { clearAnswers } = this.props
    clearAnswers()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { flag } = this.state
    const { isVisible } = nextProps
    if (isVisible && !flag) {
      this.setState({ flag: true })
    }
  }

  closeModal = () => {
    const { onClose, changePreviewMode, clearPreview } = this.props
    this.setState({ flag: false })
    clearPreview()
    changePreviewMode('clear')
    onClose()
  }

  onRegenerateTestItem = () => {
    const { regenerateTestItem, item, groupIndex = 0 } = this.props
    const {
      alignment,
      grades,
      subjects,
      stimulus,
      depthOfKnowledge,
      authorDifficulty,
      title: questionTitle,
    } = item?.data?.questions[0]

    const { _id } = item

    if (
      [_id, alignment, grades, subjects, stimulus, questionTitle].every(
        (x) => !isEmpty(x)
      )
    ) {
      regenerateTestItem({
        itemType: QUE_TYPE_BY_TITLE[questionTitle],
        numberOfItems: 1,
        dok: [depthOfKnowledge],
        difficulty: [authorDifficulty],
        alignment,
        existingQidToRegenerate: _id,
        groupIndex,
      })
    } else {
      notification({
        type: 'warn',
        msg: 'Facing some issue while regenerating this Question.',
      })
    }

    segmentApi.genericEventTrack('GenerateAIItem', {
      source: 'AI Quiz: Regenerate',
    })
  }

  handleDuplicateTestItem = async () => {
    const {
      data,
      testId,
      duplicateTestItem,
      test,
      match,
      isTest = !!testId,
      passage,
      item = {},
      isPlaylistTestReview,
      playlistId,
      groupIndex,
      hasSections,
      setSectionsTestSetGroupIndex,
      setShowSectionsTestSelectGroupIndexModal,
    } = this.props
    const itemId = data.id
    const regradeFlow = match.params.oldId && match.params.oldId !== 'undefined'
    if (!passage) {
      if (hasSections) {
        setSectionsTestSetGroupIndex(groupIndex)
        setShowSectionsTestSelectGroupIndexModal(true)
      }
      return duplicateTestItem({
        data,
        testId,
        test,
        match,
        isTest,
        itemId,
        regradeFlow,
        isPlaylistTestReview,
        playlistId,
      })
    }

    const { _id: currentItem = '' } = item

    const handleCompletePassageClick = () => {
      duplicateTestItem({
        data,
        testId,
        test,
        match,
        isTest,
        itemId,
        regradeFlow,
        passage,
        duplicateWholePassage: true,
        isPlaylistTestReview,
        playlistId,
      })
      Modal.destroyAll()
      this.closeModal()
    }

    const handleCurrentItemClick = () => {
      duplicateTestItem({
        data,
        testId,
        test,
        match,
        isTest,
        itemId,
        regradeFlow,
        passage,
        currentItem,
        isPlaylistTestReview,
        playlistId,
      })
      Modal.destroyAll()
      this.closeModal()
    }

    // show confirmation message only if more than one item to be cloned
    if (passage.testItems.length > 1) {
      const bodyContent = (
        <>
          <p>
            This passage has {passage.testItems.length} Items associated with
            it. Would you like to clone complete passage or a single item?
          </p>
          <FlexContainer justifyContent="flex-end" mt="24px">
            <EduButton
              isGhost
              onClick={handleCompletePassageClick}
              data-cy="completePassageBtn"
            >
              Complete Passage
            </EduButton>
            <EduButton
              onClick={handleCurrentItemClick}
              data-cy="currentItemBtn"
            >
              Current Item
            </EduButton>
          </FlexContainer>
        </>
      )

      Modal.confirm({
        title: 'Clone Passage Item',
        content: bodyContent,
        onCancel: () => this.setState({ flag: false }),
        centered: true,
        width: 500,
        className: 'passage-clone-modal',
      })
    } else {
      handleCompletePassageClick()
    }

    // const duplicatedItem = await duplicateTestItem(itemId);

    // if (isTest) {
    //   updateTestAndNavigate({
    //     pathname: `/author/tests/${testId}/editItem/${duplicatedItem._id}`,
    //     fadeSidebar: true,
    //     regradeFlow,
    //     previousTestId: test.previousTestId,
    //     testId,
    //     isDuplicating: true,
    //     passage
    //   });
    // } else {
    //   history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    // }
  }

  // this is the one need to be modified
  editTestItem = () => {
    const {
      data,
      history,
      testId,
      clearItemStore,
      changeView,
      updateTestAndNavigate,
      test,
      isTest = !!testId,
      editNonAuthoredItem,
      isEditable,
      item,
      userId,
      testAssignments,
      userRole,
      writableCollections,
      collections,
      userFeatures,
      passage,
    } = this.props

    const itemId = data.id
    const regradeFlow = !!test?._id && testAssignments.length && test.isUsed
    const isOwner = item?.authors?.some((author) => author._id === userId)
    const hasCollectionAccess = allowContentEditCheck(
      item?.collections,
      writableCollections
    )
    const isCollectionContentEditable = isContentOfCollectionEditable(
      item?.collections,
      writableCollections
    )
    const allowDuplicate = allowDuplicateCheck(
      item?.collections,
      collections,
      'item'
    )
    const isDisableEdit = !(
      (isEditable && isOwner) ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (hasCollectionAccess && userFeatures.isCurator) ||
      isCollectionContentEditable
    )

    // change the question editor view to "edit"
    changeView('edit')
    // itemDetail store has leftovers from previous visit to the page,
    // clearing it before navigation.

    clearItemStore()
    if (isDisableEdit && regradeFlow && isTest && allowDuplicate) {
      let passageItems = passage && passage.testItems
      const passageId = passage && passage._id
      if (passageItems && passageId) {
        const testItemIds = test.itemGroups.flatMap((group) =>
          group.items.map((ele) => ele._id)
        )
        passageItems = passageItems.filter((ele) => testItemIds.includes(ele))
      }

      return editNonAuthoredItem({
        itemId,
        testId,
        replaceOldItem: true,
        passageItems,
        passageId,
      })
    }
    if (isTest) {
      const payload = {
        pathname: `/author/tests/${testId}/editItem/${itemId}`,
        fadeSidebar: 'false',
        regradeFlow,
        testId,
        isEditing: true,
      }
      if (testId !== test.previousTestId) {
        payload.previousTestId = test.previousTestId
      }
      updateTestAndNavigate(payload)
    } else {
      history.push(`/author/items/${itemId}/item-detail`)
    }
  }

  clearView = () => {
    const { changePreviewMode, clearAnswers } = this.props
    changePreviewMode('clear')
    clearAnswers()
  }

  goToItem = (page) => {
    const {
      setQuestionsForPassage,
      setPrevewItem,
      item,
      testItemPreviewData,
      passageItemIds = [],
      updateCurrentItemFromPassagePagination,
    } = this.props
    const itemId = passageItemIds[page - 1]
    if (!(testItemPreviewData && testItemPreviewData.data)) {
      setPrevewItem(item)
    }
    testItemsApi.getById(itemId).then((response) => {
      if (response?._id && updateCurrentItemFromPassagePagination) {
        /**
         * Whenever we are changing the item using the navigation in the passage
         * we need to update the state in the ItemListContainer component as well
         * why? @see https://snapwiz.atlassian.net/browse/EV-15223
         */
        updateCurrentItemFromPassagePagination(response._id)
      }
      setQuestionsForPassage(response)
    })
  }

  handleSelectGroupModalResponse = (index) => {
    const { setCurrentGroupIndex, item } = this.props
    const { isAddingSinglePassageItem } = this.state
    if (index || index === 0) {
      setCurrentGroupIndex(index)
      if (item.passageId && !isAddingSinglePassageItem) {
        this.handleAddPassageItemsToSection()
      } else {
        this.handleDynamicTestSelection()
      }
    }
    this.setState({ showSelectGroupModal: false })
  }

  handleAddPassageItemsToSection = () => {
    const {
      passageItems,
      passage,
      page,
      selectedRows,
      setAndSavePassageItems,
    } = this.props
    const passageTestItems = get(passage, 'testItems', [])
    const isAdding = passageTestItems.some((x) => !selectedRows.includes(x))
    setAndSavePassageItems({ passageItems, page, remove: !isAdding })
  }

  handleDynamicTestSelection = async () => {
    const {
      setTestItems,
      setDataAndSave,
      selectedRows,
      test,
      gotoSummary,
      item,
      page,
      current,
    } = this.props
    if (!test.title?.trim().length && page !== pageType.itemList) {
      gotoSummary()
      return notification({
        messageKey: this.notificationStringConst.nameShouldNotEmpty,
      })
    }

    let keys = []
    if (test.safeBrowser && !test.sebPassword) {
      return notification({
        messageKey: this.notificationStringConst.enterValidPassword,
      })
    }

    if (selectedRows !== undefined) {
      ;(selectedRows || []).forEach((selectedRow, index) => {
        keys[index] = selectedRow
      })
    }
    if (!keys.includes(item._id)) {
      keys[keys.length] = item._id
      setDataAndSave({ addToTest: true, item, current })
      notification({
        type: 'success',
        messageKey: this.notificationStringConst.itemAddedTest,
      })
    } else {
      keys = keys.filter((_item) => _item !== item._id)
      setDataAndSave({ addToTest: false, item: { _id: item._id }, current })
      notification({
        type: 'success',
        messageKey: this.notificationStringConst.itemRemovedTest,
      })
    }
    setTestItems(keys)
  }

  handleAddToSection = (staticGroups, item) => {
    const {
      test: { itemGroups },
      setCurrentGroupIndex,
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
    } = this.props
    /**
     * For sections test if group index is known, directly add the item to respective index
     * without setting index in store
     * showSelectGroupIndexModal - this value is always "true" for all other tests except sections test
     */
    if (
      staticGroups?.length > 1 &&
      !showSelectGroupIndexModal &&
      typeof currentGroupIndexValueFromStore === 'number'
    ) {
      this.handleSelectGroupModalResponse(currentGroupIndexValueFromStore)
      return
    }

    if (staticGroups?.length === 1) {
      const index = itemGroups.findIndex(
        (g) => g.groupName === staticGroups[0].groupName
      )
      if (
        itemGroups[index]?.deliveryType ===
          ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
        item.itemLevelScoring === false
      ) {
        return notification({ type: 'warn', messageKey: 'itemCantBeAdded' })
      }
      setCurrentGroupIndex(index)
      this.handleSelection()
    } else if (staticGroups.length > 1) {
      this.setState({ showSelectGroupModal: true })
    } else {
      return notification({
        type: 'warn',
        messageKey: 'noStaticGroupFound',
      })
    }
  }

  handleRemoveOne = (itemId) => {
    const { test, setTestData, setTestItems } = this.props
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
    setTestData(newData)
    this.handleSelection(false)
  }

  toggleTTSTextModal = () => {
    this.setState(({ showTTSTextModal: prevShowTTSTextModal }) => ({
      showTTSTextModal: !prevShowTTSTextModal,
    }))
  }

  viewTTSText = (updateTTSText = false) => {
    const {
      item: { _id: itemId, data: { questions = [] } = {} },
      fetchTTSText,
      ttsTextResult,
    } = this.props

    if (!updateTTSText) {
      this.toggleTTSTextModal()
    }

    const questionId = questions?.[0]?.id

    if (questionId) {
      const requestData = {
        itemId,
        questionId,
        updateTTSText,
      }

      if (isEmpty(ttsTextResult) || updateTTSText) {
        fetchTTSText(requestData)
      }
    }
  }

  updateQuestionTTSText = (updatedTTSTextData) => {
    const {
      item: { _id: itemId, data: { questions = [] } = {} },
      updateTTSText,
    } = this.props

    const questionId = questions?.[0]?.id

    if (questionId) {
      const requestData = {
        itemId,
        questionId,
        data: updatedTTSTextData,
      }

      updateTTSText(requestData)
    }
  }

  handleAddOrRemove = () => {
    const {
      item,
      test,
      test: { itemGroups },
      hasSections,
      isDynamicTest,
    } = this.props

    if (item?.unsavedItem) {
      return this.handleRemoveOne(item?._id)
    }

    const staticGroups = (itemGroups || []).filter(
      (g) => g.type === ITEM_GROUP_TYPES.STATIC
    )

    if (hasSections || isDynamicTest) {
      const isAdding = this.isAddOrRemove
      /**
       * set the following state as there is no way to figure out whether user is
       * adding single passage item or all passage items, in handleSelectGroupModalResponse method
       */
      if (isAdding) {
        if (item.passageId) {
          this.setIsAddingSinglePassageItem(true)
        }
        this.handleAddToSection(staticGroups, item)
        return
      }
      this.handleSelection()
      return
    }

    if (
      test.testCategory !== testCategoryTypes.DYNAMIC_TEST ||
      item.passageId
    ) {
      this.handleSelection()
    } else if (this.isAddOrRemove) {
      this.handleAddToSection(staticGroups, item)
    } else {
      this.handleDynamicTestSelection()
    }
  }

  handleSelection = (shouldSave = true) => {
    const {
      setDataAndSave,
      selectedRows,
      addItemToCart,
      test,
      gotoSummary,
      item,
      setTestItems,
      page,
      setNextPreviewItem,
    } = this.props

    if (page === 'itemList') {
      return addItemToCart(item)
    }
    if (!test?.title?.trim()?.length && page !== 'itemList') {
      this.closeModal()
      gotoSummary()
      console.log('Reaching here')
      notification({ messageKey: 'nameShouldNotEmpty' })
    }
    let keys = [...(selectedRows || [])]
    if (test.safeBrowser && !test.sebPassword) {
      notification({ messageKey: 'enterValidPassword' })
      return
    }
    if (!keys.includes(item?._id)) {
      keys[keys.length] = item?._id
      setDataAndSave({ addToTest: true, item })
      notification({ type: 'success', messageKey: 'itemAddedTest' })
    } else {
      if (page === 'review') {
        const testItems = test.itemGroups.flatMap((group) => group.items || [])
        let itemFound = false
        for (const ele of testItems) {
          if (itemFound) {
            setNextPreviewItem(ele._id)
            break
          }
          if (ele._id === item._id) {
            itemFound = true
          }
        }
      }
      keys = (keys || []).filter((key) => key !== item?._id)
      if (shouldSave) {
        setDataAndSave({ addToTest: false, item: { _id: item?._id } })
      }
      notification({ type: 'success', messageKey: 'itemRemovedTest' })
    }
    setTestItems(keys)
    if (page === 'review' && keys.length === 0) {
      this.closeModal()
    }
  }

  handleAddMultiplePassageItemsToSections = () => {
    const {
      passageItems,
      passageItemIds = [],
      test: { itemGroups },
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
      setCurrentGroupIndex,
      setAndSavePassageItems,
      page,
      selectedRows,
    } = this.props

    const hasPassageItemToAdd = (passageItemIds || []).some(
      (x) => !selectedRows.includes(x)
    )

    // remove all passage items from test
    if (!hasPassageItemToAdd) {
      setAndSavePassageItems({ passageItems, page, remove: true })
      return
    }

    const staticGroups = (itemGroups || []).filter(
      (g) => g.type === ITEM_GROUP_TYPES.STATIC
    )

    if (
      staticGroups?.length > 1 &&
      !showSelectGroupIndexModal &&
      typeof currentGroupIndexValueFromStore === 'number'
    ) {
      setAndSavePassageItems({ passageItems, page, remove: false })
      return
    }

    this.setIsAddingSinglePassageItem(false)

    if (staticGroups?.length === 1) {
      const index = itemGroups.findIndex(
        (g) => g.groupName === staticGroups[0].groupName
      )
      setCurrentGroupIndex(index)
      setAndSavePassageItems({ passageItems, page, remove: false })
    } else if (staticGroups.length > 1) {
      this.setState({ showSelectGroupModal: true })
    }
  }

  handleAddAllPassageItems = () => {
    const {
      passageItems,
      passage,
      page,
      selectedRows,
      setAndSavePassageItems,
      hasSections,
      isDynamicTest,
    } = this.props
    const passageTestItems = get(passage, 'testItems', [])

    const isAdding = passageTestItems.some((x) => !selectedRows.includes(x))

    if (hasSections || isDynamicTest) {
      this.handleAddMultiplePassageItemsToSections()
      return
    }

    setAndSavePassageItems({ passageItems, page, remove: !isAdding })
  }

  get isAddOrRemove() {
    const { item, selectedRows } = this.props
    if (selectedRows && selectedRows.length) {
      return !selectedRows.includes(item?._id)
    }
    return true
  }

  toggleHints = () => {
    this.setState((prevState) => ({
      showHints: !prevState.showHints,
    }))
  }

  toggleReportIssue = () => {
    this.setState((prevState) => ({
      showReportIssueField: !prevState.showReportIssueField,
    }))
  }

  toggleFullModal = () => {
    this.setState((prevState) => ({
      fullModal: !prevState.fullModal,
    }))
  }

  navigationBtns = () => {
    const { nextItem, prevItem } = this.props
    return (
      <>
        <PrevArrow
          onClick={() => {
            this.clearView()
            prevItem()
          }}
          position="absolute"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </PrevArrow>
        <NextArrow
          onClick={() => {
            this.clearView()
            nextItem()
          }}
          position="absolute"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </NextArrow>
      </>
    )
  }

  getBtnStyle = (addedToTest) => ({
    backgroundColor: !addedToTest ? '#fff' : themeColor,
    color: !addedToTest ? themeColor : '#fff',
    borderColor: !addedToTest ? themeColor : '',
  })

  handleDeleteItem = () => {
    const {
      item: { _id, isPassageWithQuestions = false, collections = [] },
      deleteItem,
      isEditable,
      page,
      closeModal,
      writableCollections = [],
    } = this.props
    const isCollectionContentEditable = isContentOfCollectionEditable(
      collections,
      writableCollections
    )
    if (!(isEditable || isCollectionContentEditable)) {
      notification({ messageKey: 'dontHaveWritePermission' })
      return
    }
    if (closeModal) closeModal()
    return deleteItem({
      id: _id,
      isItemPrevew: page === 'addItems' || page === 'itemList',
      isPassageWithQuestions,
    })
  }

  handleApproveOrRejectSingleItem = (value) => {
    const {
      approveOrRejectSingleItem: _approveOrRejectSingleItem,
      item,
    } = this.props
    if (item?._id) {
      _approveOrRejectSingleItem({ itemId: item._id, status: value })
    }
  }

  handleReject = () => this.setState({ isRejectMode: true })

  setIsAddingSinglePassageItem = (val) =>
    this.setState({ isAddingSinglePassageItem: val })

  get navigationButtonVisibile() {
    const { item, page } = this.props
    if (page === 'review') {
      return true
    }
    return !item?.isPassageWithQuestions
  }

  // TODO consistency for question and resources for previeew
  render() {
    const {
      isVisible,
      collections,
      loading,
      item = { rows: [], data: {}, authors: [] },
      userId,
      isEditable = false,
      checkAnswer,
      showAnswer,
      preview,
      passage,
      questions = keyBy(get(item, 'data.questions', []), 'id'),
      page,
      showAddPassageItemToTestButton = false, // show if add item to test button needs to shown.
      windowWidth,
      userFeatures,
      onlySratchpad,
      changePreviewMode,
      test,
      test: { itemGroups },
      testAssignments,
      userRole,
      deleting,
      writableCollections,
      testStatus = 'draft',
      selectedRows,
      passageItemIds = [],
      isPlaylistTestReview,
      t,
      isDynamicTest,
      ttsTextResult,
      ttsTextAPIStatus,
      updateTTSAPIStatus,
    } = this.props

    const premiumCollectionWithoutAccess =
      item?.premiumContentRestriction &&
      item?.collections
        ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
        .map(({ name }) => name)
    const uniSectionTestLength = 1
    const { testItems = [] } = passage || {}
    const hasMultipleTestItems = testItems.length > 1

    const {
      passageLoading,
      showHints,
      showReportIssueField,
      fullModal,
      isRejectMode,
      showSelectGroupModal,
      showTTSTextModal,
    } = this.state
    const resources = keyBy(
      get(item, 'data.resources', []),
      (r) => `${item._id}_${r.id}`
    )

    let allWidgets = { ...questions, ...resources }
    const { authors = [], rows, data = {} } = item || {}
    const questionsType =
      data.questions && uniq(data.questions.map((question) => question.type))
    const intersectionCount = intersection(
      questionsType,
      questionType.manuallyGradableQn
    ).length
    const isAnswerBtnVisible =
      questionsType && intersectionCount < questionsType.length
    const isOwner = authors.some((author) => author._id === userId)
    const hasCollectionAccess = allowContentEditCheck(
      item?.collections,
      writableCollections
    )
    const { derivedFromPremiumBankId = false } = item || {}
    const isCollectionContentEditable = isContentOfCollectionEditable(
      item?.collections,
      writableCollections
    )
    let allowDuplicate =
      (allowDuplicateCheck(item?.collections, collections, 'item') ||
        isOwner) &&
      !derivedFromPremiumBankId
    if (
      item?.sharedWith?.filter(
        (s) =>
          `${s?._id}` === `${item._id}` &&
          s.name === 'LINK' &&
          s.permission === 'NOACTION'
      ).length &&
      !isOwner
    ) {
      allowDuplicate = false
    }
    const allRows =
      item && !!item.passageId && !!passage
        ? [passage.structure, ...rows]
        : rows
    const passageTestItems = passageItemIds || []
    const isPassage = passage && passageTestItems.length
    const hasPassageItemToAdd = passageTestItems.some(
      (x) => !selectedRows.includes(x)
    )

    if (!!item?.passageId && !!passage) {
      allWidgets = { ...allWidgets, ...keyBy(passage.data, 'id') }
    }

    const isSmallSize = windowWidth <= SMALL_DESKTOP_WIDTH

    const isTestInRegrade =
      !!test?._id &&
      (test.isInEditAndRegrade || (testAssignments.length && test.isUsed))
    const isDisableEdit = !(
      (isEditable && isOwner) ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      (hasCollectionAccess && userFeatures.isCurator) ||
      (isTestInRegrade && allowDuplicate && isEditable) ||
      isCollectionContentEditable
    )
    const isDisableDuplicate = !(
      allowDuplicate && userRole !== roleuser.EDULASTIC_CURATOR
    )
    const disableEdit = item?.algoVariablesEnabled && isTestInRegrade
    const itemHasAtleastOneQuestion = Object.keys(questions || {}).length > 0
    const showAddItemToTestButton =
      itemHasAtleastOneQuestion && testStatus !== 'published'
    const isLoading = loading || item === null || passageLoading
    const isMobile = isSmallSize || fullModal
    const staticGroups = (itemGroups || []).filter(
      (g) => g.type === ITEM_GROUP_TYPES.STATIC
    )
    const groupName =
      staticGroups.length === uniSectionTestLength
        ? 'Test'
        : test?.itemGroups?.find(
            (grp) => !!grp.items.find((i) => i._id === item._id)
          )?.groupName || 'Test'

    const showviewTTSTextBtn =
      data?.questions?.length === 1 &&
      [questionType.MULTIPLE_CHOICE].includes(questionsType?.[0])

    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 0 }}
        wrapClassName="preview-full-modal"
        width={isMobile ? '100%' : '75%'}
        height={isMobile ? '100%' : null}
        visible={isVisible}
        closable={false}
        onCancel={this.closeModal}
        footer={null}
        centered
        className="noOverFlowModal"
        isMobile={isMobile}
      >
        <CustomModalStyled
          title="Customize TTS"
          footer={null}
          width="768px"
          modalMinHeight="400px"
          visible={showTTSTextModal}
          destroyOnClose={false}
          onCancel={this.toggleTTSTextModal}
        >
          <SpeakableText
            ttsTextAPIStatus={ttsTextAPIStatus}
            updateTTSAPIStatus={updateTTSAPIStatus}
            ttsTextData={ttsTextResult}
            updateQuestionTTSText={this.updateQuestionTTSText}
            regenerateTTSText={this.viewTTSText}
            question={data?.questions?.[0] || {}}
            showTTSTextModal={showTTSTextModal}
          />
        </CustomModalStyled>
        {this.navigationButtonVisibile && this.navigationBtns()}
        <HeadingWrapper>
          <Title>Preview</Title>
          <FlexContainer justifyContent="flex-end" width="100%">
            <EduIf condition={showSelectGroupModal}>
              <SelectGroupModal
                visible={showSelectGroupModal}
                test={test}
                handleResponse={this.handleSelectGroupModalResponse}
              />
            </EduIf>
            <ScoreBlock
              customStyle={{
                position: 'relative',
                top: 'unset',
                right: 'unset',
                bottom: 'unset',
                left: 'unset',
                margin: '0 5px',
                transform: 'unset',
              }}
            />
          </FlexContainer>

          <ModalTopAction hidden={isLoading}>
            <FeaturesSwitch
              inputFeatures="viewTTSText"
              actionOnInaccessible="hidden"
            >
              <EduIf condition={showviewTTSTextBtn}>
                <EduButton
                  isGhost
                  height="28px"
                  data-cy="viewTTSText"
                  onClick={() => this.viewTTSText(false)}
                >
                  Customize TTS
                </EduButton>
              </EduIf>
            </FeaturesSwitch>
            {showAddItemToTestButton &&
              (isPassage && showAddPassageItemToTestButton ? (
                <>
                  <EduButton
                    isBlue
                    height="28px"
                    justifyContent="center"
                    onClick={this.handleAddOrRemove}
                    dataCy={
                      this.isAddOrRemove
                        ? 'addCurrentItem'
                        : 'removeCurrentItem'
                    }
                  >
                    {this.isAddOrRemove
                      ? 'ADD CURRENT ITEM'
                      : `REMOVE CURRENT ITEM FROM ${groupName.toUpperCase()}`}
                  </EduButton>
                  {isPassage > 1 && (
                    <EduButton
                      isGhost
                      height="28px"
                      justifyContent="center"
                      onClick={this.handleAddAllPassageItems}
                      dataCy={
                        hasPassageItemToAdd ? `addAllItems` : `removeAllItems`
                      }
                    >
                      {hasPassageItemToAdd
                        ? `Add all(${isPassage}) items`
                        : `Remove all(${isPassage}) items`}
                    </EduButton>
                  )}
                </>
              ) : (
                <EduButton
                  isBlue
                  height="28px"
                  justifyContent="center"
                  onClick={this.handleAddOrRemove}
                  data-cy={this.isAddOrRemove ? 'addToTest' : 'removefromTest'}
                  title={
                    item.unsavedItem
                      ? 'Please save the Test to delete this AI Generated Item'
                      : ''
                  }
                >
                  {this.isAddOrRemove
                    ? 'Add To Test'
                    : `Remove from ${groupName}`}
                </EduButton>
              ))}
            <ButtonsWrapper
              justifyContent="flex-end"
              wrap="nowrap"
              style={{
                visibility: onlySratchpad && 'hidden',
                position: 'relative',
                marginLeft: '5px',
              }}
            >
              {isAnswerBtnVisible && (
                <>
                  <EduButton
                    isGhost
                    height="28px"
                    data-cy="check-answer-btn"
                    onClick={checkAnswer}
                    disabled={!!premiumCollectionWithoutAccess}
                  >
                    CHECK ANSWER
                  </EduButton>
                  <EduButton
                    isGhost
                    height="28px"
                    data-cy="show-answers-btn"
                    onClick={showAnswer}
                    disabled={!!premiumCollectionWithoutAccess}
                  >
                    SHOW ANSWER
                  </EduButton>
                </>
              )}
              <EduIf condition={item?.unsavedItem && page === 'review'}>
                <AiEduButton
                  title="Regenerate"
                  width="28px"
                  isGhost
                  height="28px"
                  onClick={this.onRegenerateTestItem}
                  aiStyle
                >
                  <IconMagicWand fill={`${white}`} />
                </AiEduButton>
              </EduIf>
              {page !== 'itemAuthoring' && (
                <EduButton
                  title="Clear"
                  IconBtn
                  isGhost
                  width="28px"
                  height="28px"
                  data-cy="clear-btn"
                  onClick={this.clearView}
                  disabled={!!premiumCollectionWithoutAccess}
                >
                  <IconClear width="15" height="15" color={themeColor} />
                </EduButton>
              )}
              {disableEdit && userRole !== roleuser.EDULASTIC_CURATOR ? (
                <Popover
                  placement="bottomRight"
                  content={
                    <DisabledHelperText>
                      Dynamic Parameter questions have their random values
                      generated when the test is assigned, and they cannot be
                      changed. You will have to grade these questions manually.
                    </DisabledHelperText>
                  }
                >
                  <DisabledButton>
                    <IconPencilEdit color={themeColor} />
                  </DisabledButton>
                </Popover>
              ) : (
                <Tooltip
                  title={isDynamicTest ? t('authoringItemDisabled.info') : ''}
                >
                  <span
                    style={{
                      cursor: isDynamicTest ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <EduButton
                      IconBtn
                      isGhost
                      height="28px"
                      width="28px"
                      title={
                        item.unsavedItem
                          ? 'Please save the Test to edit this AI Generated Item'
                          : isDisableEdit
                          ? !allowDuplicate
                            ? 'Edit of Item is restricted by Publisher'
                            : 'Edit permission is restricted by the author'
                          : 'Edit item'
                      }
                      noHover={isDisableEdit}
                      disabled={
                        isPlaylistTestReview ||
                        isDisableEdit ||
                        !!premiumCollectionWithoutAccess ||
                        isDynamicTest ||
                        item.unsavedItem
                      }
                      onClick={this.editTestItem}
                      style={isDynamicTest ? { pointerEvents: 'none' } : {}} // For Dynamic & Sections test, edit and clone button are disabled. To avoid overlapping of tooltip on hover of edit and clone button, we disable the pointer events.
                    >
                      <IconPencilEdit color={themeColor} title="Edit item" />
                    </EduButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip
                title={isDynamicTest ? t('authoringItemDisabled.info') : ''}
              >
                <span
                  style={{
                    cursor: isDynamicTest ? 'not-allowed' : 'pointer',
                  }}
                >
                  <EduButton
                    IconBtn
                    isGhost
                    width="28px"
                    height="28px"
                    title={
                      item.unsavedItem
                        ? 'Please save the Test to Clone this AI Generated Item'
                        : isDisableDuplicate
                        ? 'Clone permission is restricted by the author'
                        : 'Clone'
                    }
                    noHover={isDisableDuplicate}
                    disabled={
                      isDisableDuplicate ||
                      !!premiumCollectionWithoutAccess ||
                      isDynamicTest ||
                      item.unsavedItem
                    }
                    onClick={this.handleDuplicateTestItem}
                    style={isDynamicTest ? { pointerEvents: 'none' } : {}} // For Dynamic & Sections test, edit and clone button are disabled. To avoid overlapping of tooltip on hover of edit and clone button, we disable the pointer events.
                  >
                    <IconCopy color={themeColor} />
                  </EduButton>
                </span>
              </Tooltip>
              {(isOwner || isCollectionContentEditable) &&
                !(
                  userFeatures?.isPublisherAuthor && item.status === 'published'
                ) &&
                (page === 'addItems' || page === 'itemList') && (
                  <EduButton
                    IconBtn
                    title="Delete item"
                    isGhost
                    height="28px"
                    width="28px"
                    onClick={this.handleDeleteItem}
                    disabled={
                      (isPassage
                        ? !hasMultipleTestItems || deleting
                        : deleting) || !!premiumCollectionWithoutAccess
                    }
                    data-cy="deleteItem"
                  >
                    <IconTrash title="Delete item" />
                    {/* <span>delete</span> */}
                  </EduButton>
                )}
              <FeaturesSwitch
                inputFeatures="isCurator"
                actionOnInaccessible="hidden"
              >
                <>
                  {item && item.status === 'inreview' && hasCollectionAccess ? (
                    <RejectButton
                      title="Reject"
                      isGhost
                      height="28px"
                      onClick={this.handleReject}
                      disabled={isRejectMode}
                    >
                      <Icon type="stop" color={red} />
                      <span>Reject</span>
                    </RejectButton>
                  ) : null}
                  {item &&
                  (item.status === 'inreview' || item.status === 'rejected') &&
                  hasCollectionAccess ? (
                    <EduButton
                      title="Approve"
                      isGhost
                      height="28px"
                      onClick={() => {
                        this.handleApproveOrRejectSingleItem('published')
                      }}
                    >
                      <Icon type="check" color={themeColor} />
                      <span>Approve</span>
                    </EduButton>
                  ) : null}
                </>
              </FeaturesSwitch>
            </ButtonsWrapper>

            <EduButton
              IconBtn
              isGhost
              type="primary"
              width="28px"
              height="28px"
              onClick={this.toggleFullModal}
              title={fullModal ? 'Collapse' : 'Expand'}
            >
              {fullModal ? <IconCollapse /> : <IconExpand />}
            </EduButton>
            <EduButton
              data-cy="close-preview"
              IconBtn
              isGhost
              width="28px"
              height="28px"
              onClick={this.closeModal}
              title="Close"
              noHover
              style={{ border: 'none', boxShadow: 'none' }}
            >
              <IconClose width={10} height={10} color={`${title} !important`} />
            </EduButton>
          </ModalTopAction>
        </HeadingWrapper>
        <ModalContentArea isMobile={isMobile} id="preview-modal-content-area">
          {isLoading && (
            <ProgressContainer>
              <Spin tip="" />
            </ProgressContainer>
          )}
          <QuestionWrapper hidden={isLoading}>
            <AuthorTestItemPreview
              cols={allRows}
              preview={preview}
              previewTab={preview}
              verticalDivider={item.verticalDivider}
              scrolling={item.scrolling}
              style={{ width: '100%' }}
              questions={allWidgets}
              viewComponent="authorPreviewPopup"
              handleCheckAnswer={checkAnswer}
              handleShowAnswer={showAnswer}
              handleShowHints={this.toggleHints}
              toggleReportIssue={this.toggleReportIssue}
              showHints={showHints}
              allowDuplicate={allowDuplicate}
              /* Giving edit test item functionality to the user who is a curator as curator can edit any test item. */
              isEditable={
                (isEditable && isOwner) ||
                userFeatures.isCurator ||
                userRole === roleuser.EDULASTIC_CURATOR ||
                isCollectionContentEditable
              }
              isPassage={isPassage}
              passageTestItems={passageTestItems}
              handleDuplicateTestItem={this.handleDuplicateTestItem}
              editTestItem={this.editTestItem}
              clearView={this.clearView}
              goToItem={this.goToItem}
              isAnswerBtnVisible={isAnswerBtnVisible}
              item={item}
              page={page}
              isMobile={isMobile}
              showCollapseBtn
              changePreviewTab={changePreviewMode}
              onlySratchpad={onlySratchpad}
              isTestInRegrade={isTestInRegrade}
              closeModal={this.closeModal}
              isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
              premiumCollectionWithoutAccess={premiumCollectionWithoutAccess}
            />
            {/* we may need to bring hint button back */}
            {/* {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />} */}
            {showReportIssueField && (
              <ReportIssue
                textareaRows="3"
                item={item}
                toggleReportIssue={this.toggleReportIssue}
              />
            )}
          </QuestionWrapper>
        </ModalContentArea>
      </PreviewModalWrapper>
    )
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  item: PropTypes.object.isRequired,
  preview: PropTypes.any.isRequired,
  userId: PropTypes.string.isRequired,
  collections: PropTypes.any.isRequired,
  loading: PropTypes.bool,
  gotoSummary: PropTypes.func,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired,
  windowWidth: PropTypes.number.isRequired,
  prevItem: PropTypes.func,
  nextItem: PropTypes.func,
  setSectionsTestSetGroupIndex: PropTypes.func,
  setShowSectionsTestSelectGroupIndexModal: PropTypes.func,
}

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
  gotoSummary: () => {},
  prevItem: () => {},
  nextItem: () => {},
  setSectionsTestSetGroupIndex: () => {},
  setShowSectionsTestSelectGroupIndexModal: () => {},
  loading: false,
  isEditable: false,
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state, ownProps) => {
      const itemId = (ownProps.data || {}).id
      return {
        item:
          getItemDetailSelectorForPreview(state, itemId, ownProps.page) ||
          get(state, 'itemDetail.item'),
        collections: getCollectionsSelector(state),
        passage: getPassageSelector(state),
        preview: get(state, ['view', 'preview']),
        userId: get(state, ['user', 'user', '_id']),
        testItemPreviewData: get(state, ['testItemPreview', 'item'], {}),
        selectedRows: getSelectedItemSelector(state),
        test: getTestSelector(state),
        testAssignments: getAssignmentsSelector(state),
        userFeatures: getUserFeatures(state),
        deleting: getItemDeletingSelector(state),
        passageItems: state.tests.passageItems,
        writableCollections: getWritableCollectionsSelector(state),
        archivedItems: archivedItemsSelector(state),
        passageItemIds: passageItemIdsSelector(state),
        aiTestStatus: state?.aiTestDetails?.status,
        isDynamicTest: isDynamicTestSelector(state),
        ttsTextAPIStatus: getTTSTextAPIStatusSelector(state),
        ttsTextResult: getTTSTextResultSelector(state),
        updateTTSAPIStatus: updateTTSTextAPIStatusSelector(state),
      }
    },
    {
      changeView: changeViewAction,
      changePreviewMode: changePreviewAction,
      clearAnswers: clearAnswersAction,
      addPassage: addPassageAction,
      addItemToCart: addItemToCartAction,
      setPrevewItem: setPrevewItemAction,
      setQuestionsForPassage: setQuestionsForPassageAction,
      clearPreview: clearPreviewAction,
      setDataAndSave: setTestDataAndUpdateAction,
      setTestItems: setTestItemsAction,
      clearItemStore: clearItemDetailAction,
      updateTestAndNavigate: updateTestAndNavigateAction,
      duplicateTestItem: duplicateTestItemPreviewRequestAction,
      deleteItem: deleteItemAction,
      approveOrRejectSingleItem: approveOrRejectSingleItemAction,
      setNextPreviewItem: setNextPreviewItemAction,
      setPassageTestItems: setPassageItemsAction,
      setAndSavePassageItems: setAndSavePassageItemsAction,
      editNonAuthoredItem: editNonAuthoredItemAction,
      setCurrentGroupIndex: setCurrentGroupIndexAction,
      regenerateTestItem: aiTestActions.regenerateAiTestItems,
      setTestData: setTestDataAction,
      setTTSTextState: setTTSTextStateAction,
      fetchTTSText: fetchTTSTextAction,
      updateTTSText: updateTTSTextAction,
    }
  )
)

export default enhance(PreviewModal)

const ProgressContainer = styled.div`
  min-width: 250px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviewModalWrapper = styled(Modal)`
  height: ${({ isMobile }) => (isMobile ? '100%' : 'auto')};
  border-radius: ${({ isMobile }) => (isMobile ? '0px' : '5px')};
  background: #f7f7f7;
  top: 30px;
  padding: 0px;
  position: relative;
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
    overflow-y: auto;
    .ant-modal-close {
      top: 22px;
      right: 18px;
    }
    .ant-modal-close-icon {
      font-size: 25px;
      color: #000;
    }
  }
`

const ArrowStyle = css`
  max-width: 30px;
  font-size: 26px;
  border-radius: 0px;
  left: 0px;
  svg {
    fill: #878a91;
    path {
      fill: unset;
    }
  }

  &:hover {
    svg {
      fill: ${white};
    }
  }
`

const PrevArrow = styled(Nav.BackArrow)`
  ${ArrowStyle};
`

const NextArrow = styled(Nav.NextArrow)`
  ${ArrowStyle};
  left: unset;
  right: 0px;
`

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background: ${white};
  justify-content: space-between;
  position: relative;
`

const ModalTopAction = styled(FlexContainer)`
  visibility: ${({ hidden }) => hidden && 'hidden'};
  justify-content: flex-end;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  user-select: none;
`

export const PlusIcon = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  font-size: 18px;
  line-height: 1;
  margin-right: 10px;
`

const QuestionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  visibility: ${({ hidden }) => hidden && 'hidden'};
  .report {
    flex: 0 0 100%;
  }
`

const ModalContentArea = styled.div`
  border-radius: 0px;
  padding: 0px 30px;
  height: ${({ isMobile }) => (isMobile ? 'calc(100vh - 100px)' : '100%')};
`

const DisabledButton = styled.div`
  height: 28px;
  width: 28px;
  border-radius: 4px;
  border: 1px solid ${themeColor};
  position: relative;
  margin-left: 5px;
  opacity: 0.3;
  cursor: not-allowed;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const DisabledHelperText = styled.div`
  max-width: 320px;
`
