import React from "react";
import { Link } from "react-router-dom";
import { keyBy } from "lodash";
import moment from "moment";

// components
import { Tooltip } from "antd";
import { FlexContainer } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { StyledTable, StyledTag, Icon, TestThumbnail, AssignmentTD, TestTypeIcon } from "../styled";
import presentationIcon from "../../../Assignments/assets/presentation.svg";

// constants
import { STATUS_LIST, TEST_TYPE_COLOR } from "../../transformers";

const statusMap = keyBy(STATUS_LIST, "id");

const GradebookStudentTable = ({ t, dataSource = [], studentData, windowHeight }) => {

  const studentAssessments = studentData?.assessments || {};
  const assessmentsData = dataSource.map(a => ({
    ...a,
    endDate: a.class?.[0]?.endDate,
    ...studentAssessments[a.id]
  }));

  const columns = [
    {
      title: "Test Name",
      dataIndex: "name",
      render: (data, row) => (
        <FlexContainer justifyContent="unset" alignItems="center">
          <TestThumbnail src={row.thumbnail} />
          <Tooltip placement="top" title={data}>
            <AssignmentTD>{data}</AssignmentTD>
          </Tooltip>
          <Tooltip title={t(`common.toolTip.${row.testType}`)}>
            <TestTypeIcon bgColor={TEST_TYPE_COLOR[row.testType]}>
              {t(`common.${row.testType}`) || t("common.common")}
            </TestTypeIcon>
          </Tooltip>
        </FlexContainer>
      ),
      sorter: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    },
    {
      title: "Due Date",
      dataIndex: "endDate",
      render: data => data ? moment(data).format("MMM Do, YYYY h:mm A") : "-",
      sorter: (a, b) => ((a.endDate || 0) - (b.endDate || 0)) || ((a.laDate || 0) - (b.laDate || 0))
    },
    {
      title: "Submitted Date",
      dataIndex: "laDate",
      render: (data, row) => (!["NOT STARTED", "START"].includes(row.status) && data) ? moment(data).format("MMM Do, YYYY h:mm A") : "-",
      sorter: (a, b) => ((a.laDate || 0) - (b.laDate || 0)) || ((a.endDate || 0) - (b.endDate || 0)),
      defaultSortOrder: "descend"
    },
    {
      title: "Score",
      align: "center",
      render: (_, row) => row.maxScore ? `${row.score || 0}/${row.maxScore || 1}` : "-",
      sorter: (a, b) => {
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        const aMaxScore = a.maxScore || 0;
        const bMaxScore = b.maxScore || 0;
        return (aScore * bMaxScore - bScore * aMaxScore) || (aScore - bScore) || (aMaxScore - bMaxScore);
      }
    },
    {
      title: "Percentage",
      dataIndex: "percentScore",
      align: "center",
      render: data => data?.trim() ? data : "-",
      sorter: (a, b) => {
        const aScore = a.score || 0;
        const bScore = b.score || 0;
        const aMaxScore = a.maxScore || 0;
        const bMaxScore = b.maxScore || 0;
        return (aScore * bMaxScore - bScore * aMaxScore) || (aScore - bScore) || (aMaxScore - bMaxScore);
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: data => data ? (
        <StyledTag
          bgColor={statusMap[data].color}
          textColor={statusMap[data].fgColor}
        >
          {statusMap[data].name}
        </StyledTag>
      ) : "-",
      sorter: (a, b) => statusMap[a.status].idx - statusMap[b.status].idx
    },
    {
      dataIndex: "id",
      align: "center",
      render: (_, row) => (
        <Link to={`/author/classBoard/${row.id}/${row.class?.[0]?._id}`}>
          <Icon src={presentationIcon} alt="Images" />
        </Link>
      )
    }
  ];
  return (
    <StyledTable
      rowKey="id"
      columns={columns}
      dataSource={assessmentsData}
      pagination={false}
    />
  );
};

export default withNamespaces("assignmentCard")(GradebookStudentTable);
