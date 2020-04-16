import React, { Component } from "react";
import { connect } from "react-redux";
import { debounce, get, has, pickBy, identity, pick } from "lodash";
import * as qs from "query-string";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { compose } from "redux";
import moment from "moment";
import { Button, Row, Spin, message, Dropdown, Menu } from "antd";
import Modal from "react-responsive-modal";
import { withWindowSizes, FlexContainer, TextInputStyled } from "@edulastic/common";
import { IconList, IconTile, IconTestBank } from "@edulastic/icons";
import { greyish, greyLight1, greyThemeLight } from "@edulastic/colors";
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
  CardBox,
  StyledCountText,
  ItemsMenu,
  SearchInput
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
  emptyFilters,
  addTestToCartAction,
  removeTestFromCartAction,
  approveOrRejectMultipleTestsRequestAction
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
import AddBulkTestModal from "../../../PlaylistPage/components/AddBulkTestModal/AddBulkTestModal";
import DeleteBulkTestModal from "../../../PlaylistPage/components/DeleteBulkTestModal/DeleteBulkTestModal";
import ManageModulesModalBody from "../../../CurriculumSequence/components/modals/ManageModulesModalBody";
import { StyledButton, BtnActionsContainer } from "../../../TestPage/components/AddItems/styled";
import {
  createNewModuleAction,
  updateModuleAction,
  deleteModuleAction,
  resequenceModulesAction,
  createTestInModuleAction,
  addTestToModuleInBulkAction,
  deleteTestFromModuleInBulkAction,
  removeTestFromPlaylistAction
} from "../../../PlaylistPage/ducks";
import RemoveTestModal from "../../../PlaylistPage/components/RemoveTestModal/RemoveTestModal";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import {
  getInterestedCurriculumsSelector,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector,
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getUserFeatures
} from "../../../src/selectors/user";
import { getInterestedStandards, getDefaultInterests, setDefaultInterests } from "../../../dataUtils";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../../../student/Login/ducks";
import CartButton from "../CartButton/cartButton";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";

import Actions from "../../../ItemList/components/Actions";
import SelectCollectionModal from "../../../ItemList/components/Actions/SelectCollection";
import { withNamespaces } from "react-i18next";
import HeaderFilter from "../../../ItemList/components/HeaderFilter";
import { getFromSessionStorage } from "@edulastic/api/src/utils/Storage";

// TODO: split into mulitple components, for performance sake.
// and only connect what is required.
// like seprating out filter and test rendering into two, and connect them to only what is required.

const setBlockstyleInSession = blockstyle => {
  sessionStorage.setItem("testLibraryBlockstyle", blockstyle);
};

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
    clearCreatedItems: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func,
    playlist: PropTypes.object.isRequired,
    mode: PropTypes.string.isRequired,
    getAllTags: PropTypes.func.isRequired,
    testFilters: PropTypes.object.isRequired
  };

  static defaultProps = {
    clearSelectedItems: () => null,
    clearTestData: () => null
  };

  state = {
    standardQuery: "",
    blockstyle: "tile",
    showCreateModuleModal: false,
    showManageModuleModal: false,
    showConfirmRemoveModal: false,
    showAddTestInModules: false,
    showAddModules: false,
    selectedTests: [],
    isShowFilter: false,
    markedTests: [],
    moduleModalAdd: null
  };

  static getDerivedStateFromProps = (props, prevState) => {
    const { features, mode } = props;
    const localBlockstyle = getFromSessionStorage("testLibraryBlockstyle");
    if (localBlockstyle) {
      return {
        ...prevState,
        blockstyle: localBlockstyle
      };
    } else if (features.isCurator && mode !== "embedded") {
      setBlockstyleInSession("horizontal");
      return {
        ...prevState,
        blockstyle: "horizontal"
      };
    }
    setBlockstyleInSession("tile");
    return prevState;
  };

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
      clearCreatedItems,
      clearSelectedItems,
      getAllTags,
      testFilters,
      clearDictStandards,
      history,
      interestedSubjects,
      interestedGrades,
      interestedCurriculums: [firstCurriculum]
    } = this.props;
    const {
      subject = interestedSubjects?.[0] || "",
      grades = interestedGrades || [],
      curriculumId = firstCurriculum && firstCurriculum.subject === interestedSubjects?.[0] ? firstCurriculum._id : ""
    } = getDefaultInterests();
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters[testList]")) || {};
    const searchFilters = {
      ...testFilters,
      ...sessionFilters,
      subject,
      grades,
      curriculumId: parseInt(curriculumId) || ""
    };

    // propagate filter from query params to the store (test.filters)
    let searchParams = qs.parse(location.search);
    searchParams = this.typeCheck(searchParams, searchFilters);
    if (Object.keys(searchParams).length) {
      searchParams.curriculumId = Number(searchParams.curriculumId) || searchFilters.curriculumId || "";
      searchParams.standardIds = searchParams.standardIds ? searchParams.standardIds.map(id => parseInt(id)) : [];
      Object.assign(searchFilters, pick(searchParams, Object.keys(testFilters)));
    }

    this.updateFilterState(searchFilters, true);

    if (mode === "embedded") {
      const selectedTests = [];
      const { modules } = playlist;
      const { state = {} } = location;
      const { editFlow } = state;
      modules?.forEach(mod => {
        mod.data.forEach(test => {
          selectedTests.push(test.contentId);
        });
      });
      this.setState({
        selectedTests,
        editFlow,
        blockstyle: "horizontal"
      });
      setBlockstyleInSession("horizontal");
      receiveTests({
        page: 1,
        limit,
        search: searchFilters
      });
    } else {
      if (!curriculums.length) {
        getCurriculums();
      }
      const pageNumber = params.page || page;
      const limitCount = params.limit || limit;
      const queryParams = qs.stringify(pickBy({ ...searchFilters, page: pageNumber, limit: limitCount }, identity));
      history.push(`/author/tests?${queryParams}`);
      receiveTests({ page: 1, limit, search: searchFilters });
      getAllTags({ type: "test" });
    }

    if (searchFilters.curriculumId) {
      const { curriculumId, grades: curriculumGrades = [] } = searchFilters;
      clearDictStandards();
      getCurriculumStandards(curriculumId, curriculumGrades, "");
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
    const { receiveTests, limit, history, playlistPage, playlist: { _id } = {} } = this.props;
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
      playlist: { _id } = {}
    } = this.props;

    // all the fields to pass for search.

    let updatedKeys = {
      ...testFilters
    };

    if (name === "grades" || name === "subject" || name === "curriculumId") {
      setDefaultInterests({ [name]: value });
    }

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
    }
    if (name === "createdAt") {
      updatedKeys = {
        ...updatedKeys,
        [name]: value ? moment(dateString, "DD/MM/YYYY").valueOf() : ""
      };
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
      [name]: name === "createdAt" ? updatedKeys[name] : value
    };
    this.updateFilterState(searchFilters, true);
    // update the url to reflect the newly applied filter and get the new results.
    const queryParams = qs.stringify(pickBy({ ...searchFilters, page: 1, limit }, identity));
    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
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
    const { receiveTests, limit, history, testFilters, playlistPage, playlist: { _id } = {} } = this.props;
    const searchFilters = {
      ...testFilters
    };

    const queryParams = qs.stringify(pickBy({ ...searchFilters, page, limit }, identity));
    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    history.push(locToPush);
    receiveTests({ page, limit, search: searchFilters });
  };

  handlePaginationChange = page => {
    this.updateTestList(page);
  };

  handleClearFilter = () => {
    const { history, mode, limit, receiveTests } = this.props;
    this.updateFilterState(emptyFilters, true);
    setDefaultInterests({ subject: "", grades: [], curriculumId: "" });
    if (mode !== "embedded") history.push(`/author/tests?filter=ENTIRE_LIBRARY&limit=${limit}&page=1`);
    receiveTests({ page: 1, limit, search: emptyFilters });
  };

  handleStyleChange = blockstyle => {
    this.setState({
      blockstyle
    });
    setBlockstyleInSession(blockstyle);
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

  handleManageModule = () => {
    this.setState({ showManageModuleModal: true });
  };

  onCloseManageModule = () => {
    this.setState({ showManageModuleModal: false });
  };

  handleSaveModule = () => {
    const { handleSave } = this.props;
    handleSave();
    this.setState({ showManageModuleModal: false });
  };

  deleteModule = id => {
    const { selectedTests } = this.state;
    const { playlist, deleteModuleFromPlaylist } = this.props;
    const moduleData = playlist?.modules?.[id]?.data?.map(x => x.contentId);
    const newSelectedTests = selectedTests?.filter(testId => !moduleData.includes(testId));
    this.setState({ selectedTests: newSelectedTests }, () => deleteModuleFromPlaylist(id));
  };

  handleAddTests = item => {
    if (!item) {
      console.error("Test data is missing while adding tests in bulk..");
      return;
    }

    if (item?.status === "draft" || item?.status === "rejected") {
      const testStatus = item?.status === "draft" ? "Draft" : "Rejected";
      message.warning(`${testStatus} tests cannot be added`);
      return;
    }

    const {
      playlist: { modules }
    } = this.props;
    if (!modules.length) {
      this.setState({ showManageModuleModal: true, moduleModalAdd: true, testAdded: item });
      message.warning("Create atleast 1 module");
    } else this.setState({ showAddTestInModules: true, testAdded: item });
  };

  handleBulkAddTests = () => {
    const { markedTests } = this.state;
    const { playlist: { modules } = {} } = this.props;
    if (modules?.length) {
      if (markedTests.length) {
        this.setState({ showAddModules: true });
      } else {
        message.warning("Select one or more tests");
      }
    } else {
      message.warning("Create atleast 1 module");
    }
  };

  handleBulkRemoveTests = () => {
    const { markedTests } = this.state;
    const { playlist: { modules } = {} } = this.props;
    if (modules?.length) {
      if (markedTests.length) {
        this.setState({ showRemoveModules: true });
      } else {
        message.warning("Select one or more tests");
      }
    } else {
      message.warning("Create atleast 1 module");
    }
  };

  handleCheckboxAction = (e, prop) => {
    const { markedTests } = this.state;
    if (e.target.checked) {
      this.setState({ markedTests: [...markedTests, prop] });
    } else {
      this.setState({ markedTests: markedTests.filter(data => data._id !== prop._id) });
    }
  };

  onCloseCreateModule = () => {
    this.setState({ showCreateModuleModal: false });
  };

  onCloseAddTestModal = () => {
    this.setState({ showAddTestInModules: false });
  };

  onCloseBulkAddTestModal = () => {
    this.setState({ showAddModules: false });
  };

  onCloseBulkDeleteTestModal = () => {
    this.setState({ showRemoveModules: false });
  };

  removeTestFromPlaylist = () => {
    const { selectedTests, removeItemId } = this.state;
    const { deleteTestFromPlaylist } = this.props;
    const newSelectedTests = selectedTests.filter(testId => testId !== removeItemId);
    deleteTestFromPlaylist({ itemId: removeItemId });
    this.setState({ selectedTests: newSelectedTests, showConfirmRemoveModal: false });
  };

  handleRemoveTest = itemId => {
    const { removeTestFromPlaylist } = this;
    this.setState({ removeItemId: itemId }, () => {
      removeTestFromPlaylist();
    });
  };

  onCloseConfirmRemoveModal = () => {
    this.setState({ showConfirmRemoveModal: false });
  };

  handleTestAdded = index => {
    const { addTestToModule, handleSave } = this.props;
    const { testAdded, selectedTests } = this.state;
    this.setState(prevState => ({
      ...prevState,
      selectedTests: [...selectedTests, testAdded._id],
      moduleModalAdd: null
    }));
    addTestToModule({ moduleIndex: index, testAdded });
    if (selectedTests.length === 0) handleSave();
  };

  handleBulkTestAdded = index => {
    const { addTestToModuleInBulk, handleSave, playlist: { modules = [] } = {}, tests = [] } = this.props;
    const { markedTests, selectedTests } = this.state;
    const addedTestIds = modules.flatMap(x => x.data.map(y => y.contentId));
    const markedIds = markedTests.map(obj => obj._id);
    const uniqueMarkedIds = markedIds.filter(x => !addedTestIds.includes(x));
    const uniqueMarkedTests = markedTests.filter(x => uniqueMarkedIds.includes(x._id));
    if (uniqueMarkedIds.length !== markedIds.length) {
      if (uniqueMarkedIds.length === 0) {
        message.warning("Selected tests already exists in this module");
        return;
      }
      if (uniqueMarkedIds.length < markedIds.length && uniqueMarkedIds.length !== 0)
        message.warning("Some of the selected tests already exists in this module");
    }

    // Dont add draft type tests
    const nonDraftTests = uniqueMarkedTests.filter(x => tests.find(y => y._id === x._id).status !== "draft");
    if (nonDraftTests.length === uniqueMarkedTests.length) {
      this.setState(() => ({
        selectedTests: [...selectedTests, ...uniqueMarkedIds],
        markedTests: []
      }));
      const uniqueMarkedTestsIds = uniqueMarkedTests.map(x => x?._id);
      const testsToAdd = tests.filter(x => uniqueMarkedTestsIds?.includes(x?._id));
      const testsWithStandardIdentifiers = testsToAdd?.map(x => {
        return {
          ...x,
          standardIdentifiers: x?.summary?.standards?.reduce((a, c) => a.concat(c?.identifier), [])
        };
      });
      addTestToModuleInBulk({ moduleIndex: index, tests: testsWithStandardIdentifiers });
      message.success("Tests Added to playlist");
    } else {
      const nonDraftIds = nonDraftTests.map(x => x._id);
      this.setState(() => ({
        selectedTests: [...selectedTests, ...nonDraftIds],
        markedTests: []
      }));
      const nonDraftTestsIds = nonDraftTests?.map(x => x?._id);
      const testsToAdd = tests.filter(x => nonDraftTestsIds?.includes(x?._id));
      const testsWithStandardIdentifiers = testsToAdd?.map(x => {
        return {
          ...x,
          standardIdentifiers: x?.summary?.standards?.reduce((a, c) => a.concat(c?.identifier), [])
        };
      });
      addTestToModuleInBulk({ moduleIndex: index, tests: testsWithStandardIdentifiers });
      nonDraftTests.length
        ? message.warning(`${nonDraftTests.length}/${markedTests.length} are added to ${modules[index].title}`)
        : message.warning("Draft test(s) cannot be added");
    }
    if (selectedTests.length === 0) handleSave();
  };

  handleBulkTestDelete = len => {
    const { deleteTestFromModuleInBulk } = this.props;
    const { markedTests, selectedTests } = this.state;
    const testIds = markedTests.map(test => test._id);
    this.setState(prevState => ({
      ...prevState,
      selectedTests: [...selectedTests.filter(x => !testIds.includes(x))],
      markedTests: []
    }));
    if (len) {
      deleteTestFromModuleInBulk({ testIds });
      message.success("Tests removed from playlist");
    } else {
      message.success("Selected tests are cleared");
    }
  };

  searchFilterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  onAddToCart = item => {
    const { addTestToCartAction } = this.props;
    addTestToCartAction(item);
  };

  onRemoveFromCart = item => {
    const { removeTestFromCartAction } = this.props;
    removeTestFromCartAction(item);
  };

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
      playlist = {}
    } = this.props;
    const { blockstyle, selectedTests, markedTests } = this.state;
    const markedTestsList = markedTests.map(data => data._id);
    const moduleTitleMap = {};
    const modulesMap =
      playlist?.modules?.map(module => ({
        title: module.title,
        data: [...module.data.map(it => it.contentId)]
      })) || [];

    const testIds = tests?.map(test => test._id) || [];
    testIds.forEach(testId => {
      for (const obj of modulesMap) {
        if (obj?.data?.includes(testId)) moduleTitleMap[testId] = obj.title;
      }
    });

    if (loading) {
      return <Spin size="large" />;
    }
    if (tests.length < 1) {
      return (
        <NoDataNotification
          heading="Tests not available"
          description={`There are no tests found for this filter. You can create new item by clicking the "AUTHOR TEST" button.`}
        />
      );
    }
    const GridCountInARow = windowWidth >= 1600 ? 4 : 3;
    const countModular = new Array(GridCountInARow - (tests.length % GridCountInARow)).fill(1);

    if (blockstyle === "tile") {
      return (
        <Row type="flex" justify={windowWidth > 575 ? "space-between" : "center"}>
          {tests.map((item, index) => (
            <>
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
            </>
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
            moduleTitle={moduleTitleMap[item._id]}
            checked={markedTestsList.includes(item._id)}
            handleCheckboxAction={this.handleCheckboxAction}
            onRemoveFromCart={this.onRemoveFromCart}
            onAddToCart={this.onAddToCart}
          />
        ))}
      </Row>
    );
  };

  handleLabelSearch = e => {
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const { history, receiveTests, limit, testFilters, playlistPage, playlist: { _id } = {} } = this.props;
    let updatedKeys = { ...testFilters };

    if (filter === filterMenuItems[0].filter) {
      updatedKeys = {
        ...updatedKeys,
        status: ""
      };
    }

    updatedKeys.filter = filter;
    this.updateFilterState(updatedKeys, true);

    const queryParams = qs.stringify(pickBy({ ...updatedKeys, page: 1, limit }, identity));
    const locToPush = playlistPage ? `/author/playlists/${_id}/edit` : `/author/tests?${queryParams}`;
    history.push(locToPush);
    receiveTests({
      page: 1,
      limit,
      search: updatedKeys
    });
  };

  rejectNumberChecker = tests => {
    let num = 0;
    for (const o of tests) {
      if (o.status === "inreview") {
        num++;
      }
    }
    return num;
  };

  approveNumberChecker = tests => {
    let num = 0;
    for (const o of tests) {
      if (o.status === "inreview" || o.status === "rejected") {
        num++;
      }
    }
    return num;
  };

  renderExtra = () => (
    <>
      <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
        <CartButton
          onClick={() => {
            const { approveOrRejectMultipleTestsRequestAction } = this.props;
            approveOrRejectMultipleTestsRequestAction({ status: "rejected" });
          }}
          buttonText="Reject"
          numberChecker={this.rejectNumberChecker}
        />
        <CartButton
          onClick={() => {
            const { approveOrRejectMultipleTestsRequestAction } = this.props;
            approveOrRejectMultipleTestsRequestAction({ status: "published" });
          }}
          buttonText="Approve"
          numberChecker={this.approveNumberChecker}
        />
      </FeaturesSwitch>
    </>
  );

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
      handleSave,
      t
    } = this.props;

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
      testAdded
    } = this.state;
    const search = {
      ...testFilters
    };

    let modulesList = [];
    if (playlist) {
      modulesList = playlist.modules;
    }

    const menu = (
      <Menu>
        <Menu.Item key="0" data-cy="addToModule" onClick={this.handleBulkAddTests}>
          Add to Module
        </Menu.Item>
        <Menu.Item key="1" data-cy="removeFromModule" onClick={this.handleBulkRemoveTests}>
          Remove from Modules
        </Menu.Item>
      </Menu>
    );

    const counts = [];
    markedTests.forEach(({ _id }) => {
      playlist?.modules?.forEach((module, i) => {
        if (module?.data.map(x => x.contentId).includes(_id)) {
          if (counts[i]) counts[i]++;
          else counts[i] = 1;
        }
      });
    });

    const modulesNamesCountMap = counts.map((item, i) => ({
      count: item,
      mName: playlist?.modules[i]?.title
    }));

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
            title={t("common.testLibrary")}
            titleIcon={IconTestBank}
            btnTitle="New Test"
            renderFilter={() => (
              <StyleChangeWrapper>
                <IconTile
                  data-cy="tileView"
                  onClick={() => this.handleStyleChange("tile")}
                  width={18}
                  height={18}
                  color={blockstyle === "tile" ? greyThemeLight : greyLight1}
                />
                <IconList
                  data-cy="listView"
                  onClick={() => this.handleStyleChange("horizontal")}
                  width={18}
                  height={18}
                  color={blockstyle === "horizontal" ? greyThemeLight : greyLight1}
                />
              </StyleChangeWrapper>
            )}
            renderExtra={this.renderExtra}
          />
        )}
        <Container>
          <MobileFilter>
            <TextInputStyled
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

          {showManageModuleModal && (
            <Modal
              open={showManageModuleModal}
              title="Manage Modules"
              onClose={this.onCloseManageModule}
              footer={null}
              styles={{ modal: { minWidth: "800px", padding: "20px", background: greyish } }}
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

          <FlexContainer>
            <Filter>
              <AffixWrapper>
                <ScrollbarWrapper>
                  <PerfectScrollbar>
                    <ScrollBox>
                      <SearchInput
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
              <ItemsMenu justifyContent="space-between">
                <PaginationInfo>
                  <span>{count}</span> TESTS FOUND
                </PaginationInfo>

                <HeaderFilter search={search} handleCloseFilter={this.handleFiltersChange} type="test" />

                {mode === "embedded" && (
                  <BtnActionsContainer>
                    <StyledCountText>
                      {playlist.modules?.flatMap(item => item?.data || [])?.length} TESTS SELECTED
                    </StyledCountText>
                    <StyledButton data-cy="createNewItem" type="secondary" size="large" onClick={() => {}}>
                      <Dropdown overlay={menu} trigger={["click"]} placement="bottomCenter">
                        <a data-cy="moduleActions" className="ant-dropdown-link" href="#">
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
                {mode !== "embedded" && blockstyle === "horizontal" && <Actions type="TEST" />}
              </ItemsMenu>
              <PerfectScrollbar style={{ padding: "0 20px" }}>
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
        </Container>
      </>
    );
  }
}

const enhance = compose(
  withWindowSizes,
  withNamespaces("header"),
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
      testFilters: getTestsFilterSelector(state),
      features: getUserFeatures(state)
    }),
    {
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      receiveTests: receiveTestsAction,
      addModuleToPlaylist: createNewModuleAction,
      updateModuleInPlaylist: updateModuleAction,
      deleteModuleFromPlaylist: deleteModuleAction,
      resequenceModules: resequenceModulesAction,
      addTestToModule: createTestInModuleAction,
      addTestToModuleInBulk: addTestToModuleInBulkAction,
      deleteTestFromModuleInBulk: deleteTestFromModuleInBulkAction,
      clearDictStandards: clearDictStandardsAction,
      clearSelectedItems: clearSelectedItemsAction,
      clearCreatedItems: clearCreatedItemsAction,
      updateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
      deleteTestFromPlaylist: removeTestFromPlaylistAction,
      getAllTags: getAllTagsAction,
      clearTestData: clearTestDataAction,
      updateTestFilters: updateTestSearchFilterAction,
      updateAllTestFilters: updateAllTestSearchFilterAction,
      clearAllFilters: clearTestFiltersAction,
      addTestToCartAction,
      removeTestFromCartAction,
      approveOrRejectMultipleTestsRequestAction
    }
  )
);

export default enhance(TestList);
