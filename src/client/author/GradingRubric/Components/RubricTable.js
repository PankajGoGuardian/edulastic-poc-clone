import React from "react";
import { connect } from "react-redux";
import { Col, Icon } from "antd";
import { TableActionsContainer, StyledTable, StyledScrollbarContainer } from "../styled";
import { updateRubricDataAction, getCurrentRubricDataSelector } from "../ducks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const RubricTable = ({ handleTableAction, searchedRubricList, loading, user }) => {
  const columns = [
    {
      title: "Rubric Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Author",
      dataIndex: "name",
      key: "authorName",
      render: (_, record) => record.createdBy.name
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "",
      key: "actions",
      align: "right",
      render: (text, record, index) => getTableActions(text, record, index)
    }
  ];

  const getTableActions = (text, record) => {
    return (
      <TableActionsContainer>
        <span title="Preview" onClick={() => handleTableAction("PREVIEW", record._id)}>
          <Icon type="eye" />
        </span>
        <span title="Clone" onClick={() => handleTableAction("CLONE", record._id)}>
          <FontAwesomeIcon icon={faClone} aria-hidden="true" />
        </span>
        {record.createdBy._id === user._id && (
          <>
            <span title="Delete" onClick={() => handleTableAction("DELETE", record._id)}>
              <FontAwesomeIcon icon={faTrashAlt} aria-hidden="true" />
            </span>
            <span title="Share" onClick={() => handleTableAction("SHARE", record._id)}>
              <Icon type="share-alt" />
            </span>
          </>
        )}
      </TableActionsContainer>
    );
  };

  return (
    <Col md={24}>
      <StyledScrollbarContainer style={{ maxHeight: "350px" }}>
        <StyledTable columns={columns} dataSource={searchedRubricList} pagination={false} loading={loading} />
      </StyledScrollbarContainer>
    </Col>
  );
};

export default connect(
  state => ({
    currentRubricData: getCurrentRubricDataSelector(state)
  }),
  {
    updateRubricData: updateRubricDataAction
  }
)(RubricTable);
