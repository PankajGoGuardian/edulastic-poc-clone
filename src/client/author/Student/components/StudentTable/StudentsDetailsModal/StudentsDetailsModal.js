import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, isEmpty } from "lodash";

import { Row, Col, Button, Modal, Table } from "antd";
import { StyledStatusIcon, StatusDiv } from "./styled";

class StudentsDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Name",
        dataIndex: "fullName",
        width: "50%",
        render: (fullName, { provider, role }) => {
          if (role === "student") {
            if (provider === "google" || provider === "mso") {
              return <div>Student name will be auto-updated after first sign-in</div>;
            } else {
              return <div>{isEmpty(fullName.trim()) ? "-" : fullName}</div>;
            }
          }
          if (role === "teacher") return <div>Teacher name will be updated after first sign-up</div>;
        }
      },
      {
        title: "Username",
        dataIndex: "username",
        width: "50%",
        render: username => <div>{username}</div>
      },
      {
        title: "Status",
        dataIndex: "status",
        width: "50%",
        render: status => {
          let statusText = "";
          if (status === "SUCCESS") {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="check" iconColor="#1890ff" />
                New User Created
              </StatusDiv>
            );
          } else if (status === "FAILED_USER_EXISTS") {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="exclamation-circle" iconColor="#faad14" />
                User Already Exist
              </StatusDiv>
            );
          } else {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="close-circle" iconColor="#f5222d" />
                Create User Failed
              </StatusDiv>
            );
          }
          return <React.Fragment>{statusText}</React.Fragment>;
        }
      }
    ];
  }

  onCloseModal = () => {
    this.props.closeModal();
  };

  render() {
    const { dataSource, teacherDataSource, role, modalVisible, dataProvider } = this.props;
    const selectedDataSource = role === "teacher" ? teacherDataSource : dataSource;
    const modifiedDataSource = selectedDataSource.map(item => {
      const obj = {
        ...item,
        fullName: get(item, "firstName", "") + " " + get(item, "lastName", ""),
        provider: dataProvider,
        role
      };
      return obj;
    });
    return (
      <Modal
        visible={modalVisible}
        title={role === "teacher" ? "Teacher Details" : "Student Details"}
        onCancel={this.onCloseModal}
        maskClosable={false}
        footer={[
          <Button type="primary" key="back" onClick={this.onCloseModal}>
            Done
          </Button>
        ]}
      >
        <Row>
          <Col span={24}>
            <Table
              rowKey={record => record.userName}
              dataSource={modifiedDataSource}
              pagination={false}
              columns={this.columns}
            />
          </Col>
        </Row>
      </Modal>
    );
  }
}

const enhance = compose(
  connect(state => ({
    dataSource: get(state, ["studentReducer", "multiStudents"], []),
    teacherDataSource: get(state, ["schoolAdminReducer", "bulkTeacherData"], []),
    dataProvider: get(state, ["studentReducer", "mutliStudentsProvider"], "")
  }))
);

export default enhance(StudentsDetailsModal);
