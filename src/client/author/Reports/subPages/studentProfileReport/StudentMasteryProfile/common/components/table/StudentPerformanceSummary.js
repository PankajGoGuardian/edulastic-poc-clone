import React from "react";
import PropTypes from "prop-types";
import { round } from "lodash";
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

const StudentPerformanceSummary = ({ data }) => {
  return (
    <>
      <StyledH3>Standard Performance Summary</StyledH3>
      <Row>
        <Col>
          <StyledTable
            dataSource={data}
            columns={columns}
            pagination={{
              pageSize: 5
            }}
          />
        </Col>
      </Row>
    </>
  );
};

StudentPerformanceSummary.propTypes = {
  data: PropTypes.array
};

StudentPerformanceSummary.defaultProps = {
  data: []
};

export default StudentPerformanceSummary;
