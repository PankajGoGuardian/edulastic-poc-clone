import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Select, Radio, List } from 'antd';

//components
import ListCard from '../../../Setting/components/Card/Card';
import {
  AlignRight,
  AlignSwitchRight,
  StyledRowSettings,
  StyledRowLabel,
  FlexItem,
  TbleHeader
} from './styled';
//selectors
import {
  getReleaseScoreSelector,
  getActivityReview
} from '../../../Setting/ducks';

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
      <StyledRowSettings gutter={16}>
        <Col span={8}>MARK AS DONE</Col>
        <Col span={16}>
          <AlignRight onChange={updateMarkAsDone} value={isAutomatic}>
            <Radio value={0}>Automatically</Radio>
            <Radio value={1}>Manually</Radio>
          </AlignRight>
        </Col>
      </StyledRowSettings>
      {/* Mark as done */}

      {/* Release score */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>RELEASE SCORES AUTOMATICALLY</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked={releaseScore} />
        </Col>
      </StyledRowSettings>
      {/* Release score */}

      {/* Require Safe Exam Browser */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>REQUIRE SAFE EXAM BROWSER</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked={activityReview} />
        </Col>
      </StyledRowSettings>
      {/* Require Safe Exam Browser */}

      {/*Release Answers With Grades */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>RELEASE ANSWERS WITH GRADES</Col>
        <Col span={16}>
          <AlignSwitchRight />
        </Col>
      </StyledRowSettings>
      {/*Release Answers With Grades */}

      {/* Shuffle Question */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>SHUFFLE QUESTION</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRowSettings>
      {/* Shuffle Question */}

      {/* Shuffle Answer Choice */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>SHUFFLE ANSWER CHOICE</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRowSettings>
      {/* Shuffle Answer Choice */}

      {/* Show Calculator */}
      <StyledRowSettings gutter={16}>
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
      </StyledRowSettings>
      {/* Show Calculator */}

      {/* Answer on Paper */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>ANSWER ON PAPER</Col>
        <Col span={16}>
          <AlignSwitchRight />
        </Col>
      </StyledRowSettings>
      {/* Answer on Paper */}

      {/* Require Password */}
      <StyledRowSettings gutter={16}>
        <Col span={8}>REQUIRE PASSWORD</Col>
        <Col span={16}>
          <AlignSwitchRight defaultChecked />
        </Col>
      </StyledRowSettings>
      {/* Require Password */}

      {/* Evaluation Method */}
      <StyledRowSettings gutter={16}>
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
      </StyledRowSettings>
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
