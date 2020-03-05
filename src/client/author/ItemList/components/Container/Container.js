import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";
import { withWindowSizes } from "@edulastic/common";
import { IconItemLibrary } from "@edulastic/icons";
import { withNamespaces } from "@edulastic/localization";
import { Pagination, Spin } from "antd";
import { debounce, omit } from "lodash";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import FeaturesSwitch from "../../../../features/components/FeaturesSwitch";
import { updateDefaultGradesAction, updateDefaultSubjectAction } from "../../../../student/Login/ducks";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";
import { createTestItemAction } from "../../../src/actions/testItem";
import FilterToggleBtn from "../../../src/components/common/FilterToggleBtn";
import ListHeader from "../../../src/components/common/ListHeader";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { getTestItemCreatingSelector } from "../../../src/selectors/testItem";
import {
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  getInterestedCurriculumsSelector,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector,
  getUserFeatures
} from "../../../src/selectors/user";
import { ItemsMenu, PaginationInfo } from "../../../TestList/components/Container/styled";
import {
  clearFilterStateAction,
  clearSelectedItemsAction,
  filterMenuItems,
  getSearchFilterStateSelector,
  getTestItemsLoadingSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  initalSearchState,
  receiveTestItemsAction,
  updateSearchFilterStateAction
} from "../../../TestPage/components/AddItems/ducks";
import {
  getAllTagsAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  setDefaultTestDataAction
} from "../../../TestPage/ducks";
import { approveOrRejectMultipleItem, createTestFromCartAction } from "../../ducks";
import Actions from "../Actions";
import SelectCollectionModal from "../Actions/SelectCollection";
import CartButton from "../CartButton/CartButton";
import ItemFilter from "../ItemFilter/ItemFilter";
import ItemListContainer from "./ItemListContainer";
import {
  Container,
  ContentWrapper,
  Element,
  ListItems,
  MobileFilterIcon,
  PaginationContainer,
  ScrollbarContainer
} from "./styled";

// container the main entry point to the component
class Contaier extends Component {
  state = {
    isShowFilter: true
  };

  componentDidMount() {
    const {
      receiveItems,
      curriculums,
      getCurriculums,
      getCurriculumStandards,
      match = {},
      limit,
      setDefaultTestData,
      clearSelectedItems,
      search: initSearch,
      getAllTags,
      history
    } = this.props;
    const isAuthoredNow = history?.location?.state?.isAuthoredNow;
    const applyAuthoredFilter = isAuthoredNow ? { filter: "AUTHORED_BY_ME" } : {};
    const { params = {} } = match;
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters[itemList]")) || {};
    const search = {
      ...initSearch,
      ...sessionFilters,
      ...applyAuthoredFilter,
      subject: sessionFilters?.subject || initSearch.subject,
      grades: sessionFilters?.grades?.length ? sessionFilters.grades : initSearch.grades
    };
    setDefaultTestData();
    clearSelectedItems();
    getAllTags({ type: "testitem" });
    if (params.filterType) {
      const getMatchingObj = filterMenuItems.filter(item => item.path === params.filterType);
      const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
      let updatedSearch = { ...search };
      if (filter === filterMenuItems[0].filter) {
        updatedSearch = { ...updatedSearch, status: "" };
      }
      this.updateFilterState({
        ...updatedSearch,
        filter
      });
      receiveItems({ ...updatedSearch, filter }, 1, limit);
    } else {
      this.updateFilterState(search);
      receiveItems(search, 1, limit);
    }
    if (curriculums.length === 0) {
      getCurriculums();
    }
    if (search.curriculumId) {
      getCurriculumStandards(search.curriculumId, search.grades, "");
    }
  }

  updateFilterState = newSearch => {
    const { updateSearchFilterState } = this.props;
    updateSearchFilterState(newSearch);
    sessionStorage.setItem("filters[itemList]", JSON.stringify(newSearch));
  };

  handleSearch = searchState => {
    const { limit, receiveItems, userFeatures } = this.props;
    let search = searchState || this.props.search;
    if (!userFeatures.isCurator) search = omit(search, "authoredByIds");
    receiveItems(search, 1, limit);
  };

  handleLabelSearch = e => {
    const { limit, receiveItems, history, search } = this.props;
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    let updatedSearch = { ...search };
    if (filter === filterMenuItems[0].filter) {
      updatedSearch = {
        ...updatedSearch,
        status: ""
      };
    }
    this.updateFilterState({
      ...updatedSearch,
      filter
    });
    receiveItems({ ...updatedSearch, filter }, 1, limit);
    history.push(`/author/items/filter/${filterType}`);
  };

  handleClearSearch = () => {
    const { clearFilterState, limit, receiveItems } = this.props;

    clearFilterState();

    this.updateFilterState(initalSearchState);
    receiveItems(initalSearchState, 1, limit);
  };

  handleSearchFieldChangeCurriculumId = value => {
    const { clearDictStandards, getCurriculumStandards, search } = this.props;
    clearDictStandards();
    const updatedSearchValue = {
      ...search,
      curriculumId: value,
      standardIds: []
    };
    this.updateFilterState(updatedSearchValue);
    this.handleSearch(updatedSearchValue);
    getCurriculumStandards(value, search.grades, "");
  };

  handleSearchFieldChange = fieldName => (value, dateString) => {
    const {
      updateDefaultGrades,
      udpateDefaultSubject,
      clearDictStandards,
      getCurriculumStandards,
      search
    } = this.props;
    let updatedKeys = {};
    if (fieldName === "curriculumId") {
      this.handleSearchFieldChangeCurriculumId(value);
      return;
    }
    if (fieldName === "grades" && search.curriculumId) {
      clearDictStandards();
      getCurriculumStandards(search.curriculumId, value, "");
    }
    if (fieldName === "subject") {
      clearDictStandards();
      storeInLocalStorage("defaultSubject", value);
      udpateDefaultSubject(value);
      updatedKeys = {
        ...search,
        [fieldName]: value,
        curriculumId: "",
        standardIds: []
      };
    }
    if (fieldName === "createdAt") {
      updatedKeys = {
        ...search,
        [fieldName]: value ? moment(dateString, "DD/MM/YYYY").valueOf() : ""
      };
    } else {
      updatedKeys = {
        ...search,
        [fieldName]: value
      };
    }

    if (fieldName === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
    }

    this.updateFilterState(updatedKeys);
    this.handleSearch(updatedKeys);
  };

  searchDebounce = debounce(this.handleSearch, 500);

  handleSearchInputChange = e => {
    const { search } = this.props;
    const searchString = e.target.value;
    const updatedKeys = {
      ...search,
      searchString
    };

    this.updateFilterState(updatedKeys);
    this.searchDebounce();
  };

  handleCreate = async () => {
    const { createItem } = this.props;
    createItem({
      rows: [
        {
          tabs: [],
          dimension: "100%",
          widgets: [],
          flowLayout: false,
          content: ""
        }
      ]
    });
  };

  handlePaginationChange = page => {
    const { search } = this.props;
    const { receiveItems, limit } = this.props;
    receiveItems(search, page, limit);
  };

  renderPagination = () => {
    const { count, page } = this.props;
    return (
      <Pagination
        simple={false}
        showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
        onChange={this.handlePaginationChange}
        defaultPageSize={10}
        total={count}
        current={page}
      />
    );
  };

  toggleFilter = () => {
    const { isShowFilter } = this.state;

    this.setState({
      isShowFilter: !isShowFilter
    });
  };

  rejectNumberChecker = testItems => {
    let count = 0;
    for (const i of testItems) {
      if (i.status === "inreview") {
        count++;
      }
    }
    return count;
  };

  approveNumberChecker = testItems => {
    let count = 0;
    for (const i of testItems) {
      if (i.status === "inreview" || i.status === "rejected") {
        count++;
      }
    }
    return count;
  };

  renderCartButton = () => (
    <>
      <CartButton
        onClick={() => {
          const { createTestFromCart } = this.props;
          createTestFromCart();
        }}
        buttonText="New Test"
      />
      <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
        <CartButton
          onClick={() => {
            const { approveOrRejectMultipleItem } = this.props;
            approveOrRejectMultipleItem({ status: "rejected" });
          }}
          buttonText="Reject"
          numberChecker={this.rejectNumberChecker}
        />
        <CartButton
          onClick={() => {
            const { approveOrRejectMultipleItem } = this.props;
            approveOrRejectMultipleItem({ status: "published" });
          }}
          buttonText="Approve"
          numberChecker={this.approveNumberChecker}
        />
      </FeaturesSwitch>
    </>
  );

  renderFilterIcon = isShowFilter => <FilterToggleBtn isShowFilter={isShowFilter} toggleFilter={this.toggleFilter} />;

  render() {
    const {
      windowWidth,
      creating,
      t,
      getCurriculumStandards,
      curriculumStandards,
      loading,
      count,
      search
    } = this.props;

    const { isShowFilter } = this.state;

    return (
      <div>
        <SelectCollectionModal contentType="TESTITEM" />
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title="common.itemBank"
          titleIcon={IconItemLibrary}
          renderExtra={this.renderCartButton}
          renderFilterIcon={this.renderFilterIcon}
        />
        <Container>
          {(windowWidth < SMALL_DESKTOP_WIDTH ? !isShowFilter : isShowFilter) && (
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
              items={filterMenuItems}
              toggleFilter={this.toggleFilter}
              t={t}
            />
          )}
          <ListItems isShowFilter={isShowFilter}>
            <Element>
              <MobileFilterIcon> {this.renderFilterIcon(isShowFilter)} </MobileFilterIcon>
              <ContentWrapper borderRadius="0px" padding="0px">
                {loading && <Spin size="large" />}
                {!loading && (
                  <>
                    <ItemsMenu>
                      <PaginationInfo>
                        <span>{count}</span> QUESTIONS FOUND
                      </PaginationInfo>
                      <Actions type="TESTITEM" />
                    </ItemsMenu>

                    <ScrollbarContainer>
                      <ItemListContainer history={history} windowWidth={windowWidth} search={search} />
                      {count > 10 && <PaginationContainer>{this.renderPagination()}</PaginationContainer>}
                    </ScrollbarContainer>
                  </>
                )}
              </ContentWrapper>
            </Element>
          </ListItems>
        </Container>
      </div>
    );
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
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
  getCurriculums: PropTypes.func.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  clearDictStandards: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setDefaultTestData: PropTypes.func.isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
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
      passageItems: state.tests.passageItems || [],
      userFeatures: getUserFeatures(state)
    }),
    {
      receiveItems: receiveTestItemsAction,
      createItem: createTestItemAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      setDefaultTestData: setDefaultTestDataAction,
      udpateDefaultSubject: updateDefaultSubjectAction,
      updateDefaultGrades: updateDefaultGradesAction,
      clearSelectedItems: clearSelectedItemsAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      getAllTags: getAllTagsAction,
      createTestFromCart: createTestFromCartAction,
      updateSearchFilterState: updateSearchFilterStateAction,
      clearFilterState: clearFilterStateAction,
      approveOrRejectMultipleItem
    }
  )
);

export default enhance(Contaier);
