import { withWindowSizes } from '@edulastic/common'
import { IconItemLibrary } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { roleuser, sortOptions } from '@edulastic/constants'
import { Pagination, Spin } from 'antd'
import { debounce, omit, isEqual } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import {
  updateDefaultGradesAction,
  updateDefaultSubjectAction,
} from '../../../../student/Login/ducks'
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
} from '../../../src/actions/dictionaries'
import { createTestItemAction } from '../../../src/actions/testItem'
import FilterToggleBtn from '../../../src/components/common/FilterToggleBtn'
import ListHeader from '../../../src/components/common/ListHeader'
import { SMALL_DESKTOP_WIDTH } from '../../../src/constants/others'
import {
  getCurriculumsListSelector,
  getStandardsListSelector,
} from '../../../src/selectors/dictionaries'
import { getTestItemCreatingSelector } from '../../../src/selectors/testItem'
import {
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getInterestedCurriculumsSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getUserFeatures,
  getUserId,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import {
  ItemsMenu,
  PaginationInfo,
} from '../../../TestList/components/Container/styled'
import {
  clearFilterStateAction,
  filterMenuItems,
  getSearchFilterStateSelector,
  getTestItemsLoadingSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  initialSearchState,
  receiveTestItemsAction,
  updateSearchFilterStateAction,
  getSelectedItemSelector,
  setApproveConfirmationOpenAction,
  getSortFilterStateSelector,
  initialSortState,
} from '../../../TestPage/components/AddItems/ducks'
import {
  getAllTagsAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  setDefaultTestDataAction,
  getDefaultTestSettingsAction,
} from '../../../TestPage/ducks'
import {
  approveOrRejectMultipleItem as approveOrRejectMultipleItemAction,
  createTestFromCartAction,
} from '../../ducks'
import Actions from '../Actions'
import SelectCollectionModal from '../Actions/SelectCollection'
import CartButton from '../CartButton/CartButton'
import ItemFilter from '../ItemFilter/ItemFilter'
import ItemListContainer from './ItemListContainer'
import {
  Container,
  ContentWrapper,
  Element,
  ListItems,
  MobileFilterIcon,
  PaginationContainer,
  ScrollbarContainer,
} from './styled'
import { setDefaultInterests, getDefaultInterests } from '../../../dataUtils'
import HeaderFilter from '../HeaderFilter'
import SideContent from '../../../Dashboard/components/SideContent/Sidecontent'
import ApproveConfirmModal from '../ApproveConfirmModal'
import SortMenu from '../SortMenu'
import {
  getFilterFromSession,
  setFilterInSession,
} from '../../../../common/utils/helpers'
import { getTestEntitySelector } from '../../../AssignTest/duck'

// container the main entry point to the component
class Contaier extends Component {
  state = {
    isShowFilter: true,
    openSidebar: false,
  }

  componentDidMount() {
    const {
      receiveItems,
      curriculums,
      getCurriculums,
      getCurriculumStandards,
      match = {},
      limit,
      setDefaultTestData,
      search: initSearch,
      getAllTags,
      history,
      interestedSubjects,
      interestedGrades,
      interestedCurriculums: [firstCurriculum],
      sort: initSort = {},
      userId,
      districtId,
      test,
      getDefaultTestSettings,
      userRole,
    } = this.props

    // TODO use getPreviouslyUsedOrDefaultInterestsSelector from src/client/author/src/selectors/user.js
    const {
      subject = interestedSubjects,
      grades = interestedGrades || [],
      curriculumId = firstCurriculum &&
      firstCurriculum.subject === interestedSubjects?.[0]
        ? firstCurriculum._id
        : '',
    } = getDefaultInterests()
    const isAuthoredNow = history?.location?.state?.isAuthoredNow
    const applyAuthoredFilter = isAuthoredNow
      ? { filter: 'AUTHORED_BY_ME' }
      : {}
    const { params = {} } = match
    const sessionFilters = getFilterFromSession({
      key: sessionFilterKeys.TEST_ITEM_FILTER,
      userId,
      districtId,
    })
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
    const search = {
      ...initSearch,
      ...sessionFilters,
      ...applyAuthoredFilter,
      subject: subject || [],
      grades,
      curriculumId: parseInt(curriculumId, 10) || '',
    }
    if (test && test._id) {
      setDefaultTestData()
    } else if (userRole !== roleuser.EDULASTIC_CURATOR) {
      getDefaultTestSettings()
    }
    getAllTags({ type: 'testitem' })
    if (params.filterType) {
      const getMatchingObj = filterMenuItems.filter(
        (item) => item.path === params.filterType
      )
      const { filter = '' } = (getMatchingObj.length && getMatchingObj[0]) || {}
      const updatedSearch = { ...search, filter }

      if (filter === filterMenuItems[0].filter) {
        updatedSearch.status = ''
      }
      this.updateFilterState(updatedSearch, sort)

      if (filter === filterMenuItems[4].filter) {
        updatedSearch.filter = filterMenuItems[0].filter
      }

      receiveItems(updatedSearch, sort, 1, limit)
    } else {
      this.updateFilterState(search, sort)
      receiveItems(search, sort, 1, limit)
    }
    if (curriculums.length === 0) {
      getCurriculums()
    }
    if (search.curriculumId) {
      getCurriculumStandards(search.curriculumId, search.grades, '')
    }
  }

  updateFilterState = (newSearch, sort = {}) => {
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
    const {
      limit,
      receiveItems,
      userFeatures,
      search: propSearch,
      sort,
    } = this.props
    let search = searchState || propSearch
    if (!userFeatures.isCurator) search = omit(search, 'authoredByIds')
    receiveItems(search, sort, 1, limit)
  }

  handleLabelSearch = (e) => {
    const { limit, receiveItems, history, search } = this.props
    const { key: filterType } = e
    const getMatchingObj = filterMenuItems.filter(
      (item) => item.path === filterType
    )
    const { filter = '' } = (getMatchingObj.length && getMatchingObj[0]) || {}
    let updatedSearch = omit(search, ['folderId'])

    if (filter === filterMenuItems[0].filter) {
      updatedSearch = {
        ...updatedSearch,
        status: '',
      }
    }
    const sortByRecency = ['by-me', 'shared'].includes(filterType)
    const sort = {
      sortBy: sortByRecency ? 'recency' : 'popularity',
      sortDir: 'desc',
    }
    this.updateFilterState(
      {
        ...updatedSearch,
        filter,
      },
      sort
    )

    if (filterType !== 'folders') {
      receiveItems({ ...updatedSearch, filter }, sort, 1, limit)
    }

    history.push(`/author/items/filter/${filterType}`)
  }

  handleClearSearch = () => {
    const {
      clearFilterState,
      limit,
      receiveItems,
      search = {},
      sort = {},
    } = this.props

    // If current filter and initial filter is equal don't need to reset again
    if (isEqual(search, initialSearchState) && isEqual(sort, initialSortState))
      return null

    clearFilterState()

    this.updateFilterState(initialSearchState, initialSortState)
    receiveItems(initialSearchState, initialSortState, 1, limit)
    setDefaultInterests({ subject: [], grades: [], curriculumId: '' })
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

  handleSearchFieldChange = (fieldName) => (value, dateString) => {
    const {
      updateDefaultGrades,
      udpateDefaultSubject,
      clearDictStandards,
      getCurriculumStandards,
      search,
      sort,
    } = this.props
    let updatedKeys = {}
    if (fieldName === 'folderId') {
      const searchWithFolder = {
        ...initialSearchState,
        [fieldName]: value,
        filter: 'FOLDERS',
      }
      this.updateFilterState(searchWithFolder, sort)
      return this.handleSearch(searchWithFolder)
    }
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
    if (fieldName === 'grades' && search.curriculumId) {
      clearDictStandards()
      getCurriculumStandards(search.curriculumId, value, '')
    }
    if (fieldName === 'subject') {
      clearDictStandards()
      udpateDefaultSubject(value)
      updatedKeys = {
        ...search,
        [fieldName]: value,
        curriculumId: '',
        standardIds: [],
      }
    }
    if (fieldName === 'createdAt') {
      updatedKeys = {
        ...search,
        [fieldName]: value ? moment(dateString, 'DD/MM/YYYY').valueOf() : '',
      }
    } else {
      updatedKeys = {
        ...search,
        [fieldName]: value,
      }
    }

    if (fieldName === 'grades') {
      updateDefaultGrades(value)
      storeInLocalStorage('defaultGrades', value)
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
    this.searchDebounce()
  }

  handleCreate = async () => {
    const { createItem } = this.props
    createItem({
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: [],
          flowLayout: false,
          content: '',
        },
      ],
    })
  }

  handlePaginationChange = (page) => {
    const { search, sort } = this.props
    const { receiveItems, limit } = this.props
    receiveItems(search, sort, page, limit)
  }

  renderPagination = () => {
    const { count, page } = this.props
    return (
      <Pagination
        simple={false}
        showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
        onChange={this.handlePaginationChange}
        defaultPageSize={25}
        total={count}
        current={page}
      />
    )
  }

  toggleFilter = () => {
    const { isShowFilter } = this.state

    this.setState({
      isShowFilter: !isShowFilter,
    })
  }

  rejectNumberChecker = (testItems) => {
    let count = 0
    for (const i of testItems) {
      if (i.status === 'inreview') {
        count++
      }
    }
    return count
  }

  approveNumberChecker = (testItems) => {
    let count = 0
    for (const i of testItems) {
      if (i.status === 'inreview' || i.status === 'rejected') {
        count++
      }
    }
    return count
  }

  onClickNewTest = () => {
    const { createTestFromCart } = this.props
    createTestFromCart()
  }

  toggleSidebar = () =>
    this.setState((prevState) => ({ openSidebar: !prevState.openSidebar }))

  onSelectSortOption = (value, sortDir) => {
    const { search, limit, sort, receiveItems } = this.props
    const updateSort = {
      ...sort,
      sortBy: value,
      sortDir,
    }
    this.updateFilterState(search, updateSort)
    receiveItems(search, updateSort, 1, limit)
  }

  handleApproveItems = () => {
    const {
      approveOrRejectMultipleItem,
      selectedItems,
      setApproveConfirmationOpen,
    } = this.props
    if (selectedItems.length > 1) {
      setApproveConfirmationOpen(true)
    } else {
      approveOrRejectMultipleItem({ status: 'published' })
    }
  }

  renderCartButton = () => {
    const { approveOrRejectMultipleItem, userRole } = this.props
    if (userRole === roleuser.EDULASTIC_CURATOR) return null

    return (
      <>
        <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
          <CartButton
            onClick={() => approveOrRejectMultipleItem({ status: 'rejected' })}
            buttonText="Reject"
            numberChecker={this.rejectNumberChecker}
          />
          <CartButton
            onClick={this.handleApproveItems}
            buttonText="Approve"
            numberChecker={this.approveNumberChecker}
          />
        </FeaturesSwitch>
      </>
    )
  }

  renderFilterIcon = (isShowFilter) => (
    <FilterToggleBtn
      isShowFilter={!isShowFilter}
      toggleFilter={this.toggleFilter}
    />
  )

  render() {
    const {
      windowWidth,
      creating,
      t,
      getCurriculumStandards,
      curriculumStandards,
      loading,
      count,
      search,
      userRole,
      sort = {},
    } = this.props

    const { isShowFilter, openSidebar } = this.state
    return (
      <div>
        <SideContent
          onClick={this.toggleSidebar}
          open={openSidebar}
          showSliderBtn={false}
        />
        <SelectCollectionModal contentType="TESTITEM" />
        <ApproveConfirmModal contentType="TESTITEM" />
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title={t('header:common.itemBank')}
          titleIcon={IconItemLibrary}
          renderExtra={this.renderCartButton}
          renderFilterIcon={this.renderFilterIcon}
          newTest={this.onClickNewTest}
          toggleSidebar={this.toggleSidebar}
        />
        <Container>
          <ItemFilter
            onSearchFieldChange={this.handleSearchFieldChange}
            onSearchInputChange={this.handleSearchInputChange}
            onSearch={this.handleSearch}
            onClearSearch={this.handleClearSearch}
            onLabelSearch={this.handleLabelSearch}
            windowWidth={windowWidth}
            search={search}
            getCurriculumStandards={getCurriculumStandards}
            curriculumStandards={curriculumStandards}
            items={
              userRole === roleuser.EDULASTIC_CURATOR
                ? [filterMenuItems[0]]
                : filterMenuItems
            }
            toggleFilter={this.toggleFilter}
            t={t}
            itemCount={count}
            showFilter={
              windowWidth < SMALL_DESKTOP_WIDTH ? !isShowFilter : isShowFilter
            }
          />
          <ListItems isShowFilter={isShowFilter}>
            <Element>
              <MobileFilterIcon>
                {this.renderFilterIcon(isShowFilter)}
              </MobileFilterIcon>
              <ContentWrapper borderRadius="0px" padding="0px">
                {loading && <Spin size="large" />}
                <>
                  <ItemsMenu>
                    <PaginationInfo>
                      <span>{count}</span>
                      <span>{t('author:component.item.itemsFound')}</span>
                    </PaginationInfo>
                    <HeaderFilter
                      search={search}
                      handleCloseFilter={(type, value) =>
                        this.handleSearchFieldChange(type)(value)
                      }
                      type="testitem"
                    />
                    <SortMenu
                      options={sortOptions.itemList}
                      onSelect={this.onSelectSortOption}
                      sortDir={sort.sortDir}
                      sortBy={sort.sortBy}
                    />
                    <Actions type="TESTITEM" />
                  </ItemsMenu>

                  {!loading && (
                    <ScrollbarContainer>
                      <ItemListContainer
                        windowWidth={windowWidth}
                        search={search}
                      />
                      {count > 10 && (
                        <PaginationContainer>
                          {this.renderPagination()}
                        </PaginationContainer>
                      )}
                    </ScrollbarContainer>
                  )}
                </>
              </ContentWrapper>
            </Element>
          </ListItems>
        </Container>
      </div>
    )
  }
}

Contaier.propTypes = {
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  receiveItems: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  createItem: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  creating: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
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
  loading: PropTypes.bool.isRequired,
  setDefaultTestData: PropTypes.func.isRequired,
}

const enhance = compose(
  withWindowSizes,
  withNamespaces(['author', 'header']),
  connect(
    (state) => ({
      limit: getTestsItemsLimitSelector(state),
      page: getTestsItemsPageSelector(state),
      count: getTestsItemsCountSelector(state),
      loading: getTestItemsLoadingSelector(state),
      creating: getTestItemCreatingSelector(state),
      curriculums: getCurriculumsListSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      search: getSearchFilterStateSelector(state),
      sort: getSortFilterStateSelector(state),
      passageItems: state.tests.passageItems || [],
      userFeatures: getUserFeatures(state),
      userRole: getUserRole(state),
      selectedItems: getSelectedItemSelector(state),
      userId: getUserId(state),
      districtId: getUserOrgId(state),
      test: getTestEntitySelector(state),
    }),
    {
      receiveItems: (search, sort, page, limit) => {
        const _search = {
          ...search,
          standardIds: search?.standardIds?.map((item) => item._id) || [],
        }
        return receiveTestItemsAction(_search, sort, page, limit)
      },
      createItem: createTestItemAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      setDefaultTestData: setDefaultTestDataAction,
      udpateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      getAllTags: getAllTagsAction,
      createTestFromCart: createTestFromCartAction,
      updateSearchFilterState: updateSearchFilterStateAction,
      clearFilterState: clearFilterStateAction,
      approveOrRejectMultipleItem: approveOrRejectMultipleItemAction,
      setApproveConfirmationOpen: setApproveConfirmationOpenAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
    }
  )
)

export default enhance(Contaier)
