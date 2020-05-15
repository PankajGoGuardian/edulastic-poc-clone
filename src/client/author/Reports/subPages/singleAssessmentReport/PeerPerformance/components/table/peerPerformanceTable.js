import { Col, Row } from "antd";
import next from "immer";
import { sumBy } from "lodash";
import React, { useMemo } from "react";
import styled from "styled-components";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import CsvTable from "../../../../../common/components/tables/CsvTable";
import { StyledH3 } from "../../../../../common/styled";
import { downloadCSV } from "../../../../../common/util";
import { idToName } from "../../util/transformers";
import { StyledTable } from "../styled";

const getDisplayValue = (data, record, analyseBy, columnKey) => {
  let printData = data;
  let NA = "N/A";
  if (printData === 0 && (analyseBy === "aboveBelowStandard" || analyseBy === "proficiencyBand")) {
    return NA;
  }
  if (analyseBy === "score(%)") {
    printData = record[columnKey] + "%";
  } else if (analyseBy === "rawScore") {
    printData = record[columnKey].toFixed(2);
  } else if (analyseBy === "proficiencyBand" || analyseBy === "aboveBelowStandard") {
    printData = data + " (" + Math.abs(record[columnKey + "Percentage"]) + "%)";
  }
  return printData;
};

export const PeerPerformanceTable = ({
  columns,
  dataSource,
  rowKey,
  analyseBy,
  compareBy,
  assessmentName,
  filter,
  bandInfo,
  role,
  isCsvDownloading = false
}) => {
  const sortNumbers = key => (a, b) => {
    let _a = a[key] || 0;
    let _b = b[key] || 0;

    return _a - _b;
  };

  let _columns = [];

  const colorCell = (colorkey, columnKey, columnTitle) => (data, record) => {
    const tooltipText = record => () => {
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Assessment Name: </Col>
            <Col className="custom-table-tooltip-value">{assessmentName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">{`${idToName[compareBy]}: `}</Col>
            <Col className="custom-table-tooltip-value">{record.compareBylabel}</Col>
          </Row>
          {analyseBy === "score(%)" || analyseBy === "rawScore" ? (
            <>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Assigned: </Col>
                <Col className="custom-table-tooltip-value">{record.graded + record.absent}</Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Graded: </Col>
                <Col className="custom-table-tooltip-value">{record.graded}</Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Absent: </Col>
                <Col className="custom-table-tooltip-value">{record.absent}</Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">District Avg: </Col>
                <Col className="custom-table-tooltip-value">
                  {getDisplayValue(record.districtAvg, record, analyseBy, "districtAvg")}
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Student Avg Score: </Col>
                <Col className="custom-table-tooltip-value">
                  {analyseBy === "score(%)"
                    ? getDisplayValue(
                        record.avgStudentScorePercentUnrounded,
                        record,
                        analyseBy,
                        "avgStudentScorePercent"
                      )
                    : getDisplayValue(record.avgStudentScoreUnrounded, record, analyseBy, "avgStudentScore")}
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Performance Band: </Col>
                <Col className="custom-table-tooltip-value">{columnTitle}</Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Student#: </Col>
                <Col className="custom-table-tooltip-value">{record[columnKey] === 0 ? "N/A" : record[columnKey]}</Col>
              </Row>
              <Row type="flex" justify="start">
                <Col className="custom-table-tooltip-key">Student(%): </Col>
                <Col className="custom-table-tooltip-value">
                  {record[columnKey] === 0 ? "N/A" : Math.abs(record[columnKey + "Percentage"]) + "%"}
                </Col>
              </Row>
            </>
          )}
        </div>
      );
    };

    const getCellContents = props => {
      let { printData, colorKey } = props;
      return <div style={{ backgroundColor: record[colorKey] }}>{printData}</div>;
    };

    let printData = getDisplayValue(data, record, analyseBy, columnKey);

    return (
      <CustomTableTooltip
        printData={printData}
        colorKey={colorkey}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    );
  };

  const tableData = useMemo(() => {
    let arr = dataSource.filter(item => filter[item[compareBy]] || Object.keys(filter).length === 0);
    return arr;
  }, [dataSource, filter]);

  let colouredCellsNo = 0;

  _columns = next(columns, arr => {
    if (analyseBy === "score(%)") {
      arr[arr.length - 1].render = colorCell("fill", "avgStudentScorePercent");
      arr[arr.length - 2].render = colorCell("dFill", "districtAvg");
      colouredCellsNo = 2;
    } else if (analyseBy === "rawScore") {
      arr[arr.length - 1].render = colorCell("fill", "avgStudentScore");
      arr[arr.length - 2].render = colorCell("dFill", "districtAvg");
      colouredCellsNo = 2;
    } else if (analyseBy === "aboveBelowStandard") {
      arr[arr.length - 1].render = colorCell("fill_0", "aboveStandard", "Above Standard");
      arr[arr.length - 2].render = colorCell("fill_1", "belowStandard", "Below Standard");
      arr[arr.length - 2].sorter = sortNumbers(arr[arr.length - 2].key);
      colouredCellsNo = 2;
    } else {
      bandInfo.sort((a, b) => {
        return a.threshold - b.threshold;
      });

      const allBandCols = {};
      for (let band of bandInfo) {
        let name = band.name;
        const sum = sumBy(tableData, o => o[name + "Percentage"]);
        allBandCols[name + "Percentage"] = sum !== 0;
      }

      let validBandCols = 0;
      for (let [index, value] of bandInfo.entries()) {
        if (!allBandCols[value.name + "Percentage"]) {
          continue;
        }
        arr.push({
          title: value.name,
          dataIndex: value.name,
          key: value.name,
          width: 250,
          render: colorCell("fill_" + index, value.name, value.name)
        });
        validBandCols++;
      }
      colouredCellsNo = validBandCols;
    }
    arr[arr.length - 1].sorter = sortNumbers(arr[arr.length - 1].key);
    if (role === "teacher" && compareBy === "groupId") {
      arr.splice(1, 2);
    }
  });

  const onCsvConvert = data => downloadCSV(`Sub-group Performance School Report.csv`, data);

  return (
    <div>
      <StyledDiv>
        <StyledH3>
          Assessment Statistics By {idToName[compareBy]} | {assessmentName}
        </StyledH3>
      </StyledDiv>
      <CsvTable
        isCsvDownloading={isCsvDownloading}
        onCsvConvert={onCsvConvert}
        colouredCellsNo={colouredCellsNo}
        columns={_columns}
        dataSource={tableData}
        rowKey={rowKey}
        tableToRender={StyledTable}
      />
    </div>
  );
};

const StyledDiv = styled.div`
  padding: 10px;
`;
