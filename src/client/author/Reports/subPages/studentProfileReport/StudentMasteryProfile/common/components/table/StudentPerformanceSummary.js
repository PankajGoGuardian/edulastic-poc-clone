import React from "react";
import PropTypes from "prop-types";
import { round, intersection, filter, map } from "lodash";
import { Row, Col } from "antd";
import TableTooltipRow from "../../../../../../common/components/tooltip/TableTooltipRow";
import { CustomTableTooltip } from "../../../../../../common/components/customTableTooltip";
import { StyledTable, StyledCell, StyledH3 } from "../../../../../../common/styled";
import TooltipTag from "./TooltipTag";

const columns = [
  {
    title: "Domain",
    key: "name",
    dataIndex: "name"
  },
  {
    title: "Domain Description",
    key: "description",
    dataIndex: "description",
    width: 300
  },
  {
    title: "Domain Mastery",
    key: "masteryScore",
    dataIndex: "masteryScore",
    render: value => `${round(value)}% Mastered`
  },
  {
    title: "Standards",
    key: "standards",
    dataIndex: "standards",
    width: 335,
    render: (standards, record) => {
      return (
        <Row type="flex">
          {standards.map(standard => (
            <TooltipTag standard={standard} />
          ))}
        </Row>
      );
    }
  }
];

const StudentPerformanceSummary = ({ data, selectedMastery }) => {
  const filteredDomains = filter(data, domain => {
    if (!selectedMastery.length) {
      return data;
    }

    const domainStandardsMastery = map(domain.standards, standard => standard.scale.masteryLabel);
    return intersection(domainStandardsMastery, selectedMastery).length;
  });

  return (
    <>
      <StyledH3>Standard Performance Summary</StyledH3>
      <Row>
        <Col>
          <StyledTable dataSource={filteredDomains} columns={columns} pagination={false} />
        </Col>
      </Row>
    </>
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
