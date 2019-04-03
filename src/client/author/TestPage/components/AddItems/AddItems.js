import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Select, Pagination, Spin } from "antd";

import { Paper, FlexContainer, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { Container, TopMenu, MainList, ListItems, ItemsTableContainer, StyledButton, StyledSelect } from "./styled";
import { getCurriculumsListSelector, getStandardsListSelector } from "../../../src/selectors/dictionaries";
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from "../../../src/actions/dictionaries";
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
    clearDictStandards: PropTypes.func.isRequired
  };

  state = {
    search: getClearSearchState(),
    selectedTestItems: []
  };

  componentDidMount() {
    const { search } = this.state;
    const { selectedItems, getCurriculums, receiveTestItems, match, limit } = this.props;
    const { params = {} } = match;
    this.setState({
      selectedTestItems: selectedItems
    });

    getCurriculums();
    if (params.filterType) {
      const getMatchingObj = filterMenuItems.filter(item => item.path === params.filterType);
      const { filter = "" } = (getMatchingObj.length && getMatchingObj[0]) || {};
      this.setState(prevState => ({
        search: {
          ...prevState.search,
          filter
        }
      }));
      receiveTestItems({ ...search, filter }, 1, limit);
    } else {
      receiveTestItems(search, 1, limit);
    }
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
    const { history } = this.props;
    history.push("/author/items");
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
    if (fieldName === "curriculumId") {
      this.handleSearchFieldChangeCurriculumId(value);
    } else {
      this.setState(
        {
          search: {
            ...search,
            [fieldName]: value
          }
        },
        () => {
          this.handleSearch();
        }
      );
    }
  };

  handlePaginationChange = newPage => {
    const { receiveTestItems, limit } = this.props;
    const { search } = this.state;
    receiveTestItems(search, newPage, limit);
  };

  renderPagination = () => {
    const { windowWidth, count, page } = this.props;
    return (
      <Pagination
        simple={windowWidth <= 768 && true}
        showTotal={(total, range) => `${range[0]} to ${range[1]} of ${total}`}
        onChange={this.handlePaginationChange}
        defaultPageSize={10}
        total={count}
        current={page}
      />
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
      t
    } = this.props;

    const { search, selectedTestItems } = this.state;
    return (
      <Container>
        <TopMenu>
          <FlexContainer justifyContent="space-between">
            <FlexContainer alignItems="center" />
            <FlexContainer alignItems="center">
              {windowWidth > 468 && (
                <>
                  <StyledButton type="secondary" size="large" onClick={this.handleCreateNewItem}>
                    Create new Item
                  </StyledButton>
                  <StyledSelect size="large" defaultValue="popularity" style={{ width: 120 }}>
                    <Select.Option value="popularity">Popularity</Select.Option>
                  </StyledSelect>
                </>
              )}
            </FlexContainer>
          </FlexContainer>
        </TopMenu>
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
            {windowWidth > 992 && this.renderPagination()}
            <ItemsTableContainer>
              <Paper padding="0">
                {loading && <Spin size="large" />}
                {!loading && (
                  <ItemsTable
                    items={items}
                    setSelectedTests={this.setSelectedTestItems}
                    selectedTests={selectedTestItems}
                    onAddItems={onAddItems}
                  />
                )}
              </Paper>
            </ItemsTableContainer>
            {windowWidth < 992 && (
              <StyledButton style={{ width: "100%" }} type="secondary" size="large" onClick={this.handleCreateNewItem}>
                Create new Item
              </StyledButton>
            )}
            {this.renderPagination()}
          </ListItems>
        </MainList>
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
      curriculumStandards: getStandardsListSelector(state)
    }),
    {
      receiveTestItems: receiveTestItemsAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction
    }
  )
);

export default enhance(AddItems);
