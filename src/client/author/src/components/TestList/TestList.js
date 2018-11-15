import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withWindowSizes, Card, helpers, FlexContainer } from '@edulastic/common';
import { compose } from 'redux';
import { Row, Col, Input, Pagination, Spin } from 'antd';

import styled from 'styled-components';
import Item from './Item';
import { receiveTestsAction } from '../../actions/tests';
import {
  getTestsSelector,
  getTestsLoadingSelector,
  getTestsCountSelector,
  getTestsLimitSelector,
  getTestsPageSelector,
  getTestsCreatingSelector,
} from '../../selectors/tests';
import TestListHeader from './TestListHeader';
import TestFilters from '../common/TestFilters';
import TestFiltersNav from '../common/TestFilters/TestFiltersNav';
import SortBar from './SortBar';

class TestList extends Component {
  state = {
    searchStr: '',
    blockStyle: 'tile',
  };

  items = [
    { icon: '', key: 'library', text: 'Entire Library' },
    { icon: '', key: 'byMe', text: 'Authored by me' },
    { icon: '', key: 'coAuthor', text: 'I am a Co-Author' },
    { icon: '', key: 'previously', text: 'Previously Used' },
    { icon: '', key: 'favorites', text: 'My Favorites' },
  ];

  componentDidMount() {
    const { receiveTests, page, limit } = this.props;
    receiveTests({ page, limit });
  }

  handleSearch = (value) => {
    const { receiveTests, limit } = this.props;
    this.setState(
      {
        searchStr: value,
      },
      () => receiveTests({ page: 1, limit, search: value }),
    );
  };

  handleSearchChange = (e) => {
    this.setState({
      searchStr: e.target.value,
    });
  };

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  handlePaginationChange = (page) => {
    const { receiveTests, limit } = this.props;
    const { searchStr } = this.state;

    receiveTests({ page, limit, search: searchStr });
  };

  handleFilterNavSelect = ({ item, key, selectedKeys }) => {
    console.log(item, key, selectedKeys);
  };

  handleFiltersChange = (name, value) => {
    console.log(name, value);
  };

  handleSortChange = (value) => {
    console.log(value);
  };

  handleStyleChange = (blockStyle) => {
    this.setState({
      blockStyle,
    });
  };

  render() {
    const { tests, page, limit, count, loading, history, creating, match } = this.props;
    const { searchStr, blockStyle } = this.state;
    const { from, to } = helpers.getPaginationInfo({ page, limit, count });

    return (
      <div>
        <TestListHeader onCreate={this.handleCreate} creating={creating} title="Test List" />
        <Container>
          <Row gutter={16}>
            <Col span={6}>
              <Input.Search
                placeholder="Search by skills and keywords"
                onSearch={this.handleSearch}
                onChange={this.handleSearchChange}
                style={{ width: '100%' }}
                size="large"
                value={searchStr}
              />
            </Col>
            <Col span={18} style={{ paddingLeft: 24 }}>
              <FlexContainer justifyContent="space-between">
                <PaginationInfo>
                  {from} to {to} of <i>{count}</i>
                </PaginationInfo>
                <SortBar
                  onSortChange={this.handleSortChange}
                  onStyleChange={this.handleStyleChange}
                  activeStyle={blockStyle}
                />
              </FlexContainer>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <TestFilters onChange={this.handleFiltersChange}>
                <TestFiltersNav items={this.items} onSelect={this.handleFilterNavSelect} />
              </TestFilters>
            </Col>
            <Col span={18} style={{ paddingLeft: 24 }}>
              <Card>
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <Row gutter={16} type="flex">
                    {tests.map(item => (
                      <Col
                        key={item.id}
                        span={blockStyle === 'tile' ? 8 : 24}
                        style={{ marginBottom: 15 }}
                      >
                        <Item item={item} history={history} match={match} />
                      </Col>
                    ))}
                  </Row>
                )}
                <Pagination
                  style={{ padding: '20px 0' }}
                  defaultCurrent={page}
                  total={count}
                  pageSize={limit}
                  onChange={this.handlePaginationChange}
                  hideOnSinglePage
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

TestList.propTypes = {
  tests: PropTypes.array.isRequired,
  receiveTests: PropTypes.func.isRequired,
  creating: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

const enhance = compose(
  withWindowSizes,
  connect(
    state => ({
      tests: getTestsSelector(state),
      loading: getTestsLoadingSelector(state),
      page: getTestsPageSelector(state),
      limit: getTestsLimitSelector(state),
      count: getTestsCountSelector(state),
      creating: getTestsCreatingSelector(state),
    }),
    {
      receiveTests: receiveTestsAction,
    },
  ),
);

export default enhance(TestList);

const Container = styled.div`
  padding: 30px;

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

const PaginationInfo = styled.span`
  font-weight: 600;
  font-size: 13px;
`;
