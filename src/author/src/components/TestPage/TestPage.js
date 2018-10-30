import React, { useState, useEffect, memo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { Container } from '../common';
import AddItems from './AddItems';
import TestPageHeader from './TestPageHeader';
import {
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
} from '../../actions/tests';
import { getTestSelector } from '../../selectors/tests';

const TestPage = ({ createTest, match, receiveTestById, test, setData, updateTest }) => {
  useEffect(() => {
    if (match.params.id) {
      receiveTestById(match.params.id);
    }
  }, []);

  const [current, setCurrent] = useState('addItems');

  const handleNavChange = (value) => {
    setCurrent(value);
  };

  const handleAddItems = (items) => {
    setData({ ...test, testItems: items.map(id => ({ id })) });
  };

  const renderContent = () => {
    switch (current) {
      case 'addItems':
        return <AddItems onAddItems={handleAddItems} />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (test.id) {
      updateTest(test.id, test);
    } else {
      createTest(test);
    }
  };

  return (
    <div>
      <TestPageHeader
        onChangeNav={handleNavChange}
        current={current}
        onSave={handleSave}
        title={test.title}
      />
      <Container>{renderContent()}</Container>
    </div>
  );
};

TestPage.propTypes = {
  createTest: PropTypes.func.isRequired,
  updateTest: PropTypes.func.isRequired,
  receiveTestById: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  test: PropTypes.object,
};

TestPage.defaultProps = {
  test: null,
};

const enhance = compose(
  memo,
  withRouter,
  connect(
    state => ({
      test: getTestSelector(state),
    }),
    {
      createTest: createTestAction,
      updateTest: updateTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
    },
  ),
);

export default enhance(TestPage);
