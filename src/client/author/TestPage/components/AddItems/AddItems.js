import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { debounce, uniq, get } from 'lodash'
import { Pagination, Spin, Tooltip } from 'antd'
import {
  roleuser,
  sortOptions,
  test as testConstants,
} from '@edulastic/constants'
import {
  withWindowSizes,
  FlexContainer,
  notification,
  EduButton,
  EduIf,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  IconPlusCircle,
  IconItemGroup,
  IconTestSection,
} from '@edulastic/icons'
import { themeColor, white } from '@edulastic/colors'
import qs from 'qs'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'

import { ItemsPagination, Selected, StyledVerticalDivider } from './styled'
import {
  getCurriculumsListSelector,
  getStandardsListSelector,
} from '../../../src/selectors/dictionaries'
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  clearDictAlignmentAction,
  getDictStandardsForCurriculumAction,
} from '../../../src/actions/dictionaries'
import { createTestItemAction } from '../../../src/actions/testItem'
import FilterToggleBtn from '../../../src/components/common/FilterToggleBtn'
import {
  getTestItemsLoadingSelector,
  getTestItemsSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  receiveTestItemsAction,
  setTestItemsAction,
  getSearchFilterStateSelector,
  updateSearchFilterStateAction,
  clearFilterStateAction,
  filterMenuItems,
  initialSearchState,
  getSortFilterStateSelector,
  initialSortState,
} from './ducks'
import {
  setAndSavePassageItemsAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  setTestDataAndUpdateAction,
  getAllTagsAction,
  setCurrentGroupIndexAction,
  isDynamicTestSelector,
  hasSectionsSelector,
  getCurrentGroupIndexSelector,
  isSurveyTestSelector,
} from '../../ducks'
import ItemFilter from '../../../ItemList/components/ItemFilter/ItemFilter'
import {
  ListItems,
  Element,
  PaginationContainer,
  ContentWrapper,
  ScrollbarContainer,
  MobileFilterIcon,
} from '../../../ItemList/components/Container/styled'
import AddItemsContainer from './AddItemsContainer'
import { SMALL_DESKTOP_WIDTH } from '../../../src/constants/others'
import {
  getInterestedCurriculumsSelector,
  getUserId,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getUserOrgId,
} from '../../../src/selectors/user'
import Item from '../../../ItemList/components/Item/Item'
import {
  PaginationInfo,
  ItemsMenu,
  NoDataMessageContainer,
} from '../../../TestList/components/Container/styled'
import { getDefaultInterests, setDefaultInterests } from '../../../dataUtils'
import HeaderFilter from '../../../ItemList/components/HeaderFilter'
import PreviewModal from '../../../src/components/common/PreviewModal'
import SortMenu from '../../../ItemList/components/SortMenu'
import {
  getFilterFromSession,
  setFilterInSession,
} from '../../../../common/utils/helpers'
import EduAIQuiz from '../../../AssessmentCreate/components/CreateAITest'
import { STATUS } from '../../../AssessmentCreate/components/CreateAITest/ducks/constants'
import SelectGroupModal from './SelectGroupModal'
import { CREATE_AI_TEST_DISPLAY_SCREENS } from '../../../AssessmentCreate/components/CreateAITest/constants'
import { NoDataContainer } from '../../../Reports/common/styled'

const { sectionTestActions } = testConstants

class AddItems extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    receiveTestItems: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    windowWidth: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired,
      })
    ).isRequired,
    getCurriculums: PropTypes.func.isRequired,
    getCurriculumStandards: PropTypes.func.isRequired,
    curriculumStandards: PropTypes.array.isRequired,
    clearDictStandards: PropTypes.func.isRequired,
    onSaveTestId: PropTypes.func.isRequired,
    createTestItem: PropTypes.func.isRequired,
    gotoSummary: PropTypes.func.isRequired,
    needToSetFilter: PropTypes.bool,
  }

  static defaultProps = {
    needToSetFilter: false,
  }

  state = {
    itemIndexForPreview: null,
    showSelectGroupModal: false,
  }

  componentDidMount() {
    const {
      getCurriculums,
      receiveTestItems,
      getCurriculumStandards,
      limit,
      test,
      curriculums,
      getAllTags,
      search: initSearch,
      history,
      interestedSubjects,
      interestedGrades,
      interestedCurriculums: [firstCurriculum],
      pageNumber,
      needToSetFilter,
      sort: initSort,
      userId,
      districtId,
      isSurveyTest,
    } = this.props
    const query = qs.parse(window.location.search, { ignoreQueryPrefix: true })
    let search = {}
    const sessionSort = getFilterFromSession({
      key: sessionFilterKeys.TEST_ITEM_SORT,
      userId,
      districtId,
    })
    const sort = {
      ...initSort,
      sortBy: 'popularity',
      sortDir: 'desc',
      ...sessionSort,
    }

    if (needToSetFilter) {
      // TODO use getPreviouslyUsedOrDefaultInterestsSelector from src/client/author/src/selectors/user.js
      const {
        subject = interestedSubjects?.[0],
        grades = interestedGrades || [],
        curriculumId = firstCurriculum?.subject === interestedSubjects?.[0]
          ? firstCurriculum?._id
          : '',
      } = getDefaultInterests()
      const isAuthoredNow = history?.location?.state?.isAuthoredNow
      const applyAuthoredFilter = isAuthoredNow
        ? { filter: 'AUTHORED_BY_ME' }
        : {}
      const sessionFilters = getFilterFromSession({
        key: sessionFilterKeys.TEST_ITEM_FILTER,
        userId,
        districtId,
      })
      const selectedSubjects = (test?.subjects || []).filter((item) => !!item)
      const selectedGrades = (test?.grades || []).filter((item) => !!item)
      search = {
        ...initSearch,
        ...sessionFilters,
        ...applyAuthoredFilter,
        ...(isSurveyTest ? { questionType: 'likertScale' } : {}),
        subject: selectedSubjects[0] || subject || [],
        grades: uniq([...selectedGrades, ...grades]),
        curriculumId: parseInt(curriculumId, 10) || '',
      }

      this.updateFilterState(search, sort)
    }
    if (!curriculums.length) getCurriculums()
    getAllTags({ type: 'testitem' })
    receiveTestItems(
      search,
      sort,
      parseInt(query.page, 10) ? parseInt(query.page, 10) : pageNumber || 1,
      limit
    )
    if (search.curriculumId) {
      getCurriculumStandards(search.curriculumId, search.grades, '')
    }
  }

  updateFilterState = (newSearch, sort) => {
    const { updateSearchFilterState, userId, districtId } = this.props
    updateSearchFilterState({ search: newSearch, sort })
    setFilterInSession({
      key: sessionFilterKeys.TEST_ITEM_FILTER,
      filter: newSearch,
      userId,
      districtId,
    })
    setFilterInSession({
      key: sessionFilterKeys.TEST_ITEM_SORT,
      filter: sort,
      userId,
      districtId,
    })
  }

  handleSearch = (searchState) => {
    const { receiveTestItems, limit, search, sort } = this.props
    receiveTestItems(searchState || search, sort, 1, limit)
  }

  handleLabelSearch = (e) => {
    const { limit, receiveTestItems, search } = this.props
    const { key: filterType } = e
    const getMatchingObj = filterMenuItems.filter(
      (item) => item.path === filterType
    )
    const { filter = '' } = (getMatchingObj.length && getMatchingObj[0]) || {}
    const searchState = {
      ...search,
      filter,
    }
    const sortByRecency = ['by-me', 'shared'].includes(filterType)
    const sort = {
      sortBy: sortByRecency ? 'recency' : 'popularity',
      sortDir: 'desc',
    }
    this.updateFilterState(searchState, sort)
    receiveTestItems(searchState, sort, 1, limit)
  }

  handleClearSearch = () => {
    const {
      clearFilterState,
      receiveTestItems,
      limit,
      isSurveyTest,
    } = this.props
    const clearFilterObj = {
      needToSetFilter: false,
    }
    if (isSurveyTest) {
      clearFilterObj.search = { questionType: 'likertScale' }
      initialSearchState.questionType = 'likertScale'
    }
    clearFilterState(clearFilterObj)
    receiveTestItems(initialSearchState, initialSortState, 1, limit)
    setDefaultInterests({ subject: [], grades: [], curriculumId: '' })
  }

  // A copy of this functions exists at src/client/author/TestPage/components/Review/components/AddMoreQuestionsPannel/AddMoreQuestionsPannel.js
  // If you make any changes here please do so for the above mentioned copy as well
  handleCreateTestItem = () => {
    const {
      onSaveTestId,
      createTestItem,
      test: { _id: testId, title },
      clearDictAlignment,
    } = this.props
    const defaultWidgets = {
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
    clearDictAlignment()
    onSaveTestId()
    createTestItem(defaultWidgets, true, testId, false, title)
  }

  // A copy of this functions exists at src/client/author/TestPage/components/Review/components/AddMoreQuestionsPannel/AddMoreQuestionsPannel.js
  // If you make any changes here please do so for the above mentioned copy as well
  handleCreateNewItem = () => {
    const {
      test: { _id: testId, title, itemGroups },
      handleSaveTest,
      updated,
      hasSections,
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
    } = this.props
    if (!title) {
      notification({ messageKey: 'nameShouldNotEmpty' })
    }

    /* 
      On create of new item, trigger the save test when:-
        - the test is not having any sections and is updated or
        - the test is having one section or
        - If the test is having multiple sections, then the save test is called 
          after the user selects a particular section from modal
    */
    if (
      ((!hasSections && updated) || (hasSections && itemGroups.length === 1)) &&
      testId
    ) {
      handleSaveTest()
    }

    /**
     * For sections test the select group index modal should only be shown if group index is not known.
     * When click on select items in a section the group index is known and select group index
     * modal need not be shown once again.
     * showSelectGroupIndexModal - this value is always "true" for all other tests except sections test
     */
    if (
      itemGroups.length > 1 &&
      !showSelectGroupIndexModal &&
      typeof currentGroupIndexValueFromStore === 'number'
    ) {
      this.handleSelectGroupModalResponse(currentGroupIndexValueFromStore)
      return
    }
    if (itemGroups.length > 1) {
      this.setState({ showSelectGroupModal: true })
      return
    }
    this.handleCreateTestItem()
  }

  // A copy of this functions exists at src/client/author/TestPage/components/Review/components/AddMoreQuestionsPannel/AddMoreQuestionsPannel.js
  // If you make any changes here please do so for the above mentioned copy as well
  handleSelectGroupModalResponse = (index) => {
    const { setCurrentGroupIndex, handleSaveTest } = this.props
    if (index || index === 0) {
      handleSaveTest()
      setCurrentGroupIndex(index)
      this.handleCreateTestItem()
    }
    this.setState({ showSelectGroupModal: false })
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

  handleSearchFieldChangeCurriculumId = (value) => {
    const {
      clearDictStandards,
      getCurriculumStandards,
      search,
      sort,
    } = this.props
    clearDictStandards()
    const updatedSearchValue = {
      ...search,
      curriculumId: value,
      standardIds: [],
    }
    this.updateFilterState(updatedSearchValue, sort)
    this.handleSearch(updatedSearchValue)
    getCurriculumStandards(value, search.grades, '')
  }

  handleSearchFieldChange = (fieldName) => (value) => {
    const { search, clearDictStandards, sort } = this.props
    let updatedKeys = {}
    if (
      fieldName === 'grades' ||
      fieldName === 'subject' ||
      fieldName === 'curriculumId'
    ) {
      setDefaultInterests({ [fieldName]: value })
    }
    if (fieldName === 'curriculumId') {
      this.handleSearchFieldChangeCurriculumId(value)
      return
    }
    if (fieldName === 'subject') {
      clearDictStandards()
      updatedKeys = {
        ...search,
        [fieldName]: value,
        curriculumId: '',
        standardIds: [],
      }
    } else {
      updatedKeys = {
        ...search,
        [fieldName]: value,
      }
    }
    this.updateFilterState(updatedKeys, sort)
    this.handleSearch(updatedKeys)
  }

  searchDebounce = debounce(this.handleSearch, 500)

  handleSearchInputChange = (tags) => {
    const { search, sort } = this.props
    const updatedKeys = {
      ...search,
      searchString: tags,
    }
    this.updateFilterState(updatedKeys, sort)
    this.searchDebounce(updatedKeys)
  }

  renderPagination = () => {
    const { windowWidth, count, page } = this.props
    return (
      <ItemsPagination>
        <Pagination
          simple={windowWidth <= 768 && true}
          onChange={this.handlePaginationChange}
          defaultPageSize={10}
          total={count}
          current={page}
        />
      </ItemsPagination>
    )
  }

  handlePaginationChange = (page) => {
    const { search, receiveTestItems, limit, sort } = this.props
    receiveTestItems(search, sort, page, limit)
  }

  /*
    When the Add new Sections button is clicked, we will set the hasSections flag to true. 
    As a result, the Add Items tab will be replaced by Add Sections. Also in order to navigate 
    to the Add Sections, we are using the handleNavChange method.
  */
  handleAddSections = () => {
    const {
      setData,
      gotoManageSections,
      setSectionsState,
      testId,
      handleSaveTest,
      setCurrentGroupDetails,
    } = this.props
    setData({ hasSections: true })
    gotoManageSections()
    setSectionsState(true)
    if (testId) handleSaveTest(sectionTestActions.ADD)
    setCurrentGroupDetails()
  }

  renderItems = (selectedItemIds) => {
    const {
      items,
      test,
      history,
      windowWidth,
      addItemToCart,
      userId,
      interestedCurriculums,
      testItemsList,
      setDataAndSave,
      setTestItems,
      gotoSummary,
      search,
      setCurrentGroupIndex,
      current,
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
      isDynamicTest,
    } = this.props
    const { ADD_ITEMS_NO_DATA_SCREEN } = CREATE_AI_TEST_DISPLAY_SCREENS
    if (items.length < 1) {
      return (
        <NoDataContainer>
          <FlexContainer flexDirection="column" alignItems="center">
            <NoDataMessageContainer maxWidth="220px">
              No item available for the search criteria
            </NoDataMessageContainer>
            <EduIf condition={!isDynamicTest}>
              <EduAIQuiz
                addItems
                test={test}
                currentGroupIndexValueFromStore={
                  currentGroupIndexValueFromStore
                }
                showSelectGroupIndexModal={showSelectGroupIndexModal}
                displayScreen={ADD_ITEMS_NO_DATA_SCREEN}
              />
            </EduIf>
          </FlexContainer>
        </NoDataContainer>
      )
    }
    return items.map((item, index) => (
      <Item
        key={`Item_${item._id}`}
        item={item}
        history={history}
        userId={userId}
        windowWidth={windowWidth}
        onToggleToCart={addItemToCart}
        selectedToCart={
          selectedItemIds ? selectedItemIds.includes(item._id) : false
        }
        interestedCurriculums={interestedCurriculums}
        search={search}
        test={test}
        testItemsList={testItemsList}
        current={current}
        setDataAndSave={setDataAndSave}
        setTestItems={setTestItems}
        selectedRows={selectedItemIds}
        gotoSummary={gotoSummary}
        page="addItems"
        openPreviewModal={this.openPreviewModal(index)}
        setCurrentGroupIndex={setCurrentGroupIndex}
        showSelectGroupIndexModal={showSelectGroupIndexModal}
        currentGroupIndexValueFromStore={currentGroupIndexValueFromStore}
      />
    ))
  }

  openPreviewModal = (itemIndex) => () => {
    this.setState({ itemIndexForPreview: itemIndex })
  }

  closePreviewModal = () => {
    this.setState({ itemIndexForPreview: null })
  }

  checkItemAnswer = () => {
    const { checkAnswer } = this.props
    checkAnswer({ ...this.selectedItem, isItem: true })
  }

  showItemAnswer = () => {
    const { showAnswer } = this.props
    showAnswer(this.selectedItem)
  }

  prevItem = () => {
    const { itemIndexForPreview } = this.state
    const prevItemIndex = itemIndexForPreview - 1
    if (prevItemIndex < 0) {
      return
    }
    this.setState({ itemIndexForPreview: prevItemIndex })
  }

  nextItem = () => {
    const { items } = this.props
    const { itemIndexForPreview } = this.state
    const nextItemIndex = itemIndexForPreview + 1
    if (nextItemIndex > items.length - 1) {
      return
    }
    this.setState({ itemIndexForPreview: nextItemIndex })
  }

  onSelectSortOption = (value, sortDir) => {
    const { search, limit, sort, receiveTestItems } = this.props
    const updateSort = {
      ...sort,
      sortBy: value,
      sortDir,
    }
    this.updateFilterState(search, updateSort)
    receiveTestItems(search, updateSort, 1, limit)
  }

  get selectedItem() {
    const { items } = this.props
    const { itemIndexForPreview } = this.state
    const item = get(items, `[${itemIndexForPreview}]`, false)
    if (!item) {
      return item
    }
    return { ...item, isItem: true, id: item._id }
  }

  get owner() {
    const { userId } = this.props
    return get(this.selectedItem, 'authors', []).some((x) => x._id === userId)
  }

  get getGroupIndex() {
    const { test, items } = this.props
    const { itemIndexForPreview } = this.state
    const itemGroups = test?.itemGroups || []
    const item = get(items, `[${itemIndexForPreview}]`, false)
    const itemId = item?._id || ''

    const groupIndex = itemGroups?.findIndex((group) =>
      group.items?.some((_item) => _item._id === itemId)
    )

    // If the item is not added to the test
    if (groupIndex === -1) {
      return 0
    }

    return groupIndex
  }

  render() {
    const {
      windowWidth,
      curriculums,
      getCurriculumStandards,
      curriculumStandards,
      loading,
      t,
      count,
      test,
      toggleFilter,
      isShowFilter,
      search,
      userRole,
      sort = {},
      gotoManageSections,
      aiTestStatus = false,
      isDynamicTest,
      hasSections,
      isOwner,
      isEditable,
      isDefaultTest,
      isEnterprise,
      showSelectGroupIndexModal,
      currentGroupIndexValueFromStore,
      setSectionsTestSetGroupIndex,
      setShowSectionsTestSelectGroupIndexModal,
    } = this.props
    const { showSelectGroupModal } = this.state
    const selectedItemIds = test?.itemGroups?.flatMap(
      (itemGroup) => itemGroup?.items?.map((i) => i._id) || []
    )
    const itemGroupCount = selectedItemIds?.length || 0

    const { ADD_ITEMS_SCREEN } = CREATE_AI_TEST_DISPLAY_SCREENS

    return (
      // The Add item screen will be displayed in full screen mode for dynamic test
      <AddItemsContainer isFullScreenMode={isDynamicTest}>
        {showSelectGroupModal && (
          <SelectGroupModal
            visible={showSelectGroupModal}
            test={test}
            handleResponse={this.handleSelectGroupModalResponse}
          />
        )}
        <ItemFilter
          onSearchFieldChange={this.handleSearchFieldChange}
          onSearchInputChange={this.handleSearchInputChange}
          onSearch={this.handleSearch}
          onClearSearch={this.handleClearSearch}
          onLabelSearch={this.handleLabelSearch}
          windowWidth={windowWidth}
          search={search}
          curriculums={curriculums}
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandards={curriculumStandards}
          items={
            userRole === roleuser.EDULASTIC_CURATOR
              ? [filterMenuItems[0]]
              : filterMenuItems
          }
          toggleFilter={toggleFilter}
          isShowFilter={isShowFilter}
          showFilter={
            windowWidth < SMALL_DESKTOP_WIDTH ? !isShowFilter : isShowFilter
          }
          t={t}
        />
        <ListItems isShowFilter={isShowFilter}>
          <Element>
            <MobileFilterIcon>
              <FilterToggleBtn
                isShowFilter={!isShowFilter}
                toggleFilter={toggleFilter}
              />
            </MobileFilterIcon>
            <ContentWrapper borderRadius="0px" padding="0px">
              {loading && <Spin size="large" />}
              <ItemsMenu>
                <PaginationInfo>
                  <span>{count}</span> QUESTIONS FOUND
                </PaginationInfo>
                <HeaderFilter
                  search={search}
                  handleCloseFilter={(type, value) =>
                    this.handleSearchFieldChange(type)(value)
                  }
                  type="testitem"
                />
                <FlexContainer
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Selected style={{ fontSize: '12px' }}>
                    {itemGroupCount} SELECTED
                  </Selected>
                  <EduIf
                    condition={
                      !isDynamicTest &&
                      !hasSections &&
                      isOwner &&
                      isEditable &&
                      isDefaultTest &&
                      isEnterprise
                    }
                  >
                    <EduButton
                      height="28px"
                      isGhost
                      data-cy="createSectionsTest"
                      disabled={isDynamicTest || hasSections}
                      onClick={this.handleAddSections}
                    >
                      <IconTestSection
                        color={themeColor}
                        width={12}
                        height={12}
                      />
                      <span>CREATE SECTION</span>
                    </EduButton>
                    <StyledVerticalDivider type="vertical" />
                  </EduIf>
                  <EduIf condition={!isDynamicTest}>
                    <EduAIQuiz
                      addItems
                      test={test}
                      currentGroupIndexValueFromStore={
                        currentGroupIndexValueFromStore
                      }
                      showSelectGroupIndexModal={showSelectGroupIndexModal}
                      displayScreen={ADD_ITEMS_SCREEN}
                    />
                  </EduIf>
                  {userRole !== roleuser.EDULASTIC_CURATOR && (
                    <Tooltip
                      title={
                        isDynamicTest ? t('authoringItemDisabled.info') : ''
                      }
                    >
                      <div>
                        <EduButton
                          height="28px"
                          isGhost
                          data-cy="createNewItem"
                          disabled={isDynamicTest}
                          onClick={this.handleCreateNewItem}
                          style={isDynamicTest ? { pointerEvents: 'none' } : {}} // Tooltip should hide immediately as soon as mouse pointer leaves
                        >
                          <IconPlusCircle
                            color={themeColor}
                            width={12}
                            height={12}
                          />
                          <span>Create new Item</span>
                        </EduButton>
                      </div>
                    </Tooltip>
                  )}
                </FlexContainer>
                <SortMenu
                  options={sortOptions.itemList}
                  onSelect={this.onSelectSortOption}
                  sortDir={sort.sortDir}
                  sortBy={sort.sortBy}
                />
                {(isDynamicTest || hasSections) && (
                  <EduButton
                    style={{ height: '32px !important' }}
                    data-cy="gotoManageSections"
                    onClick={gotoManageSections}
                  >
                    <IconItemGroup color={white} width={12} height={12} />
                    <span>Done</span>
                  </EduButton>
                )}
              </ItemsMenu>

              {!loading && (
                <ScrollbarContainer>
                  {this.renderItems(selectedItemIds)}
                  {count > 10 && (
                    <PaginationContainer>
                      {this.renderPagination()}
                    </PaginationContainer>
                  )}
                </ScrollbarContainer>
              )}

              {this.selectedItem && (
                <Spin spinning={aiTestStatus === STATUS.INPROGRESS}>
                  <PreviewModal
                    isVisible={!!this.selectedItem}
                    page="itemList"
                    showAddPassageItemToTestButton
                    showEvaluationButtons
                    data={this.selectedItem}
                    isEditable={this.owner}
                    owner={this.owner}
                    testId={test?._id}
                    isTest={!!test}
                    prevItem={this.prevItem}
                    nextItem={this.nextItem}
                    onClose={this.closePreviewModal}
                    checkAnswer={this.checkItemAnswer}
                    showAnswer={this.showItemAnswer}
                    hasSections={hasSections}
                    currentGroupIndexValueFromStore={
                      currentGroupIndexValueFromStore
                    }
                    showSelectGroupIndexModal={showSelectGroupIndexModal}
                    setSectionsTestSetGroupIndex={setSectionsTestSetGroupIndex}
                    setShowSectionsTestSelectGroupIndexModal={
                      setShowSectionsTestSelectGroupIndexModal
                    }
                    groupIndex={this.getGroupIndex}
                  />
                </Spin>
              )}
            </ContentWrapper>
          </Element>
        </ListItems>
      </AddItemsContainer>
    )
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      items: getTestItemsSelector(state),
      loading: getTestItemsLoadingSelector(state),
      page: getTestsItemsPageSelector(state),
      limit: getTestsItemsLimitSelector(state),
      count: getTestsItemsCountSelector(state),
      curriculums: getCurriculumsListSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      userId: getUserId(state),
      districtId: getUserOrgId(state),
      testItemsList: getTestItemsSelector(state),
      search: getSearchFilterStateSelector(state),
      sort: getSortFilterStateSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      pageNumber: state?.testsAddItems?.page,
      needToSetFilter: state?.testsAddItems?.needToSetFilter,
      aiTestStatus: get(state, 'aiTestDetails.status'),
      isDynamicTest: isDynamicTestSelector(state),
      hasSections: hasSectionsSelector(state),
      currentGroupIndexValueFromStore: getCurrentGroupIndexSelector(state),
      isSurveyTest: isSurveyTestSelector(state),
    }),
    {
      receiveTestItems: (search, sort, page, limit) => {
        const _search = {
          ...search,
          standardIds: search?.standardIds?.map((item) => item._id) || [],
        }
        return receiveTestItemsAction(_search, sort, page, limit)
      },
      getAllTags: getAllTagsAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      clearDictAlignment: clearDictAlignmentAction,
      createTestItem: createTestItemAction,
      setAndSavePassageItems: setAndSavePassageItemsAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      setDataAndSave: setTestDataAndUpdateAction,
      setTestItems: setTestItemsAction,
      updateSearchFilterState: updateSearchFilterStateAction,
      clearFilterState: clearFilterStateAction,
      setCurrentGroupIndex: setCurrentGroupIndexAction,
    }
  )
)

export default enhance(AddItems)
