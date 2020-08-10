import React from "react";
import PropTypes from "prop-types";
import { Modal, Table, Button } from "antd";
import { FlexContainer } from "./styled";
import { lightGrey, themeColor, white } from "@edulastic/colors";
import PerfectScrollbar from "react-perfect-scrollbar";

const ShowSyncDetailsModal = ({ syncClassResponse, visible, close }) => {
  const columns = [
    {
      title: "Name",
      key: "firstName",
      width: "25%",
      dataIndex: "name",
      render: (_, row) => `${row.firstName} ${row.lastName}`
    },
    {
      title: "UserName",
      key: "username",
      width: "30%",
      dataIndex: "username"
    },
    {
      title: "Role",
      key: "username",
      width: "15%",
      dataIndex: "role"
    },
    {
      title: "Status",
      key: "status",
      width: "30%",
      dataIndex: "status"
    }
  ];

  return (
    <Modal
      visible={visible}
      onCancel={close}
      title="Google Sync Details"
      width={"70vw"}
      bodyStyle={{ backgroundColor: lightGrey, height: "70vh" }}
      style={{}}
      footer={
        <FlexContainer style={{ alignItems: "center" }}>
          <Button
            style={{ backgroundColor: themeColor, color: white, padding: "3px 30px 3px" }}
            shape="round"
            onClick={() => close()}
          >
            {" "}
            DONE{" "}
          </Button>
        </FlexContainer>
      }
    >
      <PerfectScrollbar>
        {Object.keys(syncClassResponse).map((group, index) => (
          <FlexContainer style={{ margin: "0px 20px 40px", padding: "20px", background: white, borderRadius: "10px" }}>
            <div>
              <b> {`#${index + 1} `}</b>
              {`The class section`} <b>{syncClassResponse[group].groupName}</b>
              {` is synced with Google Class `}
              <b>{group}</b>
              {`. Below are the synced student details: `}
            </div>
            <Table
              style={{ marginTop: "20px" }}
              columns={columns}
              dataSource={syncClassResponse[group].students}
              bordered
              pagination={{
                defaultPageSize: (syncClassResponse[group].students && syncClassResponse[group].students.length) || 10,
                hideOnSinglePage: true
              }}
            />
          </FlexContainer>
        ))}
      </PerfectScrollbar>
    </Modal>
  );
};

ShowSyncDetailsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  syncClassResponse: PropTypes.object
};
export default ShowSyncDetailsModal;
