import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, Paper } from '@edulastic/common';
import { compose } from 'redux';
import { connect } from 'react-redux';

import ItemHeader from '../QuestionEditor/ItemHeader';
import TestPageNav from './TestPageNav';
import { Container } from '../common';
import Items from './Items';
import { getTestItemsSelector, getItemsLoadingSelector } from '../../selectors/testItems';
import { receiveTestItemsAction } from '../../actions/testItems';

class TestPage extends Component {
  state = {
    current: 'addItems',
    checkedItems: [],
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    testItems: PropTypes.array.isRequired,
    receiveTestItems: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const { receiveTestItems } = this.props;
    receiveTestItems();
  }

  handleNavChange = (value) => {
    this.setState({
      current: value,
    });
  };

  handleSelectItems = (checkedItems) => {
    this.setState({
      checkedItems,
    });
  };

  handleAddItems = () => {
    console.log('handleAddItems');
  };

  renderContent = () => {
    const { testItems, loading } = this.props;
    const { current, checkedItems } = this.state;

    switch (current) {
      case 'addItems':
        return (
          <Items
            items={testItems}
            loading={loading}
            onSelect={this.handleSelectItems}
            checkedItems={checkedItems}
            onAddItems={this.handleAddItems}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { match } = this.props;
    const { current } = this.state;

    return (
      <div>
        <ItemHeader
          hideIcon
          title="Test"
          link={{ url: '/author/tests', text: 'Test list' }}
          reference={match.params.id || ''}
        >
          <FlexContainer>
            <TestPageNav onChange={this.handleNavChange} current={current} />
          </FlexContainer>
        </ItemHeader>
        <Container>
          <Paper>{this.renderContent()}</Paper>
        </Container>
      </div>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      testItems: getTestItemsSelector(state),
      loading: getItemsLoadingSelector(state),
    }),
    { receiveTestItems: receiveTestItemsAction },
  ),
);

export default enhance(TestPage);
