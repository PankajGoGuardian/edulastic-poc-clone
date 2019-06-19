import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce, get, has } from "lodash";
import * as qs from "query-string";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Button, Row, Input, Spin } from "antd";
import Modal from "react-responsive-modal";
import { withWindowSizes, helpers, FlexContainer } from "@edulastic/common";
import { IconList, IconTile } from "@edulastic/icons";
import { grey, white } from "@edulastic/colors";
import { uniq } from "lodash";
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
  StyleChangeWrapper
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
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  updateDefaultGradesAction,
  updateDefaultSubjectAction
} from "../../ducks";

import { getTestsCreatingSelector, clearTestDataAction } from "../../../TestPage/ducks";

import ListHeader from "../../../src/components/common/ListHeader";
import TestListFilters from "../../../TestList/components/Container/TestListFilters";
import { receiveRecentPlayListsAction } from "../../ducks";
import {
  getInterestedCurriculumsSelector,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector
} from "../../../src/selectors/user";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";

const filterMenuItems = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "copy", filter: "CO_AUTHOR", path: "co-author", text: "I am a Co-Author" },
  { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

export const getClearSearchState = () => ({
  grades: [],
  subject: "",
  filter: filterMenuItems[0].filter,
  searchString: "",
  type: "",
  status: "",
  collectionName: ""
});

class TestList extends Component {
  static propTypes = {
    tests: PropTypes.array.isRequired,
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
    search: getClearSearchState(),
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
      interestedSubjects,
      defaultGrades = [],
      defaultSubject = [],
      match: { params = {} }
    } = this.props;

    const { search } = this.state;
    const parsedQueryData = qs.parse(location.search);
    const { filterType } = params;
    receivePublishers();
    if (filterType) {
      const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
      const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
      let updatedSearch = { ...search };
      if (filter === filterMenuItems[0].filter) {
        updatedSearch = {
          ...updatedSearch,
          status: ""
        };
      }
      this.setState({
        search: {
          ...updatedSearch,
          filter
        }
      });
      receivePlaylists({
        page: 1,
        limit,
        search: {
          ...updatedSearch,
          filter
        }
      });
    } else if (Object.entries(parsedQueryData).length > 0) {
      this.setFilterParams(parsedQueryData, params);
    } else if (params.page && params.limit) {
      receivePlaylists({
        page: Number(params.page),
        limit: Number(params.limit),
        search
      });
    } else {
      let grades = defaultGrades;
      let subject = defaultSubject;
      if (!grades) {
        grades = interestedGrades;
      }
      if (subject === null) {
        subject = interestedSubjects[0] || "";
      }
      this.setState({
        search: {
          ...search,
          grades,
          subject
        }
      });
      receivePlaylists({ page: 1, limit, search: { ...search, grades, subject } });
    }
    receiveRecentPlayLists();
  }

  searchTest = debounce(() => {
    const { receivePlaylists, limit } = this.props;
    const { search } = this.state;
    receivePlaylists({
      page: 1,
      limit,
      search
    });
  }, 500);

  handleSearchInputChange = e => {
    const { search } = this.state;
    const searchString = e.target.value;
    const newSearch = {
      ...search,
      searchString
    };
    this.setState(
      {
        search: newSearch
      },
      () => {
        this.searchTest();
      }
    );
  };

  handleFiltersChange = (name, value) => {
    const { search } = this.state;
    const { receivePlaylists, history, limit, page, updateDefaultGrades, updateDefaultSubject } = this.props;
    let updatedKeys = {};

    updatedKeys = {
      ...search,
      [name]: value
    };
    if (name === "subject") {
      updateDefaultSubject(value);
      storeInLocalStorage("defaultSubject", value);
    } else if (name === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
    }
    this.setState(
      {
        search: updatedKeys
      },
      () => {
        const { search: updatedSearch } = this.state;
        receivePlaylists({ search: updatedSearch, page: 1, limit });
        history.push(`/author/playlists/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
      }
    );
  };

  handleCreate = () => {
    const { history, clearSelectedItems, clearTestData } = this.props;
    history.push("/author/playlists/create");
    clearTestData();
    clearSelectedItems();
  };

  handlePaginationChange = page => {
    const { receivePlaylists, limit, history } = this.props;
    const { search } = this.state;

    receivePlaylists({ page, limit, search });
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
    const { search } = this.state;
    receivePlaylists({ page: 1, limit, search });
    history.push(`/author/playlists`);
  };

  handleClearFilter = () => {
    this.setState(
      {
        search: getClearSearchState()
      },
      this.resetFilter
    );
  };

  get filterUrl() {
    const { search, standardQuery } = this.state;
    return qs.stringify({ ...search, standardQuery });
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
      match: { params = {} }
    } = this.props;
    const { search } = this.state;

    parsedQueryData = this.typeCheck(parsedQueryData, search);
    const searchClone = {};

    for (const key of Object.keys(parsedQueryData)) {
      if (has(search, key)) {
        searchClone[key] = parsedQueryData[key];
      }
    }

    this.setState(
      {
        search: searchClone
      },
      () => {
        const {
          search: { grade },
          search: updatedSearch
        } = this.state;

        receivePlaylists({
          page: Number(params.page),
          limit: Number(params.limit),
          search: updatedSearch
        });
      }
    );
  }

  searchCurriculum = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  renderCardContent = () => {
    const { loading, windowWidth, history, match, playlists } = this.props;
    const { blockStyle } = this.state;
    if (loading) {
      return <Spin size="large" />;
    }
    return (
      <Row gutter={24} type="flex">
        {playlists.map((item, index) => (
          <CardWrapper
            item={item}
            key={0}
            // owner={item.authors.find(x => x._id === userId)}
            blockStyle={blockStyle === "tile" ? blockStyle : ""}
            windowWidth={windowWidth}
            history={history}
            match={match}
            isPlaylist={true}
          />
        ))}
      </Row>
    );
  };

  handleLabelSearch = e => {
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const { history, receivePlaylists, limit } = this.props;
    const { search } = this.state;
    let updatedSearch = { ...search };
    if (filter === filterMenuItems[0].filter) {
      updatedSearch = {
        ...updatedSearch,
        status: ""
      };
    }
    history.push(`/author/playlists/filter/${filterType}`);
    this.setState({
      search: {
        ...updatedSearch,
        filter
      }
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
    const { page, limit, count, creating } = this.props;

    const { blockStyle, isShowFilter, search } = this.state;
    const { searchString } = search;

    const { from, to } = helpers.getPaginationInfo({ page, limit, count });
    return (
      <>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          title="Play List Library"
          btnTitle="New Playlist"
          renderFilter={() => (
            <StyleChangeWrapper>
              <IconTile
                onClick={() => this.handleStyleChange("tile")}
                width={18}
                height={18}
                color={blockStyle === "tile" ? white : grey}
              />
              <IconList
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
              <Button onClick={() => this.showFilterHandler()}>
                {!isShowFilter ? "SHOW FILTERS" : "HIDE FILTERS"}
              </Button>
            </FilterButton>
          </MobileFilter>
          <Modal open={isShowFilter} onClose={this.closeSearchModal}>
            <SearchModalContainer>
              <TestListFilters
                isPlaylist={true}
                search={search}
                handleLabelSearch={this.handleLabelSearch}
                onChange={this.handleFiltersChange}
                clearFilter={this.handleClearFilter}
                searchCurriculum={this.searchCurriculum}
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
                        search={search}
                        handleLabelSearch={this.handleLabelSearch}
                        onChange={this.handleFiltersChange}
                        clearFilter={this.handleClearFilter}
                        searchCurriculum={this.searchCurriculum}
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
      t: PropTypes.func.isRequired
    }),
    {
      receivePlaylists: receivePlaylistsAction,
      receivePublishers: receivePublishersAction,
      clearTestData: clearTestDataAction,
      updateDefaultGrades: updateDefaultGradesAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      receiveRecentPlayLists: receiveRecentPlayListsAction
    }
  )
);

export default enhance(TestList);
