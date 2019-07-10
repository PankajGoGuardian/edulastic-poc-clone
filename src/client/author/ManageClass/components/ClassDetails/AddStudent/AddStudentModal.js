import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { Form, Icon, Collapse, Spin } from "antd";
import { IconUser } from "@edulastic/icons";

import BasicFields from "./BasicFields";
import AdditionalFields from "./AdditionalFields";
import { StyledModal, Title, ActionButton, PanelHeader } from "./styled";
import { getUserOrgData } from "../../../../src/selectors/user";
import { enrollmentApi } from "@edulastic/api";

const { Panel } = Collapse;
class AddStudentModal extends React.Component {
  state = {
    keys: ["basic"],
    isUpdate: false,
    foundUserId: ""
  };

  setIsUpdate = payload => {
    this.setState({
      ...this.state,
      isUpdate: payload
    });
  };
  setFounduser = payload => {
    this.setState({
      ...this.state,
      foundUserId: payload
    });
  };

  enrollStudent = async () => {
    const { selectedClass, orgData, loadStudents, handleCancel } = this.props;
    const { _id: classId } = selectedClass;
    const { code: classCode } = selectedClass;
    const { districtId } = orgData;
    const userId = this.state.foundUserId;
    const data = {
      classCode,
      studentIds: [userId],
      districtId
    };
    const res = await enrollmentApi.SearchAddEnrolMultiStudents(data);
    if (res.status == 200) {
      handleCancel();
      loadStudents({ classId });
    } else {
      console.log("error updating student");
    }
  };

  render() {
    const { form, handleCancel, handleAdd, isOpen, submitted, stds, isEdit, foundUserId } = this.props;
    const { keys, isUpdate } = this.state;
    const { getFieldDecorator, getFieldValue, setFields, setFieldsValue } = form;
    const std = {};

    const title = (
      <Title>
        <IconUser />
        <label>{isEdit ? "Update User" : "Add Student to Class"}</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={handleCancel} ghost type="primary">
          No, Cancel
        </ActionButton>

        <ActionButton onClick={isUpdate ? this.enrollStudent : handleAdd} type="primary">
          {isUpdate ? "Yes, Enroll Student" : "Yes, Add Student"}

          <Icon type="right" />
        </ActionButton>
      </>
    );

    const expandIcon = panelProps => (panelProps.isActive ? <Icon type="caret-up" /> : <Icon type="caret-down" />);

    const BasicDetailsHeader = (
      <PanelHeader>
        <Icon type="bars" />
        <label>Basic Details</label>
      </PanelHeader>
    );

    const AdditionalDetailsHeader = (
      <PanelHeader>
        <Icon type="setting" theme="filled" />
        <label>Configure Additional Details</label>
      </PanelHeader>
    );

    return (
      <StyledModal title={title} visible={isOpen} onCancel={handleCancel} footer={footer}>
        <Spin spinning={submitted}>
          <Form>
            <Collapse accordion defaultActiveKey={keys} expandIcon={expandIcon} expandIconPosition="right">
              <Panel header={BasicDetailsHeader} key="basic">
                <BasicFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  stds={stds}
                  isEdit={isEdit}
                  setFields={setFields}
                  setFieldsValue={setFieldsValue}
                  isUpdate={isUpdate}
                  setIsUpdate={this.setIsUpdate}
                  updateStudent={this.updateStudent}
                  setFounduser={this.setFounduser}
                  foundUserId={foundUserId}
                  modalClose={handleCancel}
                />
              </Panel>
              <Panel header={AdditionalDetailsHeader} key="additional">
                <AdditionalFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  isEdit={isEdit}
                />
              </Panel>
            </Collapse>
          </Form>
        </Spin>
      </StyledModal>
    );
  }
}

AddStudentModal.propTypes = {
  handleAdd: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  isOpen: PropTypes.bool,
  stds: PropTypes.array,
  isEdit: PropTypes.bool
};

AddStudentModal.defaultProps = {
  isOpen: false,
  stds: [],
  isEdit: false,
  submitted: false
};

const AddStudentForm = Form.create({ name: "add_student_form" })(AddStudentModal);

export default connect(state => ({
  orgData: getUserOrgData(state),
  selectedClass: get(state, "manageClass.entity")
}))(AddStudentForm);
