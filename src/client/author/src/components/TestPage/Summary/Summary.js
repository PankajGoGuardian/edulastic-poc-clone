import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Paper } from '@edulastic/common';
import { Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import { IconSource } from '@edulastic/icons';
import { blue } from '@edulastic/colors';
import { withNamespaces } from '@edulastic/localization';

import { Container, ButtonLink } from '../../common';
import Sidebar from './Sidebar';
import { Calculator } from '../common';
import Breadcrumb from '../../Breadcrumb';
import { getSummarySelector } from '../../../selectors/tests';

const Summary = ({ setData, test, summary, current, t }) => {
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
    points: data.score || 0,
  }));

  return (
    <Container>
      <SecondHeader>
        <Breadcrumb data={['ITEM LIST', current]} style={{ position: 'unset' }} />
        <Button>
          <ButtonLink
            // onClick={onShowSource}
            color="primary"
            icon={<IconSource color={blue} />}
          >
            {t('component.questioneditor.buttonbar.source')}
          </ButtonLink>
        </Button>
      </SecondHeader>
      <Paper style={{ marginTop: 25 }}>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={16}>
            <Row gutter={32}>
              <Col span={12}>
                <Sidebar
                  title={test.title}
                  description={test.description}
                  tags={test.tags}
                  analytics={test.analytics}
                  collection={test.collection}
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
          </Col>
        </Row>
      </Paper>
    </Container>
  );
};

Summary.propTypes = {
  setData: PropTypes.func.isRequired,
  test: PropTypes.object.isRequired,
  summary: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
};

const enhance = compose(
  memo,
  withNamespaces('author'),
  connect(state => ({
    summary: getSummarySelector(state),
  })),
);

export default enhance(Summary);

const SecondHeader = styled.div`
  display: flex;
  justify-content: space-between;

  .ant-btn {
    background: transparent;
    height: 24px;
    margin-left: 17px;
  }
`;
