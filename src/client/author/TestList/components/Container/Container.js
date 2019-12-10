import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce, get, has, pickBy, identity, pick } from "lodash";
import * as qs from "query-string";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { compose } from "redux";
import { Button, Row, Input, Spin, message } from "antd";
import Modal from "react-responsive-modal";
import { withWindowSizes, helpers, FlexContainer } from "@edulastic/common";
import { IconList, IconTile, IconPlusCircle } from "@edulastic/icons";
import { grey, white, themeColor } from "@edulastic/colors";
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
} from "./styled";

import CardWrapper from "../CardWrapper/CardWrapper";
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
  emptyFilters
} from "../../ducks";
import {
  getTestsCreatingSelector,
  clearTestDataAction,
  clearCreatedItemsAction,
  getAllTagsAction
} from "../../../TestPage/ducks";
import { clearSelectedItemsAction } from "../../../TestPage/components/AddItems/ducks";
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";

import ListHeader from "../../../src/components/common/ListHeader";
import TestListFilters from "./TestListFilters";
import AddTestModal from "../../../PlaylistPage/components/AddTestsModal/AddTestModal";
import AddUnitModalBody from "../../../CurriculumSequence/components/AddUnitModalBody";
import { StyledButton } from "../../../TestPage/components/AddItems/styled";
import {
  createNewModuleAction,
  createTestInModuleAction,
  removeTestFromPlaylistAction
} from "../../../PlaylistPage/ducks";
import RemoveTestModal from "../../../PlaylistPage/components/RemoveTestModal/RemoveTestModal";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import {
  getInterestedCurriculumsSelector,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector,
  getDefaultGradesSelector,
  getDefaultSubjectSelector
} from "../../../src/selectors/user";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
import { getInterestedStandards } from "../../../dataUtils";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../../../student/Login/ducks";

// TODO: split into mulitple components, for performance sake.
// and only connect what is required.
// like seprating out filter and test rendering into two, and connect them to only what is required.

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
    getCurriculums: PropTypes.func.isRequired,
    getCurriculumStandards: PropTypes.func.isRequired,
    clearDictStandards: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    clearTestData: PropTypes.func,
    clearCreatedItems: PropTypes.func,
    clearSelectedItems: PropTypes.func
  };

  static defaultProps = {
    clearSelectedItems: () => null,
    clearTestData: () => null
  };

  state = {
    standardQuery: "",
    blockStyle: "tile",
    showCreateModuleModal: false,
    showConfirmRemoveModal: false,
    showAddTestInModules: false,
    selectedTests: [],
    isShowFilter: false
  };

  componentDidMount() {
    const {
      receiveTests,
      curriculums,
      getCurriculums,
      page,
      limit,
      location,
      playlist,
      mode,
      match: params,
      getCurriculumStandards,
      clearCreatedItems,
      clearSelectedItems,
      getAllTags,
      testFilters,
      clearDictStandards,
      history
    } = this.props;
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters[testList]")) || {};
    const searchFilters = {
      ...testFilters,
      ...sessionFilters,
      grades: sessionFilters?.grades?.length ? sessionFilters.grades : testFilters.grades || [],
      subject: sessionFilters?.subject || testFilters.subject || ""
    };

    // propagate filter from query params to the store (test.filters)
    let searchParams = qs.parse(location.search);
    searchParams = this.typeCheck(searchParams, searchFilters);
    if (Object.keys(searchParams).length) {
      searchParams.curriculumId = Number(searchParams.curriculumId) || searchFilters.curriculumId || "";
      searchParams.standardIds = Number(searchParams.standardIds) ? [Number(searchParams.standardIds)] : [];
      Object.assign(searchFilters, pick(searchParams, Object.keys(testFilters)));
    }

    if (mode === "embedded") {
      let selectedTests = [];
      const { modules } = playlist;
      const { state = {} } = location;
      const { editFlow } = state;
      modules.forEach(mod => {
        mod.data.forEach(test => {
          selectedTests.push(test.contentId);
        });
      });
      this.setState({
        selectedTests,
        editFlow,
        blockStyle: "horizontal"
      });
      receiveTests({
        page: 1,
        limit,
        search: searchFilters
      });
    } else {
      if (!curriculums.length) {
        getCurriculums();
      }
      this.updateFilterState(searchFilters, true);
      const pageNumber = params.page || page;
      const limitCount = params.limit || limit;
      const queryParams = qs.stringify(pickBy({ ...searchFilters, page: pageNumber, limit: limitCount }, identity));
      history.push(`/author/tests?${queryParams}`);
      receiveTests({ page: 1, limit, search: searchFilters });
      getAllTags({ type: "test" });
    }

    if (searchFilters.curriculumId) {
      const { curriculumId, grades = [] } = searchFilters;
      clearDictStandards();
      getCurriculumStandards(curriculumId, grades, "");
    }
    clearCreatedItems();
    clearSelectedItems();
  }

  updateFilterState = (searchState, all) => {
    const { updateAllTestFilters, updateTestFilters, testFilters } = this.props;
    const search = all
      ? { ...searchState }
      : {
          ...testFilters,
          [searchState.key]: searchState.value
        };
    sessionStorage.setItem("filters[testList]", JSON.stringify(search));
    if (all) {
      return updateAllTestFilters(search);
    }
    updateTestFilters(search);
  };

  searchTest = debounce(search => {
    const {
      receiveTests,
      limit,
      history,
      playlistPage,
      playlist: { _id }
    } = this.props;
    const queryParams = qs.stringify(pickBy({ ...search, page: 1, limit }, identity));
    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    history.push(locToPush);
    receiveTests({ search, limit, page: 1 });
  }, 500);

  handleSearchInputChange = e => {
    const { testFilters } = this.props;
    const searchString = e.target.value;
    const newSearch = {
      ...testFilters,
      searchString
    };

    this.updateFilterState(newSearch, true);
    this.searchTest(newSearch);
  };

  /**
   * invoked when any of the filter changes.
   * @params name {String} - name of the filt.er
   * @params value {Sring} - filter value
   */
  handleFiltersChange = (name, value) => {
    const {
      receiveTests,
      clearDictStandards,
      history,
      limit,
      getCurriculumStandards,
      updateDefaultGrades,
      updateDefaultSubject,
      defaultSubject,
      defaultGrades,
      testFilters,
      playlistPage,
      playlist: { _id }
    } = this.props;

    // all the fields to pass for search.

    let updatedKeys = {
      ...testFilters
    };

    if (name === "curriculumId") {
      clearDictStandards();
      getCurriculumStandards(value, testFilters.grades, "");
      updatedKeys = {
        ...updatedKeys,
        standardIds: []
      };
    }
    if (name === "grades" && testFilters.curriculumId) {
      clearDictStandards();
      getCurriculumStandards(testFilters.curriculumId, value, "");
    }
    if (name === "subject") {
      updatedKeys = {
        ...updatedKeys,
        [name]: value,
        curriculumId: "",
        standardIds: []
      };
      updateDefaultSubject(value);
      storeInLocalStorage("defaultSubject", value);
      clearDictStandards();
    } else {
      updatedKeys = {
        ...updatedKeys,
        [name]: value
      };
    }
    if (name === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
    }
    const searchFilters = {
      ...updatedKeys,
      [name]: value
    };
    this.updateFilterState(searchFilters, true);
    // update the url to reflect the newly applied filter and get the new results.
    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    const queryParams = qs.stringify(pickBy({ ...searchFilters, page: 1, limit }, identity));
    history.push(locToPush);
    receiveTests({ search: searchFilters, page: 1, limit });
  };

  handleCreate = () => {
    const { history, clearCreatedItems, clearSelectedItems, clearTestData, mode } = this.props;
    if (mode !== "embedded") {
      history.push("/author/tests/select");
    }
    clearTestData();
    clearCreatedItems();
    clearSelectedItems();
  };

  updateTestList = page => {
    const {
      receiveTests,
      limit,
      history,
      testFilters,
      defaultGrades,
      defaultSubject,
      playlistPage,
      playlist: { _id }
    } = this.props;
    const searchFilters = {
      ...testFilters
    };

    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    const queryParams = qs.stringify(pickBy({ ...searchFilters, page, limit }, identity));
    history.push(locToPush);
    receiveTests({ page, limit, search: searchFilters });
  };

  handlePaginationChange = page => {
    this.updateTestList(page);
  };

  handleClearFilter = () => {
    const { history, mode, limit, receiveTests } = this.props;
    this.updateFilterState(emptyFilters, true);
    if (mode !== "embedded") history.push(`/author/tests?filter=ENTIRE_LIBRARY&limit=${limit}&page=1`);
    receiveTests({ page: 1, limit, search: emptyFilters });
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
      getCurriculumStandards,
      receiveTests,
      match: { params = {} },
      testFilters
    } = this.props;

    const search = {
      ...testFilters
    };

    parsedQueryData = this.typeCheck(parsedQueryData, search);
    const searchClone = {
      ...testFilters
    };

    for (const key of Object.keys(parsedQueryData)) {
      if (has(testFilters, key)) {
        searchClone[key] = parsedQueryData[key];
      }
    }

    this.updateFilterState(searchClone, true);

    const { curriculumId, grade } = searchClone;
    if (curriculumId && parsedQueryData.standardQuery.length >= 2) {
      getCurriculumStandards(curriculumId, grade, parsedQueryData.standardQuery);
    }
    receiveTests({
      page: Number(params.page),
      limit: Number(params.limit),
      search: searchClone
    });
  }

  handleCreateNewModule = () => {
    this.setState({ showCreateModuleModal: true });
  };

  handleAddTests = item => {
    const {
      playlist: { modules }
    } = this.props;
    if (!modules.length) {
      message.warning("Create atleast 1 module");
    } else {
      if (item.status === "draft") {
        message.warning("Draft tests cannot be added");
      } else {
        this.setState({ showAddTestInModules: true, testAdded: item });
      }
    }
  };

  onCloseCreateModule = () => {
    this.setState({ showCreateModuleModal: false });
  };

  onCloseAddTestModal = () => {
    this.setState({ showAddTestInModules: false });
  };

  removeTestFromPlaylist = () => {
    const { selectedTests, removeItemId } = this.state;
    const { removeTestFromPlaylistAction } = this.props;
    const newSelectedTests = selectedTests.filter(testId => testId !== removeItemId);
    removeTestFromPlaylistAction({ itemId: removeItemId });
    this.setState({ selectedTests: newSelectedTests, showConfirmRemoveModal: false });
  };

  handleRemoveTest = itemId => {
    const { editFlow } = this.state;
    const { removeTestFromPlaylist } = this;
    if (editFlow) {
      this.setState({ removeItemId: itemId, showConfirmRemoveModal: true });
    } else {
      removeTestFromPlaylist;
      this.setState({ removeItemId: itemId }, () => {
        removeTestFromPlaylist();
      });
    }
  };
  onCloseConfirmRemoveModal = () => {
    this.setState({ showConfirmRemoveModal: false });
  };
  handleTestAdded = index => {
    const { addTestToModule } = this.props;
    const { testAdded, selectedTests } = this.state;
    this.setState(prevState => ({ ...prevState, selectedTests: [...selectedTests, testAdded._id] }));
    addTestToModule({ moduleIndex: index, testAdded });
  };

  searchFilterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  renderCardContent = () => {
    const { loading, tests, windowWidth, history, match, userId, mode, interestedCurriculums } = this.props;
    const { blockStyle, selectedTests } = this.state;

    if (loading) {
      return <Spin size="large" />;
    }
    if (tests.length < 1) {
      return (
        <NoDataNotification
          heading={"Tests not available"}
          description={`There are no tests found for this filter. You can create new item by clicking the "AUTHOR TEST" button.`}
        />
      );
    }
    const GridCountInARow = windowWidth >= 1600 ? 4 : 3;
    const countModular = new Array(GridCountInARow - (tests.length % GridCountInARow)).fill(1);

    if (blockStyle === "tile") {
      return (
        <Row type="flex" justify={windowWidth > 575 ? "space-between" : "center"}>
          {tests.map((item, index) => (
            <CardWrapper
              item={item}
              key={index}
              owner={item.authors && item.authors.some(x => x._id === userId)}
              blockStyle="tile"
              windowWidth={windowWidth}
              history={history}
              match={match}
              standards={getInterestedStandards(item.summary, interestedCurriculums)}
            />
          ))}

          {windowWidth > 1024 && countModular.map(index => <CardBox key={index} />)}
        </Row>
      );
    }

    return (
      <Row>
        {tests.map(item => (
          <CardWrapper
            key={item._id}
            owner={item.authors && item.authors.some(x => x._id === userId)}
            item={item}
            windowWidth={windowWidth}
            history={history}
            match={match}
            mode={mode}
            removeTestFromPlaylist={this.handleRemoveTest}
            isTestAdded={selectedTests ? selectedTests.includes(item._id) : false}
            addTestToPlaylist={this.handleAddTests}
            standards={getInterestedStandards(item.summary, interestedCurriculums)}
          />
        ))}
      </Row>
    );
  };

  handleLabelSearch = e => {
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const {
      history,
      receiveTests,
      limit,
      mode,
      testFilters,
      updateTestFilters,
      defaultGrades,
      defaultSubject,
      playlistPage,
      playlist: { _id }
    } = this.props;
    let updatedKeys = { ...testFilters };

    if (filter === filterMenuItems[0].filter) {
      updatedKeys = {
        ...updatedKeys,
        status: ""
      };
    }

    updatedKeys["filter"] = filter;
    this.updateFilterState(updatedKeys, true);

    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    const queryParams = qs.stringify(pickBy({ ...updatedKeys, page: 1, limit }, identity));
    history.push(locToPush);
    receiveTests({
      page: 1,
      limit,
      search: updatedKeys
    });
  };

  render() {
    const {
      page,
      limit,
      defaultGrades,
      interestedGrades,
      defaultSubject,
      interestedSubjects,
      count,
      creating,
      mode,
      playlist,
      addModuleToPlaylist,
      testFilters
    } = this.props;

    const {
      blockStyle,
      isShowFilter,

      showAddTestInModules,
      showCreateModuleModal,
      showConfirmRemoveModal
    } = this.state;

    const search = {
      ...testFilters
    };

    let modulesList = [];
    if (playlist) {
      modulesList = playlist.modules;
    }
    const { from, to } = helpers.getPaginationInfo({ page, limit, count });
    return (
      <>
        <RemoveTestModal
          isVisible={showConfirmRemoveModal}
          onClose={this.onCloseConfirmRemoveModal}
          handleRemove={this.removeTestFromPlaylist}
        />
        {mode !== "embedded" && (
          <ListHeader
            onCreate={this.handleCreate}
            creating={creating}
            title="Test Library"
            btnTitle="Author Test"
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
        )}
        <Container>
          <MobileFilter>
            <Input
              placeholder="Search by skills and keywords"
              onChange={this.handleSearchInputChange}
              size="large"
              value={testFilters.searchString}
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
                search={search}
                handleLabelSearch={this.handleLabelSearch}
                onChange={this.handleFiltersChange}
                clearFilter={this.handleClearFilter}
                searchFilterOption={this.searchFilterOption}
                filterMenuItems={filterMenuItems}
              />
            </SearchModalContainer>
          </Modal>

          {showCreateModuleModal && (
            <Modal
              open={showCreateModuleModal}
              title="Add Module"
              onClose={this.onCloseCreateModule}
              footer={null}
              style={{ minWidth: "640px", padding: "20px" }}
            >
              <AddUnitModalBody
                destinationCurriculumSequence={playlist}
                addModuleToPlaylist={addModuleToPlaylist}
                handleAddModule={this.onCloseCreateModule}
                newModule={{ name: "New Module", afterModuleId: 0 }}
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
                        value={testFilters.searchString}
                      />
                      <TestListFilters
                        search={search}
                        handleLabelSearch={this.handleLabelSearch}
                        onChange={this.handleFiltersChange}
                        clearFilter={this.handleClearFilter}
                        searchFilterOption={this.searchFilterOption}
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
                {mode === "embedded" && (
                  <StyledButton
                    data-cy="createNewItem"
                    type="secondary"
                    size="large"
                    onClick={this.handleCreateNewModule}
                  >
                    <IconPlusCircle color={themeColor} width={15} height={15} />
                    <span>Add Module</span>
                  </StyledButton>
                )}
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
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      userId: get(state, "user.user._id", false),
      testFilters: getTestsFilterSelector(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      receiveTests: receiveTestsAction,
      addModuleToPlaylist: createNewModuleAction,
      addTestToModule: createTestInModuleAction,
      clearDictStandards: clearDictStandardsAction,
      clearSelectedItems: clearSelectedItemsAction,
      clearCreatedItems: clearCreatedItemsAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
      removeTestFromPlaylistAction: removeTestFromPlaylistAction,
      getAllTags: getAllTagsAction,
      clearTestData: clearTestDataAction,
      updateTestFilters: updateTestSearchFilterAction,
      updateAllTestFilters: updateAllTestSearchFilterAction,
      clearAllFilters: clearTestFiltersAction
    }
  )
);

export default enhance(TestList);
