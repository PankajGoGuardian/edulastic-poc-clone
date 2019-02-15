import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Row, Col, Select, Radio, Switch, List } from 'antd';

//components
import ListCard from '../Setting/Card';

//selectors
import {
  getReleaseScoreSelector,
  getActivityReview
} from '../../../selectors/tests';

const RadioGroup = Radio.Group;

const data = [
  {
    bands: 'Advanced',
    from: '100%'
  },
  {
    bands: 'Mastery',
    from: '100%'
  },
  {
    bands: 'Basic',
    from: '100%'
  },
  {
    bands: 'Approaching Basic',
    from: '100%'
  },
  {
    bands: 'Unsatisfactory',
    from: '100%'
  }
];

const calculators = ['None', 'Scientific', 'Basic', 'Graphing'];
const evaluationtypes = [
  'All or Nothing',
  'Partial Credit',
  'Dont penalize for incorrect selection'
];

const Settings = ({
  modalData,
  selectsData,
  onChange,
  activityReview,
  releaseScore
}) => {
  const [isAutomatic, setAssignmentCompletionType] = useState(0);
  const [calcType, setCalcType] = useState(0);
  const [type, setEvaluationType] = useState(0);

  const updateMarkAsDone = e => {
    setAssignmentCompletionType(e.target.value);
  };

  const calculatorShowMethod = e => {
    setCalcType(e.target.value);
  };

  const evalMethod = e => {
    setEvaluationType(e.target.value);
  };

  const ClosePolicy = () => {
    const policy = selectsData.closePolicy || [];
    return (
      <Select
        data-cy="closePolicy"
        defaultValue="Automatically on Due Date"
        size="large"
        style={{ width: '100%' }}
        value={modalData.closePolicy}
        onChange={value => onChange('closePolicy', value)}
      >
        {policy.map(({ value, text }) => (
          <Select.Option key={value} value={value} data-cy="close">
            {text}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const OpenPolicy = () => {
    const policy = selectsData.openPolicy || [];
    return (
      <Select
        data-cy="openPolicy"
        defaultValue="Automatically on Start Date"
        size="large"
        style={{ width: '100%' }}
        value={modalData.openPolicy}
        onChange={value => onChange('openPolicy', value)}
      >
        {policy.map(({ value, text }) => (
          <Select.Option key={value} value={value} data-cy="open">
            {text}
          </Select.Option>
        ))}
      </Select>
    );
  };

  return (
    <Fragment>
      <StyledRowLabel gutter={16}>
        <Col span={12}>Open Policy</Col>
        <Col span={12}>Close Policy</Col>
      </StyledRowLabel>
      <Row gutter={16}>
        <Col span={12}>
          <OpenPolicy />
        </Col>
        <Col span={12}>
          <ClosePolicy />
        </Col>
      </Row>

      {/* Mark as done */}
      <StyledRow gutter={16}>
        <Col span={8}>MARK AS DONE</Col>
        <Col span={16}>
          <AlignRight onChange={updateMarkAsDone} value={isAutomatic}>
            <Radio value={0}>Automatically</Radio>
            <Radio value={1}>Manually</Radio>
          </AlignRight>
        </Col>
      </StyledRow>
      {/* Mark as done */}

      {/* Release score */}
      <StyledRow gutter={16}>
        <Col span={8}>RELEASE SCORES AUTOMATICALLY</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked={releaseScore} />
        </Col>
      </StyledRow>
      {/* Release score */}

      {/* Require Safe Exam Browser */}
      <StyledRow gutter={16}>
        <Col span={8}>REQUIRE SAFE EXAM BROWSER</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked={activityReview} />
        </Col>
      </StyledRow>
      {/* Require Safe Exam Browser */}

      {/*Release Answers With Grades */}
      <StyledRow gutter={16}>
        <Col span={8}>RELEASE ANSWERS WITH GRADES</Col>
        <Col span={16}>
          <AlignSwitchRight />
        </Col>
      </StyledRow>
      {/*Release Answers With Grades */}

      {/* Shuffle Question */}
      <StyledRow gutter={16}>
        <Col span={8}>SHUFFLE QUESTION</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRow>
      {/* Shuffle Question */}

      {/* Shuffle Answer Choice */}
      <StyledRow gutter={16}>
        <Col span={8}>SHUFFLE ANSWER CHOICE</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRow>
      {/* Shuffle Answer Choice */}

      {/* Show Calculator */}
      <StyledRow gutter={16}>
        <Col span={8}>SHOW CALCULATOR</Col>
        <Col span={16}>
          <AlignRight onChange={calculatorShowMethod} value={calcType}>
            {calculators.map((item, index) => (
              <Radio value={index} key={index}>
                {item}
              </Radio>
            ))}
          </AlignRight>
        </Col>
      </StyledRow>
      {/* Show Calculator */}

      {/* Answer on Paper */}
      <StyledRow gutter={16}>
        <Col span={8}>ANSWER ON PAPER</Col>
        <Col span={16}>
          <AlignSwitchRight />
        </Col>
      </StyledRow>
      {/* Answer on Paper */}

      {/* Require Password */}
      <StyledRow gutter={16}>
        <Col span={8}>REQUIRE PASSWORD</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRow>
      {/* Require Password */}

      {/* Evaluation Method */}
      <StyledRow gutter={16}>
        <Col span={6}>EVALUATION METHOD</Col>
        <Col span={18}>
          <AlignRight onChange={evalMethod} value={type}>
            {evaluationtypes.map((item, index) => (
              <Radio value={index} key={index}>
                {item}
              </Radio>
            ))}
          </AlignRight>
        </Col>
      </StyledRow>
      {/*Evaluation Method */}

      {/*Performance Bands */}
      <TbleHeader>
        <Col span={6}>
          <span>PERFORMANCE BANDS</span>
        </Col>
        <FlexItem span={6}>
          <span>Above or at Standard</span>
        </FlexItem>
        <FlexItem span={6}>
          <span>From</span>
        </FlexItem>
        <FlexItem span={6}>
          <span>To</span>
        </FlexItem>
      </TbleHeader>
      <List
        grid={{ column: 1 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <ListCard item={item} />
          </List.Item>
        )}
      />
      {/*Performance Bands */}
    </Fragment>
  );
};

export default connect(
  state => ({
    releaseScore: getReleaseScoreSelector(state),
    activityReview: getActivityReview(state)
  }),
  null
)(Settings);

const AlignRight = styled(RadioGroup)`
  float: right;
`;

const AlignSwitchRight = styled(Switch)`
  float: right;
`;

const StyledRow = styled.div`
  border-bottom: 1px solid rgba(128, 128, 128, 0.26);
  padding: 15px 0px;
  font-size: 10px;
  display: flex;
`;
const StyledRowLabel = styled(Row)`
  margin-bottom: 10px;
`;

const FlexItem = styled(Col)`
  display: flex;
  justify-content: center;
`;

const TbleHeader = styled(Row)`
  margin: 18px 0;
`;
