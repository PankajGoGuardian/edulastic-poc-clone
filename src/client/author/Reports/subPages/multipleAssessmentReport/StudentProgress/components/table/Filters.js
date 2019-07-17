import React from "react";
import PropTypes from "prop-types";
import { Row } from "antd";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";

import dropDownData from "../../static/json/dropDownData.json";

const Filters = ({ onFilterChange, analyseBy }) => {
  const onDropDownChange = key => (_, selectedItem) => onFilterChange(key, selectedItem);

  const onAnalyseByChange = onDropDownChange("analyseBy");

  return (
    <Row type="flex" justify="end">
      <ControlDropDown
        prefix="Analyse By"
        by={analyseBy}
        selectCB={onAnalyseByChange}
        data={dropDownData.analyseByData}
      />
    </Row>
  );
};

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  analyseBy: PropTypes.shape({
    key: PropTypes.string,
    title: PropTypes.string
  })
};

Filters.defaultProps = {
  analyseBy: dropDownData.analyseByData[0]
};

export default Filters;
