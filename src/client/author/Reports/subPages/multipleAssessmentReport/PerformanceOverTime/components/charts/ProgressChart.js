import React from "react";
import PropTypes from "prop-types";
import next from "immer";
import { indexOf, includes } from "lodash";
import { toggleItem } from "../../../../../common/util";

import ScoreChart from "./ScoreChart";
import BandChart from "./BandChart";

const ProgressChart = ({ data, analyseBy, selectedItems, setSelectedItems, bandInfo }) => {
  const handleToggleSelectedBars = item => {
    const newSelectedTests = toggleItem(selectedItems, item.uniqId);
    setSelectedItems(newSelectedTests);
  };

  const onResetClick = () => setSelectedItems([]);

  const barToRender = includes(["score", "rawScore"], analyseBy) ? (
    <ScoreChart
      data={data}
      analyseBy={analyseBy}
      onBarClickCB={handleToggleSelectedBars}
      selectedTests={selectedItems}
      onResetClickCB={onResetClick}
    />
  ) : (
    <BandChart
      data={data}
      bandInfo={bandInfo}
      analyseBy={analyseBy}
      onBarClickCB={handleToggleSelectedBars}
      selectedTests={selectedItems}
      onResetClickCB={onResetClick}
    />
  );

  return barToRender;
};

ProgressChart.propTypes = {
  data: PropTypes.array,
  analyseBy: PropTypes.string,
  selectedItems: PropTypes.array,
  setSelectedItems: PropTypes.func,
  bandInfo: PropTypes.array
};

ProgressChart.defaultProps = {
  data: [],
  analyseBy: "score",
  selectedItems: [],
  setSelectedItems: () => {},
  bandInfo: []
};

export default ProgressChart;
