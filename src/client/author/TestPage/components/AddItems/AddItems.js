import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Pagination, Spin } from "antd";

import { Paper, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconPlusCircle } from "@edulastic/icons";

import {
  Container,
  MainList,
  ListItems,
  ItemsTableContainer,
  StyledButton,
  ItemsMenu,
  QuestionsFound,
  ItemsPagination,
  ListWrapper
} from "./styled";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import { getCreateItemModalVisibleSelector } from "../../../src/selectors/testItem";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";
import { createTestItemAction } from "../../../src/actions/testItem";
import {
  getTestItemsLoadingSelector,
  getTestItemsSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  receiveTestItemsAction
} from "./ducks";
import ItemsTable from "../common/ItemsTable/ItemsTable";
import ItemFilter from "../../../ItemList/components/ItemFilter/ItemFilter";
import { getClearSearchState, filterMenuItems } from "../../../ItemList";
import ModalCreateTestItem from "../ModalCreateTestItem/ModalCreateTestItem";

class AddItems extends PureComponent {
  static propTypes = {
    items: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    receiveTestItems: PropTypes.func.isRequired,
    onAddItems: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    selectedItems: PropTypes.array.isRequired,
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
    createTestItemModalVisible: PropTypes.bool
  };

  static defaultProps = {
    createTestItemModalVisible: false
  };

  state = {
    search: getClearSearchState(),
    selectedTestItems: []
  };

  componentDidMount() {
    const { search } = this.state;
    const { selectedItems, getCurriculums, receiveTestItems, limit } = this.props;
    this.setState({
      selectedTestItems: selectedItems
    });

    getCurriculums();
    receiveTestItems(search, 1, limit);
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
    this.setState({
      search: getClearSearchState()
    });
  };

  handleCreateNewItem = () => {
    const { onSaveTestId, createTestItem } = this.props;
    const defaultWidgets = {
      rows: [
        {
          tabs: [],
          dimension: "100%",
          widgets: []
        }
      ]
    };
    onSaveTestId();
    createTestItem(defaultWidgets, true);
  };

  handleSearchFieldChangeCurriculumId = value => {
    const { clearDictStandards } = this.props;
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

  handlePaginationChange = newPage => {
    const { receiveTestItems, limit } = this.props;
    const { search } = this.state;
    receiveTestItems(search, newPage, limit);
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

  setSelectedTestItems = value => {
    this.setState({
      selectedTestItems: value
    });
  };

  render() {
    const {
      windowWidth,
      curriculums,
      getCurriculumStandards,
      curriculumStandards,
      loading,
      items,
      onAddItems,
      t,
      createTestItemModalVisible,
      count
    } = this.props;

    const { search, selectedTestItems } = this.state;
    return (
      <Container>
        <MainList id="main-list">
          <ItemFilter
            onSearchFieldChange={this.handleSearchFieldChange}
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
          <ListItems id="item-list">
            <ItemsTableContainer>
              <ItemsMenu>
                <QuestionsFound>{count} questions found</QuestionsFound>
                <StyledButton type="secondary" size="large" onClick={this.handleCreateNewItem}>
                  <IconPlusCircle color="#1774F0" width={15} height={15} />
                  <span>Create new Item</span>
                </StyledButton>
              </ItemsMenu>
              <ListWrapper borderRadius="0px" boxShadow="none" padding="0px 71px 0 31px">
                {loading && <Spin size="large" />}
                {!loading && (
                  <ItemsTable
                    items={items}
                    setSelectedTests={this.setSelectedTestItems}
                    selectedTests={selectedTestItems}
                    onAddItems={onAddItems}
                    testId={this.props.match.params.id}
                  />
                )}
                {!loading && this.renderPagination()}
              </ListWrapper>
            </ItemsTableContainer>
          </ListItems>
        </MainList>
        {createTestItemModalVisible && <ModalCreateTestItem />}
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
      createTestItemModalVisible: getCreateItemModalVisibleSelector(state)
    }),
    {
      receiveTestItems: receiveTestItemsAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction,
      createTestItem: createTestItemAction
    }
  )
);

export default enhance(AddItems);
