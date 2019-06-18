import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Pagination, Spin } from "antd";
import { debounce } from "lodash";

import { Paper, withWindowSizes } from "@edulastic/common";
import { compose } from "redux";
import { withNamespaces } from "@edulastic/localization";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Container, Element, ListItems, SpinContainer, PaginationContainer } from "./styled";
import Item from "../Item/Item";
import { uniq } from "lodash";
import ItemFilter from "../ItemFilter/ItemFilter";
import CartButton from "../CartButton/CartButton";
import ModalCreateTest from "../ModalCreateTest/ModalCreateTest";
import ListHeader from "../../../src/components/common/ListHeader";
import { createTestItemAction } from "../../../src/actions/testItem";
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
  clearDictStandardsAction
} from "../../../src/actions/dictionaries";
import {
  getTestItemsSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  getTestItemsLoadingSelector,
  receiveTestItemsAction,
  getSelectedItemSelector,
  clearSelectedItemsAction
} from "../../../TestPage/components/AddItems/ducks";
import { setDefaultTestDataAction } from "../../../TestPage/ducks";
import { getItemsTypesSelector } from "../../../TestPage/components/Review/ducks";
import { getTestItemCreatingSelector } from "../../../src/selectors/testItem";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { addItemToCartAction } from "../../ducks";
import FilterButton from "../FilterButton/FilterButton";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";
import { getInterestedCurriculumsSelector } from "../../../src/selectors/user";
import {
  getDefaultGradesSelector,
  getDefaultSubjectSelector,
  updateDefaultSubjectAction,
  updateDefaultGradesAction
} from "../../../ItemDetail/ducks";
import { storeInLocalStorage } from "@edulastic/api/src/utils/Storage";

export const filterMenuItems = [
  { icon: "book", filter: "ENTIRE_LIBRARY", path: "all", text: "Entire Library" },
  { icon: "folder", filter: "AUTHORED_BY_ME", path: "by-me", text: "Authored by me" },
  { icon: "share-alt", filter: "SHARED_WITH_ME", path: "shared", text: "Shared with me" },
  { icon: "reload", filter: "PREVIOUS", path: "previous", text: "Previously Used" },
  { icon: "heart", filter: "FAVORITES", path: "favourites", text: "My Favorites" }
];

export const getClearSearchState = () => ({
  subject: "",
  curriculumId: "",
  standardIds: [],
  questionType: "",
  depthOfKnowledge: "",
  authorDifficulty: "",
  status: "",
  grades: [],
  filter: filterMenuItems[0].filter
});

// container the main entry point to the component
class Contaier extends Component {
  state = {
    search: getClearSearchState(),
    isShowFilter: false,
    modalCreateTestVisible: false
  };

  componentDidMount() {
    const { search } = this.state;
    const {
      receiveItems,
      curriculums,
      getCurriculums,
      match = {},
      limit,
      setDefaultTestData,
      defaultGrades,
      defaultSubject,
      clearSelectedItems,
      interestedCurriculums,
      clearDictStandards
    } = this.props;
    const { params = {} } = match;
    setDefaultTestData();
    clearSelectedItems();
    clearDictStandards();
    if (params.filterType) {
      const getMatchingObj = filterMenuItems.filter(item => item.path === params.filterType);
      const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
      let updatedSearch = { ...search };
      if (filter === filterMenuItems[0].filter) {
        updatedSearch = { ...updatedSearch, status: "" };
      }
      this.setState({
        search: {
          ...updatedSearch,
          filter
        }
      });
      receiveItems({ ...updatedSearch, filter }, 1, limit);
    } else {
      let grades = defaultGrades;
      let subject = defaultSubject;
      let filteredInterestedCurriculum;
      if (!grades && subject === null) {
        filteredInterestedCurriculum = interestedCurriculums.filter(ic => ic.orgType === "teacher") || [];
        if (!filteredInterestedCurriculum.length) {
          filteredInterestedCurriculum = interestedCurriculums.filter(ic => ic.orgType === "school") || [];
          if (!filteredInterestedCurriculum.length) {
            filteredInterestedCurriculum = interestedCurriculums.filter(ic => ic.orgType === "district") || [];
            if (!filteredInterestedCurriculum.length) {
              filteredInterestedCurriculum = interestedCurriculums;
            }
          }
        }

        grades = filteredInterestedCurriculum.flatMap(o => o.grades || []);
        grades = grades.length ? uniq(grades.join(",").split(",")) : [];
        subject = (filteredInterestedCurriculum[0] && filteredInterestedCurriculum[0].subject) || "";
      }
      grades = grades || [];
      this.setState({
        search: {
          ...search,
          grades,
          subject
        }
      });
      receiveItems({ ...search, grades, subject }, 1, limit);
    }
    if (curriculums.length === 0) {
      getCurriculums();
    }
  }

  handleSearch = () => {
    const { search } = this.state;
    const { limit, receiveItems } = this.props;
    receiveItems(search, 1, limit);
  };

  handleLabelSearch = e => {
    const { search } = this.state;
    const { limit, receiveItems, history } = this.props;
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
    this.setState({
      search: {
        ...updatedSearch,
        filter
      }
    });
    receiveItems({ ...updatedSearch, filter }, 1, limit);
    history.push(`/author/items/filter/${filterType}`);
  };

  handleClearSearch = () => {
    this.setState(
      {
        search: getClearSearchState()
      },
      this.handleSearch
    );
  };

  handleSearchFieldChangeCurriculumId = value => {
    const { search } = this.state;
    const { clearDictStandards, getCurriculumStandards } = this.props;
    clearDictStandards();
    this.setState(
      {
        search: {
          ...search,
          curriculumId: value,
          standardIds: []
        }
      },
      this.handleSearch
    );
    getCurriculumStandards(value, search.grades, "");
  };

  handleSearchFieldChange = fieldName => value => {
    const { search } = this.state;
    const { updateDefaultGrades, udpateDefaultSubject, clearDictStandards, getCurriculumStandards } = this.props;
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
      const { clearDictStandards } = this.props;
      clearDictStandards();
      storeInLocalStorage("defaultSubject", value);
      udpateDefaultSubject(value);
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
    if (fieldName === "grades") {
      updateDefaultGrades(value);
      storeInLocalStorage("defaultGrades", value);
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
    const { search } = this.state;
    const { receiveItems, limit } = this.props;
    const _this = this;
    const spinner = document.querySelector(`.${this.spinner.state.generatedClassName}`);
    spinner.classList.add("active");

    setTimeout(() => {
      receiveItems(search, page, limit);
      _this.itemsScrollBar._container.scrollTop = 0;
    }, 350);
  };

  handleToggleModalCreateTest = value => () => this.setState({ modalCreateTestVisible: value });

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

  renderItems = () => {
    const {
      items,
      itemTypes,
      history,
      windowWidth,
      addItemToCart,
      selectedCartItems,
      interestedCurriculums
    } = this.props;
    const { search } = this.state;
    return items.map(item => (
      <Item
        key={`Item_${item._id}`}
        item={item}
        types={itemTypes[item._id]}
        history={history}
        windowWidth={windowWidth}
        onToggleToCart={addItemToCart}
        selectedToCart={selectedCartItems ? selectedCartItems.includes(item._id) : false}
        interestedCurriculums={interestedCurriculums}
        search={search}
      />
    ));
  };

  toggleFilter = () => {
    const { isShowFilter } = this.state;

    this.setState({
      isShowFilter: !isShowFilter
    });
  };

  renderCartButton = () => <CartButton onClick={this.handleToggleModalCreateTest(true)} />;

  renderFilterButton = () => {
    const { windowWidth, t } = this.props;
    const { isShowFilter } = this.state;

    return (
      <FilterButton toggleFilter={this.toggleFilter} isShowFilter={isShowFilter} windowWidth={windowWidth} t={t} />
    );
  };

  render() {
    const { windowWidth, creating, t, getCurriculumStandards, curriculumStandards, loading } = this.props;

    const { search, isShowFilter, modalCreateTestVisible } = this.state;

    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title={t("component.itemlist.header.itemlist")}
          renderExtra={this.renderCartButton}
          renderFilter={this.renderFilterButton}
        />
        <Container>
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
            t={t}
            toggleFilter={this.toggleFilter}
            isShowFilter={isShowFilter}
          />
          <ListItems>
            <Element>
              <Paper borderRadius="0px" padding="0px">
                <SpinContainer
                  ref={e => {
                    this.spinner = e;
                  }}
                  className={loading ? "active" : ""}
                >
                  <Spin size="large" />
                </SpinContainer>
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
        {modalCreateTestVisible && (
          <ModalCreateTest
            onProceed={this.handleToggleModalCreateTest(false)}
            onCancel={this.handleToggleModalCreateTest(false)}
          />
        )}
      </div>
    );
  }
}

Contaier.propTypes = {
  items: PropTypes.array.isRequired,
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
  itemTypes: PropTypes.object.isRequired,
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
  setDefaultTestData: PropTypes.func.isRequired,
  addItemToCart: PropTypes.func.isRequired,
  selectedCartItems: PropTypes.arrayOf(PropTypes.string).isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces("author"),
  connect(
    state => ({
      items: getTestItemsSelector(state),
      limit: getTestsItemsLimitSelector(state),
      page: getTestsItemsPageSelector(state),
      count: getTestsItemsCountSelector(state),
      loading: getTestItemsLoadingSelector(state),
      creating: getTestItemCreatingSelector(state),
      itemTypes: getItemsTypesSelector(state),
      curriculums: getCurriculumsListSelector(state),
      curriculumStandards: getStandardsListSelector(state),
      selectedCartItems: getSelectedItemSelector(state).data,
      defaultGrades: getDefaultGradesSelector(state),
      defaultSubject: getDefaultSubjectSelector(state),
      interestedCurriculums: getInterestedCurriculumsSelector(state)
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
      addItemToCart: addItemToCartAction
    }
  )
);

export default enhance(Contaier);
