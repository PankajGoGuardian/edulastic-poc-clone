import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaCaretDown } from 'react-icons/fa';

import {
  textColor, white, grey, blue,
} from '../../utilities/css';

export default class SelectButton extends Component {
  state = {
    open: false,
  };

  toggleList = () => {
    this.setState(({ open }) => ({
      open: !open,
    }));
  };

  handleSelectItem = item => () => {
    const { onSelect } = this.props;
    onSelect(item.value);
    this.toggleList();
  };

  render() {
    const { options, icon } = this.props;
    const { open } = this.state;

    return (
      <SelectContainer>
        <Button onClick={this.toggleList}>
          <span>{icon}</span>
          <span>
            <FaCaretDown />
          </span>
        </Button>
        {open && (
          <List>
            {options.map((item, index) => (
              <ListItem key={index} onClick={this.handleSelectItem(item)}>
                {item.label}
              </ListItem>
            ))}
          </List>
        )}
      </SelectContainer>
    );
  }
}

SelectButton.propTypes = {
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  icon: PropTypes.any,
};

SelectButton.defaultProps = {
  icon: null,
};

const SelectContainer = styled.div`
  position: relative;
`;

const Button = styled.button`
  padding: 0 10px;
  border-radius: 10px;
  background-color: ${white};
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  color: ${textColor};
  font-size: 14px;
  border: 1px solid ${grey};
  -webkit-appearance: none;
  min-width: 85px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const List = styled.div`
  width: 100%;
  position: absolute;
  top: 40px;
  left: 0;
  background: ${white};
  z-index: 10000;
  border-radius: 10px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
`;

const ListItem = styled.div`
  width: 100%;
  padding: 10px;
  cursor: pointer;
  :hover {
    background: ${blue};
  }
`;
