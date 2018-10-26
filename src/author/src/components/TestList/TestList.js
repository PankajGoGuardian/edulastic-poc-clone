import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Paper, Pagination, withWindowSizes } from '@edulastic/common';
import { compose } from 'redux';
import styled from 'styled-components';
import { mobileWidth } from '@edulastic/colors';

import Item from './Item';
import ListHeader from '../common/ListHeader';
import { receiveTestsAction } from '../../actions/tests';
import {
  getTestsSelector,
  getTestsLoadingSelector,
  getTestsCountSelector,
  getTestsLimitSelector,
  getTestsPageSelector,
  getTestsCreatingSelector,
} from '../../selectors/tests';

class TestList extends Component {
  componentDidMount() {
    const { receiveTests } = this.props;
    receiveTests();
  }

  handleSearch = (value) => {
    const { receiveTests, limit } = this.props;
    receiveTests({ page: 1, limit, search: value });
  };

  handleCreate = () => {
    const { history, match } = this.props;
    history.push(`${match.url}/create`);
  };

  handlePrevious = () => {
    const { receiveTests, page, limit } = this.props;
    receiveTests({ page: page - 1, limit });
  };

  handleNext = () => {
    const { receiveTests, page, limit } = this.props;
    receiveTests({ page: page + 1, limit });
  };

  render() {
    const {
      tests,
      page,
      limit,
      count,
      loading,
      windowWidth,
      history,
      creating,
      match,
    } = this.props;
    return (
      <Container>
        <ListHeader
          onSearch={this.handleSearch}
          onCreate={this.handleCreate}
          creating={creating}
          windowWidth={windowWidth}
          title="Test List"
        />
        <Paper style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
          {tests.map(item => (
            <Item key={item.id} item={item} history={history} match={match} />
          ))}
        </Paper>
        <Pagination
          onPrevious={this.handlePrevious}
          onNext={this.handleNext}
          page={page}
          itemsPerPage={limit}
          count={count}
          loading={loading}
        />
      </Container>
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
  windowWidth: PropTypes.number.isRequired,
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
  padding: 20px 40px;

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;
