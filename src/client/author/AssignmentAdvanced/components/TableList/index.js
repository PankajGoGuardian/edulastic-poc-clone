import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { groupBy } from "lodash";
import { Tooltip, Dropdown } from "antd";
import { Link, withRouter } from "react-router-dom";
import { withNamespaces } from "@edulastic/localization";
import { test } from "@edulastic/constants";
import { EduButton, notification } from "@edulastic/common";
import { IconMoreHorizontal } from "@edulastic/icons";
import presentationIcon from "../../assets/presentation.svg";
import additemsIcon from "../../assets/add-items.svg";
import piechartIcon from "../../assets/pie-chart.svg";
import ReleaseScoreSettingsModal from "../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal";
import { DeleteAssignmentModal } from "../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal";
import {
  Container,
  Icon,
  TableData,
  TypeIcon,
  BtnStatus,
  ActionsWrapper,
  BulkActionsWrapper,
  BulkActionsButtonContainer,
  MoreOption
} from "./styled";
import { Container as MoreOptionsContainer } from "../../../Assignments/components/ActionMenu/styled";

export const testTypeToolTip = {
  assessment: "Class Assessment",
  "common assessment": "Common Assessment",
  practice: "Practice Assessment"
};

const columns = [
  {
    title: "Class",
    dataIndex: "class",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.class.localeCompare(b.class, "en", { ignorePunctuation: true }),
    width: "30%",
    align: "left",
    render: text => <div>{text}</div>
  },
  {
    title: "Type",
    dataIndex: "type",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.type.localeCompare(b.type, "en", { ignorePunctuation: true }),
    width: "6%",
    render: (text = test.type.ASSESSMENT) => (
      <Tooltip placement="bottom" title={testTypeToolTip[text]}>
        <TypeIcon type={text.charAt(0)}>{text.charAt(0)}</TypeIcon>
      </Tooltip>
    )
  },
  {
    title: "Assigned by",
    dataIndex: "assigned",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.assigned.localeCompare(b.assigned, "en", { ignorePunctuation: true }),
    width: "20%",
    render: text => <div> {text} </div>
  },
  {
    title: "Status",
    dataIndex: "status",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.status.localeCompare(b.status, "en", { ignorePunctuation: true }),
    width: "10%",
    render: text => (text ? <BtnStatus status={text}>{text}</BtnStatus> : "")
  },
  {
    title: "Submitted",
    dataIndex: "submitted",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => parseInt(a.submitted.split("/")[0], 10) - parseInt(b.submitted.split("/")[0], 10),
    width: "8%",
    render: text => <div> {text} </div>
  },
  {
    title: "Graded",
    dataIndex: "graded",
    sortDirections: ["descend", "ascend"],
    sorter: (a, b) => a.graded - b.graded,
    width: "8%",
    render: text => <div> {text} </div>
  },
  {
    title: "",
    dataIndex: "action",
    width: "8%",
    render: (_, row) => (
      <ActionsWrapper data-cy="PresentationIcon">
        <Tooltip placement="bottom" title="Live Class Board">
          <Link to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
            <Icon src={presentationIcon} alt="Images" />
          </Link>
        </Tooltip>
        <Tooltip placement="bottom" title="Express Grader">
          <Link to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}>
            <Icon src={additemsIcon} alt="Images" />
          </Link>
        </Tooltip>
        <Tooltip placement="bottom" title="Reports">
          <Link to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}>
            <Icon src={piechartIcon} alt="Images" />
          </Link>
        </Tooltip>
      </ActionsWrapper>
    )
  }
];
const TableList = ({
  classList = [],
  filterStatus,
  bulkOpenAssignmentRequest,
  bulkCloseAssignmentRequest,
  bulkPauseAssignmentRequest,
  bulkMarkAsDoneAssignmentRequest,
  bulkReleaseScoreAssignmentRequest,
  bulkUnassignAssignmentRequest,
  bulkDownloadGradesAndResponsesRequest,
  testType,
  testName,
  toggleDeleteAssignmentModal,
  isLoadingAssignments,
  bulkActionStatus,
  isHeaderAction
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [showReleaseScoreModal, setReleaseScoreModalVisibility] = useState(false);
  const convertRowData = (data, index) => ({
    class: data.name,
    type: data.testType,
    status: data.isPaused && data.status !== "DONE" ? `${data.status} (PAUSED)` : data.status,
    assigned: data.assignedBy.name,
    submitted: `${data.inGradingNumber + data.gradedNumber}/${data.assignedCount}`,
    graded: data.gradedNumber,
    action: "",
    assignmentId: data.assignmentId,
    classId: data._id,
    key: index
  });
  const rowData = useMemo(
    () =>
      classList
        .filter(o => (filterStatus ? o.status === filterStatus : true))
        .map((data, index) => convertRowData(data, index)),
    [classList, filterStatus]
  );

  /**
   * Here we are resetting the selected rows to unselect whenever thre is a change in rows.
   * Change in row can occur when we filter the rows based on status of the row.
   */
  useEffect(() => {
    setSelectedRows([]);
  }, [rowData]);

  const showPagination = rowData.length > 10;

  const handleSelectAll = selected => {
    if (selected) {
      setSelectedRows(rowData.map(({ key }) => key));
    } else {
      setSelectedRows([]);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map(key => key),
    onSelect: (_, __, selectedRowz) => {
      setSelectedRows(selectedRowz.map(({ key }) => key));
    },
    onSelectAll: handleSelectAll
  };

  const handleBulkAction = (type, releaseScoreResponse) => {
    if (bulkActionStatus) {
      return notification({
        msg: "The test is being updated by another user, please wait for a few minutes and try again."
      });
    }
    let selectedRowsGroupByAssignment = {};
    if (rowData.length > selectedRows.length) {
      const selectedRowsData = rowData.filter((_, i) => selectedRows.includes(i));
      selectedRowsGroupByAssignment = groupBy(selectedRowsData, "assignmentId");
      for (const [key, value] of Object.entries(selectedRowsGroupByAssignment)) {
        const classIds = value.map(d => d.classId);
        selectedRowsGroupByAssignment[key] = classIds;
      }
    }
    const payload = {
      data: selectedRowsGroupByAssignment,
      testId: classList[0].testId,
      testType
    };
    if (type === "open") bulkOpenAssignmentRequest(payload);
    else if (type === "close") bulkCloseAssignmentRequest(payload);
    else if (type === "pause") bulkPauseAssignmentRequest(payload);
    else if (type === "markAsDone") bulkMarkAsDoneAssignmentRequest(payload);
    else if (type === "releaseScore") {
      payload.data = {
        assignmentGroups: payload.data,
        releaseScore: releaseScoreResponse
      };
      bulkReleaseScoreAssignmentRequest(payload);
    } else if (type === "unassign") bulkUnassignAssignmentRequest(payload);
    else {
      payload.testName = testName;
      if (type === "downloadResponses") {
        payload.isResponseRequired = true;
      }
      bulkDownloadGradesAndResponsesRequest(payload);
    }
  };

  const onUpdateReleaseScoreSettings = releaseScoreResponse => {
    setReleaseScoreModalVisibility(false);
    handleBulkAction("releaseScore", releaseScoreResponse);
  };

  const moreOptions = () => (
    <MoreOptionsContainer>
      <MoreOption onClick={() => setReleaseScoreModalVisibility(true)}>Release Score</MoreOption>
      <MoreOption onClick={() => handleBulkAction("downloadGrades")}>Download Grades</MoreOption>
      <MoreOption onClick={() => handleBulkAction("downloadResponses")}>Download Responses</MoreOption>
      <MoreOption onClick={() => toggleDeleteAssignmentModal(true)}>Unassign</MoreOption>
    </MoreOptionsContainer>
  );

  const renderBulkActions = () => (
    <BulkActionsWrapper>
      <div>
        <span>{selectedRows.length}</span>
        <span>Class(es) Selected</span>
      </div>
      <BulkActionsButtonContainer>
        <EduButton height="30px" isGhost btnType="primary" onClick={() => handleBulkAction("open")}>
          Open
        </EduButton>
        <EduButton height="30px" isGhost btnType="primary" onClick={() => handleBulkAction("pause")}>
          Pause
        </EduButton>
        <EduButton height="30px" isGhost btnType="primary" onClick={() => handleBulkAction("close")}>
          Close
        </EduButton>
        <EduButton height="30px" isGhost btnType="primary" onClick={() => handleBulkAction("markAsDone")}>
          Mark as Done
        </EduButton>
        <Dropdown
          overlay={moreOptions()}
          placement="bottomLeft"
          trigger={["hover"]}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          <EduButton height="30px" isGhost btnType="primary">
            <IconMoreHorizontal /> More
          </EduButton>
        </Dropdown>
      </BulkActionsButtonContainer>
    </BulkActionsWrapper>
  );

  return (
    <Container>
      {selectedRows.length > 0 && renderBulkActions()}
      <TableData
        columns={columns}
        dataSource={rowData}
        pagination={showPagination}
        rowSelection={rowSelection}
        loading={isLoadingAssignments}
      />
      <ReleaseScoreSettingsModal
        showReleaseGradeSettings={showReleaseScoreModal}
        onCloseReleaseScoreSettings={() => setReleaseScoreModalVisibility(false)}
        updateReleaseScoreSettings={onUpdateReleaseScoreSettings}
      />
      {!isHeaderAction && (
        <DeleteAssignmentModal
          handleUnassignAssignments={() => {
            toggleDeleteAssignmentModal(false);
            handleBulkAction("unassign");
          }}
          advancedAssignments
        />
      )}
    </Container>
  );
};

TableList.propTypes = {
  classList: PropTypes.array.isRequired
};

const enhance = compose(
  withRouter,
  withNamespaces("assignmentCard")
);

export default enhance(TableList);
