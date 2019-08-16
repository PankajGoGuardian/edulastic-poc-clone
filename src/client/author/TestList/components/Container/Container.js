import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce, get, has } from "lodash";
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
  StyleChangeWrapper
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
import { getTestsCreatingSelector, clearTestDataAction, clearCreatedItemsAction } from "../../../TestPage/ducks";
import { clearSelectedItemsAction } from "../../../TestPage/components/AddItems/ducks";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";

import ListHeader from "../../../src/components/common/ListHeader";
import TestListFilters from "./TestListFilters";
import AddTestModal from "../../../PlaylistPage/components/AddTestsModal/AddTestModal";
import AddUnitModalBody from "../../../CurriculumSequence/components/AddUnitModalBody";
import { ItemsMenu, StyledButton } from "../../../TestPage/components/AddItems/styled";
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

export const filterMenuItems = [
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
  collectionName: "",
  curriculumId: "",
  status: "",
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
    search: getClearSearchState(),
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
      limit,
      location,
      playlist,
      mode,
      defaultGrades,
      defaultSubject,
      interestedGrades = [],
      interestedSubjects = [],
      match: { params = {} },
      getCurriculumStandards,
      clearCreatedItems,
      clearSelectedItems,
      clearDictStandards
    } = this.props;
    const { search } = this.state;
    const parsedQueryData = qs.parse(location.search);
    if (mode === "embedded") {
      let selectedTests = [];
      const { grades, subjects, tags, modules } = playlist;
      const { state = {} } = location;
      const { editFlow } = state;
      modules.forEach(mod => {
        mod.data.forEach(test => {
          selectedTests.push(test.contentId);
        });
      });
      this.setState(prevState => ({
        search: {
          ...prevState.search,
          subject: subjects && subjects[0],
          grades,
          tags
        },
        selectedTests,
        editFlow,
        blockStyle: "horizontal"
      }));
      receiveTests({
        page: 1,
        limit,
        search: {
          ...search,
          subject: subjects && subjects[0],
          grades,
          tags
        }
      });
    } else {
      if (!curriculums.length) {
        getCurriculums();
      }
      const { filterType } = params;
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
        receiveTests({
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
        receiveTests({
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
        receiveTests({ page: 1, limit, search: { ...search, grades, subject } });
      }
    }
    if (parsedQueryData.curriculumId) {
      const { curriculumId, grades } = parsedQueryData;
      const gradeArray = Array.isArray(grades) ? grades : [grades];
      clearDictStandards();
      getCurriculumStandards(curriculumId, gradeArray, "");
    }
    clearCreatedItems();
    clearSelectedItems();
  }

  searchTest = debounce(() => {
    const { receiveTests, limit } = this.props;
    const { search } = this.state;

    receiveTests({
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
    const {
      receiveTests,
      clearDictStandards,
      history,
      limit,
      page,
      mode,
      getCurriculumStandards,
      updateDefaultGrades,
      updateDefaultSubject
    } = this.props;
    let updatedKeys = {};
    if (name === "curriculumId") {
      clearDictStandards();
      getCurriculumStandards(value, search.grades, "");
      search.standardIds = [];
    }
    if (name === "grades" && search.curriculumId) {
      clearDictStandards();
      getCurriculumStandards(search.curriculumId, value, "");
    }
    if (name === "subject") {
      updatedKeys = {
        ...search,
        [name]: value,
        curriculumId: ""
      };
      updateDefaultSubject(value);
      storeInLocalStorage("defaultSubject", value);
      clearDictStandards();
    } else {
      updatedKeys = {
        ...search,
        [name]: value
      };
    }
    if (name === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
    }
    this.setState(
      {
        search: updatedKeys
      },
      () => {
        const { search: updatedSearch } = this.state;
        receiveTests({ search: updatedSearch, page: 1, limit });
        if (mode !== "embedded") {
          history.push(`/author/tests/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
        }
      }
    );
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

  handlePaginationChange = page => {
    const { receiveTests, limit, history, mode } = this.props;
    const { search } = this.state;

    receiveTests({ page, limit, search });
    if (mode !== "embedded") {
      history.push(`/author/tests/limit/${limit}/page/${page}/filter?${this.filterUrl}`);
    }
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
    const { receiveTests, limit, history, mode } = this.props;
    const { search } = this.state;
    receiveTests({ page: 1, limit, search });
    if (mode !== "embedded") {
      history.push(`/author/tests`);
    }
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
      getCurriculumStandards,
      receiveTests,
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
          search: { curriculumId, grade },
          search: updatedSearch
        } = this.state;
        if (curriculumId.length && parsedQueryData.standardQuery.length >= 2) {
          getCurriculumStandards(curriculumId, grade, parsedQueryData.standardQuery);
        }
        receiveTests({
          page: Number(params.page),
          limit: Number(params.limit),
          search: updatedSearch
        });
      }
    );
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
          description={`There are no tests found for this filter.You can create new item by clicking the "AUTHOR TEST" button.`}
        />
      );
    }

    if (blockStyle === "tile") {
      return (
        <Row gutter={24} type="flex">
          {tests.map((item, index) => (
            <CardWrapper
              item={item}
              key={index}
              owner={item.authors && item.authors.some(x => x._id === userId)}
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
        {tests.map((item, index) => (
          <CardWrapper
            key={index}
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
    const { history, receiveTests, limit, mode } = this.props;
    const { search } = this.state;
    let updatedKeys = { ...search };
    if (mode !== "embedded") {
      history.push(`/author/tests/filter/${filterType}`);
    }
    if (filter === filterMenuItems[0].filter) {
      updatedKeys = {
        ...updatedKeys,
        status: ""
      };
    }
    this.setState({
      search: {
        ...updatedKeys,
        filter
      }
    });
    receiveTests({
      page: 1,
      limit,
      search: {
        ...updatedKeys,
        filter
      }
    });
  };

  render() {
    const { page, limit, count, creating, mode, playlist, addModuleToPlaylist } = this.props;

    const {
      blockStyle,
      isShowFilter,
      search,
      showAddTestInModules,
      showCreateModuleModal,
      showConfirmRemoveModal
    } = this.state;
    const { searchString } = search;
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
        )}
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
                        value={searchString}
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
      t: PropTypes.func.isRequired
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
      clearTestData: clearTestDataAction
    }
  )
);

export default enhance(TestList);
