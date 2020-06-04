import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { debounce, uniq, get } from "lodash";
import { Pagination, Spin } from "antd";
import { roleuser } from "@edulastic/constants";
import { withWindowSizes, FlexContainer, notification } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconPlusCircle, IconItemGroup } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { StyledButton, ItemsPagination, Selected } from "./styled";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  clearDictAlignmentAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";
import { createTestItemAction } from "../../../src/actions/testItem";
import FilterToggleBtn from "../../../src/components/common/FilterToggleBtn";
import {
  getTestItemsLoadingSelector,
  getTestItemsSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  receiveTestItemsAction,
  setTestItemsAction,
  getSelectedItemSelector,
  getSearchFilterStateSelector,
  updateSearchFilterStateAction,
  clearFilterStateAction,
  filterMenuItems,
  initalSearchState
} from "./ducks";
import {
  setAndSavePassageItemsAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  setTestDataAndUpdateAction,
  getAllTagsAction,
  setCurrentGroupIndexAction
} from "../../ducks";
import ItemFilter from "../../../ItemList/components/ItemFilter/ItemFilter";
import {
  Container,
  ListItems,
  Element,
  PaginationContainer,
  ContentWrapper,
  ScrollbarContainer,
  MobileFilterIcon
} from "../../../ItemList/components/Container/styled";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";
import {
  getInterestedCurriculumsSelector,
  getUserId,
  getUserFeatures,
  getInterestedGradesSelector,
  getInterestedSubjectsSelector
} from "../../../src/selectors/user";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import Item from "../../../ItemList/components/Item/Item";
import { PaginationInfo, ItemsMenu } from "../../../TestList/components/Container/styled";
import { getDefaultInterests, setDefaultInterests } from "../../../dataUtils";
import HeaderFilter from "../../../ItemList/components/HeaderFilter";
import PreviewModal from "../../../src/components/common/PreviewModal";

class AddItems extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    receiveTestItems: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    windowWidth: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
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
    onSaveTestId: PropTypes.func.isRequired,
    createTestItem: PropTypes.func.isRequired,
    gotoSummary: PropTypes.func.isRequired
  };

  state = {
    itemIndexForPreview: null
  };

  componentDidMount() {
    const {
      getCurriculums,
      receiveTestItems,
      getCurriculumStandards,
      limit,
      test,
      curriculums,
      getAllTags,
      search: initSearch,
      history,
      interestedSubjects,
      interestedGrades,
      interestedCurriculums: [firstCurriculum]
    } = this.props;

    const {
      subject = interestedSubjects?.[0] || "",
      grades = interestedGrades || [],
      curriculumId = firstCurriculum?.subject === interestedSubjects?.[0] ? firstCurriculum?._id : ""
    } = getDefaultInterests();
    const isAuthoredNow = history?.location?.state?.isAuthoredNow;
    const applyAuthoredFilter = isAuthoredNow ? { filter: "AUTHORED_BY_ME" } : {};
    const sessionFilters = JSON.parse(sessionStorage.getItem("filters[itemList]")) || {};
    const selectedSubjects = test.subjects.filter(item => !!item);
    const selectedGrades = test.grades.filter(item => !!item);
    const search = {
      ...initSearch,
      ...sessionFilters,
      ...applyAuthoredFilter,
      subject: selectedSubjects[0] || subject,
      grades: uniq([...selectedGrades, ...grades]),
      curriculumId: parseInt(curriculumId, 10) || ""
    };

    this.updateFilterState(search);
    if (!curriculums.length) getCurriculums();
    receiveTestItems(search, 1, limit);
    getAllTags({ type: "testitem" });
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
    const { receiveTestItems, limit, search } = this.props;
    receiveTestItems(searchState || search, 1, limit);
  };

  handleLabelSearch = e => {
    const { limit, receiveTestItems, search } = this.props;
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    const searchState = {
      ...search,
      filter
    };
    this.updateFilterState(searchState);
    receiveTestItems(searchState, 1, limit);
  };

  handleClearSearch = () => {
    const { clearFilterState, receiveTestItems, limit } = this.props;
    clearFilterState();
    receiveTestItems(initalSearchState, 1, limit);
    setDefaultInterests({ subject: "", grades: [], curriculumId: "" });
  };

  handleCreateNewItem = () => {
    const {
      onSaveTestId,
      createTestItem,
      test: { _id: testId, title },
      clearDictAlignment,
      handleSaveTest,
      updated
    } = this.props;
    if (!title) {
      notification({ messageKey: "nameShouldNotEmpty" });
    }

    if (updated && testId) {
      handleSaveTest();
    }
    const defaultWidgets = {
      rows: [
        {
          tabs: [],
          dimension: "100%",
          widgets: [],
          flowLayout: false,
          content: ""
        }
      ]
    };
    clearDictAlignment();
    onSaveTestId();
    createTestItem(defaultWidgets, true, testId, false, title);
  };

  handleDuplicateItem = duplicateTestItemId => {
    const {
      onSaveTestId,
      test: { title, _id: testId },
      clearDictAlignment,
      history
    } = this.props;
    if (!title) {
      notification({ messageKey: "nameShouldNotEmpty" });
    }
    clearDictAlignment();
    onSaveTestId();
    history.push(`/author/tests/${testId}/createItem/${duplicateTestItemId}`);
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

  handleSearchFieldChange = fieldName => value => {
    const { search, clearDictStandards } = this.props;
    let updatedKeys = {};
    if (fieldName === "grades" || fieldName === "subject" || fieldName === "curriculumId") {
      setDefaultInterests({ [fieldName]: value });
    }
    if (fieldName === "curriculumId") {
      this.handleSearchFieldChangeCurriculumId(value);
      return;
    }
    if (fieldName === "subject") {
      clearDictStandards();
      updatedKeys = {
        ...search,
        [fieldName]: value,
        curriculumId: "",
        standardIds: []
      };
    } else {
      updatedKeys = {
        ...search,
        [fieldName]: value
      };
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
    this.searchDebounce(updatedKeys);
  };

  renderPagination = () => {
    const { windowWidth, count, page } = this.props;
    return (
      <ItemsPagination>
        <Pagination
          simple={windowWidth <= 768 && true}
          onChange={this.handlePaginationChange}
          defaultPageSize={10}
          total={count}
          current={page}
        />
      </ItemsPagination>
    );
  };

  handlePaginationChange = page => {
    const { search } = this.props;
    const { receiveTestItems, limit } = this.props;
    receiveTestItems(search, page, limit);
  };

  renderItems = () => {
    const {
      items,
      test,
      history,
      windowWidth,
      addItemToCart,
      userId,
      interestedCurriculums,
      testItemsList,
      setDataAndSave,
      setTestItems,
      selectedRows,
      gotoSummary,
      search,
      setCurrentGroupIndex,
      current
    } = this.props;
    if (items.length < 1) {
      return (
        <NoDataNotification
          heading="Items Not Available"
          description='There are currently no items available for this filter. 
          You can create new item by clicking the "CREATE ITEM" button.'
        />
      );
    }
    return items.map((item, index) => (
      <Item
        key={`Item_${item._id}`}
        item={item}
        history={history}
        userId={userId}
        windowWidth={windowWidth}
        onToggleToCart={addItemToCart}
        selectedToCart={selectedRows ? selectedRows.includes(item._id) : false}
        interestedCurriculums={interestedCurriculums}
        search={search}
        test={test}
        testItemsList={testItemsList}
        current={current}
        setDataAndSave={setDataAndSave}
        setTestItems={setTestItems}
        selectedRows={selectedRows}
        gotoSummary={gotoSummary}
        page="addItems"
        openPreviewModal={this.openPreviewModal(index)}
        setCurrentGroupIndex={setCurrentGroupIndex}
      />
    ));
  };

  openPreviewModal = itemIndex => () => {
    this.setState({ itemIndexForPreview: itemIndex });
  };

  closePreviewModal = () => {
    this.setState({ itemIndexForPreview: null });
  };

  checkItemAnswer = () => {
    const { checkAnswer } = this.props;
    checkAnswer({ ...this.selectedItem, isItem: true });
  };

  showItemAnswer = () => {
    const { showAnswer } = this.props;
    showAnswer(this.selectedItem);
  };

  prevItem = () => {
    const { itemIndexForPreview } = this.state;
    const prevItemIndex = itemIndexForPreview - 1;
    if (prevItemIndex < 0) {
      return;
    }
    this.setState({ itemIndexForPreview: prevItemIndex });
  };

  nextItem = () => {
    const { items } = this.props;
    const { itemIndexForPreview } = this.state;
    const nextItemIndex = itemIndexForPreview + 1;
    if (nextItemIndex > items.length - 1) {
      return;
    }
    this.setState({ itemIndexForPreview: nextItemIndex });
  };

  get selectedItem() {
    const { items } = this.props;
    const { itemIndexForPreview } = this.state;
    const item = get(items, `[${itemIndexForPreview}]`, false);
    if (!item) {
      return item;
    }
    return { ...item, isItem: true, id: item._id };
  }

  get owner() {
    const { userId } = this.props;
    return get(this.selectedItem, "authors", []).some(x => x._id === userId);
  }

  render() {
    const {
      windowWidth,
      curriculums,
      getCurriculumStandards,
      curriculumStandards,
      loading,
      t,
      count,
      test,
      toggleFilter,
      isShowFilter,
      search,
      features,
      gotoGroupItems,
      userRole,
      isPowerTeacher,
      isPremiumUser
    } = this.props;

    const { isCurator, isPublisherAuthor } = features;
    let showGroupItemsBtn = false;

    if (
      isCurator ||
      isPublisherAuthor ||
      ([roleuser.TEACHER, roleuser.SCHOOL_ADMIN, roleuser.DISTRICT_ADMIN].includes(userRole) &&
        isPowerTeacher &&
        isPremiumUser)
    ) {
      showGroupItemsBtn = true;
    }

    return (
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
            curriculums={curriculums}
            getCurriculumStandards={getCurriculumStandards}
            curriculumStandards={curriculumStandards}
            items={userRole === roleuser.EDULASTIC_CURATOR ? [filterMenuItems[0]] : filterMenuItems}
            toggleFilter={toggleFilter}
            isShowFilter={isShowFilter}
            t={t}
          />
        )}
        <ListItems isShowFilter={isShowFilter}>
          <Element>
            <MobileFilterIcon>
              <FilterToggleBtn isShowFilter={isShowFilter} toggleFilter={toggleFilter} />
            </MobileFilterIcon>
            <ContentWrapper borderRadius="0px" padding="0px">
              {loading && <Spin size="large" />}
              <ItemsMenu>
                <PaginationInfo>
                  <span>{count}</span> QUESTIONS FOUND
                </PaginationInfo>
                <HeaderFilter
                  search={search}
                  handleCloseFilter={(type, value) => this.handleSearchFieldChange(type)(value)}
                  type="testitem"
                />
                <FlexContainer alignItems="center" justifyContent="space-between">
                  <Selected style={{ fontSize: "12px" }}>
                    {test.itemGroups.flatMap(itemGroup => itemGroup.items || []).length} SELECTED
                  </Selected>
                  {userRole !== roleuser.EDULASTIC_CURATOR && (
                    <StyledButton
                      data-cy="createNewItem"
                      type="secondary"
                      size="large"
                      onClick={this.handleCreateNewItem}
                      noHover
                    >
                      <IconPlusCircle color={themeColor} width={15} height={15} />
                      <span>Create new Item</span>
                    </StyledButton>
                  )}
                  {showGroupItemsBtn && (
                    <StyledButton data-cy="groupItem" type="secondary" size="large" onClick={gotoGroupItems}>
                      <IconItemGroup color={themeColor} width={15} height={15} />
                      <span>Group Items</span>
                    </StyledButton>
                  )}
                </FlexContainer>
              </ItemsMenu>

              {!loading && (
                <ScrollbarContainer>
                  {this.renderItems()}
                  {count > 10 && <PaginationContainer>{this.renderPagination()}</PaginationContainer>}
                </ScrollbarContainer>
              )}

              {this.selectedItem && (
                <PreviewModal
                  isVisible={!!this.selectedItem}
                  page="itemList"
                  showAddPassageItemToTestButton
                  showEvaluationButtons
                  data={this.selectedItem}
                  isEditable={this.owner}
                  owner={this.owner}
                  testId={test?._id}
                  isTest={!!test}
                  prevItem={this.prevItem}
                  nextItem={this.nextItem}
                  onClose={this.closePreviewModal}
                  checkAnswer={this.checkItemAnswer}
                  showAnswer={this.showItemAnswer}
                />
              )}
            </ContentWrapper>
          </Element>
        </ListItems>
      </Container>
    );
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      items: getTestItemsSelector(state),
      loading: getTestItemsLoadingSelector(state),
      page: getTestsItemsPageSelector(state),
      limit: getTestsItemsLimitSelector(state),
      count: getTestsItemsCountSelector(state),
      curriculums: getCurriculumsListSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      userId: getUserId(state),
      testItemsList: getTestItemsSelector(state),
      selectedRows: getSelectedItemSelector(state),
      search: getSearchFilterStateSelector(state),
      features: getUserFeatures(state),
      interestedGrades: getInterestedGradesSelector(state),
      interestedSubjects: getInterestedSubjectsSelector(state),
      isPowerTeacher: get(state, ["user", "user", "isPowerTeacher"], false),
      isPremiumUser: get(state, ["user", "user", "features", "premium"], false)
    }),
    {
      receiveTestItems: receiveTestItemsAction,
      getAllTags: getAllTagsAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      clearDictAlignment: clearDictAlignmentAction,
      createTestItem: createTestItemAction,
      setAndSavePassageItems: setAndSavePassageItemsAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      setDataAndSave: setTestDataAndUpdateAction,
      setTestItems: setTestItemsAction,
      updateSearchFilterState: updateSearchFilterStateAction,
      clearFilterState: clearFilterStateAction,
      setCurrentGroupIndex: setCurrentGroupIndexAction
    }
  )
);

export default enhance(AddItems);
