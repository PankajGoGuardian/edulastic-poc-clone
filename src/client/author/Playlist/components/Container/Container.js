import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce, get, has, pickBy, pick, identity } from "lodash";
import styled from "styled-components";
import moment from "moment";
import * as qs from "query-string";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Button, Row, Input, Spin } from "antd";
import Modal from "react-responsive-modal";
import { withWindowSizes, helpers, FlexContainer } from "@edulastic/common";
import { IconList, IconTile, IconPlusCircle } from "@edulastic/icons";
import { grey, white, themeColor } from "@edulastic/colors";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
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
  CardBox
} from "../../../TestList/components/Container/styled";

import CardWrapper from "../../../TestList/components/CardWrapper/CardWrapper";
import {
  receivePlaylistsAction,
  getPlaylistsSelector,
  getPlaylistsLoadingSelector,
  getPlaylistsCountSelector,
  getPlaylistsLimitSelector,
  getPlaylistsPageSelector,
  receivePublishersAction,
  receiveRecentPlayListsAction,
  getPlalistFilterSelector,
  updateAllPlaylistSearchFilterAction,
  clearPlaylistFiltersAction,
  emptyFilters
} from "../../ducks";

import { getTestsCreatingSelector, clearTestDataAction, getAllTagsAction } from "../../../TestPage/ducks";

import ListHeader from "../../../src/components/common/ListHeader";
import TestListFilters from "../../../TestList/components/Container/TestListFilters";
import {
  getInterestedCurriculumsSelector,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector,
  getDefaultSubjectSelector,
  getDefaultGradesSelector
} from "../../../src/selectors/user";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../../../student/Login/ducks";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import { filterMenuItems } from "../../../Playlist/ducks";

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
    curriculums: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        curriculum: PropTypes.string.isRequired,
        grades: PropTypes.array.isRequired,
        subject: PropTypes.string.isRequired
      })
    ).isRequired,
    clearDictStandards: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    clearTestData: PropTypes.func,
    clearSelectedItems: PropTypes.func
  };

  static defaultProps = {
    clearSelectedItems: () => null,
    clearTestData: () => null
  };

  state = {
    standardQuery: "",
    blockStyle: "tile",
    isShowFilter: false
  };

  componentDidMount() {
    const {
      receivePlaylists,
      receivePublishers,
      receiveRecentPlayLists,
      limit,
      location,
      interestedGrades,
      getAllTags,
      interestedSubjects,
      defaultGrades = [],
      defaultSubject = [],
      match: { params = {} },
      playListFilters,
      page,
      history
    } = this.props;
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters[playList]")) || {};
    const searchFilters = {
      ...playListFilters,
      ...sessionFilters,
      grades: sessionFilters?.grades?.length ? sessionFilters.grades : playListFilters.grades || [],
      subject: sessionFilters?.subject || playListFilters.subject || ""
    };
    let searchParams = qs.parse(location.search);
    searchParams = this.typeCheck(searchParams, searchFilters);

    if (Object.keys(searchParams).length) {
      Object.assign(searchFilters, pick(searchParams, Object.keys(playListFilters)));
    }
    this.updateFilterState(searchFilters);
    const pageNumber = params.page || page;
    const limitCount = params.limit || limit;
    const queryParams = qs.stringify(pickBy({ ...searchFilters, page: pageNumber, limit: limitCount }, identity));
    history.push(`/author/playlists?${queryParams}`);

    receivePublishers();
    receivePlaylists({ page: 1, limit, search: searchFilters });
    getAllTags({ type: "playlist" });
    receiveRecentPlayLists();
  }

  updateFilterState = searchState => {
    const { updateAllPlaylistSearchFilter } = this.props;
    sessionStorage.setItem("filters[playList]", JSON.stringify(searchState));
    updateAllPlaylistSearchFilter(searchState);
  };

  searchTest = debounce(searchState => {
    const { receivePlaylists, limit, playListFilters } = this.props;
    receivePlaylists({
      page: 1,
      limit,
      search: searchState || playListFilters
    });
  }, 500);

  handleSearchInputChange = e => {
    const { playListFilters } = this.props;
    const searchString = e.target.value;
    const newSearch = {
      ...playListFilters,
      searchString
    };
    this.updateFilterState(newSearch);
    this.searchTest(newSearch);
  };

  handleFiltersChange = (name, value, dateString) => {
    const {
      receivePlaylists,
      history,
      limit,
      page,
      updateDefaultGrades,
      updateDefaultSubject,
      playListFilters
    } = this.props;
    let updatedKeys = {};

    updatedKeys = {
      ...playListFilters,
      [name]: value
    };
    if (name === "subject") {
      updateDefaultSubject(value);
      storeInLocalStorage("defaultSubject", value);
    } else if (name === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
    } else if (name === "createdAt") {
      updatedKeys = {
        ...updatedKeys,
        [name]: value ? moment(dateString, "DD/MM/YYYY").valueOf() : ""
      };
    }
    this.updateFilterState(updatedKeys);
    receivePlaylists({ search: updatedKeys, page: 1, limit });
    history.push(`/author/playlists/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
  };

  handleCreate = () => {
    const { history, clearSelectedItems, clearTestData } = this.props;
    history.push("/author/playlists/create");
    clearTestData();
    clearSelectedItems();
  };

  handlePaginationChange = page => {
    const { receivePlaylists, limit, history, TestListFilters } = this.props;

    receivePlaylists({ page, limit, search: TestListFilters });
    history.push(`/author/playlists/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
  };

  handleStyleChange = blockStyle => {
    this.setState({
      blockStyle
    });
  };

  showFilterHandler = () => {
    this.setState({ isShowFilter: true });
  };

  closeSearchModal = () => {
    this.setState({ isShowFilter: false });
  };

  resetFilter = () => {
    const { receivePlaylists, limit, history } = this.props;
    this.updateFilterState(emptyFilters);
    receivePlaylists({ page: 1, limit, search: emptyFilters });
    history.push(`/author/playlists`);
  };

  handleClearFilter = () => {
    this.resetFilter();
  };

  get filterUrl() {
    const { playListFilters, standardQuery } = this.state;
    return qs.stringify({ ...playListFilters, standardQuery });
  }

  typeCheck = (parsedQueryData, search) => {
    const parsedQueryDataClone = {};
    for (const key of Object.keys(parsedQueryData)) {
      if (search[key] instanceof Array && !(parsedQueryData[key] instanceof Array)) {
        parsedQueryDataClone[key] = [parsedQueryData[key]];
      } else {
        parsedQueryDataClone[key] = parsedQueryData[key];
      }
    }
    return parsedQueryDataClone;
  };

  setFilterParams(parsedQueryData) {
    const {
      receivePlaylists,
      match: { params = {} },
      playListFilters
    } = this.props;
    // const { search } = this.state;

    parsedQueryData = this.typeCheck(parsedQueryData, playListFilters);
    const searchClone = {};

    for (const key of Object.keys(parsedQueryData)) {
      if (has(search, key)) {
        searchClone[key] = parsedQueryData[key];
      }
    }

    this.updateFilterState(searchClone);

    receivePlaylists({
      page: Number(searchClone.page),
      limit: Number(searchClone.limit),
      search: searchClone
    });
  }

  searchFilterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  renderCardContent = () => {
    const { loading, windowWidth, history, match, playlists } = this.props;
    const { blockStyle } = this.state;
    if (loading) {
      return <Spin size="large" />;
    }
    if (playlists.length < 1) {
      return (
        <NoDataNotification
          heading={"Playlists not available"}
          description={`There are no playlists found for this filter. You can create new playlist by clicking the "NEW PLAYLIST" button.`}
        />
      );
    }

    const GridCountInARow = windowWidth >= 1600 ? 4 : 3;
    const countModular = new Array(GridCountInARow - (playlists.length % GridCountInARow)).fill(1);
    return (
      <Row type="flex" justify={windowWidth > 575 ? "space-between" : "center"}>
        {playlists.map((item, index) => (
          <CardWrapper
            item={item}
            key={0}
            blockStyle={blockStyle === "tile" ? blockStyle : ""}
            windowWidth={windowWidth}
            history={history}
            match={match}
            isPlaylist={true}
          />
        ))}

        {windowWidth > 1024 && countModular.map(index => <CardBox key={index} />)}
      </Row>
    );
  };

  handleLabelSearch = e => {
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const { history, receivePlaylists, limit, playListFilters, updateAllPlaylistSearchFilter } = this.props;
    let updatedSearch = { ...playListFilters };
    if (filter === filterMenuItems[0].filter) {
      updatedSearch = {
        ...updatedSearch,
        status: ""
      };
    }
    history.push(`/author/playlists/filter/${filterType}`);
    this.updateFilterState({
      ...updatedSearch,
      filter
    });
    receivePlaylists({
      page: 1,
      limit,
      search: {
        ...updatedSearch,
        filter
      }
    });
  };

  render() {
    const { page, limit, count, creating, playListFilters } = this.props;

    const { blockStyle, isShowFilter } = this.state;
    const { searchString } = playListFilters;

    const { from, to } = helpers.getPaginationInfo({ page, limit, count });
    return (
      <>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          title="Play List Library"
          btnTitle="New Play list"
          icon={<IconPlusStyled color={themeColor} width={20} height={20} hoverColor={themeColor} />}
          renderFilter={() => (
            <StyleChangeWrapper>
              <IconTile
                data-cy="tileView"
                onClick={() => this.handleStyleChange("tile")}
                width={18}
                height={18}
                color={blockStyle === "tile" ? white : grey}
              />
              <IconList
                data-cy="listView"
                onClick={() => this.handleStyleChange("horizontal")}
                width={18}
                height={18}
                color={blockStyle === "horizontal" ? white : grey}
              />
            </StyleChangeWrapper>
          )}
        />
        <Container>
          <MobileFilter>
            <Input.Search
              placeholder="Search by skills and keywords"
              onChange={this.handleSearchInputChange}
              size="large"
              value={searchString}
            />
            <FilterButton>
              <Button data-cy="filter" onClick={() => this.showFilterHandler()}>
                {!isShowFilter ? "SHOW FILTERS" : "HIDE FILTERS"}
              </Button>
            </FilterButton>
          </MobileFilter>
          <Modal open={isShowFilter} onClose={this.closeSearchModal}>
            <SearchModalContainer>
              <TestListFilters
                isPlaylist={true}
                search={playListFilters}
                handleLabelSearch={this.handleLabelSearch}
                onChange={this.handleFiltersChange}
                clearFilter={this.handleClearFilter}
                searchFilterOption={this.searchFilterOption}
                handleStandardSearch={this.handleStandardSearch}
                filterMenuItems={filterMenuItems}
              />
            </SearchModalContainer>
          </Modal>
          <FlexContainer>
            <Filter>
              <AffixWrapper>
                <ScrollbarWrapper>
                  <PerfectScrollbar>
                    <ScrollBox>
                      <Input.Search
                        placeholder="Search by skills and keywords"
                        onChange={this.handleSearchInputChange}
                        size="large"
                        value={searchString}
                      />
                      <TestListFilters
                        isPlaylist={true}
                        search={playListFilters}
                        handleLabelSearch={this.handleLabelSearch}
                        onChange={this.handleFiltersChange}
                        clearFilter={this.handleClearFilter}
                        searchFilterOption={this.searchFilterOption}
                        handleStandardSearch={this.handleStandardSearch}
                        filterMenuItems={filterMenuItems}
                      />
                    </ScrollBox>
                  </PerfectScrollbar>
                </ScrollbarWrapper>
              </AffixWrapper>
            </Filter>
            <Main>
              <FlexContainer justifyContent="space-between" style={{ marginBottom: 10 }}>
                <PaginationInfo>
                  {count ? from : 0} to {to} of <i>{count}</i>
                </PaginationInfo>
              </FlexContainer>
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
            </Main>
          </FlexContainer>
        </Container>
      </>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      playlists: getPlaylistsSelector(state),
      loading: getPlaylistsLoadingSelector(state),
      page: getPlaylistsPageSelector(state),
      limit: getPlaylistsLimitSelector(state),
      count: getPlaylistsCountSelector(state),
      creating: getTestsCreatingSelector(state),
      userId: get(state, "user.user._id", false),
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      playListFilters: getPlalistFilterSelector(state)
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
      clearPlaylistFilters: clearPlaylistFiltersAction
    }
  )
);

export default enhance(TestList);

const IconPlusStyled = styled(IconPlusCircle)`
  position: relative;
`;
