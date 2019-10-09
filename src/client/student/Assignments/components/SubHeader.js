import { Button } from "antd";
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";
import { withNamespaces } from "@edulastic/localization";
import { extraDesktopWidthMax, largeDesktopWidth } from "@edulastic/colors";

// actions
import { setFilterAction } from "../../sharedDucks/AssignmentModule/ducks";
import { filterSelector, FILTERS } from "../ducks";

// components
import Breadcrumb from "../../sharedComponents/Breadcrumb";

// styled components
import { BreadcrumbWrapper } from "../../styled";

const breadcrumbData = [{ title: "DASHBOARD", to: "" }];

const AssignmentSubHeader = ({ t, setFilter, filter }) => {
  const filterItems = Object.keys(FILTERS);

  const Filter = ({ value }) => (
    <FilterBtn data-cy={value} onClick={() => setFilter(FILTERS[value])} enabled={FILTERS[value] === filter}>
      {t(FILTERS[value])}
    </FilterBtn>
  );

  return (
    <BreadcrumbWrapper>
      <Breadcrumb data={breadcrumbData} />
      <StatusBtnsContainer>
        {filterItems.map((value, i) => (
          <Filter key={i} index={i} value={value} />
        ))}
      </StatusBtnsContainer>
    </BreadcrumbWrapper>
  );
};

const enhance = compose(
  withNamespaces("default"),
  connect(
    state => ({
      filter: filterSelector(state)
    }),
    {
      setFilter: setFilterAction
    }
  )
);

export default enhance(AssignmentSubHeader);

AssignmentSubHeader.propTypes = {
  t: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired
};

const StatusBtnsContainer = styled.div`
  @media screen and (max-width: 992px) {
    margin-top: 10px;
    position: relative;
    display: flex;
    flex-direction: row;
    overflow: auto;
  }
`;

const FilterBtn = styled(Button)`
  min-height: 24px;
  height: auto;
  color: ${props =>
    props.enabled
      ? props.theme.headerFilters.headerSelectedFilterTextColor
      : props.theme.headerFilters.headerFilterTextColor};
  border: 1px solid ${props => props.theme.headerFilters.headerFilterBgBorderColor};
  border-radius: 4px;
  margin-left: 20px;
  min-width: 85px;
  font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
  background: ${props => (props.enabled ? props.theme.headerFilters.headerSelectedFilterBgColor : "transparent")};
  &:focus,
  &:active {
    color: ${props =>
      props.enabled
        ? props.theme.headerFilters.headerSelectedFilterTextColor
        : props.theme.headerFilters.headerFilterTextColor};
    background: ${props =>
      props.enabled
        ? props.theme.headerFilters.headerSelectedFilterBgColor
        : props.theme.headerFilters.headerFilterBgColor};
  }
  &:hover {
    color: ${props => props.theme.headerFilters.headerFilterTextHoverColor};
    background: ${props => props.theme.headerFilters.headerFilterBgHoverColor};
    border-color: ${props => props.theme.headerFilters.headerFilterBgBorderHoverColor};
  }
  span {
    font-size: ${props => props.theme.headerFilters.headerFilterTextSize};
    font-weight: 600;
  }

  @media (max-width: ${largeDesktopWidth}) {
    margin-left: 10px;
    min-width: 85px;
    font-size: 8px;
  }

  @media screen and (max-width: 992px) {
    margin: 5px 10px 0px 0px;
    min-width: auto;
  }
`;
