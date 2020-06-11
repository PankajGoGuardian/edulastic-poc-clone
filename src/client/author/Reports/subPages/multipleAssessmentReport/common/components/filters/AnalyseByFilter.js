import React from "react";
import PropTypes from "prop-types";
import { Row } from "antd";
import { ControlDropDown } from "../../../../../common/components/widgets/controlDropDown";
import analyseByData from "../../static/json/analyseByDropDown.json";

const AnalyseByFilter = ({ onFilterChange, analyseBy }) => {
  const onAnalyseByChange = (_, selectedItem) => onFilterChange(selectedItem);

  return (
    <Row type="flex" justify="end" align="middle">
      <ControlDropDown prefix="Analyse By" by={analyseBy} selectCB={onAnalyseByChange} data={analyseByData} />
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
