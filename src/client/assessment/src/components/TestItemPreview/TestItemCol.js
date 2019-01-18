import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from 'antd';
import { Tabs } from '@edulastic/common';
import { white, darkBlueSecondary } from '@edulastic/colors';

import { SMALL_DESKTOP_WIDTH, MAX_MOBILE_WIDTH } from '../../constants/others';
import QuestionWrapper from '../QuestionWrapper';

class TestItemCol extends Component {
  state = {
    value: 0
  };

  static propTypes = {
    col: PropTypes.object.isRequired,
    style: PropTypes.object,
    preview: PropTypes.string.isRequired,
    windowWidth: PropTypes.number.isRequired,
    evaluation: PropTypes.any.isRequired
  };

  static defaultProps = {
    style: {}
  };

  handleTabChange = (value) => {
    this.setState({
      value
    });
  };

  renderTabContent = (widget) => {
    const { preview, evaluation: evaluations } = this.props;
    const evaluation = evaluations[widget.entity.id];
    return (
      <Tabs.TabContainer style={{ padding: 20 }}>
        <QuestionWrapper
          testItem
          type={widget.type}
          view="preview"
          evaluation={evaluation}
          previewTab={preview}
          questionId={widget.reference}
          data={{ ...widget.entity, smallSize: true }}
        />
      </Tabs.TabContainer>
    );
  };

  render() {
    const { col, style, windowWidth } = this.props;
    const { value } = this.state;

    return (
      <Container
        value={value}
        style={{
          ...style,
          width: windowWidth < SMALL_DESKTOP_WIDTH ? '100%' : '100%'
        }}
        width={col.dimension}
      >
        {col.tabs && !!col.tabs.length && windowWidth >= MAX_MOBILE_WIDTH && (
          <Tabs value={value} onChange={this.handleTabChange}>
            {col.tabs.map((tab, tabIndex) => (
              <Tabs.Tab
                key={tabIndex}
                label={tab}
                style={{
                  width: '50%',
                  textAlign: 'center',
                  padding: '30px 20px 15px'
                }}
              />
            ))}
          </Tabs>
        )}
        {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 0 && (
          <MobileRightSide onClick={() => this.handleTabChange(1)}>
            <Icon type="left" style={{ color: white }} />
          </MobileRightSide>
        )}
        {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 1 && (
          <MobileLeftSide onClick={() => this.handleTabChange(0)}>
            <Icon type="right" style={{ color: white }} />
          </MobileLeftSide>
        )}
        {col.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {col.tabs &&
              !!col.tabs.length &&
              value === widget.tabIndex &&
              this.renderTabContent(widget)}
            {col.tabs && !col.tabs.length && this.renderTabContent(widget)}
          </React.Fragment>
        ))}
      </Container>
    );
  }
}

export default connect(state => ({
  evaluation: state.evaluation,
  preview: state.view.preview
}))(TestItemCol);

const Container = styled.div`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;

  @media (max-width: 468px) {
    padding-left: 10px;
    margin-right: ${props => !props.value && '20px !important'};
    margin-left: ${props => props.value && '20px !important'};
  }
`;

const MobileRightSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: 0;
  background: ${darkBlueSecondary};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const MobileLeftSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  left: 0;
  background: ${darkBlueSecondary};
  width: 25px;
  bottom: 20px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;
