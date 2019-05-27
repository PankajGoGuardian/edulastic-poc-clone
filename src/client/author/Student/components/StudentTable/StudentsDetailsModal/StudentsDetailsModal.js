import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Row, Col, Button, Modal, Table } from "antd";
import { StyledStatusIcon, StatusDiv } from "./styled";

class StudentsDetailsModal extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: "Username",
        dataIndex: "userName",
        width: "50%"
      },
      {
        title: "Status",
        dataIndex: "status",
        width: "50%",
        render: (text, record) => {
          let statusText = "";
          if (record.status === "SUCCESS") {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="check" iconColor={"#1890ff"} />
                New User Created
              </StatusDiv>
            );
          } else if (record.status === "FAILED_USER_EXISTS") {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="exclamation-circle" iconColor={"#faad14"} />
                User Already Exist
              </StatusDiv>
            );
          } else {
            statusText = (
              <StatusDiv>
                <StyledStatusIcon type="close-circle" iconColor={"#f5222d"} />
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
    const columns = this.columns.map(col => {
      return {
        ...col
      };
    });

    const { dataSource, modalVisible } = this.props;
    console.log(dataSource);
    return (
      <Modal
        visible={modalVisible}
        title="Student Details"
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
            <Table dataSource={dataSource} pagination={false} columns={columns} />
          </Col>
        </Row>
      </Modal>
    );
  }
}

const enhance = compose(
  connect(state => ({
    dataSource: get(state, ["studentReducer", "multiStudents"], [])
  }))
);

export default enhance(StudentsDetailsModal);
