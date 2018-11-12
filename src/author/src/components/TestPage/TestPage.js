import React, { useState, useEffect, memo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import uuidv4 from 'uuid/v4';

import styled from 'styled-components';
import AddItems from './AddItems';
import TestPageHeader from './TestPageHeader';
import {
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
  setDefaultTestDataAction,
} from '../../actions/tests';
import {
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector,
} from '../../selectors/tests';
import SourceModal from '../QuestionEditor/SourceModal';
import Review from './Review';
import Summary from './Summary';
import Assign from './Assign';

const TestPage = ({
  createTest,
  match,
  receiveTestById,
  test,
  setData,
  updateTest,
  setDefaultData,
  rows,
  creating,
}) => {
  useEffect(
    () => {
      if (match.params.id) {
        receiveTestById(match.params.id);
      } else {
        setDefaultData();
      }
    },
    [match],
  );

  const [current, setCurrent] = useState('addItems');
  const [showModal, setShowModal] = useState(false);

  const handleNavChange = (value) => {
    if (value === 'source') {
      setShowModal(true);
      return;
    }
    setCurrent(value);
  };

  const handleAddItems = (testItems) => {
    const newTest = cloneDeep(test);

    newTest.testItems = testItems;
    newTest.scoring.testItems = testItems.map((item) => {
      const foundItem = newTest.scoring.testItems.find(({ id }) => item && item.id === id);
      if (!foundItem) {
        return {
          id: item ? item.id : uuidv4(),
          points: 0,
        };
      }
      return foundItem;
    });

    setData(newTest);
    message.info('Selected items was added');
  };

  const handleChangeGrade = (grades) => {
    setData({ ...test, grades });
  };

  const handleChangeSubject = (subjects) => {
    setData({ ...test, subjects });
  };

  const selectedItems = test.testItems.map(({ id = uuidv4() }) => id);

  const renderContent = () => {
    switch (current) {
      case 'addItems':
        return (
          <AddItems onAddItems={handleAddItems} selectedItems={selectedItems} current={current} />
        );
      case 'summary':
        return <Summary setData={setData} test={test} current={current} />;
      case 'review':
        return (
          <Review
            test={test}
            rows={rows}
            onChangeGrade={handleChangeGrade}
            onChangeSubjects={handleChangeSubject}
            current={current}
          />
        );
      case 'assign':
        return <Assign test={test} setData={setData} current={current} />;
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

  const handleApplySource = (source) => {
    try {
      const data = JSON.parse(source);
      setData(data);
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {showModal && (
        <SourceModal onClose={() => setShowModal(false)} onApply={handleApplySource}>
          {JSON.stringify(test, null, 4)}
        </SourceModal>
      )}
      <TestPageHeader
        onChangeNav={handleNavChange}
        current={current}
        onSave={handleSave}
        title={test.title}
        creating={creating}
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
  setDefaultData: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  creating: PropTypes.bool.isRequired,
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
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
    }),
    {
      createTest: createTestAction,
      updateTest: updateTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction,
    },
  ),
);

export default enhance(TestPage);

const Container = styled.div`
  width: 100%;
  position: absolute;
  height: 100%;
  overflow: auto;
  left: 0;
  right: 0;
`;
