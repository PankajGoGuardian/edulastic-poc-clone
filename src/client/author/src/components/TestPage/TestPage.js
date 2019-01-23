import React, { useState, useEffect, memo } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import uuidv4 from 'uuid/v4';
import styled from 'styled-components';
import { withWindowSizes } from '@edulastic/common';

import AddItems from './AddItems';
import TestPageHeader from './TestPageHeader';
import {
  createTestAction,
  receiveTestByIdAction,
  setTestDataAction,
  updateTestAction,
  setDefaultTestDataAction
} from '../../actions/tests';
import {
  getTestSelector,
  getTestItemsRowsSelector,
  getTestsCreatingSelector
} from '../../selectors/tests';
import { getSelectedItemSelector } from '../../selectors/testItems';
import { getUserSelector } from '../../selectors/user';
import SourceModal from '../QuestionEditor/SourceModal';
import ShareModal from '../common/ShareModal';
import Review from './Review';
import Summary from './Summary';
import Assign from './Assign';
import Setting from './Setting';

const TestPage = ({
  createTest,
  match,
  receiveTestById,
  test,
  user,
  setData,
  updateTest,
  setDefaultData,
  rows,
  creating,
  selectedRows,
  windowWidth
}) => {
  useEffect(
    () => {
      if (match.params.id) {
        receiveTestById(match.params.id);
      } else {
        setDefaultData();
      }
    },
    [match]
  );

  const [current, setCurrent] = useState('addItems');
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleNavChange = value => {
    if (value === 'source') {
      setShowModal(true);
      return;
    }
    setCurrent(value);
  };

  const handleAddItems = testItems => {
    const newTest = cloneDeep(test);

    newTest.testItems = testItems;
    newTest.scoring.testItems = testItems.map(item => {
      const foundItem = newTest.scoring.testItems.find(
        ({ id }) => item && item._id === id
      );
      if (!foundItem) {
        return {
          id: item ? item._id : uuidv4(),
          points: 0
        };
      }
      return foundItem;
    });
    setData(newTest);
  };

  const handleChangeGrade = grades => {
    setData({ ...test, grades });
  };

  const handleChangeSubject = subjects => {
    setData({ ...test, subjects });
  };

  const selectedItems = test.testItems.map(({ _id = uuidv4() }) => _id);

  const renderContent = () => {
    switch (current) {
      case 'addItems':
        return (
          <AddItems
            onAddItems={handleAddItems}
            selectedItems={selectedItems}
            current={current}
          />
        );
      case 'summary':
        return (
          <Summary
            onShowSource={() => handleNavChange('source')}
            setData={setData}
            test={test}
            current={current}
          />
        );
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
      case 'settings':
        return (
          <Setting
            current={current}
            onShowSource={() => handleNavChange('source')}
          />
        );
      case 'assign':
        return <Assign test={test} setData={setData} current={current} />;
      default:
        return null;
    }
  };

  const handleSave = async () => {
    const testItems = selectedRows.data;
    const newTest = cloneDeep(test);

    newTest.createdBy = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    };

    newTest.testItems = testItems;
    newTest.scoring.testItems = testItems.map(item => {
      const foundItem = newTest.scoring.testItems.find(
        ({ id }) => item && item._id === id
      );
      if (!foundItem) {
        return {
          id: item ? item._id : uuidv4(),
          points: 0
        };
      }
      return foundItem;
    });
    if (test._id) {
      updateTest(test._id, newTest);
    } else {
      createTest(newTest);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const onCloseShareModal = () => {
    setShowShareModal(false);
  };

  const handleApplySource = source => {
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
        <SourceModal
          onClose={() => setShowModal(false)}
          onApply={handleApplySource}
        >
          {JSON.stringify(test, null, 4)}
        </SourceModal>
      )}
      <ShareModal isVisible={showShareModal} onClose={onCloseShareModal} />
      <TestPageHeader
        onChangeNav={handleNavChange}
        current={current}
        onSave={handleSave}
        onShare={handleShare}
        title={test.title}
        creating={creating}
        windowWidth={windowWidth}
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
  windowWidth: PropTypes.number.isRequired,
  selectedRows: PropTypes.object,
  test: PropTypes.object,
  user: PropTypes.object
};

TestPage.defaultProps = {
  test: null,
  selectedRows: {},
  user: {}
};

const enhance = compose(
  memo,
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      test: getTestSelector(state),
      rows: getTestItemsRowsSelector(state),
      creating: getTestsCreatingSelector(state),
      selectedRows: getSelectedItemSelector(state),
      user: getUserSelector(state)
    }),
    {
      createTest: createTestAction,
      updateTest: updateTestAction,
      receiveTestById: receiveTestByIdAction,
      setData: setTestDataAction,
      setDefaultData: setDefaultTestDataAction
    }
  )
);

export default enhance(TestPage);

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  left: 0;
  right: 0;
`;
