import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce } from "lodash";
import * as qs from "query-string";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Button, Row, Input, Spin } from "antd";
import Modal from "react-responsive-modal";
import { get } from "lodash";
import { withWindowSizes, helpers, FlexContainer } from "@edulastic/common";

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
  AffixWrapper
} from "./styled";

import CardWrapper from "../CardWrapper/CardWrapper";
import {
  receiveTestsAction,
  getTestsSelector,
  getTestsLoadingSelector,
  getTestsCountSelector,
  getTestsLimitSelector,
  getTestsPageSelector
} from "../../ducks";
import { getTestsCreatingSelector, clearTestDataAction } from "../../../TestPage/ducks";
import { clearSelectedItemsAction } from "../../../TestPage/components/AddItems/ducks";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";

import TestFilters from "../../../src/components/common/TestFilters";
import TestFiltersNav from "../../../src/components/common/TestFilters/TestFiltersNav";
import SortBar from "../SortBar/SortBar";
import ListHeader from "../../../src/components/common/ListHeader";
import filterData from "./FilterData";

const filterMenuItems = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "copy", filter: "CO_AUTHOR", path: "co-author", text: "I am a Co-Author" },
  { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

export const getClearSearchState = () => ({
  subject: "",
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  curriculumId: "",
  grades: [],
  standardIds: [],
  tags: [],
  filter: filterMenuItems[0].filter,
  searchString: ""
});

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
        subject: PropTypes.string.isRequired
      })
    ).isRequired,
    curriculumStandards: PropTypes.array.isRequired,
    getCurriculums: PropTypes.func.isRequired,
    getCurriculumStandards: PropTypes.func.isRequired,
    clearDictStandards: PropTypes.func.isRequired
  };

  state = {
    search: getClearSearchState(),
    standardQuery: "",
    blockStyle: "tile",
    isShowFilter: false
  };

  componentDidMount() {
    const {
      receiveTests,
      curriculums,
      getCurriculums,
      limit,
      location,
      match: { params = {} }
    } = this.props;
    const { search } = this.state;
    const parsedQueryData = qs.parse(location.search);
    if (!curriculums.length) {
      getCurriculums();
    }
    const { filterType } = params;
    if (filterType) {
      const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
      const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
      this.setState(prevState => ({
        search: {
          ...prevState.search,
          filter
        }
      }));
      receiveTests({
        page: 1,
        limit,
        search: {
          ...search,
          filter
        }
      });
    } else if (Object.entries(parsedQueryData).length > 0) {
      this.setFilterParams(parsedQueryData, params);
    } else if (params.page && params.limit) {
      receiveTests({
        page: Number(params.page),
        limit: Number(params.limit),
        search
      });
    } else {
      receiveTests({ page: 1, limit, search });
    }
  }

  searchTest = debounce(() => {
    const { receiveTests, limit } = this.props;

    receiveTests({
      page: 1,
      limit,
      search: this.state.search
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

  handleStandardSearch = searchStr => {
    const { getCurriculumStandards } = this.props;
    this.setState({ standardQuery: searchStr });
    const {
      search: { grades, curriculumId }
    } = this.state;
    if (curriculumId && searchStr.length >= 2) {
      getCurriculumStandards(curriculumId, grades, searchStr);
    }
  };

  handleFiltersChange = (name, value) => {
    const { search } = this.state;
    const { receiveTests, clearDictStandards, history, limit, page } = this.props;

    if (name === "curriculumId" && !value.length) {
      clearDictStandards();
    }

    this.setState(
      {
        search: {
          ...search,
          [name]: value
        }
      },
      () => {
        receiveTests({ search: this.state.search, page: 1, limit });

        history.push(`/author/tests/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
      }
    );
  };

  handleCreate = () => {
    const { history, clearSelectedItems, clearTestData } = this.props;
    history.push("/author/tests/create");
    clearTestData();
    clearSelectedItems();
  };

  handlePaginationChange = page => {
    const { receiveTests, limit, history } = this.props;
    const { search } = this.state;

    receiveTests({ page, limit, search });
    history.push(`/author/tests/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
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
    const { receiveTests, limit, history } = this.props;
    const { search } = this.state;
    receiveTests({ page: 1, limit, search });
    history.push(`/author/tests`);
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

  typeCheck(parsedQueryData, search) {
    const parsedQueryDataClone = {};
    for (const key of Object.keys(parsedQueryData)) {
      if (search[key] instanceof Array && !(parsedQueryData.standardIds instanceof Array)) {
        parsedQueryDataClone[key] = [parsedQueryData[key]];
      } else {
        parsedQueryDataClone[key] = parsedQueryData[key];
      }
    }
    return parsedQueryDataClone;
  }

  setFilterParams(parsedQueryData) {
    const {
      getCurriculumStandards,
      receiveTests,
      match: { params = {} }
    } = this.props;
    const { search } = this.state;

    parsedQueryData = this.typeCheck(parsedQueryData, search);
    const searchClone = {};

    for (const key of Object.keys(parsedQueryData)) {
      if (search.hasOwnProperty(key)) {
        searchClone[key] = parsedQueryData[key];
      }
    }

    this.setState(
      {
        search: searchClone
      },
      () => {
        const {
          search: { curriculumId, grade }
        } = this.state;
        if (curriculumId.length && parsedQueryData.standardQuery.length >= 2) {
          getCurriculumStandards(curriculumId, grade, parsedQueryData.standardQuery);
        }
        receiveTests({
          page: Number(params.page),
          limit: Number(params.limit),
          search: this.state.search
        });
      }
    );
  }

  getFilters(filters) {
    const { curriculums, curriculumStandards } = this.props;
    const {
      search: { curriculumId }
    } = this.state;
    const formattedCuriculums = curriculums.map(item => ({
      value: item._id,
      text: item.curriculum
    }));

    const formattedStandards = curriculumStandards.map(item => ({
      value: item._id,
      text: `${item.identifier} : ${item.description}`
    }));

    const standardsPlaceholder = !curriculumId.length
      ? "Available with Curriculum"
      : 'Type to Search, for example "k.cc"';

    return [
      ...filters,
      {
        size: "large",
        title: "Curriculum",
        onChange: "curriculumId",
        data: [{ value: "", text: "All Curriculum" }, ...formattedCuriculums]
      },
      {
        onSearch: this.handleStandardSearch,
        size: "large",
        mode: "multiple",
        placeholder: standardsPlaceholder,
        title: "Standards",
        filterOption: false,
        disabled: !curriculumId.length,
        onChange: "standardIds",
        data: formattedStandards
      }
    ];
  }

  renderCardContent = () => {
    const { loading, tests, windowWidth, history, match, userId } = this.props;
    const { blockStyle } = this.state;

    if (loading) {
      return <Spin size="large" />;
    }

    if (blockStyle === "tile") {
      return (
        <Row gutter={16} type="flex">
          {tests.map(item => (
            <CardWrapper
              item={item}
              owner={item.authors.find(x => x._id === userId)}
              blockStyle="tile"
              windowWidth={windowWidth}
              history={history}
              match={match}
            />
          ))}
        </Row>
      );
    }

    return (
      <Row>
        {tests.map(item => {
          return (
            <CardWrapper owner={item.authors.find(x => x._id === userId)} item={item} history={history} match={match} />
          );
        })}
      </Row>
    );
  };

  handleLabelSearch = e => {
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const { history, receiveTests, limit } = this.props;
    const { search } = this.state;
    history.push(`/author/tests/filter/${filterType}`);
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        filter
      }
    }));
    receiveTests({
      page: 1,
      limit,
      search: {
        ...search,
        filter
      }
    });
  };

  render() {
    const { page, limit, count, creating } = this.props;

    const { blockStyle, isShowFilter, search } = this.state;
    const { searchString } = search;

    const { from, to } = helpers.getPaginationInfo({ page, limit, count });
    const filters = this.getFilters(filterData);
    return (
      <>
        <ListHeader onCreate={this.handleCreate} creating={creating} title="Test List" />
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
              <TestFilters clearFilter={this.handleClearFilter} state={search} filterData={filters}>
                <TestFiltersNav items={filterMenuItems} onSelect={this.handleLabelSearch} search={search} />
              </TestFilters>
            </SearchModalContainer>
          </Modal>
          <FlexContainer>
            <Filter>
              <AffixWrapper>
                <Input.Search
                  placeholder="Search by skills and keywords"
                  onChange={this.handleSearchInputChange}
                  size="large"
                  value={searchString}
                />
                <ScrollbarWrapper>
                  <PerfectScrollbar>
                    <ScrollBox>
                      <TestFilters
                        clearFilter={this.handleClearFilter}
                        state={search}
                        filterData={filters}
                        onChange={this.handleFiltersChange}
                      >
                        <TestFiltersNav items={filterMenuItems} onSelect={this.handleLabelSearch} search={search} />
                      </TestFilters>
                    </ScrollBox>
                  </PerfectScrollbar>
                </ScrollbarWrapper>
              </AffixWrapper>
            </Filter>
            <Main>
              <FlexContainer justifyContent="space-between" style={{ marginBottom: 10 }}>
                <PaginationInfo>
                  {from} to {to} of <i>{count}</i>
                </PaginationInfo>
                <SortBar onStyleChange={this.handleStyleChange} activeStyle={blockStyle} />
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
      tests: getTestsSelector(state),
      loading: getTestsLoadingSelector(state),
      page: getTestsPageSelector(state),
      limit: getTestsLimitSelector(state),
      count: getTestsCountSelector(state),
      creating: getTestsCreatingSelector(state),
      curriculums: getCurriculumsListSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      userId: get(state, "user.user._id", false)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      receiveTests: receiveTestsAction,
      clearDictStandards: clearDictStandardsAction,
      clearSelectedItems: clearSelectedItemsAction,
      clearTestData: clearTestDataAction
    }
  )
);

export default enhance(TestList);
