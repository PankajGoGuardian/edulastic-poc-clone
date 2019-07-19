import React from "react";
import PropTypes from "prop-types";
import { Row } from "antd";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import dropDownData from "../../static/json/dropDownData.json";

const Filters = ({ compareByOptions = [], onFilterChange, analyseBy, compareBy }) => {
  const onDropDownChange = key => (_, selectedItem) => onFilterChange(key, selectedItem);

  const onCompareByChange = onDropDownChange("compareBy");
  const onAnalyseByChange = onDropDownChange("analyseBy");

  return (
    <Row type="flex" justify="end">
      <ControlDropDown
        prefix="Analyse By"
        by={analyseBy}
        selectCB={onAnalyseByChange}
        data={dropDownData.analyseByData}
      />
      <ControlDropDown prefix="Compare By" by={compareBy} selectCB={onCompareByChange} data={compareByOptions} />
    </Row>
  );
};

const getShape = data =>
  PropTypes.shape({
    key: PropTypes.oneOf(data.map(item => item.key)),
    title: PropTypes.oneOf(data.map(item => item.title))
  });

const analyseByShape = getShape(dropDownData.analyseByData);
const compareByShape = getShape(dropDownData.compareByData);

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: analyseByShape,
  compareBy: compareByShape
};

Filters.defaultProps = {
  analyseBy: dropDownData.analyseByData[0],
  compareBy: dropDownData.compareByData[0],
  role: ""
};

export default Filters;
