import React, { useState, memo } from 'react';
import { Row, Col } from 'antd';
import { Paper } from '@edulastic/common';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';

import HeaderBar from './HeaderBar';
import Calculator from './Calculator';
import List from './List';
import ItemsTable from '../common/ItemsTable/ItemsTable';
import { getItemsTypesSelector, getStandardsSelector } from '../../../selectors/testItems';
import { getSummarySelector } from '../../../selectors/tests';
import { setTestDataAction } from '../../../actions/tests';

const Review = ({
  test,
  onChangeGrade,
  onChangeSubjects,
  rows,
  setData,
  types,
  standards,
  summary,
}) => {
  const [isCollapse, setIsCollapse] = useState(false);

  const setSelected = (values) => {
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

  const handleSelectAll = (e) => {
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

    newData.scoring.testItems = test.scoring.testItems.filter((item) => {
      const foundItem = test.testItems.find(({ id }) => id === item.id);
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

  const handleMoveTo = (newIndex) => {
    const oldIndex = test.testItems.findIndex(item => item.selected);
    moveTestItems({ oldIndex, newIndex });
  };

  const handleChangePoints = (testItemId, value) => {
    const newData = cloneDeep(test);

    const itemIndex = newData.scoring.testItems.findIndex(({ id }) => testItemId === id);

    newData.scoring.testItems[itemIndex].points = value;
    newData.scoring.total = newData.scoring.testItems.reduce((acc, item) => acc + item.points, 0);

    setData(newData);
  };

  const tableData = summary.map(data => ({
    key: data.standard,
    standard: data.standard,
    qs: data.questionsCount,
    points: data.score || 0,
  }));

  const totalPoints = test.scoring.total;
  const questionsCount = test.testItems.length;

  const handleSelectedTest = (items) => {
    const result = items.map(item => test.testItems.findIndex(i => item === i.id));
    setSelected(result);
  };

  const selected = test.testItems.reduce((acc, item, i) => {
    if (item.selected) {
      acc.push(i);
    }
    return acc;
  }, []);

  return (
    <Row>
      <Col span={19} style={{ padding: '0 45px' }}>
        <HeaderBar
          onSelectAll={handleSelectAll}
          selectedItems={selected}
          onRemoveSelected={handleRemoveSelected}
          onCollapse={handleCollapse}
          onMoveTo={handleMoveTo}
        />
        <Paper>
          {isCollapse ? (
            <ItemsTable
              items={test.testItems}
              setSelectedTests={handleSelectedTest}
              selectedTests={selected.map(i => test.testItems[i].id)}
            />
          ) : (
            <List
              onChangePoints={handleChangePoints}
              testItems={test.testItems}
              rows={rows}
              standards={standards}
              selected={selected}
              setSelected={setSelected}
              onSortEnd={moveTestItems}
              types={types}
              scoring={test.scoring}
            />
          )}
        </Paper>
      </Col>
      <Col span={5}>
        <Calculator
          totalPoints={totalPoints}
          questionsCount={questionsCount}
          grades={test.grades}
          subjects={test.subjects}
          thumbnail={test.thumbnail}
          onChangeGrade={onChangeGrade}
          onChangeSubjects={onChangeSubjects}
          tableData={tableData}
        />
      </Col>
    </Row>
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
};

const enhance = compose(
  memo,
  connect(
    state => ({
      types: getItemsTypesSelector(state),
      standards: getStandardsSelector(state),
      summary: getSummarySelector(state),
    }),
    { setData: setTestDataAction },
  ),
);

export default enhance(Review);
