import React, { Component } from 'react';
import styled from 'styled-components';
import { white, greenDark } from '@edulastic/colors';
import { Button, FlexContainer, Checkbox } from '@edulastic/common';
import { IconSettings } from '@edulastic/icons';
import PropTypes from 'prop-types';

import SettingsBarItem from './SettingsBarItem';
import SettingsBarTags from './SettingsBarTags';
import SettingsBarUseTabs from './SettingsBarUseTabs';

export default class SettingsBar extends Component {
  state = {
    type: '',
    verticalDivider: false,
    scrolling: false,
    useTabsLeft: false,
    useTabsRight: false,
  };

  componentDidMount() {
    const { type } = this.props;

    this.setState({
      type,
    });
  }

  layouts = [
    {
      value: 'single',
      text: 'Single column',
    },
    {
      value: '30-70',
      text: '30 | 70',
    },
    {
      value: '70-30',
      text: '70 | 30',
    },
    {
      value: '50-50',
      text: '50 | 50',
    },
    {
      value: '40-60',
      text: '40 | 60',
    },
    {
      value: '60-40',
      text: '60 | 40',
    },
  ];

  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onApply: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  };

  handleItemChange = (type) => {
    this.setState({
      type,
    });
  };

  handleCheckboxChange = name => () => {
    this.setState(state => ({
      [name]: !state[name],
    }));
  };

  handleApply = () => {
    const { onApply } = this.props;
    onApply(this.state);
  };

  handleRemoveTag = () => {};

  handleChangeLeftTab = () => {
    this.setState(({ useTabsLeft }) => ({
      useTabsLeft: !useTabsLeft,
    }));
  };

  handleChangeRightTab = () => {
    this.setState(({ useTabsRight }) => ({
      useTabsRight: !useTabsRight,
    }));
  };

  render() {
    const { type, verticalDivider, scrolling, useTabsLeft, useTabsRight } = this.state;
    const { onCancel } = this.props;

    return (
      <Container>
        <SettingsButtonWrapper justifyContent="flex-end">
          <Button color="primary" onClick={onCancel} style={{ minWidth: 85 }}>
            <IconSettings color={white} />
          </Button>
        </SettingsButtonWrapper>
        <Heading>Layout</Heading>
        <Items>
          {this.layouts.map(item => (
            <SettingsBarItem
              onSelect={() => this.handleItemChange(item.value)}
              selected={type === item.value}
              key={item.value}
              item={item}
            />
          ))}
        </Items>
        <SettingsBarUseTabs
          onChangeLeft={this.handleChangeLeftTab}
          onChangeRight={this.handleChangeRightTab}
          checkedLeft={useTabsLeft}
          checkedRight={useTabsRight}
        />
        <Checkboxes>
          <Checkbox
            style={{ marginBottom: 20 }}
            label="Show vertical divider"
            checked={verticalDivider}
            onChange={this.handleCheckboxChange('verticalDivider')}
          />
          <Checkbox
            label="Enable Scrolling For Long Content"
            checked={scrolling}
            onChange={this.handleCheckboxChange('scrolling')}
          />
        </Checkboxes>
        <Heading>Tags</Heading>
        <SettingsBarTags tags={['equations', 'algebra']} onRemove={this.handleRemoveTag} />
        <FlexContainer justifyContent="center">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={this.handleApply} color="success">
            Apply
          </Button>
        </FlexContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 25vw;
  background: ${white};
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  padding: 30px;
  box-shadow: -3px 3px 6px 0 rgba(0, 0, 0, 0.16);
  overflow-y: auto;
`;

const SettingsButtonWrapper = styled(FlexContainer)`
  margin-bottom: 25px;
`;

const Heading = styled.div`
  color: ${greenDark};
  margin-bottom: 25px;
  font-size: 16px;
  font-weight: 600;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Checkboxes = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;
