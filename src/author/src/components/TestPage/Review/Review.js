import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { Paper } from '@edulastic/common';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';

import HeaderBar from './HeaderBar';
import Calculator from './Calculator';
import List from './List';

const Review = ({ test, onChangeGrade, onChangeSubjects, rows, setData }) => {
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    if (checked) {
      setSelected(rows.map((row, i) => i));
    } else {
      setSelected([]);
    }
  };

  const handleRemoveSelected = () => {
    setData({ ...test, testItems: test.testItems.filter((item, i) => !selected.includes(i)) });
    setSelected([]);
  };

  const handleCollapse = () => {
    console.log('collapse');
  };

  const moveTestItems = ({ oldIndex, newIndex }) => {
    const newData = cloneDeep(test);

    const [removed] = newData.testItems.splice(oldIndex, 1);
    newData.testItems.splice(newIndex, 0, removed);

    setData(newData);
  };

  const handleMoveTo = (newIndex) => {
    const [oldIndex] = selected;
    moveTestItems({ oldIndex, newIndex });
  };

  const tableData = [
    {
      key: 'standard',
      standard: 'Standard',
      qs: 'qs',
      points: 100,
    },
  ];

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
          <List
            rows={rows}
            selected={selected}
            setSelected={setSelected}
            onSortEnd={moveTestItems}
          />
        </Paper>
      </Col>
      <Col span={5}>
        <Calculator
          total={test.scoring.total}
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
};

export default Review;
