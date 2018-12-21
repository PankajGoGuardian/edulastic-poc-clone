import React, { Component } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Button, Row, Col, Input, Pagination, Spin, Affix } from 'antd';
import Modal from 'react-responsive-modal';
import {
  withWindowSizes,
  Card,
  helpers,
  FlexContainer
} from '@edulastic/common';
import { desktopWidth, textColor } from '@edulastic/colors';

import styled from 'styled-components';
import Item from './Item';
import ListItem from './ListItem';
import { receiveTestsAction } from '../../actions/tests';
import {
  getTestsSelector,
  getTestsLoadingSelector,
  getTestsCountSelector,
  getTestsLimitSelector,
  getTestsPageSelector,
  getTestsCreatingSelector
} from '../../selectors/tests';
import TestFilters from '../common/TestFilters';
import TestFiltersNav from '../common/TestFilters/TestFiltersNav';
import SortBar from './SortBar';
import ListHeader from '../common/ListHeader';

class TestList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchStr: '',
      blockStyle: 'tile',
      isShowFilter: false,
      items: [
        { icon: 'book', key: 'library', text: 'Entire Library' },
        { icon: 'folder', key: 'byMe', text: 'Authored by me' },
        { icon: 'copy', key: 'coAuthor', text: 'I am a Co-Author' },
        { icon: 'reload', key: 'previously', text: 'Previously Used' },
        { icon: 'heart', key: 'favorites', text: 'My Favorites' }
      ]
    };
  }

  componentDidMount() {
    const { receiveTests, page, limit } = this.props;

    receiveTests({ page, limit });
  }

  handleSearch = value => {
    const { receiveTests, limit } = this.props;
    this.setState(
      {
        searchStr: value
      },
      () => receiveTests({ page: 1, limit, search: value })
    );
  };

  handleSearchChange = e => {
    this.setState({
      searchStr: e.target.value
    });
  };

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  handlePaginationChange = page => {
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

  handleSortChange = value => {
    console.log(value);
  };

  handleStyleChange = blockStyle => {
    this.setState({
      blockStyle
    });
  };

  showFilterHandler = () => {
    this.setState({ isShowFilter: true });
  };

  closeSearchModal = () => {
    this.setState({ isShowFilter: false });
  };

  render() {
    const {
      tests,
      page,
      limit,
      count,
      loading,
      history,
      creating,
      match,
      windowWidth
    } = this.props;
    const { searchStr, blockStyle, items, isShowFilter } = this.state;
    const { from, to } = helpers.getPaginationInfo({ page, limit, count });

    return (
      <div>
        <ListHeader
          onCreate={this.handleCreate}
          creating={creating}
          title="Test List"
        />
        <Container>
          <MobileFilter>
            <Input.Search
              placeholder="Search by skills and keywords"
              onSearch={this.handleSearch}
              onChange={this.handleSearchChange}
              size="large"
              value={searchStr}
            />
            <FilterButton>
              <Button onClick={() => this.showFilterHandler()}>
                {!isShowFilter ? 'SHOW FILTERS' : 'HIDE FILTERS'}
              </Button>
            </FilterButton>
          </MobileFilter>
          <Modal open={isShowFilter} onClose={this.closeSearchModal}>
            <SearchModalContainer>
              <TestFilters onChange={this.handleFiltersChange}>
                <TestFiltersNav
                  items={items}
                  onSelect={this.handleFilterNavSelect}
                />
              </TestFilters>
            </SearchModalContainer>
          </Modal>
          <FlexContainer>
            <Filter style={{ zIndex: 0 }}>
              <Affix
                style={{
                  position: 'fixed',
                  width: 250,
                  top: 85,
                  paddingRight: 15
                }}
              >
                <Input.Search
                  placeholder="Search by skills and keywords"
                  onSearch={this.handleSearch}
                  onChange={this.handleSearchChange}
                  size="large"
                  value={searchStr}
                />
                <ScrollbarWrapper>
                  <PerfectScrollbar>
                    <ScrollBox>
                      <TestFilters onChange={this.handleFiltersChange}>
                        <TestFiltersNav
                          items={items}
                          onSelect={this.handleFilterNavSelect}
                        />
                      </TestFilters>
                    </ScrollBox>
                  </PerfectScrollbar>
                </ScrollbarWrapper>
              </Affix>
            </Filter>
            <Main>
              <FlexContainer
                justifyContent="space-between"
                style={{ marginBottom: 10 }}
              >
                <PaginationInfo>
                  {from} to {to} of <i>{count}</i>
                </PaginationInfo>
                <SortBar
                  onSortChange={this.handleSortChange}
                  onStyleChange={this.handleStyleChange}
                  activeStyle={blockStyle}
                />
              </FlexContainer>
              <Card>
                {loading ? (
                  <Spin size="large" />
                ) : blockStyle === 'tile' ? (
                  <Row gutter={16} type="flex">
                    {tests.map(
                      item =>
                        item !== null && (
                          <Col
                            key={item._id}
                            span={windowWidth > 468 ? 8 : 24}
                            style={{ marginBottom: 15 }}
                          >
                            <Item item={item} history={history} match={match} />
                          </Col>
                        )
                    )}
                  </Row>
                ) : (
                  <Row>
                    {tests.map(item => (
                      <Col span={24}>
                        <ListItem item={item} history={history} match={match} />
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
            </Main>
          </FlexContainer>
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
  windowWidth: PropTypes.number.isRequired
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
      creating: getTestsCreatingSelector(state)
    }),
    {
      receiveTests: receiveTestsAction
    }
  )
);

export default enhance(TestList);

const ScrollBox = styled.div`
  & > div {
    padding-top: 0px;
    padding-bottom: 5px;
    padding-right: 15px;
  }
`;

const CardWrapper = styled(Col)`
  margin-bottom: 15px;
`;

const Container = styled.div`
  padding: 20px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;

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

  .scrollbar-container {
    overflow: auto !important;
    height: calc(100vh - 160px);

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ScrollbarWrapper = styled.div`
  margin-top: 15px;
`;

const PaginationInfo = styled.span`
  font-weight: 600;
  font-size: 13px;
`;

const Filter = styled.div`
  width: 250px;

  @media (max-width: 993px) {
    display: none;
  }
`;

const MobileFilter = styled.div`
  height: 50px;
  margin-bottom: 15px;
  @media (min-width: 993px) {
    display: none;
  }

  @media (max-width: 993px) {
    display: flex;
    .ant-input-search {
      margin-right: 10px;
    }
  }
`;

const Main = styled.div`
  flex: 1;
`;

const FilterButton = styled.div`
  display: none;
  flex: 1;
  height: 50px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;

  .ant-btn {
    height: 50px;
    border-radius: 3px;
    width: 100%;

    span {
      font-size: 11px;
      font-weight: 600;
      color: ${textColor};
    }
  }

  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`;

const SearchModalContainer = styled.div`
  width: 100%;
`;
