import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Menu } from 'antd';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';
import {
  IconMath,
  IconEdit,
  IconLayout,
  IconLineChart,
  IconMolecule,
  IconNewList,
  IconSelection,
  IconTarget,
  IconMore,
  IconBarChart,
} from '@edulastic/icons';

import QuestionTypes from './questionTypes';
import { getItemSelector } from '../../selectors/items';
import Header from './Header';
import { setQuestionAction } from '../../actions/question';

const makeQuestion = data => ({
  regionId: '1',
  widgetType: 'question',
  data,
});

class PickUpQuestionType extends Component {
  selectQuestionType = (data) => {
    const { setQuestion, history, match, t } = this.props;
    const question = makeQuestion(data);

    setQuestion(question.data);

    history.push({
      pathname: '/author/questions/create',
      state: {
        ...history.location.state,
        backUrl: match.url,
        backText: t('component.pickupcomponent.headertitle'),
      },
    });
  };

  get link() {
    const { history, t } = this.props;

    if (history.location.state) {
      return {
        url: history.location.state.backUrl,
        text: history.location.state.backText,
      };
    }

    return {
      url: '/author/items',
      text: t('component.itemDetail.backToItemList'),
    };
  }

  render() {
    const { t } = this.props;

    return (
      <Container>
        <LeftSide>
          <Menu mode="horizontal" selectedKeys={['question']}>
            <Menu.Item key="question">Question</Menu.Item>
            <Menu.Item key="feature" disabled>Feature</Menu.Item>
          </Menu>
          <Menu mode="inline">
            <Menu.Item key="multiple-choice">
              <NewListIcon />{'Multiple Choice'}
            </Menu.Item>
            <Menu.Item key="fill-blanks">
              <SelectionIcon />{'Fill in the Blanks'}
            </Menu.Item>
            <Menu.Item key="classify">
              <LayoutIcon />{'Classify, Math & Order'}
            </Menu.Item>
            <Menu.Item key="edit">
              <EditIcon />{'Written & Spoken'}
            </Menu.Item>
            <Menu.Item key="highlight">
              <TargetIcon />{'Highlight'}
            </Menu.Item>
            <Menu.Item key="math">
              <MathIcon />{'Math'}
            </Menu.Item>
            <Menu.Item key="graphing">
              <LineChartIcon />{'Graphing'}
            </Menu.Item>
            <Menu.Item key="charts">
              <BarChartIcon />{'Charts'}
            </Menu.Item>
            <Menu.Item key="chemistry">
              <MoleculeIcon />{'Chemistry'}
            </Menu.Item>
            <Menu.Item key="other">
              <MoreIcon />{'Other'}
            </Menu.Item>
          </Menu>
        </LeftSide>
        <RightSide>
          <Header title={t('component.pickupcomponent.headertitle')} link={this.link} />
          <PaddingDiv left={30} right={30}>
            <QuestionTypes onSelectQuestionType={this.selectQuestionType} />
          </PaddingDiv>
        </RightSide>
      </Container>
    );
  }
}

const enhance = compose(
  withNamespaces('author'),
  connect(
    state => ({
      item: getItemSelector(state),
    }),
    {
      setQuestion: setQuestionAction,
    },
  ),
);

PickUpQuestionType.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setQuestion: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default enhance(PickUpQuestionType);

const Container = styled.div`
  display: flex;
`;

const LeftSide = styled.div`
  height: 100vh;
  background-color: #fbfafc;

  .ant-menu-item:after {
    left: 0;
    right: auto;
    border-right: 3px solid #4aac8b;
  }

  .ant-menu-horizontal {
    padding-left: 26px;
    height: 62px;

    .ant-menu-item {
      height: 62px;
      font-size: 11px;
      padding-top: 15px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: #00b0ff;
      text-transform: uppercase;
    }
  }

  .ant-menu-horizontal > .ant-menu-item-selected {
    border-bottom: solid 2px #00b0ff;
  }

  .ant-menu-inline {
    margin-top: 18px;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 14px;
    font-weight: 600;
    color: #434b5d;
    display: flex;
    align-items: center;
    padding-left: 42px !important;
  }

  .ant-menu-inline .ant-menu-item-selected {
    color: #4aac8b;
    background: transparent !important;

    svg {
      fill: #4aac8b;
    }
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 18px;p
  }

`;
const RightSide = styled.div``;

const NewListIcon = styled(IconNewList)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const SelectionIcon = styled(IconSelection)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const LayoutIcon = styled(IconLayout)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const EditIcon = styled(IconEdit)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const MathIcon = styled(IconMath)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const MoleculeIcon = styled(IconMolecule)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const TargetIcon = styled(IconTarget)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const MoreIcon = styled(IconMore)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const LineChartIcon = styled(IconLineChart)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;

const BarChartIcon = styled(IconBarChart)`
  fill: #434b5d;
  width: 21px !important;
  height: 21px !important;
  margin-right: 13px;
`;
