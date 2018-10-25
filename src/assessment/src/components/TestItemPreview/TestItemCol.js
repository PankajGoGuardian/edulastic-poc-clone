import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tabs } from '@edulastic/common';

import QuestionWrapper from '../QuestionWrapper';

class TestItemCol extends Component {
  state = {
    value: 0,
  };

  static propTypes = {
    col: PropTypes.object.isRequired,
    style: PropTypes.object,
    previewTab: PropTypes.string.isRequired,
  };

  static defaultProps = {
    style: {},
  };

  handleTabChange = (value) => {
    this.setState({
      value,
    });
  };

  renderTabContent = (widget) => {
    const { previewTab } = this.props;

    return (
      <Tabs.TabContainer style={{ padding: 20 }}>
        <QuestionWrapper
          testItem
          type={widget.type}
          view="preview"
          previewTab={previewTab}
          questionId={widget.reference}
          data={{ ...widget.referencePopulate.data, smallSize: true }}
        />
      </Tabs.TabContainer>
    );
  };

  render() {
    const { col, style } = this.props;
    const { value } = this.state;

    return (
      <Container style={style} width={col.dimension}>
        {col.tabs &&
          !!col.tabs.length && (
            <Tabs value={value} onChange={this.handleTabChange}>
              {col.tabs.map((tab, tabIndex) => (
                <Tabs.Tab
                  key={tabIndex}
                  label={tab}
                  style={{
                    width: '50%',
                    textAlign: 'center',
                    padding: '30px 20px 15px',
                  }}
                />
              ))}
            </Tabs>
        )}
        {col.widgets.map((widget, i) => (
          <React.Fragment key={i}>
            {!!col.tabs.length && value === widget.tabIndex && this.renderTabContent(widget)}
            {!col.tabs.length && this.renderTabContent(widget)}
          </React.Fragment>
        ))}
      </Container>
    );
  }
}

export default TestItemCol;

const Container = styled.div`
  width: ${({ width }) => width};
`;
