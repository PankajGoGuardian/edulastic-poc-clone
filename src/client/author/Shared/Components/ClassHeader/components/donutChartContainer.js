import React from "react";
import { SimpleDonutChart } from "../../../../Reports/common/components/charts/simpleDonutChart";

export const DonutChartContainer = props => {
  const { data } = props;

  const centerDetailsData = {
    bigText: data.length ? (data[0].count / data[0].total) * 100 + "%" : 0,
    smallText: "IN MASTERY",
    fill: data.length ? data[0].fill : ""
  };
  return (
    <SimpleDonutChart
      data={data}
      dataKey={"count"}
      name={"masteryName"}
      centerDetails={true}
      centerDetailsData={centerDetailsData}
      height={220}
    />
  );
};
