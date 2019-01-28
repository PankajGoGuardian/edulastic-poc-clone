import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Select, Pagination, Spin } from 'antd';

import { Paper, FlexContainer, EduButton, withWindowSizes } from '@edulastic/common';
import {
  secondaryTextColor,
  desktopWidth,
  mobileWidth,
  tabletWidth,
  greenDark,
  white
} from '@edulastic/colors';

import styled from 'styled-components';
import {
  getCurriculumsListSelector,
  getStandardsListSelector
} from '../../../selectors/dictionaries';
import {
  clearDictStandardsAction,
  getDictCurriculumsAction,
  getDictStandardsForCurriculumAction
} from '../../../actions/dictionaries';
import {
  getTestItemsLoadingSelector,
  getTestItemsSelector,
  getTestsItemsCountSelector, getTestsItemsLimitSelector,
  getTestsItemsPageSelector
} from '../../../selectors/testItems';
import { receiveTestItemsAction } from '../../../actions/testItems';
import ItemsTable from '../common/ItemsTable/ItemsTable';
import ItemFilter from '../../ItemList/ItemFilter';
import { getClearSearchState } from '../../ItemList/ItemList';

const Items = ({
  items,
  loading,
  receiveTestItems,
  history,
  onAddItems,
  selectedItems,
  windowWidth,
  count,
  page,
  limit,
  clearDictStandards,
  curriculums,
  getCurriculums,
  getCurriculumStandards,
  curriculumStandards
}) => {
  useEffect(() => {
    receiveTestItems();
    getCurriculums();
  }, []);
  const [search, setSearch] = useState(getClearSearchState());
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(
    () => {
      setSelectedTests(selectedItems);
    },
    [selectedItems]
  );

  const handleSearch = () => {
    receiveTestItems(search, 1, limit);
  };

  useEffect(
    () => {
      handleSearch();
    },
    [search]
  );

  const handleClearSearch = () => {
    setSearch(getClearSearchState());
  };

  const handleSortChange = () => {};

  const handleCreateNewItem = () => {
    history.push('/author/items');
  };

  const handleSearchFieldChangeCurriculumId = (value) => {
    clearDictStandards();
    setSearch({
      ...search,
      curriculumId: value,
      standardIds: []
    });
  };

  const handleSearchFieldChange = fieldName => (value) => {
    if (fieldName === 'curriculumId') {
      handleSearchFieldChangeCurriculumId(value);
    } else {
      setSearch({
        ...search,
        [fieldName]: value
      });
    }
  };

  const handlePaginationChange = (newPage) => {
    receiveTestItems(search, newPage, limit);
  };

  const renderPagination = () => (
    <Pagination
      simple={windowWidth <= 768 && true}
      showTotal={(total, range) =>
        `${range[0]} to ${range[1]} of ${total}`
        }
      onChange={handlePaginationChange}
      defaultPageSize={10}
      total={count}
      current={page}
    />
  );

  return (
    <Container>
      <TopMenu>
        <FlexContainer justifyContent="space-between">
          <FlexContainer alignItems="center" />
          <FlexContainer alignItems="center">
            <StyledButton
              type="secondary"
              size="large"
              onClick={handleCreateNewItem}
            >
              Create new Item
            </StyledButton>
            <StyledSelect
              size="large"
              defaultValue="popularity"
              style={{ width: 120 }}
              onChange={handleSortChange}
            >
              <Select.Option value="popularity">Popularity</Select.Option>
            </StyledSelect>
          </FlexContainer>
        </FlexContainer>
      </TopMenu>
      <MainList id="main-list">
        <ItemFilter
          onSearchFieldChange={handleSearchFieldChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          windowWidth={windowWidth}
          search={search}
          curriculums={curriculums}
          getCurriculumStandards={getCurriculumStandards}
          curriculumStandards={curriculumStandards}
        />
        <ListItems id="item-list">
          {windowWidth > 468 && renderPagination()}
          <ItemsTableContainer>
            <Paper>
              { loading &&
              <Spin size="large" />
              }
              { !loading && (
                <ItemsTable
                  items={items}
                  setSelectedTests={setSelectedTests}
                  selectedTests={selectedTests}
                  onAddItems={onAddItems}
                />
              )}
            </Paper>
          </ItemsTableContainer>
          {renderPagination()}
        </ListItems>
      </MainList>
    </Container>
  );
};

Items.propTypes = {
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
  curriculums: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    curriculum: PropTypes.string.isRequired,
    grades: PropTypes.array.isRequired,
    subject: PropTypes.string.isRequired
  })).isRequired,
  getCurriculums: PropTypes.func.isRequired,
  getCurriculumStandards: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  clearDictStandards: PropTypes.func.isRequired
};

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes,
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

export default enhance(Items);

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 51px;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    padding-bottom: 40px;
  }
`;

const TopMenu = styled.div`
  margin: 24px 45px 0px 45px;
`;

const MainList = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;

const ListItems = styled.div`
  flex: 1;
  margin: 29px 40px 0px 29px;

  @media (min-width: 993px) {
    width: 200px;
  }

  .ant-pagination {
    display: flex;

    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
      margin-left: 29px !important;
      margin-top: 80px !important;
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

  @media (max-width: ${mobileWidth}) {
    margin: 21px 26px 0px 26px;
  }
`;

const ItemsTableContainer = styled.div`
  margin: 14px 0px;
`;

const StyledButton = styled(EduButton)`
  height: 32px;
  font-size: 11px;
  margin-right: 15px;
  text-transform: uppercase;

  :last-child {
    margin-right: 0;
  }
`;

const StyledSelect = styled(Select)`
  height: 32px;

  .ant-select-selection--single {
    height: 32px;
  }

  .ant-select-selection__rendered {
    height: 32px;
  }

  .ant-select-selection-selected-value {
    height: 32px;
    display: flex !important;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
  }

  .ant-select-arrow-icon {
    svg {
      fill: #00b0ff;
    }
  }
`;
