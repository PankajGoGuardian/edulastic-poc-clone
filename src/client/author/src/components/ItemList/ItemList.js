import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import { Paper, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { withNamespaces } from '@edulastic/localization';
import {
  mobileWidth,
  desktopWidth,
  secondaryTextColor,
  greenDark,
  white,
  tabletWidth
} from '@edulastic/colors';

import Item from './Item';
import ItemFilter from './ItemFilter';
import ListHeader from '../common/ListHeader';
import { receiveTestItemsAction } from '../../actions/testItems';
import { createTestItemAction } from '../../actions/testItem';
import {
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction,
  clearDictStandardsAction
} from '../../actions/dictionaries';
import {
  getTestItemsSelector,
  getItemsTypesSelector,
  getTestsItemsCountSelector,
  getTestsItemsLimitSelector,
  getTestsItemsPageSelector,
  getTestItemsLoadingSelector
} from '../../selectors/testItems';
import { getTestItemCreatingSelector } from '../../selectors/testItem';
import {
  getCurriculumsListSelector,
  getStandardsListSelector
} from '../../selectors/dictionaries';

export const getClearSearchState = () => ({
  subject: '',
  curriculumId: '',
  standardIds: [],
  questionType: '',
  depthOfKnowledge: '',
  authorDifficulty: '',
  grades: []
});

class ItemList extends Component {
  state = {
    search: getClearSearchState()
  };

  handleSearch = () => {
    const { search } = this.state;
    const { limit, receiveItems } = this.props;
    receiveItems(search, 1, limit);
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
    const { clearDictStandards } = this.props;
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
  };

  handleSearchFieldChange = fieldName => value => {
    const { search } = this.state;
    if (fieldName === 'curriculumId') {
      this.handleSearchFieldChangeCurriculumId(value);
    } else {
      this.setState(
        {
          search: {
            ...search,
            [fieldName]: value
          }
        },
        this.handleSearch
      );
    }
  };

  handleCreate = async () => {
    const { createItem } = this.props;
    createItem({
      rows: [
        {
          tabs: [],
          dimension: '100%',
          widgets: []
        }
      ]
    });
  };

  handlePaginationChange = page => {
    const { search } = this.state;
    const { receiveItems, limit } = this.props;
    receiveItems(search, page, limit);
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

  componentDidMount() {
    const { receiveItems, curriculums, getCurriculums } = this.props;
    receiveItems();
    if (curriculums.length === 0) {
      getCurriculums();
    }
  }

  render() {
    const {
      items,
      windowWidth,
      history,
      creating,
      t,
      itemTypes,
      curriculums,
      getCurriculumStandards,
      curriculumStandards,
      loading
    } = this.props;
    const { search } = this.state;
    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title={t('component.itemlist.header.itemlist')}
        />
        <Container>
          <ItemFilter
            onSearchFieldChange={this.handleSearchFieldChange}
            onSearch={this.handleSearch}
            onClearSearch={this.handleClearSearch}
            windowWidth={windowWidth}
            search={search}
            curriculums={curriculums}
            getCurriculumStandards={getCurriculumStandards}
            curriculumStandards={curriculumStandards}
          />
          <ListItems>
            {windowWidth > 468 && this.renderPagination()}
            <Items>
              <Paper
                padding={windowWidth > 768 ? '25px 39px 25px 39px' : '0px'}
              >
                {loading && <Spin size="large" />}
                {!loading &&
                  items.map(item => (
                    <Item
                      key={item._id}
                      item={item}
                      types={itemTypes[item._id]}
                      history={history}
                      windowWidth={windowWidth}
                    />
                  ))}
              </Paper>
            </Items>
            {this.renderPagination()}
          </ListItems>
        </Container>
      </div>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  receiveItems: PropTypes.func.isRequired,
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
  loading: PropTypes.bool.isRequired
};

const enhance = compose(
  withWindowSizes,
  withNamespaces('author'),
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
      curriculumStandards: getStandardsListSelector(state)
    }),
    {
      receiveItems: receiveTestItemsAction,
      createItem: createTestItemAction,
      getCurriculums: getDictCurriculumsAction,
      getCurriculumStandards: getDictStandardsForCurriculumAction,
      clearDictStandards: clearDictStandardsAction
    }
  )
);

export default enhance(ItemList);

const Container = styled.div`
  padding: 20px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
  display: flex;
  position: relative;
  @media (max-width: ${desktopWidth}) {
    flex-direction: column;
  }
  @media (max-width: ${mobileWidth}) {
    padding-bottom: 40px;
  }
`;

const ListItems = styled.div`
  flex: 1;
  .ant-pagination {
    display: flex;
    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
      margin-left: 29px !important;
    }
  }

  .ant-pagination-total-text {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Open Sans';
    color: ${secondaryTextColor};
    letter-spacing: normal;
  }

  .ant-pagination-item-active {
    border: none;
    opacity: 0.75;
    background-color: ${greenDark};
  }

  .ant-pagination-item-active a {
    color: ${white};
  }
`;

const Items = styled.div`
  margin: 14px 0px;

  @media (max-width: ${mobileWidth}) {
    margin: 20px 0px;
  }
`;
