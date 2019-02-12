import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from '@edulastic/common';

import { SMALL_DESKTOP_WIDTH, MAX_MOBILE_WIDTH } from '../../../../constants/others';

import QuestionWrapper from '../../../QuestionWrapper';

import { Container } from './styled/Container';
import { MobileRightSide } from './styled/MobileRightSide';
import { MobileLeftSide } from './styled/MobileLeftSide';
import { IconArrow } from './styled/IconArrow';

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
            <IconArrow type="left" />
          </MobileRightSide>
        )}
        {col.tabs && windowWidth < MAX_MOBILE_WIDTH && !!col.tabs.length && value === 1 && (
          <MobileLeftSide onClick={() => this.handleTabChange(0)}>
            <IconArrow type="right" />
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
