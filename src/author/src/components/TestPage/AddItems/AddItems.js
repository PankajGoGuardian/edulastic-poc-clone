import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { Paper, FlexContainer, EduButton } from '@edulastic/common';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Table, Row, Col, Input, Spin, Select } from 'antd';
import styled from 'styled-components';
import MainInfoCell from './MainInfoCell';
import MetaInfoCell from './MetaInfoCell';
import TestFilters from '../../common/TestFilters';
import { getItemsLoadingSelector, getTestItemsSelector } from '../../../selectors/testItems';
import { receiveTestItemsAction } from '../../../actions/testItems';

const useSelectedItemsEffect = (selectedItems) => {
  const [isMappedSelectedItems, setIsMappedSelectedItems] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(() => {
    if (!selectedTests.length && selectedItems.length && !isMappedSelectedItems) {
      setIsMappedSelectedItems(true);
      setSelectedTests(selectedItems);
    }
  });

  return { selectedTests, setSelectedTests };
};

const Items = ({ items, loading, receiveTestItems, history, onAddItems, selectedItems }) => {
  useEffect(() => {
    receiveTestItems();
  }, []);

  const [searchStr, setSearchStr] = useState('');
  const { selectedTests, setSelectedTests } = useSelectedItemsEffect(selectedItems);

  if (loading) return <Spin size="large" />;

  const columns = [
    {
      title: 'Main info',
      dataIndex: 'main',
      key: 'main',
      render: data => <MainInfoCell data={data} />,
    },
    {
      title: 'Meta info',
      dataIndex: 'meta',
      key: 'meta',
      render: data => <MetaInfoCell data={data} />,
    },
  ];

  const data = items.map((item) => {
    const main = {
      title: item.id,
      id: item.id,
    };
    const meta = {
      id: item.id,
      by: 'Kevin Hart',
      shared: '9578 (1)',
      likes: 9,
      tags: item.tags && item.tags.length ? item.tags : [],
    };

    if (item.data.questions && item.data.questions.length) {
      main.stimulus = item.data.questions[0].data.stimulus;
    }

    return {
      key: item.id,
      main,
      meta,
    };
  });

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedTests(selectedRowKeys);
    },
    selectedRowKeys: selectedTests,
  };

  const handleSearch = (val) => {
    console.log(val);
  };

  const handleFiltersChange = (name, filterData) => {
    console.log(name, filterData);
  };

  const handleSortChange = () => {};

  const handleAddItems = () => {
    onAddItems(selectedTests);
  };

  const handleCreateNewItem = () => {
    history.push('/author/items');
  };

  return (
    <React.Fragment>
      <Row gutter={16} style={{ paddingTop: 15, paddingBottom: 15 }} align="middle">
        <Col span={6}>
          <Input.Search
            placeholder="Search by skills and keywords"
            onSearch={handleSearch}
            onChange={e => setSearchStr(e.target.value)}
            style={{ width: '100%' }}
            size="large"
            value={searchStr}
          />
        </Col>
        <Col span={18}>
          <Row gutter={16}>
            <Col span={24}>
              <FlexContainer justifyContent="space-between">
                <span>{items.length} questions</span>
                <div>
                  <StyledButton type="primary" size="large" onClick={handleAddItems}>
                    <span>Add {selectedTests.length} selected items</span>
                  </StyledButton>
                  <StyledButton type="secondary" size="large" onClick={handleCreateNewItem}>
                    Create new Item
                  </StyledButton>
                  <Select
                    size="large"
                    defaultValue="popularity"
                    style={{ width: 120 }}
                    onChange={handleSortChange}
                  >
                    <Select.Option value="popularity">Popularity</Select.Option>
                  </Select>
                </div>
              </FlexContainer>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <TestFilters onChange={handleFiltersChange} />
        </Col>
        <Col span={18}>
          <Paper>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
              showHeader={false}
            />
          </Paper>
        </Col>
      </Row>
    </React.Fragment>
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
      loading: getItemsLoadingSelector(state),
    }),
    { receiveTestItems: receiveTestItemsAction },
  ),
);

export default enhance(Items);

const StyledButton = styled(EduButton)`
  margin-right: 15px;
  text-transform: uppercase;

  :last-child {
    margin-right: 0;
  }
`;
