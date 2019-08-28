import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { debounce } from "lodash";
import { Pagination, Spin, message } from "antd";

import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconPlusCircle, IconFilter } from "@edulastic/icons";
import { themeColor } from "@edulastic/colors";
import { StyledButton, ItemsMenu, QuestionsFound, ItemsPagination } from "./styled";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { getCreateItemModalVisibleSelector } from "../../../src/selectors/testItem";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  clearDictAlignmentAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";
import { createTestItemAction } from "../../../src/actions/testItem";
import {
  getTestItemsLoadingSelector,
  getTestItemsSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  receiveTestItemsAction,
  setTestItemsAction,
  getSelectedItemSelector
} from "./ducks";
import {
  setAndSavePassageItemsAction,
  previewCheckAnswerAction,
  previewShowAnswerAction,
  setTestDataAndUpdateAction
} from "../../ducks";
import ItemFilter from "../../../ItemList/components/ItemFilter/ItemFilter";
import { getClearSearchState, filterMenuItems } from "../../../ItemList";
import {
  Container,
  ListItems,
  Element,
  ShowLeftFilterButton,
  SpinContainer,
  PaginationContainer
} from "../../../ItemList/components/Container/styled";
import PerfectScrollbar from "react-perfect-scrollbar";
import { white } from "ansi-colors";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";
import { MEDIUM_DESKTOP_WIDTH } from "../../../../assessment/constants/others";
import { getInterestedCurriculumsSelector, getUserId } from "../../../src/selectors/user";
import NoDataNotification from "../../../../common/components/NoDataNotification";
import Item from "../../../ItemList/components/Item/Item";

class AddItems extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    receiveTestItems: PropTypes.func.isRequired,
    onAddItems: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isEditable: PropTypes.bool,
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
    createTestItemModalVisible: PropTypes.bool,
    gotoSummary: PropTypes.func.isRequired
  };

  static defaultProps = {
    createTestItemModalVisible: false
  };

  state = {
    search: getClearSearchState(),
    questionCreateType: "Duplicate",
    isShowFilter: true
  };

  componentDidMount() {
    const { search } = this.state;
    const { getCurriculums, receiveTestItems, limit, test, curriculums } = this.props;
    const selectedSubjects = test.subjects.filter(item => !!item);
    const newSearch = {
      ...search,
      grades: test.grades,
      subject: selectedSubjects.length ? selectedSubjects[0] : ""
    };
    this.setState({
      search: newSearch
    });
    if (!curriculums.length) getCurriculums();
    receiveTestItems(newSearch, 1, limit);
  }

  handleSearch = () => {
    const { receiveTestItems, limit } = this.props;
    const { search } = this.state;
    receiveTestItems(search, 1, limit);
  };

  handleLabelSearch = e => {
    const { search } = this.state;
    const { limit, receiveTestItems } = this.props;
    const { key: filterType } = e;
    const getMatchingObj = filterMenuItems.filter(item => item.path === filterType);
    const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        filter
      }
    }));
    receiveTestItems({ ...search, filter }, 1, limit);
  };

  handleClearSearch = () => {
    this.setState(
      {
        search: getClearSearchState()
      },
      this.handleSearch
    );
  };

  handleCreateNewItem = () => {
    const {
      onSaveTestId,
      createTestItem,
      test: { _id: testId, title },
      clearDictAlignment
    } = this.props;
    if (!title) {
      return message.error("Name field cannot be empty");
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
    createTestItem(defaultWidgets, true, testId);
  };

  handleDuplicateItem = duplicateTestItemId => {
    const {
      onSaveTestId,
      test: { title, _id: testId },
      clearDictAlignment,
      history
    } = this.props;
    if (!title) {
      return message.error("Name field cannot be empty");
    }
    clearDictAlignment();
    onSaveTestId();
    history.push(`/author/tests/${testId}/createItem/${duplicateTestItemId}`);
  };

  handleSearchFieldChangeCurriculumId = value => {
    const { clearDictStandards, getCurriculumStandards } = this.props;
    const { search } = this.state;
    clearDictStandards();
    this.setState(
      {
        search: {
          ...search,
          curriculumId: value,
          standardIds: []
        }
      },
      () => {
        this.handleSearch();
      }
    );
    getCurriculumStandards(value, search.grades, "");
  };

  handleSearchFieldChange = fieldName => value => {
    const { search } = this.state;
    let updatedKeys = {};
    if (fieldName === "curriculumId") {
      this.handleSearchFieldChangeCurriculumId(value);
      return;
    } else if (fieldName === "subject") {
      const { clearDictStandards } = this.props;
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
    this.setState(
      {
        search: updatedKeys
      },
      this.handleSearch
    );
  };

  searchDebounce = debounce(this.handleSearch, 500);

  handleSearchInputChange = e => {
    const { search } = this.state;
    const searchString = e.target.value;
    const updatedKeys = {
      ...search,
      searchString
    };
    this.setState(
      {
        search: updatedKeys
      },
      this.searchDebounce
    );
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

  setAuthoredByMeFilter = () => {
    this.setState(prev => ({
      search: {
        ...prev.search,
        filter: "AUTHORED_BY_ME"
      }
    }));
  };

  toggleFilter = () => {
    const { isShowFilter } = this.state;

    this.setState({
      isShowFilter: !isShowFilter
    });
  };

  handlePaginationChange = page => {
    const { search } = this.state;
    const { receiveTestItems, limit } = this.props;
    const _this = this;
    const spinner = document.querySelector(`.${this.spinner.state.generatedClassName}`);
    spinner.classList.add("active");

    setTimeout(() => {
      receiveTestItems(search, page, limit);
      _this.itemsScrollBar._container.scrollTop = 0;
    }, 350);
  };

  renderItems = () => {
    const {
      items,
      test,
      history,
      windowWidth,
      addItemToCart,
      userId,
      checkAnswer,
      showAnswer,
      interestedCurriculums,
      testItemsList,
      setDataAndSave,
      setTestItems,
      selectedRows
    } = this.props;
    const { search } = this.state;
    if (items.length < 1) {
      return (
        <NoDataNotification
          heading={"Items Not Available"}
          description={
            'There are currently no items available for this filter. You can create new item by clicking the "CREATE ITEM" button.'
          }
        />
      );
    }
    return items.map(item => (
      <Item
        key={`Item_${item._id}`}
        item={item}
        history={history}
        userId={userId}
        windowWidth={windowWidth}
        onToggleToCart={addItemToCart}
        selectedToCart={selectedRows ? selectedRows.includes(item._id) : false}
        interestedCurriculums={interestedCurriculums}
        checkAnswer={checkAnswer}
        showAnswer={showAnswer}
        search={search}
        test={test}
        testItemsList={testItemsList}
        setDataAndSave={setDataAndSave}
        setTestItems={setTestItems}
        selectedRows={selectedRows}
        page={"addItems"}
      />
    ));
  };

  render() {
    const { windowWidth, curriculums, getCurriculumStandards, curriculumStandards, loading, t, count } = this.props;

    const { search, isShowFilter } = this.state;
    return (
      <>
        <Container>
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
            items={filterMenuItems}
            t={t}
          />
          <ListItems isShowFilter={isShowFilter}>
            <Element>
              {windowWidth < MEDIUM_DESKTOP_WIDTH && (
                <ShowLeftFilterButton isShowFilter={isShowFilter} variant="filter" onClick={this.toggleFilter}>
                  <IconFilter color={isShowFilter ? white : themeColor} width={20} height={20} />
                </ShowLeftFilterButton>
              )}
              <Paper borderRadius="0px" padding="0px">
                <SpinContainer
                  ref={e => {
                    this.spinner = e;
                  }}
                  className={loading ? "active" : ""}
                >
                  <Spin size="large" />
                </SpinContainer>
                <ItemsMenu>
                  <QuestionsFound>{count} questions found</QuestionsFound>
                  <StyledButton
                    data-cy="createNewItem"
                    type="secondary"
                    size="large"
                    onClick={this.handleCreateNewItem}
                  >
                    <IconPlusCircle color={themeColor} width={15} height={15} />
                    <span>Create new Item</span>
                  </StyledButton>
                </ItemsMenu>
                <PerfectScrollbar
                  ref={e => {
                    this.itemsScrollBar = e;
                  }}
                  style={{ padding: windowWidth > 768 ? "0px 30px 30px" : "0px" }}
                >
                  {this.renderItems()}
                  {windowWidth > SMALL_DESKTOP_WIDTH && this.renderPagination()}
                </PerfectScrollbar>
              </Paper>

              {windowWidth < SMALL_DESKTOP_WIDTH && (
                <PaginationContainer>{this.renderPagination()}</PaginationContainer>
              )}
            </Element>
          </ListItems>
        </Container>
      </>
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
      createTestItemModalVisible: getCreateItemModalVisibleSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state),
      userId: getUserId(state),
      testItemsList: getTestItemsSelector(state),
      selectedRows: getSelectedItemSelector(state)
    }),
    {
      receiveTestItems: receiveTestItemsAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      clearDictAlignment: clearDictAlignmentAction,
      createTestItem: createTestItemAction,
      setAndSavePassageItems: setAndSavePassageItemsAction,
      checkAnswer: previewCheckAnswerAction,
      showAnswer: previewShowAnswerAction,
      setDataAndSave: setTestDataAndUpdateAction,
      setTestItems: setTestItemsAction
    }
  )
);

export default enhance(AddItems);
