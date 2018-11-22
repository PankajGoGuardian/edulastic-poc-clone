import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Paper, FlexContainer, EduButton } from '@edulastic/common';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { secondaryTextColor } from '@edulastic/colors';

import { Row, Col, Input, Spin, Select } from 'antd';
import styled from 'styled-components';
import TestFilters from '../../common/TestFilters';
import {
  getItemsLoadingSelector,
  getTestItemsSelector
} from '../../../selectors/testItems';
import { receiveTestItemsAction } from '../../../actions/testItems';
import TestFiltersNav from '../../common/TestFilters/TestFiltersNav';
import ItemsTable from '../common/ItemsTable/ItemsTable';

const filterItems = [
  { icon: 'book', key: 'library', text: 'Entire Library' },
  { icon: 'folder', key: 'byMe', text: 'Authored by me' },
  { icon: 'copy', key: 'coAuthor', text: 'I am a Co-Author' },
  { icon: 'reload', key: 'previously', text: 'Previously Used' },
  { icon: 'heart', key: 'favorites', text: 'My Favorites' }
];

const Items = ({
  items,
  loading,
  receiveTestItems,
  history,
  onAddItems,
  selectedItems,
}) => {
  useEffect(() => {
    receiveTestItems({});
  }, []);
  const [searchStr, setSearchStr] = useState('');
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(
    () => {
      setSelectedTests(selectedItems);
    },
    [selectedItems]
  );

  if (loading) return <Spin size="large" />;

  const handleSearch = (val) => {
    console.log(val);
  };

  const handleFiltersChange = (name, filterData) => {
    console.log(name, filterData);
  };

  const handleSortChange = () => {};

  const handleCreateNewItem = () => {
    history.push('/author/items');
  };

  return (
    <Container>
      <Row
        gutter={29}
        style={{ paddingBottom: 15 }}
        align="middle"
      >
        <Col span={5}>
          <Input.Search
            placeholder="Search by skills and keywords"
            onSearch={handleSearch}
            onChange={e => setSearchStr(e.target.value)}
            style={{ width: '100%' }}
            size="large"
            value={searchStr}
          />
        </Col>
        <Col span={19}>
          <Row gutter={16}>
            <Col span={24}>
              <FlexContainer justifyContent="space-between">
                <Question>{items.length} questions</Question>
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
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={29}>
        <Col span={5}>
          <TestFilters style={{ paddingTop: 13 }} onChange={handleFiltersChange}>
            <TestFiltersNav
              items={filterItems}
              // onSelect={this.handleFilterNavSelect}
            />
          </TestFilters>
        </Col>
        <Col span={19}>
          <Paper>
            <ItemsTable
              items={items}
              setSelectedTests={setSelectedTests}
              selectedTests={selectedTests}
              onAddItems={onAddItems}
            />
          </Paper>
        </Col>
      </Row>
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
};

const enhance = compose(
  memo,
  withRouter,
  connect(
    state => ({
      items: getTestItemsSelector(state),
      loading: getItemsLoadingSelector(state)
    }),
    { receiveTestItems: receiveTestItemsAction }
  )
);

export default enhance(Items);

const Container = styled.div`
  padding: 25px 30px 30px 30px;
  height: 100%;

  .ant-input {
    font-size: 13px;
    letter-spacing: 0.2px;
    color: #b1b1b1;
    ::placeholder {
      font-style: italic;
      color: #b1b1b1;
    }
  }

  .ant-input-suffix {
    font-size: 15px;
    svg {
      fill: #00b0ff;
    }
  }
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

const Question = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${secondaryTextColor};
`;
