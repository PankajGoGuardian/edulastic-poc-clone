import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import { find, keyBy, omitBy, isEmpty, isNaN } from "lodash";
import { StyledCard, StyledTable } from "../styled";
import { CustomTableTooltip } from "../../../../../common/components/customTableTooltip";
import { ResponseTag } from "./responseTag";
import { getHSLFromRange1, downloadCSV } from "../../../../../common/util";
import PrintableTable from "../../../../../common/components/tables/PrintableTable";
import CsvTable from "../../../../../common/components/tables/CsvTable";
import { ColoredCell } from "../../../../../common/styled";

export const ResponseFrequencyTable = ({
  columns,
  assessment,
  isCsvDownloading,
  isPrinting,
  data: dataSource,
  correctThreshold,
  incorrectFrequencyThreshold
}) => {
  /**
   * set column details for frequency table
   */

  columns[0].sorter = (a, b) => Number(a.qLabel.substring(1)) - Number(b.qLabel.substring(1));
  columns[0].render = (text, record) => (
    <Link to={`/author/classboard/${record.assignmentId}/${record.groupId}/question-activity/${record.uid}`}>
      {text}
    </Link>
  );

  columns[2].render = data => {
    if (data && Array.isArray(data)) {
      return data.join(", ");
    }
    if (typeof data == "string") {
      return data;
    }
    return "";
  };

  columns[4].sorter = (a, b) => a.corr_cnt || 0 - b.corr_cnt || 0;
  columns[4].render = (data, record) => {
    const tooltipText = rec => () => {
      const { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = rec;
      const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
      return (
        <div>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Assessment Name: </Col>
            <Col className="custom-table-tooltip-value">{assessment.testName}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Question: </Col>
            <Col className="custom-table-tooltip-value">{rec.qLabel}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Question Type: </Col>
            <Col className="custom-table-tooltip-value">{rec.qType}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Standards: </Col>
            <Col className="custom-table-tooltip-value">{rec.standards}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Max Score: </Col>
            <Col className="custom-table-tooltip-value">{rec.maxScore}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Performance: </Col>
            <Col className="custom-table-tooltip-value">{Math.round((corr_cnt / sum) * 100)}%</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Students Skipped: </Col>
            <Col className="custom-table-tooltip-value">{skip_cnt}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Students Correct: </Col>
            <Col className="custom-table-tooltip-value">{corr_cnt}</Col>
          </Row>
          <Row type="flex" justify="start">
            <Col className="custom-table-tooltip-key">Total Students: </Col>
            <Col className="custom-table-tooltip-value">{sum}</Col>
          </Row>
        </div>
      );
    };

    const getCellContents = cellData => {
      const { correct, correctThreshold: _correctThreshold } = cellData;
      return (
        <div style={{ width: "100%", height: "100%" }}>
          {correct < _correctThreshold ? (
            <ColoredCell className="response-frequency-table-correct-td" bgColor={getHSLFromRange1(0)}>
              {correct}%
            </ColoredCell>
          ) : (
            <div className="response-frequency-table-correct-td">{correct}%</div>
          )}
        </div>
      );
    };

    const { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
    const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
    let correct = ((corr_cnt / sum) * 100).toFixed(0);
    if (isNaN(correct)) correct = 0;

    return (
      <CustomTableTooltip
        correct={correct}
        correctThreshold={correctThreshold}
        placement="top"
        title={tooltipText(record)}
        getCellContents={getCellContents}
      />
    );
  };

  columns[5].render = (data, record) => {
    const { corr_cnt = 0, incorr_cnt = 0, skip_cnt = 0, part_cnt = 0 } = record;
    const sum = corr_cnt + incorr_cnt + skip_cnt + part_cnt;
    let skip = (skip_cnt / sum) * 100;
    if (isNaN(skip)) skip = 0;
    return `${Math.round(skip)}%`;
  };

  columns[6].render = (data, record) => {
    const numToAlp = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let arr = [];
    const { corr_cnt = 0, incorr_cnt = 0, part_cnt = 0 } = record;
    let sum = corr_cnt + incorr_cnt + part_cnt;
    if (sum == 0) sum = 1;
    // V1 migrated UQA doesn't have user answer data
    let hasChoiceData = false;
    // filter out empty keys from data
    const emptyKeyList = ["[]"];
    data = omitBy(data || {}, (_, key) => emptyKeyList.includes(key));
    // show correct, incorrect & partial correct if data is empty
    if (isEmpty(data)) {
      arr.push({
        value: Number(((corr_cnt / sum) * 100).toFixed(0)),
        count: corr_cnt,
        name: "Correct",
        key: "corr_cnt",
        isCorrect: true,
        isUnselected: !corr_cnt,
        record
      });
      arr.push({
        value: Number(((incorr_cnt / sum) * 100).toFixed(0)),
        count: incorr_cnt,
        name: "Incorrect",
        key: "incorr_cnt",
        isCorrect: false,
        isUnselected: !incorr_cnt,
        record
      });
      arr.push({
        value: Number(((part_cnt / sum) * 100).toFixed(0)),
        count: part_cnt,
        name: "Partially Correct",
        key: "part_cnt",
        isCorrect: false,
        isUnselected: !part_cnt,
        record
      });
    } else {
      hasChoiceData = true;
      arr = Object.keys(data).map(comboKey => {
        const slittedKeyArr = comboKey.split(",");
        let str = "";
        let isCorrect = true;
        for (const key of slittedKeyArr) {
          for (let i = 0; i < record.options.length; i++) {
            // IMPORTANT: double == instead of === cuz we need to compare number keys with string keys
            if (record.options[i].value == key) {
              str += numToAlp[i];
              const tmp = find(record.validation, vstr => key == vstr);
              isCorrect = !!(isCorrect && tmp);
            }
          }
        }
        if (record.qType.toLocaleLowerCase() === "true or false" && record.validation && record.validation[0]) {
          str = record.validation[0] === comboKey ? "Correct" : "Incorrect";
        }

        return {
          value: Math.round((data[comboKey] / sum) * 100),
          count: data[comboKey],
          name: str,
          key: str,
          isCorrect,
          isUnselected: false,
          record
        };
      });
    }

    const checkForQtypes = [
      "multiple choice - standard",
      "multiple choice - multiple response"
      // "multiple selection"
    ];

    if (checkForQtypes.includes(record.qType.toLocaleLowerCase()) && hasChoiceData) {
      const selectedMap = {};
      for (let i = 0; i < arr.length; i++) {
        selectedMap[arr[i].key] = true;
      }

      const validation = keyBy(record.validation);
      for (let i = 0; i < record.options.length; i++) {
        if (!selectedMap[numToAlp[i]]) {
          arr.push({
            value: 0,
            count: 0,
            name: numToAlp[i],
            key: numToAlp[i],
            isCorrect: !!validation[record.options[i].value],
            isUnselected: true,
            record
          });
        }
      }
    }

    arr.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return (
      <Row type="flex" justify="start" className="table-tag-container">
        {arr.map((_data, i) =>
          _data.value || (checkForQtypes.includes(_data.record.qType.toLocaleLowerCase()) && hasChoiceData) ? (
            <ResponseTag
              isPrinting={isPrinting}
              key={i}
              data={_data}
              incorrectFrequencyThreshold={incorrectFrequencyThreshold}
            />
          ) : null
        )}
      </Row>
    );
  };
  // }

  const onCsvConvert = (data, rawData) => {
    // extract all rows excpet the columns name
    const csvRows = rawData.splice(1, rawData.length);
    const modifiedCsvRows = csvRows.map(csvRow => {
      const item = csvRow[6];
      csvRow[6] = `"${item
        .replace(/"/g, "")
        .replace(/%/g, "%,")
        .split(",")
        .filter(_item => _item)
        .map(_item => {
          const option = _item.replace(/\d+%/g, "");
          const number = _item.match(/\d+%/g)[0];
          return `${option ? `${option} :` : ""} ${number || "N/A"}`;
        })
        .join(", ")}"`;

      return csvRow.join(",");
    });
    const csvData = [rawData[0].join(","), ...modifiedCsvRows].join("\n");
    downloadCSV(`Response Frequency.csv`, csvData);
  };

  return (
    <StyledCard className="response-frequency-table">
      <CsvTable
        isCsvDownloading={isCsvDownloading}
        onCsvConvert={onCsvConvert}
        tableToRender={PrintableTable}
        isPrinting={isPrinting}
        component={StyledTable}
        columns={columns}
        dataSource={dataSource}
        rowKey="uid"
        scroll={{ x: "100%" }}
      />
    </StyledCard>
  );
};
