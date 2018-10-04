import React, { Component } from 'react';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { Button, FlexContainer } from '@edulastic/common';
import PropTypes from 'prop-types';

import SettingsBarItem from './SettingsBarItem';

export default class SettingsBar extends Component {
  state = {
    type: '',
    verticalDivider: false,
    scrolling: false,
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

  handleCheckboxChange = ({ target }) => {
    this.setState({
      [target.name]: target.checked,
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleApply = () => {
    const { onApply } = this.props;
    onApply(this.state);
  };

  render() {
    const { type, verticalDivider, scrolling } = this.state;

    return (
      <Container>
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
        <Checkboxes>
          <div>
            <Label>
              <input
                type="checkbox"
                name="verticalDivider"
                checked={verticalDivider}
                onChange={this.handleCheckboxChange}
              />
              Show vertical divider
            </Label>
          </div>
          <div>
            <Label>
              <input
                type="checkbox"
                name="scrolling"
                checked={scrolling}
                onChange={this.handleCheckboxChange}
              />
              Enable scrolling for long content
            </Label>
          </div>
        </Checkboxes>
        <FlexContainer justifyContent="center">
          <Button onClick={this.handleCancel}>Cancel</Button>
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
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  padding: 30px;
`;

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Label = styled.label`
  color: ${white};
`;

const Checkboxes = styled.div`
  margin-bottom: 20px;
`;
