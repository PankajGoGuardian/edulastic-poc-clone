import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import { lightGrey9 } from "@edulastic/colors";
import { Table, Tooltip } from "antd";
import { IconInfo } from "@edulastic/icons";
import { ConfirmationModal } from "../../../src/components/common/ConfirmationModal";
import {
  itemsDataTableSelector,
  approveOrRejectMultipleItem as approveOrRejectMultipleItemAction,
  testsDataTableSelector
} from "../../ducks";
import {
  setApproveConfirmationOpenAction,
  getShowApproveConfirmationSelector
} from "../../../TestPage/components/AddItems/ducks";
import { approveOrRejectMultipleTestsRequestAction } from "../../../TestList/ducks";

const padd = num => {
  if (num < 10) {
    return `0${num}`;
  }
  return num;
};
const ApproveConfirmModal = ({
  contentType,
  showApproveConfirmation,
  itemsDataTable,
  testsDataTable,
  approveOrRejectMultipleItem,
  setApproveConfirmationOpen,
  approveOrRejectMultipleTestsRequest
}) => {
  const [isApproving, setIsApproving] = useState(false);

  const dataSource = contentType === "TEST" ? testsDataTable : itemsDataTable;
  useEffect(() => {
    setIsApproving(false);
  }, [showApproveConfirmation]);

  const contentHeading = contentType === "TEST" ? "Test" : "Item";
  const columns = [
    {
      title: "Collection",
      dataIndex: "name",
      key: "collection",
      render: (item, row) => {
        if (item === "No Collection") {
          return (
            <div>
              <span>{item}</span>
              <Tooltip
                title={`${row.count} ${
                  row.count > 1 ? `${contentHeading}s` : contentHeading
                } will not be approved. Please select a collection to get approved`}
              >
                <IconInfo color={lightGrey9} style={{ cursor: "pointer", marginLeft: "10px" }} />
              </Tooltip>
            </div>
          );
        }
        return item;
      }
    },
    {
      title: `${contentHeading} Count`,
      dataIndex: "count",
      key: "items",
      render: count => `${padd(count)} ${count > 1 ? `${contentHeading}s` : contentHeading}`
    }
  ];

  const handleApprove = () => {
    if (contentType === "TEST") {
      approveOrRejectMultipleTestsRequest({ status: "published" });
    } else {
      approveOrRejectMultipleItem({ status: "published" });
    }
    setIsApproving(true);
  };

  const handleCancel = () => {
    setApproveConfirmationOpen(false);
  };

  return (
    <StyledModal
      title={<p style={{ marginBottom: "20px" }}>{`Approve ${contentHeading}s`}</p>}
      visible={showApproveConfirmation}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      footer={[
        <EduButton isGhost key="cancel" onClick={handleCancel}>
          CANCEL
        </EduButton>,
        <EduButton data-cy="approve" key="submit" onClick={handleApprove} loading={isApproving}>
          APPROVE
        </EduButton>
      ]}
      destroyOnClose
    >
      <BodyStyled>
        <Table pagination={false} dataSource={dataSource} columns={columns} />;
      </BodyStyled>
    </StyledModal>
  );
};

export default connect(
  state => ({
    itemsDataTable: itemsDataTableSelector(state),
    testsDataTable: testsDataTableSelector(state),
    showApproveConfirmation: getShowApproveConfirmationSelector(state)
  }),
  {
    approveOrRejectMultipleItem: approveOrRejectMultipleItemAction,
    setApproveConfirmationOpen: setApproveConfirmationOpenAction,
    approveOrRejectMultipleTestsRequest: approveOrRejectMultipleTestsRequestAction
  }
)(ApproveConfirmModal);

const StyledModal = styled(ConfirmationModal)`
  .ant-modal-content {
    .ant-modal-body {
      background: transparent;
      box-shadow: none;
      padding: 0;
      min-height: 80px;
    }
  }
`;

const BodyStyled = styled.div`
  text-align: left;
  width: 100%;
`;
