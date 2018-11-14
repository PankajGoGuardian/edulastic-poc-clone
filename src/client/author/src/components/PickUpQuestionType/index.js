import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Menu } from 'antd';
import { PaddingDiv } from '@edulastic/common';
import { withNamespaces } from '@edulastic/localization';

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
          <Menu mode="inline">
            <Menu.Item>Multiple Choice</Menu.Item>
            <Menu.Item>Fill in the Blanks</Menu.Item>
            <Menu.Item>Classify, Math & Order</Menu.Item>
            <Menu.Item>Written & Spoken</Menu.Item>
            <Menu.Item>Highlight</Menu.Item>
            <Menu.Item>Math</Menu.Item>
            <Menu.Item>Graphing</Menu.Item>
            <Menu.Item>Charts</Menu.Item>
            <Menu.Item>Chemistry</Menu.Item>
            <Menu.Item>Other</Menu.Item>
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

  .ant-menu-item {
    font-size: 14px;
    font-weight: 600;
    color: #434b5d;
  }

  .ant-menu-item-selected {
    color: #4aac8b;
    background: transparent !important;
  }

  .ant-menu-inline .ant-menu-item:not(:last-child) {
    margin-bottom: 18px;p
  }

`;
const RightSide = styled.div``;
