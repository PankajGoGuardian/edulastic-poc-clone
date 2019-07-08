import React from "react";
import next from "immer";
import { Row, Col } from "antd";
import { find, sumBy, indexOf } from "lodash";
import { getTicks, getMasteryLevel } from "../../utils/transformers";
import BarTooltipRow from "../../../../../common/components/tooltip/BarTooltipRow";
import { SimpleStackedBarChart } from "../../../../../common/components/charts/simpleStackedBarChart";
import { StyledChartContainer } from "../styled";
import { FilterDropDownWithDropDown } from "../../../../../common/components/widgets/filterDropDownWithDropDown";
import { StyledH3 } from "../../../../../common/styled";

const _yTickFormatter = text => text;

const StandardsPerformanceChart = ({
  data,
  selectedDomains,
  setSelectedDomains,
  filterValues,
  filterOptions,
  onFilterChange,
  maxMasteryScore,
  rawDomainData,
  scaleInfo,
  ...chartProps
}) => {
  const ticks = getTicks(maxMasteryScore);

  const getTooltipJSX = data => {
    const [domain = {}] = data;
    const { payload = {} } = domain;
    const domainInfo = find(rawDomainData, domain => domain.tloId === payload.domainId) || {};
    const studentCount = sumBy(payload.records, record => parseInt(record.totalStudents));

    return (
      <div>
        <BarTooltipRow title="Domain: " value={payload.domainName} />
        <BarTooltipRow title="Description: " value={domainInfo.description} />
        <BarTooltipRow title="Avg Mastery Score: " value={payload.masteryScore} />
        <BarTooltipRow title="Mastery Level: " value={getMasteryLevel(payload.masteryScore, scaleInfo).masteryName} />
        <BarTooltipRow title="Student #: " value={studentCount} />
      </div>
    );
  };

  const onClickBarData = selectedLabel => {
    const selectedDomain = find(data, domain => domain.domainName === selectedLabel);

    if (!selectedDomain) {
      return;
    }

    let modifiedState = next(selectedDomains, draft => {
      let index = indexOf(draft, selectedDomain.domainId);
      if (-1 < index) {
        draft.splice(index, 1);
      } else {
        draft.push(selectedDomain.domainId);
      }
    });

    setSelectedDomains(modifiedState);
  };

  const filterDropDownCB = (_, selected, comData) => {
    onFilterChange({
      ...filterValues,
      [comData]: selected
    });
  };

  return (
    <>
      <Row type="flex" justify="start">
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <StyledH3>Mastery Level Distribution by Domain</StyledH3>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="dropdown-container">
          <FilterDropDownWithDropDown updateCB={filterDropDownCB} data={filterOptions} values={filterValues} />
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <StyledChartContainer xs={24} sm={24} md={24} lg={24} xl={24}>
          <SimpleStackedBarChart
            margin={{ top: 0, right: 25, left: 25, bottom: 0 }}
            xAxisDataKey={"domainName"}
            bottomStackDataKey={"masteryScore"}
            topStackDataKey={"diffMasteryScore"}
            yAxisLabel="Avg. Mastery Score"
            yTickFormatter={_yTickFormatter}
            barsLabelFormatter={_yTickFormatter}
            onBarClickCB={onClickBarData}
            onResetClickCB={() => setSelectedDomains([])}
            getTooltipJSX={getTooltipJSX}
            yDomain={[0, maxMasteryScore]}
            data={data}
            ticks={ticks}
            filter={selectedDomains}
            {...chartProps}
          />
        </StyledChartContainer>
      </Row>
    </>
  );
};

export default StandardsPerformanceChart;
