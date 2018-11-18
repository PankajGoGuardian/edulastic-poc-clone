import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Container } from '../../common';
import Sidebar from './Sidebar';
import { Calculator } from '../common';
import Breadcrumb from '../../Breadcrumb';
import { getSummarySelector } from '../../../selectors/tests';

const Summary = ({ setData, test, summary, current }) => {
  const handleChangeField = (field, value) => {
    setData({ ...test, [field]: value });
  };

  const handleChangeGrade = (grades) => {
    setData({ ...test, grades });
  };

  const handleChangeSubjects = (subjects) => {
    setData({ ...test, subjects });
  };

  const tableData = summary.map(data => ({
    key: data.standard,
    standard: data.standard,
    qs: data.questionsCount,
    points: data.score || 0
  }));

  return (
    <Container>
      <Breadcrumb data={['ITEM LIST', current]} style={{ position: 'unset' }} />
      <Paper style={{ marginRight: 25, marginTop: 25 }}>
        <Row gutter={32}>
          <Col span={12}>
            <Sidebar
              title={test.title}
              description={test.description}
              tags={test.tags}
              analytics={test.analytics}
              collections={test.collection}
              createdBy={test.createdBy}
              onChangeField={handleChangeField}
            />
          </Col>
          <Col span={12}>
            <Calculator
              totalPoints={test.scoring.total}
              questionsCount={test.scoring.testItems.length}
              grades={test.grades}
              subjects={test.subjects}
              onChangeGrade={handleChangeGrade}
              onChangeSubjects={handleChangeSubjects}
              tableData={tableData}
            />
          </Col>
        </Row>
      </Paper>
      {/* <Col span={12}>
        <Paper style={{ marginTop: 45 }}>
          <Calculator
            totalPoints={test.scoring.total}
            questionsCount={test.scoring.testItems.length}
            grades={test.grades}
            subjects={test.subjects}
            onChangeGrade={handleChangeGrade}
            onChangeSubjects={handleChangeSubjects}
            tableData={tableData}
          />
        </Paper>
      </Col> */}
    </Container>
  );
};

Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
  current: PropTypes.string.isRequired
};

const enhance = compose(
  memo,
  connect(state => ({
    summary: getSummarySelector(state)
  }))
);

export default enhance(Summary);
