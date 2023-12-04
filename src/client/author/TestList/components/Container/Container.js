import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  debounce,
  get,
  has,
  pickBy,
  identity,
  pick,
  isEqual,
  omit,
} from 'lodash'
import qs from 'qs'
import PerfectScrollbar from 'react-perfect-scrollbar'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import moment from 'moment'
import { Button, Row, Spin, Dropdown, Menu } from 'antd'
import Modal from 'react-responsive-modal'
import {
  withWindowSizes,
  FlexContainer,
  notification,
  EduIf,
} from '@edulastic/common'
import { IconList, IconTile, IconTestBank } from '@edulastic/icons'
import { white, greyLight1, greyThemeLight } from '@edulastic/colors'
import {
  storeInLocalStorage,
  getFromSessionStorage,
} from '@edulastic/api/src/utils/Storage'
import { libraryFilters, sortOptions } from '@edulastic/constants'
import { withNamespaces } from 'react-i18next'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'
import {
  ScrollBox,
  Container,
  ScrollbarWrapper,
  PaginationInfo,
  Filter,
  MobileFilter,
  Main,
  FilterButton,
  SearchModalContainer,
  CardContainer,
  PaginationWrapper,
  AffixWrapper,
  StyleChangeWrapper,
  CardBox,
  StyledCountText,
  ItemsMenu,
  MobileFilterModal,
} from './styled'

import CardWrapper from '../CardWrapper/CardWrapper'
import {
  receiveTestsAction,
  getTestsSelector,
  getTestsLoadingSelector,
  getTestsCountSelector,
  getTestsLimitSelector,
  getTestsPageSelector,
  updateTestSearchFilterAction,
  updateAllTestSearchFilterAction,
  getTestsFilterSelector,
  clearTestFiltersAction,
  filterMenuItems,
  emptyFilters,
  addTestToCartAction,
  removeTestFromCartAction,
  approveOrRejectMultipleTestsRequestAction,
  getSortFilterStateSelector,
  initialSortState,
  getSelectedTestsSelector,
} from '../../ducks'
import {
  getTestsCreatingSelector,
  clearTestDataAction,
  clearCreatedItemsAction,
  getAllTagsAction,
} from '../../../TestPage/ducks'
import {
  clearSelectedItemsAction,
  setApproveConfirmationOpenAction,
} from '../../../TestPage/components/AddItems/ducks'
import { getCurriculumsListSelector } from '../../../src/selectors/dictionaries'
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
} from '../../../src/actions/dictionaries'

import ListHeader from '../../../src/components/common/ListHeader'
import TestListFilters from './TestListFilters'
import AddTestModal from '../../../PlaylistPage/components/AddTestsModal/AddTestModal'
import AddBulkTestModal from '../../../PlaylistPage/components/AddBulkTestModal/AddBulkTestModal'
import DeleteBulkTestModal from '../../../PlaylistPage/components/DeleteBulkTestModal/DeleteBulkTestModal'
import ManageModulesModalBody from '../../../CurriculumSequence/components/modals/ManageModulesModalBody'
import {
  StyledButton,
  BtnActionsContainer,
} from '../../../TestPage/components/AddItems/styled'
import {
  createNewModuleAction,
  updateModuleAction,
  deleteModuleAction,
  resequenceModulesAction,
  createTestInModuleAction,
  addTestToModuleInBulkAction,
  deleteTestFromModuleInBulkAction,
  removeTestFromPlaylistAction,
} from '../../../PlaylistPage/ducks'
import RemoveTestModal from '../../../PlaylistPage/components/RemoveTestModal/RemoveTestModal'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import {
  getInterestedCurriculumsSelector,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector,
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getUserFeatures,
  getUserOrgId,
  getCollectionsSelector,
} from '../../../src/selectors/user'
import {
  getInterestedStandards,
  getDefaultInterests,
  setDefaultInterests,
} from '../../../dataUtils'
import {
  updateDefaultGradesAction,
  updateDefaultSubjectAction,
  isProxyUser as isProxyUserSelector,
  isDemoPlaygroundUser,
} from '../../../../student/Login/ducks'
import CartButton from '../CartButton/cartButton'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import Actions from '../../../ItemList/components/Actions'
import SelectCollectionModal from '../../../ItemList/components/Actions/SelectCollection'
import HeaderFilter from '../../../ItemList/components/HeaderFilter'

import InputTag from '../../../ItemList/components/ItemFilter/SearchTag'
import SideContent from '../../../Dashboard/components/SideContent/Sidecontent'
import SortMenu from '../../../ItemList/components/SortMenu'
import FilterToggleBtn from '../../../src/components/common/FilterToggleBtn'
import ApproveConfirmModal from '../../../ItemList/components/ApproveConfirmModal'
import {
  getFilterFromSession,
  setFilterInSession,
} from '../../../../common/utils/helpers'
import BuyAISuiteAlertModal from '../../../../common/components/BuyAISuiteAlertModal'

// TODO: split into mulitple components, for performance sake.
// and only connect what is required.
// like seprating out filter and test rendering into two, and connect them to only what is required.

const setBlockstyleInSession = (blockstyle) => {
  sessionStorage.setItem('testLibraryBlockstyle', blockstyle)
}

class TestList extends Component {
  static propTypes = {
    tests: PropTypes.array.isRequired,
    receiveTests: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    windowWidth: PropTypes.number.isRequired,
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
    clearDictStandards: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    clearTestData: PropTypes.func,
    clearCreatedItems: PropTypes.func.isRequired,
    playlist: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    getAllTags: PropTypes.func.isRequired,
    testFilters: PropTypes.object.isRequired,
  }

  static defaultProps = {
    clearTestData: () => null,
  }

  state = {
    standardQuery: '',
    blockstyle: 'tile',
    showCreateModuleModal: false,
    showManageModuleModal: false,
    showConfirmRemoveModal: false,
    showAddTestInModules: false,
    showAddModules: false,
    selectedTests: [],
    isShowFilter: false,
    markedTests: [],
    moduleModalAdd: null,
    openSidebar: false,
    isSingaporeMath: false,
    isBuyAISuiteAlertModalVisible: false,
  }

  static getDerivedStateFromProps = (props, prevState) => {
    const { features, mode } = props
    const localBlockstyle = getFromSessionStorage('testLibraryBlockstyle')
    if (localBlockstyle) {
      return {
        ...prevState,
        blockstyle: localBlockstyle,
      }
    }
    if (features.isCurator && mode !== 'embedded') {
      setBlockstyleInSession('horizontal')
      return {
        ...prevState,
        blockstyle: 'horizontal',
      }
    }
    setBlockstyleInSession('tile')
    return prevState
  }

  componentDidMount() {
    const {
      receiveTests,
      curriculums,
      getCurriculums,
      page,
      limit,
      location,
      playlist = {},
      mode,
      match: params,
      getCurriculumStandards,
      getAllTags,
      testFilters,
      clearDictStandards,
      history,
      interestedSubjects,
      interestedGrades,
      interestedCurriculums: [firstCurriculum],
      sort: initSort = {},
      tests,
      user,
      districtId,
      userId,
      collections,
      clearSelectedItems,
      clearCreatedItems,
      clearTestData,
    } = this.props
    clearSelectedItems()
    const isSingaporeMathCollectionActive = tests.filter(
      (test) =>
        (test.description?.toLowerCase()?.includes('singaporemath') ||
          test.description?.toLowerCase()?.includes('singapore math')) &&
        test?.active
    )

    const isSingaporeMath =
      user?.referrer?.includes('singapore') ||
      user?.utm_source?.toLowerCase()?.includes('singapore') ||
      isSingaporeMathCollectionActive?.length > 0 ||
      collections.some((itemBank) =>
        itemBank?.owner?.toLowerCase().includes('singapore')
      )

    this.setState({ isSingaporeMath })

    // TODO use getPreviouslyUsedOrDefaultInterestsSelector from src/client/author/src/selectors/user.js
    const {
      subject = interestedSubjects,
      grades = interestedGrades || [],
      curriculumId = firstCurriculum &&
      firstCurriculum.subject === interestedSubjects?.[0]
        ? firstCurriculum._id
        : '',
    } = getDefaultInterests()
    const sessionFilters = getFilterFromSession({
      key: sessionFilterKeys.TEST_FILTER,
      districtId,
      userId,
    })
    const sessionSort = getFilterFromSession({
      key: sessionFilterKeys.TEST_SORT,
      districtId,
      userId,
    })

    // propagate filter from query params to the store (test.filters)
    let searchParams = qs.parse(location.search, { ignoreQueryPrefix: true })

    let searchFilters = {}

    if (searchParams.removeInterestedFilters) {
      searchFilters = {
        ...testFilters,
      }
    } else {
      searchFilters = {
        ...testFilters,
        ...sessionFilters,
        subject,
        grades,
        curriculumId: parseInt(curriculumId, 10) || '',
      }
    }

    searchFilters.isSingaporeMath = isSingaporeMath

    const sort = {
      ...initSort,
      sortBy: 'popularity',
      sortDir: 'desc',
      ...sessionSort,
    }

    searchParams = this.typeCheck(searchParams, searchFilters)
    if (Object.keys(searchParams).length) {
      searchParams.curriculumId =
        Number(searchParams.curriculumId) || searchFilters.curriculumId || ''
      searchParams.standardIds = searchParams.standardIds
        ? searchParams.standardIds.map((item) => ({
            ...item,
            _id: parseInt(item._id, 10),
          }))
        : []
      Object.assign(searchFilters, pick(searchParams, Object.keys(testFilters)))
    }

    this.updateFilterState(searchFilters, sort, true)

    if (searchFilters.filter === filterMenuItems[5].filter) {
      searchFilters.filter = filterMenuItems[0].filter
    }

    if (mode === 'embedded') {
      const selectedTests = []
      const { modules } = playlist
      const { state = {} } = location
      const { editFlow } = state
      modules?.forEach((mod) => {
        mod.data.forEach((test) => {
          selectedTests.push(test.contentId)
        })
      })
      this.setState({
        selectedTests,
        editFlow,
        blockstyle: 'horizontal',
      })
      setBlockstyleInSession('horizontal')
      receiveTests({
        page: 1,
        limit,
        search: searchFilters,
        sort,
      })
    } else {
      if (!curriculums.length) {
        getCurriculums()
      }
      const pageNumber = params.page || page
      const limitCount = params.limit || limit
      const queryParams = qs.stringify(
        pickBy(
          { ...searchFilters, page: pageNumber, limit: limitCount },
          identity
        )
      )
      history.push(`/author/tests?${queryParams}`)
      receiveTests({ page: 1, limit, search: searchFilters, sort })
      getAllTags({ type: 'test' })
    }

    if (searchFilters.curriculumId) {
      const {
        curriculumId: _curriculumId,
        grades: curriculumGrades = [],
      } = searchFilters
      clearDictStandards()
      getCurriculumStandards(_curriculumId, curriculumGrades, '')
    }

    /**
     * clear selected items on item bank page on mounting this component.
     * @see https://snapwiz.atlassian.net/browse/EV-31074
     * @see https://snapwiz.atlassian.net/browse/EV-30990
     * we need clear selected items in this component only,
     * In terms of other pages, we are clearing them in the locationChangedSaga.
     * @see src/client/author/TestPage/components/AddItems/ducks.js
     */
    clearTestData()
    clearCreatedItems()
  }

  updateFilterState = (searchState, sortState, all) => {
    const {
      updateAllTestFilters,
      updateTestFilters,
      testFilters,
      districtId,
      userId,
    } = this.props
    const search = all
      ? { ...searchState, isSingaporeMath: this.state.isSingaporeMath }
      : {
          ...testFilters,
          [searchState.key]: searchState.value,
          isSingaporeMath: this.state.isSingaporeMath,
        }
    setFilterInSession({
      key: sessionFilterKeys.TEST_FILTER,
      filter: search,
      districtId,
      userId,
    })
    setFilterInSession({
      key: sessionFilterKeys.TEST_SORT,
      filter: sortState,
      districtId,
      userId,
    })
    if (all) {
      return updateAllTestFilters({ search, sort: sortState })
    }
    updateTestFilters({ search, sort: sortState })
  }

  searchTest = debounce((search) => {
    const {
      receiveTests,
      limit,
      history,
      playlistPage,
      playlist: { _id } = {},
      sort,
    } = this.props
    const queryParams = qs.stringify(
      pickBy({ ...search, page: 1, limit }, identity)
    )
    const locToPush = playlistPage
      ? `/author/playlists/${_id}/edit`
      : `/author/tests?${queryParams}`
    history.push(locToPush)
    receiveTests({ search, limit, page: 1, sort })
  }, 500)

  handleSearchInputChange = (tags) => {
    const { testFilters, sort } = this.props
    const newSearch = {
      ...testFilters,
      searchString: tags,
    }

    this.updateFilterState(newSearch, sort, true)
    this.searchTest(newSearch)
  }

  /**
   * invoked when any of the filter changes.
   * @params name {String} - name of the filt.er
   * @params value {Sring} - filter value
   */
  handleFiltersChange = (name, value, dateString) => {
    const {
      receiveTests,
      clearDictStandards,
      history,
      limit,
      getCurriculumStandards,
      updateDefaultGrades,
      updateDefaultSubject,
      testFilters,
      playlistPage,
      playlist: { _id } = {},
      sort = {},
    } = this.props

    if (name === 'folderId') {
      const searchfilterWithFolder = {
        ...emptyFilters,
        [name]: value,
        filter: 'FOLDERS',
      }
      this.updateFilterState(searchfilterWithFolder, sort, true)
      return receiveTests({
        search: searchfilterWithFolder,
        sort,
        page: 1,
        limit,
      })
    }
    // all the fields to pass for search.

    let updatedKeys = {
      ...testFilters,
    }

    if (name === 'grades' || name === 'subject' || name === 'curriculumId') {
      setDefaultInterests({ [name]: value })
    }

    if (name === 'curriculumId') {
      clearDictStandards()
      getCurriculumStandards(value, testFilters.grades, '')
      updatedKeys = {
        ...updatedKeys,
        standardIds: [],
      }
    }
    if (name === 'grades' && testFilters.curriculumId) {
      clearDictStandards()
      getCurriculumStandards(testFilters.curriculumId, value, '')
    }
    if (name === 'subject') {
      updatedKeys = {
        ...updatedKeys,
        [name]: value,
        curriculumId: '',
        standardIds: [],
      }
      updateDefaultSubject(value)
      storeInLocalStorage('defaultSubject', value)
      clearDictStandards()
    }
    if (name === 'createdAt') {
      updatedKeys = {
        ...updatedKeys,
        [name]: value ? moment(dateString, 'DD/MM/YYYY').valueOf() : '',
      }
    } else {
      updatedKeys = {
        ...updatedKeys,
        [name]: value,
      }
    }
    if (name === 'grades') {
      updateDefaultGrades(value)
      storeInLocalStorage('defaultGrades', value)
    }
    const searchFilters = {
      ...updatedKeys,
      [name]: name === 'createdAt' ? updatedKeys[name] : value,
    }
    this.updateFilterState(searchFilters, sort, true)
    // update the url to reflect the newly applied filter and get the new results.
    const queryParams = qs.stringify(
      pickBy({ ...searchFilters, page: 1, limit }, identity)
    )
    const locToPush = playlistPage
      ? `/author/playlists/${_id}/edit`
      : `/author/tests?${queryParams}`
    history.push(locToPush)
    receiveTests({ search: searchFilters, sort, page: 1, limit })
  }

  handleCreate = () => {
    const { history, mode } = this.props
    if (mode !== 'embedded') {
      history.push('/author/tests/select')
    }
  }

  updateTestList = (page) => {
    const {
      receiveTests,
      limit,
      history,
      testFilters,
      playlistPage,
      playlist: { _id } = {},
      sort,
    } = this.props
    const searchFilters = {
      ...testFilters,
    }

    const queryParams = qs.stringify(
      pickBy({ ...searchFilters, page, limit }, identity)
    )
    const locToPush = playlistPage
      ? `/author/playlists/${_id}/edit`
      : `/author/tests?${queryParams}`
    history.push(locToPush)
    receiveTests({ page, limit, search: searchFilters, sort })
  }

  handlePaginationChange = (page) => {
    this.updateTestList(page)
  }

  handleClearFilter = () => {
    const { history, mode, limit, receiveTests, testFilters, sort } = this.props

    // If current filter and initial filter is equal don't need to reset again
    if (isEqual(testFilters, emptyFilters) && isEqual(sort, initialSortState))
      return null

    emptyFilters.isSingaporeMath = this.state.isSingaporeMath
    this.updateFilterState(emptyFilters, initialSortState, true)
    setDefaultInterests({ subject: [], grades: [], curriculumId: '' })
    if (mode !== 'embedded')
      history.push(`/author/tests?filter=ENTIRE_LIBRARY&limit=${limit}&page=1`)
    receiveTests({
      page: 1,
      limit,
      search: emptyFilters,
      sort: initialSortState,
    })
  }

  handleStyleChange = (blockstyle) => {
    this.setState({
      blockstyle,
    })
    setBlockstyleInSession(blockstyle)
  }

  showFilterHandler = () => {
    this.setState({ isShowFilter: true })
  }

  closeSearchModal = () => {
    this.setState({ isShowFilter: false })
  }

  setAISuiteAlertModalVisibility = (value) => {
    this.setState({ isBuyAISuiteAlertModalVisible: value })
  }

  typeCheck = (parsedQueryData, search) => {
    const parsedQueryDataClone = {}
    for (const key of Object.keys(parsedQueryData)) {
      if (
        search[key] instanceof Array &&
        !(parsedQueryData[key] instanceof Array)
      ) {
        parsedQueryDataClone[key] = [parsedQueryData[key]]
      } else {
        parsedQueryDataClone[key] = parsedQueryData[key]
      }
    }
    return parsedQueryDataClone
  }

  setFilterParams(parsedQueryData) {
    const {
      getCurriculumStandards,
      receiveTests,
      match: { params = {} },
      testFilters,
      sort,
    } = this.props

    const search = {
      ...testFilters,
    }

    parsedQueryData = this.typeCheck(parsedQueryData, search)
    const searchClone = {
      ...testFilters,
    }

    for (const key of Object.keys(parsedQueryData)) {
      if (has(testFilters, key)) {
        searchClone[key] = parsedQueryData[key]
      }
    }

    this.updateFilterState(searchClone, sort, true)

    const { curriculumId, grade } = searchClone
    if (curriculumId && parsedQueryData.standardQuery.length >= 2) {
      getCurriculumStandards(curriculumId, grade, parsedQueryData.standardQuery)
    }
    receiveTests({
      page: Number(params.page),
      limit: Number(params.limit),
      search: searchClone,
      sort,
    })
  }

  handleCreateNewModule = () => {
    this.setState({ showCreateModuleModal: true })
  }

  handleManageModule = () => {
    this.setState({ showManageModuleModal: true })
  }

  onCloseManageModule = () => {
    this.setState({ showManageModuleModal: false })
  }

  handleSaveModule = () => {
    const { handleSave } = this.props
    handleSave()
    this.setState({ showManageModuleModal: false })
  }

  deleteModule = (id) => {
    const { selectedTests } = this.state
    const { playlist, deleteModuleFromPlaylist } = this.props
    const moduleData = playlist?.modules?.[id]?.data?.map((x) => x.contentId)
    const newSelectedTests = selectedTests?.filter(
      (testId) => !moduleData.includes(testId)
    )
    this.setState({ selectedTests: newSelectedTests }, () =>
      deleteModuleFromPlaylist(id)
    )
  }

  handleAddTests = (item) => {
    if (!item) {
      console.error('Test data is missing while adding tests in bulk..')
      return
    }

    if (item?.status === 'draft' || item?.status === 'rejected') {
      const testStatus = item?.status === 'draft' ? 'Draft' : 'Rejected'
      notification({
        type: 'warn',
        msg: `${testStatus} tests cannot be added`,
      })
      return
    }

    const {
      playlist: { modules },
    } = this.props
    if (!modules.length) {
      this.setState({
        showManageModuleModal: true,
        moduleModalAdd: true,
        testAdded: item,
      })
      notification({ type: 'warn', messageKey: 'createOneModuleAtleast' })
    } else {
      this.setState({ showAddTestInModules: true, testAdded: item })
    }
  }

  handleBulkAddTests = () => {
    const { markedTests } = this.state
    const { playlist: { modules } = {} } = this.props
    if (modules?.length) {
      if (markedTests.length) {
        this.setState({ showAddModules: true })
      } else {
        notification({ type: 'warn', messageKey: 'selectOneOrMoreTest' })
      }
    } else {
      notification({ type: 'warn', messageKey: 'createOneModuleAtleast' })
    }
  }

  handleBulkRemoveTests = () => {
    const { markedTests } = this.state
    const { playlist: { modules } = {} } = this.props
    if (modules?.length) {
      if (markedTests.length) {
        this.setState({ showRemoveModules: true })
      } else {
        notification({ type: 'warn', messageKey: 'selectOneOrMoreTest' })
      }
    } else {
      notification({ type: 'warn', messageKey: 'createOneModuleAtleast' })
    }
  }

  handleCheckboxAction = (e, prop) => {
    const { markedTests } = this.state
    if (e.target.checked) {
      this.setState({ markedTests: [...markedTests, prop] })
    } else {
      this.setState({
        markedTests: markedTests.filter((data) => data._id !== prop._id),
      })
    }
  }

  onCloseCreateModule = () => {
    this.setState({ showCreateModuleModal: false })
  }

  onCloseAddTestModal = () => {
    this.setState({ showAddTestInModules: false })
  }

  onCloseBulkAddTestModal = () => {
    this.setState({ showAddModules: false })
  }

  onCloseBulkDeleteTestModal = () => {
    this.setState({ showRemoveModules: false })
  }

  removeTestFromPlaylist = () => {
    const { selectedTests, removeItemId } = this.state
    const { deleteTestFromPlaylist } = this.props
    const newSelectedTests = selectedTests.filter(
      (testId) => testId !== removeItemId
    )
    deleteTestFromPlaylist({ itemId: removeItemId })
    this.setState({
      selectedTests: newSelectedTests,
      showConfirmRemoveModal: false,
    })
  }

  handleRemoveTest = (itemId) => {
    const { removeTestFromPlaylist } = this
    this.setState({ removeItemId: itemId }, () => {
      removeTestFromPlaylist()
    })
  }

  onCloseConfirmRemoveModal = () => {
    this.setState({ showConfirmRemoveModal: false })
  }

  handleTestAdded = (index) => {
    const { addTestToModule, handleSave } = this.props
    const { testAdded, selectedTests } = this.state
    this.setState((prevState) => ({
      ...prevState,
      selectedTests: [...selectedTests, testAdded._id],
      moduleModalAdd: null,
    }))
    addTestToModule({ moduleIndex: index, testAdded })
    if (selectedTests.length === 0) handleSave()
  }

  handleBulkTestAdded = (index) => {
    const {
      addTestToModuleInBulk,
      handleSave,
      playlist: { modules = [] } = {},
      tests = [],
    } = this.props
    const { markedTests, selectedTests } = this.state
    const addedTestIds = modules.flatMap((x) => x.data.map((y) => y.contentId))
    const markedIds = markedTests.map((obj) => obj._id)
    const uniqueMarkedIds = markedIds.filter((x) => !addedTestIds.includes(x))
    const uniqueMarkedTests = markedTests.filter((x) =>
      uniqueMarkedIds.includes(x._id)
    )
    if (uniqueMarkedIds.length !== markedIds.length) {
      if (uniqueMarkedIds.length === 0) {
        notification({
          type: 'warn',
          messageKey: 'selectedTestAlreadyExistInModule',
        })
        return
      }
      if (
        uniqueMarkedIds.length < markedIds.length &&
        uniqueMarkedIds.length !== 0
      )
        notification({
          type: 'warn',
          messageKey: 'someSelectedTestAlreadyExistInModule',
        })
    }

    // Dont add draft type tests
    const nonDraftTests = uniqueMarkedTests.filter(
      (x) => tests.find((y) => y._id === x._id).status !== 'draft'
    )
    if (nonDraftTests.length === uniqueMarkedTests.length) {
      this.setState(() => ({
        selectedTests: [...selectedTests, ...uniqueMarkedIds],
        markedTests: [],
      }))
      const uniqueMarkedTestsIds = uniqueMarkedTests.map((x) => x?._id)
      const testsToAdd = tests.filter((x) =>
        uniqueMarkedTestsIds?.includes(x?._id)
      )
      const testsWithStandardIdentifiers = testsToAdd?.map((x) => ({
        ...x,
        standardIdentifiers: x?.summary?.standards?.reduce(
          (a, c) => a.concat(c?.identifier),
          []
        ),
      }))
      addTestToModuleInBulk({
        moduleIndex: index,
        tests: testsWithStandardIdentifiers,
      })
      notification({ type: 'success', messageKey: 'testAddedPlalist' })
    } else {
      const nonDraftIds = nonDraftTests.map((x) => x._id)
      this.setState(() => ({
        selectedTests: [...selectedTests, ...nonDraftIds],
        markedTests: [],
      }))
      const nonDraftTestsIds = nonDraftTests?.map((x) => x?._id)
      const testsToAdd = tests.filter((x) => nonDraftTestsIds?.includes(x?._id))
      const testsWithStandardIdentifiers = testsToAdd?.map((x) => ({
        ...x,
        standardIdentifiers: x?.summary?.standards?.reduce(
          (a, c) => a.concat(c?.identifier),
          []
        ),
      }))
      addTestToModuleInBulk({
        moduleIndex: index,
        tests: testsWithStandardIdentifiers,
      })
      nonDraftTests.length
        ? notification({
            type: 'warn',
            msg: `${nonDraftTests.length}/${markedTests.length} are added to ${modules[index].title}`,
          })
        : notification({ type: 'warn', messageKey: 'draftTestCantBeAdded' })
    }
    if (selectedTests.length === 0) handleSave()
  }

  handleBulkTestDelete = (len) => {
    const { deleteTestFromModuleInBulk } = this.props
    const { markedTests, selectedTests } = this.state
    const testIds = markedTests.map((test) => test._id)
    this.setState((prevState) => ({
      ...prevState,
      selectedTests: [...selectedTests.filter((x) => !testIds.includes(x))],
      markedTests: [],
    }))
    if (len) {
      deleteTestFromModuleInBulk({ testIds })
      notification({ type: 'success', messageKey: 'testremovedPlaylist' })
    } else {
      notification({ type: 'success', messageKey: 'selectedTestAreCleared' })
    }
  }

  searchFilterOption = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  onAddToCart = (item) => {
    const { addTestToCart } = this.props
    addTestToCart(item)
  }

  onRemoveFromCart = (item) => {
    const { removeTestFromCart } = this.props
    removeTestFromCart(item)
  }

  toggleSidebar = () =>
    this.setState((prevState) => ({ openSidebar: !prevState.openSidebar }))

  renderCardContent = () => {
    const {
      loading,
      tests,
      windowWidth,
      history,
      match,
      userId,
      mode,
      interestedCurriculums,
      playlist = {},
    } = this.props
    const { blockstyle, selectedTests, markedTests } = this.state
    const markedTestsList = markedTests.map((data) => data._id)
    const moduleTitleMap = {}
    const modulesMap =
      playlist?.modules?.map((module) => ({
        title: module.title,
        data: [...module.data.map((it) => it.contentId)],
      })) || []

    const testIds = tests?.map((test) => test._id) || []
    testIds.forEach((testId) => {
      for (const obj of modulesMap) {
        if (obj?.data?.includes(testId)) moduleTitleMap[testId] = obj.title
      }
    })

    if (loading) {
      return <Spin size="large" />
    }
    if (tests.length < 1) {
      return (
        <NoDataNotification
          heading="Tests not available"
          description={`There are no tests found for this filter. You can create new item by clicking the "NEW TEST" button.`}
        />
      )
    }
    const GridCountInARow = windowWidth > 1600 ? 5 : windowWidth >= 1366 ? 4 : 3
    const countModular = new Array(
      GridCountInARow - (tests.length % GridCountInARow)
    ).fill(1)

    if (blockstyle === 'tile') {
      return (
        <Row
          type="flex"
          justify={windowWidth > 575 ? 'space-between' : 'center'}
        >
          {tests.map((item, index) => (
            <CardWrapper
              item={item}
              key={index}
              owner={item.authors && item.authors.some((x) => x._id === userId)}
              blockStyle="tile"
              windowWidth={windowWidth}
              history={history}
              match={match}
              standards={getInterestedStandards(
                item.summary,
                item.alignment,
                interestedCurriculums
              )}
              setAISuiteAlertModalVisibility={
                this.setAISuiteAlertModalVisibility
              }
            />
          ))}

          {windowWidth > 1024 &&
            countModular.map((index) => <CardBox key={index} />)}
        </Row>
      )
    }

    return (
      <Row>
        {tests.map((item) => (
          <CardWrapper
            key={item._id}
            owner={item.authors && item.authors.some((x) => x._id === userId)}
            item={item}
            windowWidth={windowWidth}
            history={history}
            match={match}
            mode={mode}
            removeTestFromPlaylist={this.handleRemoveTest}
            isTestAdded={
              selectedTests ? selectedTests.includes(item._id) : false
            }
            addTestToPlaylist={this.handleAddTests}
            standards={getInterestedStandards(
              item.summary,
              item.alignment,
              interestedCurriculums
            )}
            moduleTitle={moduleTitleMap[item._id]}
            checked={markedTestsList.includes(item._id)}
            handleCheckboxAction={this.handleCheckboxAction}
            onRemoveFromCart={this.onRemoveFromCart}
            onAddToCart={this.onAddToCart}
            setAISuiteAlertModalVisibility={this.setAISuiteAlertModalVisibility}
          />
        ))}
      </Row>
    )
  }

  handleLabelSearch = (e) => {
    const { key: filterType } = e
    const getMatchingObj = filterMenuItems.filter(
      (item) => item.path === filterType
    )
    const { filter = '' } = (getMatchingObj.length && getMatchingObj[0]) || {}
    const {
      history,
      receiveTests,
      limit,
      testFilters,
      playlistPage,
      playlist: { _id } = {},
    } = this.props
    let updatedKeys = omit(testFilters, ['folderId'])

    if (filter === filterMenuItems[0].filter) {
      updatedKeys = {
        ...updatedKeys,
        status: '',
      }
    }
    const sortByRecency = ['by-me', 'shared', 'co-author'].includes(filterType)
    const sort = {
      sortBy: sortByRecency ? 'recency' : 'popularity',
      sortDir: 'desc',
    }
    updatedKeys.filter = filter
    this.updateFilterState(updatedKeys, sort, true)

    const queryParams = qs.stringify(
      pickBy({ ...updatedKeys, page: 1, limit }, identity)
    )
    const locToPush = playlistPage
      ? `/author/playlists/${_id}/edit`
      : `/author/tests?${queryParams}`
    history.push(locToPush)

    if (filterType !== 'folders') {
      receiveTests({
        page: 1,
        limit,
        search: updatedKeys,
        sort,
      })
    }
  }

  rejectNumberChecker = (tests) => {
    let num = 0
    for (const o of tests) {
      if (o.status === 'inreview') {
        num++
      }
    }
    return num
  }

  approveNumberChecker = (tests) => {
    let num = 0
    for (const o of tests) {
      if (o.status === 'inreview' || o.status === 'rejected') {
        num++
      }
    }
    return num
  }

  onSelectSortOption = (value, sortDir) => {
    const { testFilters, limit, sort, receiveTests } = this.props
    const updateSort = {
      ...sort,
      sortBy: value,
      sortDir,
    }
    this.updateFilterState(testFilters, updateSort, true)
    receiveTests({
      page: 1,
      limit,
      search: testFilters,
      sort: updateSort,
    })
  }

  handleApproveTests = () => {
    const {
      approveOrRejectMultipleTestsRequest,
      selectedTests,
      setApproveConfirmationOpen,
    } = this.props
    if (selectedTests.length > 1) {
      setApproveConfirmationOpen(true)
    } else {
      approveOrRejectMultipleTestsRequest({ status: 'published' })
    }
  }

  renderExtra = () => (
    <>
      <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
        <CartButton
          onClick={() => {
            const { approveOrRejectMultipleTestsRequest } = this.props
            approveOrRejectMultipleTestsRequest({ status: 'rejected' })
          }}
          buttonText="Reject"
          numberChecker={this.rejectNumberChecker}
        />
        <CartButton
          onClick={this.handleApproveTests}
          buttonText="Approve"
          numberChecker={this.approveNumberChecker}
        />
      </FeaturesSwitch>
    </>
  )

  toggleFilter = () => {
    const { isShowFilter } = this.state

    this.setState({
      isShowFilter: !isShowFilter,
    })
  }

  render() {
    const {
      page,
      limit,
      count,
      creating,
      mode,
      playlist = {},
      addModuleToPlaylist,
      updateModuleInPlaylist,
      resequenceModules,
      testFilters,
      isProxyUser,
      isDemoAccount,
      t,
      sort = {},
      history,
    } = this.props

    const {
      blockstyle,
      isShowFilter,
      showManageModuleModal,
      showAddTestInModules,
      showConfirmRemoveModal,
      showAddModules,
      showRemoveModules,
      markedTests,
      moduleModalAdd,
      testAdded,
      openSidebar,
      isBuyAISuiteAlertModalVisible,
    } = this.state
    const search = {
      ...testFilters,
    }

    let modulesList = []
    if (playlist) {
      modulesList = playlist.modules
    }

    const menu = (
      <Menu>
        <Menu.Item
          key="0"
          data-cy="addToModule"
          onClick={this.handleBulkAddTests}
        >
          Add to Module
        </Menu.Item>
        <Menu.Item
          key="1"
          data-cy="removeFromModule"
          onClick={this.handleBulkRemoveTests}
        >
          Remove from Modules
        </Menu.Item>
      </Menu>
    )

    const counts = []
    markedTests.forEach(({ _id }) => {
      playlist?.modules?.forEach((module, i) => {
        if (module?.data.map((x) => x.contentId).includes(_id)) {
          if (counts[i]) counts[i]++
          else counts[i] = 1
        }
      })
    })

    const modulesNamesCountMap = counts.map((item, i) => ({
      count: item,
      mName: playlist?.modules[i]?.title,
    }))

    const renderFilterIcon = () => (
      <FilterToggleBtn
        isShowFilter={isShowFilter}
        toggleFilter={this.toggleFilter}
      />
    )

    return (
      <>
        <RemoveTestModal
          isVisible={showConfirmRemoveModal}
          onClose={this.onCloseConfirmRemoveModal}
          handleRemove={this.removeTestFromPlaylist}
        />
        {mode !== 'embedded' && (
          <>
            <ListHeader
              onCreate={this.handleCreate}
              creating={creating}
              title={t('common.testLibrary')}
              titleIcon={IconTestBank}
              btnTitle="New Test"
              renderFilter={() => (
                <StyleChangeWrapper>
                  <IconTile
                    data-cy="tileView"
                    onClick={() => this.handleStyleChange('tile')}
                    width={18}
                    height={18}
                    color={blockstyle === 'tile' ? greyThemeLight : greyLight1}
                  />
                  <IconList
                    data-cy="listView"
                    onClick={() => this.handleStyleChange('horizontal')}
                    width={18}
                    height={18}
                    color={
                      blockstyle === 'horizontal' ? greyThemeLight : greyLight1
                    }
                  />
                </StyleChangeWrapper>
              )}
              renderExtra={this.renderExtra}
              toggleSidebar={this.toggleSidebar}
            />
            <SideContent
              onClick={this.toggleSidebar}
              open={openSidebar}
              showSliderBtn={false}
            />
          </>
        )}
        <Container>
          <MobileFilter>
            <InputTag
              placeholder="Search by skills and keywords"
              onSearchInputChange={this.handleSearchInputChange}
              value={testFilters.searchString}
              disabled={
                testFilters.filter === libraryFilters.SMART_FILTERS.FAVORITES
              }
            />
            <FilterButton>
              <Button onClick={() => this.showFilterHandler()}>
                {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
              </Button>
            </FilterButton>
          </MobileFilter>
          <MobileFilterModal
            open={isShowFilter}
            onClose={this.closeSearchModal}
          >
            <SearchModalContainer>
              <TestListFilters
                search={search}
                handleLabelSearch={this.handleLabelSearch}
                onChange={this.handleFiltersChange}
                clearFilter={this.handleClearFilter}
                searchFilterOption={this.searchFilterOption}
                filterMenuItems={filterMenuItems}
                isSingaporeMath={this.state.isSingaporeMath}
              />
            </SearchModalContainer>
          </MobileFilterModal>

          {showManageModuleModal && (
            <Modal
              open={showManageModuleModal}
              title="Manage Modules"
              onClose={this.onCloseManageModule}
              footer={null}
              styles={{
                modal: {
                  minWidth: '900px',
                  padding: '20px 30px',
                  background: white,
                },
              }}
            >
              <ManageModulesModalBody
                destinationCurriculumSequence={playlist}
                addModuleToPlaylist={addModuleToPlaylist}
                updateModuleInPlaylist={updateModuleInPlaylist}
                deleteModuleFromPlaylist={this.deleteModule}
                resequenceModules={resequenceModules}
                handleAddModule={this.onCloseCreateModule}
                handleApply={this.handleSaveModule}
                onCloseManageModule={this.onCloseManageModule}
                addState={moduleModalAdd}
                handleTestAdded={this.handleTestAdded}
                testAddedTitle={testAdded?.title}
              />
            </Modal>
          )}

          {showAddTestInModules && (
            <AddTestModal
              isVisible={showAddTestInModules}
              onClose={this.onCloseAddTestModal}
              modulesList={modulesList}
              handleTestAdded={this.handleTestAdded}
            />
          )}

          {showAddModules && (
            <AddBulkTestModal
              isVisible={showAddModules}
              onClose={this.onCloseBulkAddTestModal}
              modulesList={modulesList}
              handleBulkTestAdded={this.handleBulkTestAdded}
            />
          )}

          {showRemoveModules && (
            <DeleteBulkTestModal
              isVisible={showRemoveModules}
              onClose={this.onCloseBulkDeleteTestModal}
              markedTests={markedTests?.length}
              modulesNamesCountMap={modulesNamesCountMap}
              handleBulkTestDelete={this.handleBulkTestDelete}
            />
          )}

          <EduIf condition={isBuyAISuiteAlertModalVisible}>
            <BuyAISuiteAlertModal
              isVisible={isBuyAISuiteAlertModalVisible}
              setAISuiteAlertModalVisibility={
                this.setAISuiteAlertModalVisibility
              }
              history={history}
              isClosable
              stayOnSamePage
            />
          </EduIf>

          <FlexContainer>
            <Filter isShowFilter={isShowFilter}>
              <AffixWrapper isBannerShown={isProxyUser || isDemoAccount}>
                <ScrollbarWrapper isShowFilter={isShowFilter}>
                  <PerfectScrollbar>
                    <ScrollBox>
                      <InputTag
                        onSearchInputChange={this.handleSearchInputChange}
                        size="large"
                        value={testFilters.searchString}
                      />
                      <TestListFilters
                        search={search}
                        handleLabelSearch={this.handleLabelSearch}
                        onChange={this.handleFiltersChange}
                        clearFilter={this.handleClearFilter}
                        searchFilterOption={this.searchFilterOption}
                        filterMenuItems={filterMenuItems}
                        isSingaporeMath={this.state.isSingaporeMath}
                      />
                    </ScrollBox>
                  </PerfectScrollbar>
                </ScrollbarWrapper>
              </AffixWrapper>
            </Filter>
            <Main isShowFilter={isShowFilter}>
              {renderFilterIcon()}
              <ItemsMenu justifyContent="space-between">
                <PaginationInfo>
                  <span>{count}</span> TESTS FOUND
                </PaginationInfo>

                <HeaderFilter
                  search={search}
                  handleCloseFilter={this.handleFiltersChange}
                  type="test"
                />
                <SortMenu
                  options={sortOptions.testList}
                  onSelect={this.onSelectSortOption}
                  sortDir={sort.sortDir}
                  sortBy={sort.sortBy}
                />

                {mode === 'embedded' && (
                  <BtnActionsContainer>
                    <StyledCountText>
                      {
                        playlist.modules?.flatMap((item) => item?.data || [])
                          ?.length
                      }{' '}
                      TESTS SELECTED
                    </StyledCountText>
                    <StyledButton
                      data-cy="createNewItem"
                      type="secondary"
                      size="large"
                      onClick={() => {}}
                    >
                      <Dropdown
                        overlay={menu}
                        trigger={['click']}
                        placement="bottomCenter"
                      >
                        <a
                          data-cy="moduleActions"
                          className="ant-dropdown-link"
                          href="#"
                        >
                          Actions
                        </a>
                      </Dropdown>
                    </StyledButton>
                    <StyledButton
                      data-cy="ManageModules"
                      type="secondary"
                      size="large"
                      onClick={this.handleManageModule}
                    >
                      <span>Manage Modules</span>
                    </StyledButton>
                  </BtnActionsContainer>
                )}
                {mode !== 'embedded' && blockstyle === 'horizontal' && (
                  <Actions type="TEST" />
                )}
              </ItemsMenu>
              <PerfectScrollbar style={{ padding: '7.5px 32px' }}>
                <CardContainer type={blockstyle}>
                  {this.renderCardContent()}
                  <PaginationWrapper
                    type={blockstyle}
                    current={page}
                    total={count}
                    pageSize={limit}
                    onChange={this.handlePaginationChange}
                    hideOnSinglePage
                  />
                </CardContainer>
              </PerfectScrollbar>
            </Main>
          </FlexContainer>
          <SelectCollectionModal contentType="TEST" />
          <ApproveConfirmModal contentType="TEST" />
        </Container>
      </>
    )
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces('header'),
  connect(
    (state) => ({
      tests: getTestsSelector(state),
      loading: getTestsLoadingSelector(state),
      page: getTestsPageSelector(state),
      limit: getTestsLimitSelector(state),
      count: getTestsCountSelector(state),
      creating: getTestsCreatingSelector(state),
      curriculums: getCurriculumsListSelector(state),
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      userId: get(state, 'user.user._id', false),
      districtId: getUserOrgId(state),
      user: get(state, 'user.user', false),
      testFilters: getTestsFilterSelector(state),
      features: getUserFeatures(state),
      isProxyUser: isProxyUserSelector(state),
      sort: getSortFilterStateSelector(state),
      selectedTests: getSelectedTestsSelector(state),
      isDemoAccount: isDemoPlaygroundUser(state),
      collections: getCollectionsSelector(state),
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      receiveTests: ({ search, ...rest }) => {
        const _search = {
          ...search,
          standardIds: search?.standardIds?.map((item) => item._id) || [],
        }
        return receiveTestsAction({ search: _search, ...rest })
      },
      addModuleToPlaylist: createNewModuleAction,
      updateModuleInPlaylist: updateModuleAction,
      deleteModuleFromPlaylist: deleteModuleAction,
      resequenceModules: resequenceModulesAction,
      addTestToModule: createTestInModuleAction,
      addTestToModuleInBulk: addTestToModuleInBulkAction,
      deleteTestFromModuleInBulk: deleteTestFromModuleInBulkAction,
      clearDictStandards: clearDictStandardsAction,
      clearCreatedItems: clearCreatedItemsAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
      deleteTestFromPlaylist: removeTestFromPlaylistAction,
      getAllTags: getAllTagsAction,
      clearTestData: clearTestDataAction,
      updateTestFilters: updateTestSearchFilterAction,
      updateAllTestFilters: updateAllTestSearchFilterAction,
      clearAllFilters: clearTestFiltersAction,
      addTestToCart: addTestToCartAction,
      removeTestFromCart: removeTestFromCartAction,
      approveOrRejectMultipleTestsRequest: approveOrRejectMultipleTestsRequestAction,
      setApproveConfirmationOpen: setApproveConfirmationOpenAction,
      clearSelectedItems: clearSelectedItemsAction,
    }
  )
)

export default enhance(TestList)
