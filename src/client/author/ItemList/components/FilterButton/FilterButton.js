import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "antd";
import { IconFilter } from "@edulastic/icons";
import { FilterButtonContainer } from "./styled";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";

class FilterButton extends Component {
  render() {
    const { windowWidth, t, isShowFilter, toggleFilter } = this.props;

    return (
      <FilterButtonContainer>
        <Button onClick={toggleFilter}>
          {windowWidth > SMALL_DESKTOP_WIDTH ? (
            !isShowFilter ? (
              t("component.itemlist.filter.showFilters")
            ) : (
              t("component.itemlist.filter.hideFilters")
            )
          ) : (
            <IconFilter />
          )}
        </Button>
      </FilterButtonContainer>
    );
  }
}

FilterButton.propTypes = {
  isShowFilter: PropTypes.bool.isRequired,
  windowWidth: PropTypes.number.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default FilterButton;
