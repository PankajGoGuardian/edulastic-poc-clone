import React, { useState, memo } from 'react';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { Paper, withWindowSizes } from '@edulastic/common';
import PreviewModal from '../../common/PreviewModal';
import HeaderBar from './HeaderBar';
import List from './List';
import ItemsTable from './ItemsTable';
import {
  getItemsTypesSelector,
  getStandardsSelector
} from '../../../selectors/testItems';
import { getSummarySelector } from '../../../selectors/tests';
import { setTestDataAction } from '../../../actions/tests';
import { Calculator, Photo } from '../common';
import Breadcrumb from '../../Breadcrumb';

const Review = ({
  test,
  onChangeGrade,
  onChangeSubjects,
  rows,
  setData,
  types,
  standards,
  summary,
  current,
  windowWidth
}) => {
  const [isCollapse, setIsCollapse] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [item, setItem] = useState([]);

  const setSelected = values => {
    const newData = cloneDeep(test);

    newData.testItems = newData.testItems.map((item, i) => {
      if (values.includes(i)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
      return item;
    });

    setData(newData);
  };

  const handleSelectAll = e => {
    const { checked } = e.target;

    if (checked) {
      setSelected(rows.map((row, i) => i));
    } else {
      setSelected([]);
    }
  };

  const handleRemoveSelected = () => {
    const newData = cloneDeep(test);

    newData.testItems = test.testItems.filter(item => !item.selected);

    newData.scoring.testItems = test.scoring.testItems.filter(item => {
      const foundItem = test.testItems.find(({ id }) => id === item._id);
      if (foundItem && foundItem.selected) {
        return false;
      }

      return true;
    });

    setSelected([]);
    setData(newData);
  };

  const handleCollapse = () => {
    setIsCollapse(!isCollapse);
  };

  const moveTestItems = ({ oldIndex, newIndex }) => {
    const newData = cloneDeep(test);

    const [removed] = newData.testItems.splice(oldIndex, 1);
    newData.testItems.splice(newIndex, 0, removed);

    setData(newData);
  };

  const handleMoveTo = newIndex => {
    const oldIndex = test.testItems.findIndex(item => item.selected);
    moveTestItems({ oldIndex, newIndex });
  };

  const handleChangePoints = (testItemId, value) => {
    const newData = cloneDeep(test);

    const itemIndex = newData.scoring.testItems.findIndex(
      ({ id }) => testItemId === id
    );

    newData.scoring.testItems[itemIndex].points = value;
    newData.scoring.total = newData.scoring.testItems.reduce(
      (acc, item) => acc + item.points,
      0
    );

    setData(newData);
  };

  const handlePreview = data => {
    setItem({ id: data });
    setModalVisibility(true);
  };

  const closeModal = () => {
    setModalVisibility(false);
  };

  const tableData = summary.map(data => ({
    key: data.standard,
    standard: data.standard,
    qs: data.questionsCount,
    points: data.score || 0
  }));

  const totalPoints = test.scoring.total;
  const questionsCount = test.testItems.length;

  const handleSelectedTest = items => {
    const result = items.map(item =>
      test.testItems.findIndex(i => item === i._id)
    );
    setSelected(result);
  };

  const selected = test.testItems.reduce((acc, item, i) => {
    if (item.selected) {
      acc.push(i);
    }
    return acc;
  }, []);

  const breadcrumbData = [
    {
      title: 'TESTS LIST',
      to: '/author/tests'
    },
    {
      title: current,
      to: ''
    }
  ];

  const isSmallSize = windowWidth > 993 ? 1 : 0;
  const isMobileSize = windowWidth > 468 ? 1 : 0;

  return (
    <div style={{ paddingTop: 25 }}>
      <Row>
        <Col
          span={isSmallSize ? 19 : 24}
          style={{ padding: isMobileSize ? '0 45px' : '0 25px' }}
        >
          <SecondHeader isMobileSize={isMobileSize}>
            <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
            <HeaderBar
              onSelectAll={handleSelectAll}
              selectedItems={selected}
              onRemoveSelected={handleRemoveSelected}
              onCollapse={handleCollapse}
              onMoveTo={handleMoveTo}
              windowWidth={windowWidth}
              setCollapse={isCollapse}
            />
          </SecondHeader>
          <Paper>
            {isCollapse ? (
              <ItemsTable
                items={test.testItems}
                setSelectedTests={handleSelectedTest}
                selectedTests={selected.map(i => test.testItems[i]._id)}
              />
            ) : (
              <List
                onChangePoints={handleChangePoints}
                onPreview={handlePreview}
                testItems={test.testItems}
                rows={rows}
                standards={standards}
                selected={selected}
                setSelected={setSelected}
                onSortEnd={moveTestItems}
                types={types}
                scoring={test.scoring}
                useDragHandle
              />
            )}
          </Paper>
        </Col>
        <Col
          span={isSmallSize ? 5 : 24}
          style={{
            padding: isSmallSize
              ? '0px'
              : isMobileSize
              ? '10px 45px'
              : '10px 25px'
          }}
        >
          <Calculator
            totalPoints={totalPoints}
            questionsCount={questionsCount}
            grades={test.grades}
            subjects={test.subjects}
            onChangeGrade={onChangeGrade}
            onChangeSubjects={onChangeSubjects}
            tableData={tableData}
          >
            <Photo url={test.thumbnail} />
          </Calculator>
        </Col>
      </Row>
      <PreviewModal
        isVisible={isModalVisible}
        onClose={closeModal}
        data={item}
      />
    </div>
  );
};

Review.propTypes = {
  test: PropTypes.object.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  rows: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
  types: PropTypes.any.isRequired,
  standards: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired,
  windowWidth: PropTypes.number.isRequired
};

const enhance = compose(
  memo,
  withWindowSizes,
  connect(
    state => ({
      types: getItemsTypesSelector(state),
      standards: getStandardsSelector(state),
      summary: getSummarySelector(state)
    }),
    { setData: setTestDataAction }
  )
);

export default enhance(Review);

const SecondHeader = styled.div`
  display: flex;
  flex-direction: ${props => (props.isMobileSize ? 'row' : 'column')}
  justify-content: space-between;

  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;
