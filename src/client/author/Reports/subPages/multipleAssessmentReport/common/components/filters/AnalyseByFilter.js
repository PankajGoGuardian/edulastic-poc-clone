import React from "react";
import PropTypes from "prop-types";
import { Row } from "antd";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import { FilterDropDownWithDropDown } from "../../../../../common/components/widgets/filterDropDownWithDropDown";

import analyseByData from "../../static/json/analyseByDropDown.json";
import dropDownFormat from "../../../../../common/static/json/dropDownFormat.json";

const AnalyseByFilter = ({ onFilterChange, filterDropDownCB,  analyseBy }) => {
  const onAnalyseByChange = (_, selectedItem) => onFilterChange(selectedItem);

  return (
    <Row type="flex" justify="end">
      <ControlDropDown prefix="Analyse By" by={analyseBy} selectCB={onAnalyseByChange} data={analyseByData} />
      <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={dropDownFormat.filterDropDownData} />
    </Row>
  );
};

AnalyseByFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string
  })
};

AnalyseByFilter.defaultProps = {
  analyseBy: analyseByData[0]
};

export default AnalyseByFilter;
