import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { round, intersection, filter, map } from "lodash";
import { Row, Col } from "antd";
import { StyledTable, StyledSpan } from "../../styled";
import { TooltipTag, TooltipTagContainer } from "./TooltipTag";
import { StyledTag } from "../../../../../../common/styled";
import { greyThemeDark1 } from "@edulastic/colors";
import StudentMasteryTable from "./StudentMasteryTable";

const columns = [
  {
    title: "Domain",
    key: "name",
    dataIndex: "name",
    render: name => (
      <StyledTag padding="0px 20px" fontWeight={"Bold"}>
        {name}
      </StyledTag>
    ),
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: "Standards",
    key: "standards",
    align: "center",
    dataIndex: "standards",
    render: standards => {
      let displayCount = 3;
      return (
        <Row type="flex" justify="center">
          {[
            ...standards.slice(0, displayCount).map(standard => <TooltipTag standard={standard} />),
            <TooltipTagContainer standards={standards.slice(displayCount)} />
          ]}
        </Row>
      );
    },
    sorter: (a, b) => {
      if (a.standards.length !== b.standards.length) {
        return a.standards.length - b.standards.length;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  },
  {
    title: "Domain Description",
    key: "description",
    align: "center",
    dataIndex: "description",
    render: description => <StyledSpan alignment="center">{description}</StyledSpan>,
    sorter: (a, b) => a.description.localeCompare(b.description)
  },
  {
    title: "Domain Mastery",
    key: "masteryScore",
    align: "center",
    dataIndex: "masteryScore",
    render: value => <StyledSpan>{`${round(value)}% Mastered`}</StyledSpan>,
    sorter: (a, b) => {
      if (a.masteryScore !== b.masteryScore) {
        return a.masteryScore - b.masteryScore;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  },
  {
    title: "Domain Mastery Summary",
    key: "masterySummary",
    align: "center",
    dataIndex: "masterySummary",
    render: ({ masteryName, color }) => (
      <Row type="flex" justify="center">
        <StyledTag
          width={"200px"}
          height={"34px"}
          bgColor={color}
          textColor={greyThemeDark1}
          fontStyle={"11px/15px Open Sans"}
          fontWeight={"Bold"}
        >
          {masteryName}
        </StyledTag>
      </Row>
    ),
    sorter: (a, b) => {
      if (a.masterySummary.masteryName !== b.masterySummary.masteryName) {
        return a.masterySummary.masteryName.localeCompare(b.masterySummary.masteryName);
      } else if (a.masteryScore !== b.masteryScore) {
        return a.masteryScore - b.masteryScore;
      } else {
        return a.name.localeCompare(b.name);
      }
    }
  }
];

const StudentPerformanceSummary = ({ data, selectedMastery, expandedRowProps, expandAllRows, setExpandAllRows }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleExpandedRowsChange = rowIndex => {
    setExpandedRows(state => {
      if (state.includes(rowIndex)) {
        return state.filter(item => item !== rowIndex);
      }
      return [...state, rowIndex];
    });
  };

  const filteredDomains = map(
    filter(data, domain => {
      if (!selectedMastery.length) {
        return data;
      }
      const domainStandardsMastery = map(domain.standards, standard => standard.scale.masteryLabel);
      return intersection(domainStandardsMastery, selectedMastery).length;
    }),
    (item, index) => {
      item.rowIndex = index;
      return item;
    }
  );

  useEffect(() => {
    expandAllRows ? setExpandedRows([...Array(filteredDomains).keys()]) : setExpandedRows([]);
  }, [expandAllRows]);

  useEffect(() => {
    expandedRows.length === 0 ? setExpandAllRows(false) : null;
    expandedRows.length === filteredDomains.length ? setExpandAllRows(true) : null;
  }, [expandedRows]);

  return (
    <Row>
      <Col>
        <StyledTable
          dataSource={filteredDomains}
          columns={columns}
          pagination={false}
          expandIconAsCell={false}
          expandIconColumnIndex={-1}
          expandedRowRender={() => <StudentMasteryTable {...expandedRowProps} />}
          expandRowByClick={true}
          onRow={record => ({
            onClick: () => handleExpandedRowsChange(record.rowIndex)
          })}
          expandedRowKeys={expandedRows}
        />
      </Col>
    </Row>
  );
};

StudentPerformanceSummary.propTypes = {
  data: PropTypes.array,
  selectedMastery: PropTypes.array
};

StudentPerformanceSummary.defaultProps = {
  data: [],
  selectedMastery: []
};

export default StudentPerformanceSummary;
