import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import { greyLight1, greyThemeLight } from '@edulastic/colors'
import { FlexContainer, withWindowSizes } from '@edulastic/common'
import { IconList, IconPlaylist2, IconTile } from '@edulastic/icons'
import { Button, Input, Row, Spin } from 'antd'
import qs from 'qs'
import { debounce, get, pick, isEqual, isEmpty } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { libraryFilters, sortOptions, roleuser } from '@edulastic/constants'
import { withNamespaces } from 'react-i18next'
import { userApi } from '@edulastic/api'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import {
  updateDefaultGradesAction,
  updateDefaultSubjectAction,
  isProxyUser as isProxyUserSelector,
  isDemoPlaygroundUser,
  setUserAction,
} from '../../../../student/Login/ducks'
import ListHeader from '../../../src/components/common/ListHeader'
import {
  getCollectionsSelector,
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getInterestedCurriculumsSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getUserFeatures,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import CardWrapper from '../../../TestList/components/CardWrapper/CardWrapper'
import {
  AffixWrapper,
  CardBox,
  CardContainer,
  Container,
  Filter,
  FilterButton,
  ItemsMenu,
  Main,
  MobileFilter,
  PaginationInfo,
  PaginationWrapper,
  ScrollbarWrapper,
  ScrollBox,
  SearchModalContainer,
  StyleChangeWrapper,
  MobileFilterModal,
} from '../../../TestList/components/Container/styled'
import TestListFilters from '../../../TestList/components/Container/TestListFilters'
import {
  getAllTagsAction,
  getTestsCreatingSelector,
} from '../../../TestPage/ducks'
import { clearTestDataAction } from '../../../PlaylistPage/ducks'
import {
  clearPlaylistFiltersAction,
  emptyFilters,
  getPlalistFilterSelector,
  getPlaylistsCountSelector,
  getPlaylistsLimitSelector,
  getPlaylistsLoadingSelector,
  getPlaylistsPageSelector,
  getPlaylistsSelector,
  receivePlaylistsAction,
  receivePublishersAction,
  receiveRecentPlayListsAction,
  updateAllPlaylistSearchFilterAction,
  filterMenuItems,
  getSelectedPlaylistSelector,
  checkPlayListAction,
  getSortFilterStateSelector,
  initialSortState,
} from '../../ducks'
import Actions from '../../../ItemList/components/Actions'
import SelectCollectionModal from '../../../ItemList/components/Actions/SelectCollection'
import { getDefaultInterests, setDefaultInterests } from '../../../dataUtils'
import HeaderFilter from '../../../ItemList/components/HeaderFilter'
import InputTag from '../../../ItemList/components/ItemFilter/SearchTag'
import SideContent from '../../../Dashboard/components/SideContent/Sidecontent'
import SortMenu from '../../../ItemList/components/SortMenu'
import FilterToggleBtn from '../../../src/components/common/FilterToggleBtn'
import PlaylistAvailableModal from '../../playListAvailable/playListAvailableModal'
import {
  setFilterInSession,
  getFilterFromSession,
} from '../../../../common/utils/helpers'

function getUrlFilter(filter) {
  if (filter === 'AUTHORED_BY_ME') {
    return 'by-me'
  }
  if (filter === 'SHARED_WITH_ME') {
    return 'shared'
  }
  if (filter === 'CO_AUTHOR') {
    return 'co-author'
  }
  if (filter === 'ENTIRE_LIBRARY') {
    return 'all'
  }
  return ''
}

class TestList extends Component {
  static propTypes = {
    playlists: PropTypes.array.isRequired,
    receivePlaylists: PropTypes.func.isRequired,
    receivePublishers: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    loading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    windowWidth: PropTypes.number.isRequired,
    clearTestData: PropTypes.func,
    clearSelectedItems: PropTypes.func,
  }

  static defaultProps = {
    clearSelectedItems: () => null,
    clearTestData: () => null,
  }

  state = {
    standardQuery: '',
    blockStyle: 'tile',
    isShowFilter: false,
    openSidebar: false,
    isPlaylistAvailableModalVisible: false,
    filteredSparkInfo: {},
    isSingaporeMath: false,
  }

  getUrlToPush(page = undefined) {
    const {
      playListFilters,
      match: { params = {} },
    } = this.props
    const filterUrlFragment = getUrlFilter(playListFilters?.filter)
    const pageFinal = parseInt(page || params?.page, 10) || 1
    let urlToPush = `/author/playlists`
    if (filterUrlFragment) {
      urlToPush += `/filter/${filterUrlFragment}`
    }
    urlToPush += `/page/${pageFinal}`
    return urlToPush
  }

  closePlaylistAvailableModal = () => {
    this.setState({ isPlaylistAvailableModalVisible: false })
  }

  componentDidMount() {
    const {
      receivePlaylists,
      receivePublishers,
      receiveRecentPlayLists,
      limit,
      location,
      getAllTags,
      match: { params = {} },
      playListFilters,
      collectionSelector = [],
      history,
      interestedSubjects,
      interestedGrades,
      sort: initSort = {},
      features,
      userRole,
      user,
      userId,
      districtId,
      sparkPlaylistCollectionsVisited,
      setUser,
      playlists,
    } = this.props

    const isSingaporeMathCollectionActive = playlists.filter(
      (playlist) =>
        (playlist.description?.toLowerCase()?.includes('singaporemath') ||
          playlist.description?.toLowerCase()?.includes('singapore math')) &&
        playlist?.active
    )

    const isSingaporeMath =
      user?.referrer?.includes('singapore') ||
      user?.utm_source?.toLowerCase()?.includes('singapore') ||
      isSingaporeMathCollectionActive?.length > 0 ||
      collectionSelector.some((itemBank) =>
        itemBank?.owner?.toLowerCase().includes('singapore')
      )

    this.setState({ isSingaporeMath })

    const {
      subject = interestedSubjects || [],
      grades = interestedGrades || [],
    } = getDefaultInterests()
    const sessionFilters = getFilterFromSession({
      key: sessionFilterKeys.PLAYLIST_FILTER,
      districtId,
      userId,
    })
    const sessionSortFilters = getFilterFromSession({
      key: sessionFilterKeys.PLAYLIST_SORT,
      districtId,
      userId,
    })
    let searchParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    let searchFilters = {}

    if (searchParams.removeInterestedFilters) {
      searchFilters = playListFilters
    } else {
      searchFilters = {
        ...playListFilters,
        ...sessionFilters,
      }
      if (isEmpty(sessionFilters)) {
        Object.assign(searchFilters, {
          subject,
          grades,
        })
      }
    }

    searchFilters.isSingaporeMath = isSingaporeMath

    const sort = {
      ...initSort,
      sortBy: 'popularity',
      sortDir: 'desc',
      ...sessionSortFilters,
    }

    searchParams = this.typeCheck(searchParams, searchFilters)

    if (Object.keys(searchParams).length) {
      Object.assign(
        searchFilters,
        pick(searchParams, Object.keys(playListFilters))
      )
    }
    this.updateFilterState(searchFilters, sort)

    const pageFinal = parseInt(params?.page, 10) || 1
    const urlToPush = this.getUrlToPush(pageFinal)
    history.push(urlToPush)

    receivePublishers()
    receivePlaylists({ page: pageFinal, limit, search: searchFilters, sort })
    getAllTags({ type: 'playlist' })
    receiveRecentPlayLists()

    const selectedCollectionInfo = collectionSelector.filter(
      (x) => x._id === searchFilters?.collections[0]
    )

    const { _id } = selectedCollectionInfo?.[0] || {}

    this.setState({
      filteredSparkInfo: selectedCollectionInfo?.[0] || {},
    })

    if (
      searchFilters?.collections?.includes(_id) &&
      !sparkPlaylistCollectionsVisited.includes(_id) &&
      selectedCollectionInfo?.[0]?.isPurchaseAllowed &&
      !features?.isCurator &&
      !features.isPublisherAuthor &&
      userRole !== roleuser.EDULASTIC_CURATOR
    ) {
      this.setState({ isPlaylistAvailableModalVisible: true })
      const data = {}
      data.sparkPlaylistCollectionsVisited = [
        ...sparkPlaylistCollectionsVisited,
        _id,
      ]
      userApi.updateCollectionVisited({
        data,
        userId,
      })
      const temp = user
      temp.sparkPlaylistCollectionsVisited =
        data.sparkPlaylistCollectionsVisited
      setUser(temp)
    }
  }

  updateFilterState = (searchState, sort) => {
    const { updateAllPlaylistSearchFilter, districtId, userId } = this.props
    setFilterInSession({
      key: sessionFilterKeys.PLAYLIST_FILTER,
      filter: searchState,
      districtId,
      userId,
    })
    setFilterInSession({
      key: sessionFilterKeys.PLAYLIST_SORT,
      filter: sort,
    })
    updateAllPlaylistSearchFilter({
      search: { ...searchState, isSingaporeMath: this.state.isSingaporeMath },
      sort,
    })
  }

  searchTest = debounce((searchState) => {
    const { receivePlaylists, limit, playListFilters, sort } = this.props
    receivePlaylists({
      page: 1,
      limit,
      search: searchState || playListFilters,
      sort,
    })
  }, 500)

  handleSearchInputChange = (tags) => {
    const { playListFilters, sort } = this.props
    const newSearch = {
      ...playListFilters,
      searchString: tags,
    }
    this.updateFilterState(newSearch, sort)
    this.searchTest(newSearch)
  }

  handleFiltersChange = (name, value, dateString) => {
    const {
      receivePlaylists,
      history,
      limit,
      page,
      updateDefaultGrades,
      updateDefaultSubject,
      playListFilters,
      sort,
    } = this.props
    let updatedKeys = {}

    updatedKeys = {
      ...playListFilters,
      [name]: value,
    }

    if (name === 'grades' || name === 'subject' || name === 'curriculumId') {
      setDefaultInterests({ [name]: value })
    }

    if (name === 'subject') {
      updateDefaultSubject(value)
      storeInLocalStorage('defaultSubject', value)
    } else if (name === 'grades') {
      updateDefaultGrades(value)
      setDefaultInterests({ [name]: value })
    } else if (name === 'createdAt') {
      updatedKeys = {
        ...updatedKeys,
        [name]: value ? moment(dateString, 'DD/MM/YYYY').valueOf() : '',
      }
    }
    this.updateFilterState(updatedKeys, sort)
    receivePlaylists({ search: updatedKeys, sort, page: 1, limit })
    history.push(
      `/author/playlists/limit/${limit}/page/${page}/filter?${this.filterUrl}`
    )
  }

  handleCreate = () => {
    const { history, clearSelectedItems, clearTestData } = this.props
    history.push('/author/playlists/create')
    clearTestData()
    clearSelectedItems()
  }

  handlePaginationChange = (page) => {
    const {
      receivePlaylists,
      limit,
      history,
      playListFilters,
      sort,
    } = this.props

    receivePlaylists({ page, limit, search: playListFilters, sort })
    const urlToPush = this.getUrlToPush(page)
    history.push(urlToPush)
  }

  handleStyleChange = (blockStyle) => {
    this.setState({
      blockStyle,
    })
  }

  showFilterHandler = () => {
    this.setState({ isShowFilter: true })
  }

  closeSearchModal = () => {
    this.setState({ isShowFilter: false })
  }

  resetFilter = () => {
    const {
      receivePlaylists,
      limit,
      history,
      playListFilters,
      sort,
    } = this.props
    // If current filter and initial filter is equal don't need to reset again
    if (
      isEqual(playListFilters, emptyFilters) &&
      isEqual(sort, initialSortState)
    )
      return null

    emptyFilters.isSingaporeMath = this.state.isSingaporeMath
    this.updateFilterState(emptyFilters, initialSortState)
    receivePlaylists({
      page: 1,
      limit,
      search: emptyFilters,
      sort: initialSortState,
    })
    history.push(`/author/playlists`)
  }

  handleClearFilter = () => {
    this.resetFilter()
  }

  get filterUrl() {
    const { playListFilters, standardQuery } = this.state
    return qs.stringify({ ...playListFilters, standardQuery })
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

  searchFilterOption = (input, option) =>
    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

  handleCheckboxAction = (e, selectedId) => {
    const { selectedPlayLists, checkPlayList } = this.props
    const updatedPlayslist = e.target.checked
      ? [...selectedPlayLists, selectedId]
      : selectedPlayLists.filter((_id) => _id !== selectedId)
    checkPlayList(updatedPlayslist)
  }

  renderCardContent = () => {
    const {
      loading,
      windowWidth,
      history,
      match,
      playlists,
      selectedPlayLists,
    } = this.props
    const { blockStyle } = this.state
    if (loading) {
      return <Spin size="large" />
    }
    if (playlists.length < 1) {
      return (
        <NoDataNotification
          heading="Playlists not available"
          description={`There are no playlists found for this filter. You can create new playlist by clicking the "NEW PLAYLIST" button.`}
        />
      )
    }

    const GridCountInARow = windowWidth >= 1366 ? 4 : 3
    const countModular = new Array(
      GridCountInARow - (playlists.length % GridCountInARow)
    ).fill(1)
    return (
      <Row type="flex" justify={windowWidth > 575 ? 'space-between' : 'center'}>
        {playlists.map((item) => (
          <CardWrapper
            item={item}
            key={0}
            blockStyle={blockStyle === 'tile' ? blockStyle : ''}
            windowWidth={windowWidth}
            history={history}
            match={match}
            isPlaylist
            handleCheckboxAction={this.handleCheckboxAction}
            checked={selectedPlayLists.includes(item._id)}
          />
        ))}

        {windowWidth > 1024 &&
          countModular.map((index) => <CardBox key={index} />)}
      </Row>
    )
  }

  handleLabelSearch = (e) => {
    const { key: filterType } = e
    const getMatchingObj = filterMenuItems.filter(
      (item) => item.path === filterType
    )
    const { filter = '' } = (getMatchingObj.length && getMatchingObj[0]) || {}
    const { history, receivePlaylists, limit, playListFilters } = this.props
    let updatedSearch = { ...playListFilters }
    if (filter === filterMenuItems[0].filter) {
      updatedSearch = {
        ...updatedSearch,
        status: '',
      }
    }
    const sortByRecency = ['by-me', 'shared', 'co-author'].includes(filterType)
    const sort = {
      sortBy: sortByRecency ? 'recency' : 'popularity',
      sortDir: 'desc',
    }
    history.push(`/author/playlists/filter/${filterType}`)
    this.updateFilterState(
      {
        ...updatedSearch,
        filter,
      },
      sort
    )
    receivePlaylists({
      page: 1,
      limit,
      search: {
        ...updatedSearch,
        filter,
      },
      sort,
    })
  }

  toggleSidebar = () =>
    this.setState((prevState) => ({ openSidebar: !prevState.openSidebar }))

  onSelectSortOption = (value, sortDir) => {
    const { playListFilters, limit, sort, receivePlaylists } = this.props
    const updateSort = {
      ...sort,
      sortBy: value,
      sortDir,
    }
    this.updateFilterState(playListFilters, updateSort)
    receivePlaylists({
      page: 1,
      limit,
      search: playListFilters,
      sort: updateSort,
    })
  }

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
      playListFilters,
      t,
      isProxyUser,
      sort = {},
      dashboardTiles,
      isDemoAccount = false,
    } = this.props

    const {
      blockStyle,
      isShowFilter,
      openSidebar,
      isPlaylistAvailableModalVisible,
      filteredSparkInfo,
      isSingaporeMath,
    } = this.state
    const { searchString } = playListFilters
    const renderFilterIcon = () => (
      <FilterToggleBtn
        isShowFilter={isShowFilter}
        toggleFilter={this.toggleFilter}
      />
    )

    const sparkDescription = dashboardTiles?.find(
      (x) => x.config?.subscriptionData?.itemBankId === filteredSparkInfo._id
    )

    const { description = '', title = '' } =
      sparkDescription?.config?.subscriptionData || {}

    return (
      <>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          title={t('common.playlistLibrary')}
          data-cy="new-playlist"
          btnTitle="New Playlist"
          titleIcon={IconPlaylist2}
          renderFilter={() => (
            <StyleChangeWrapper>
              <IconTile
                data-cy="tileView"
                onClick={() => this.handleStyleChange('tile')}
                width={18}
                height={18}
                color={blockStyle === 'tile' ? greyThemeLight : greyLight1}
              />
              <IconList
                data-cy="listView"
                onClick={() => this.handleStyleChange('horizontal')}
                width={18}
                height={18}
                color={
                  blockStyle === 'horizontal' ? greyThemeLight : greyLight1
                }
              />
            </StyleChangeWrapper>
          )}
          toggleSidebar={this.toggleSidebar}
        />
        <SideContent
          onClick={this.toggleSidebar}
          open={openSidebar}
          showSliderBtn={false}
        />
        <Container>
          <MobileFilter>
            <Input.Search
              placeholder="Search by skills and keywords"
              onChange={this.handleSearchInputChange}
              size="large"
              value={searchString}
              disabled={
                playListFilters.filter ===
                libraryFilters.SMART_FILTERS.FAVORITES
              }
            />
            <FilterButton>
              <Button data-cy="filter" onClick={() => this.showFilterHandler()}>
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
                isPlaylist
                search={playListFilters}
                handleLabelSearch={this.handleLabelSearch}
                onChange={this.handleFiltersChange}
                clearFilter={this.handleClearFilter}
                searchFilterOption={this.searchFilterOption}
                handleStandardSearch={this.handleStandardSearch}
                filterMenuItems={filterMenuItems}
                isSingaporeMath={isSingaporeMath}
              />
            </SearchModalContainer>
          </MobileFilterModal>
          <FlexContainer>
            <Filter isShowFilter={isShowFilter}>
              {!isShowFilter && (
                <AffixWrapper isBannerShown={isProxyUser || isDemoAccount}>
                  <ScrollbarWrapper>
                    <PerfectScrollbar>
                      <ScrollBox>
                        <InputTag
                          placeholder="Search by skills and keywords"
                          onSearchInputChange={this.handleSearchInputChange}
                          value={searchString}
                          disabled={
                            playListFilters.filter ===
                            libraryFilters.SMART_FILTERS.FAVORITES
                          }
                        />
                        <TestListFilters
                          isPlaylist
                          search={playListFilters}
                          handleLabelSearch={this.handleLabelSearch}
                          onChange={this.handleFiltersChange}
                          clearFilter={this.handleClearFilter}
                          searchFilterOption={this.searchFilterOption}
                          handleStandardSearch={this.handleStandardSearch}
                          filterMenuItems={filterMenuItems}
                          isSingaporeMath={isSingaporeMath}
                        />
                      </ScrollBox>
                    </PerfectScrollbar>
                  </ScrollbarWrapper>
                </AffixWrapper>
              )}
            </Filter>
            <Main isShowFilter={isShowFilter}>
              {renderFilterIcon()}
              <ItemsMenu justifyContent="space-between">
                <PaginationInfo>
                  <span>{count}</span> PLAYLISTS FOUND
                </PaginationInfo>
                <HeaderFilter
                  search={playListFilters}
                  handleCloseFilter={this.handleFiltersChange}
                  type="playlist"
                />
                <SortMenu
                  options={sortOptions.playList}
                  onSelect={this.onSelectSortOption}
                  sortDir={sort.sortDir}
                  sortBy={sort.sortBy}
                />
                {blockStyle === 'horizontal' && <Actions type="PLAYLIST" />}
              </ItemsMenu>
              <PerfectScrollbar style={{ padding: '0 20px' }}>
                <CardContainer type={blockStyle}>
                  {this.renderCardContent()}
                  <PaginationWrapper
                    type={blockStyle}
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
          <SelectCollectionModal contentType="PLAYLIST" />
          {isPlaylistAvailableModalVisible && (
            <PlaylistAvailableModal
              isVisible={isPlaylistAvailableModalVisible}
              closeModal={this.closePlaylistAvailableModal}
              description={description}
              title={title}
            />
          )}
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
      playlists: getPlaylistsSelector(state),
      loading: getPlaylistsLoadingSelector(state),
      page: getPlaylistsPageSelector(state),
      limit: getPlaylistsLimitSelector(state),
      count: getPlaylistsCountSelector(state),
      creating: getTestsCreatingSelector(state),
      userId: get(state, 'user.user._id', false),
      user: get(state, 'user.user'),
      sparkPlaylistCollectionsVisited: get(
        state,
        'user.user.sparkPlaylistCollectionsVisited',
        []
      ),
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      playListFilters: getPlalistFilterSelector(state),
      selectedPlayLists: getSelectedPlaylistSelector(state),
      isProxyUser: isProxyUserSelector(state),
      sort: getSortFilterStateSelector(state),
      collectionSelector: getCollectionsSelector(state),
      dashboardTiles: state.dashboardTeacher.configurableTiles,
      isDemoAccount: isDemoPlaygroundUser(state),
      features: getUserFeatures(state),
      userRole: getUserRole(state),
      districtId: getUserOrgId(state),
    }),
    {
      receivePlaylists: receivePlaylistsAction,
      receivePublishers: receivePublishersAction,
      clearTestData: clearTestDataAction,
      getAllTags: getAllTagsAction,
      updateDefaultGrades: updateDefaultGradesAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      receiveRecentPlayLists: receiveRecentPlayListsAction,
      updateAllPlaylistSearchFilter: updateAllPlaylistSearchFilterAction,
      clearPlaylistFilters: clearPlaylistFiltersAction,
      checkPlayList: checkPlayListAction,
      setUser: setUserAction,
    }
  )
)

export default enhance(TestList)
