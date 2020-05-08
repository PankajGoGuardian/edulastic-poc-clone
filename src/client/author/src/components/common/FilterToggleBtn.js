import React, { Component } from "react";
import { IconFilter } from "@edulastic/icons";
import { themeColor, white } from "@edulastic/colors";
import styled from "styled-components";
import { Button } from "antd";

class FilterToggleBtn extends Component {
  render() {
    const { isShowFilter, toggleFilter, header } = this.props;
    return (
      <>
        <MobileLeftFilterButton
          data-cy="filter"
          header={header}
          isShowFilter={isShowFilter}
          variant="filter"
          onClick={toggleFilter}
        >
          <IconFilter color={isShowFilter ? white : themeColor} width={20} height={20} />
        </MobileLeftFilterButton>
      </>
    );
  }
}

export default FilterToggleBtn;

const MobileLeftFilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  border-radius: 3px;
  position: fixed;
  margin-left: -20px;
  margin-top: 24px;
  z-index: 100;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  background: ${props => (props.header ? white : props.isShowFilter ? themeColor : white)};
  svg {
    fill: ${props => (props.header ? themeColor : props.isShowFilter ? white : themeColor)};
  }

  &:focus,
  &:hover {
    outline: unset;
    background: ${props => (props.header ? white : props.isShowFilter ? themeColor : white)};
    svg {
      fill: ${props => (props.header ? themeColor : props.isShowFilter ? white : themeColor)};
    }
  }
`;
