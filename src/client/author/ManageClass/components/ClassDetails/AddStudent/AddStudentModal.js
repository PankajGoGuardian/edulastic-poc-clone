import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { Form, Icon, Collapse, Spin, message } from "antd";
import { IconUser } from "@edulastic/icons";

import { enrollmentApi } from "@edulastic/api";
import BasicFields from "./BasicFields";
import AdditionalFields from "./AdditionalFields";
import { StyledModal, Title, ActionButton, PanelHeader, AddForm } from "./styled";
import { getUserOrgData } from "../../../../src/selectors/user";
import { fetchStudentsByIdAction } from "../../../ducks";
import { getValidatedClassDetails } from "../../../../Student/ducks";

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
    const {
      selectedClass: { groupInfo = {} },
      orgData,
      loadStudents,
      handleCancel
    } = this.props;
    const { _id: classId } = groupInfo;
    const { code: classCode } = groupInfo;
    const { districtId } = orgData;
    const userId = this.state.foundUserId;
    const data = {
      classCode,
      studentIds: [userId],
      districtId
    };
    const res = await enrollmentApi.SearchAddEnrolMultiStudents(data);
    if (res.status == 200) {
      message.success("User added to class successfully");
      handleCancel();
      loadStudents({ classId });
      return null;
    }
    message.error("Create User is failing");
  };

  render() {
    const {
      form,
      handleCancel,
      handleAdd,
      isOpen,
      submitted,
      stds,
      isEdit,
      foundUserId,
      showClassCodeField,
      fetchClassDetailsUsingCode,
      showTtsField,
      validatedClassDetails,
      resetClassDetails
    } = this.props;

    const { keys, isUpdate } = this.state;
    const { getFieldDecorator, getFieldValue, setFields, setFieldsValue } = form;
    const std = {};

    const title = (
      <Title>
        <IconUser />
        <label>{isEdit ? "Update User" : "Add Student"}</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={handleCancel} ghost type="primary">
          No, Cancel
        </ActionButton>

        <ActionButton data-cy="addButton" onClick={isUpdate ? this.enrollStudent : handleAdd} type="primary">
          {isUpdate ? "Yes, Enroll Student" : isEdit ? "Yes, Update" : "Yes, Add Student"}
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
        <label>Configure Additional Details</label>
      </PanelHeader>
    );

    return (
      <StyledModal
        centered
        title={title}
        visible={isOpen}
        onCancel={handleCancel}
        footer={footer}
        textAlign="left"
        padding="0px"
        centered
      >
        <Spin spinning={submitted}>
          <AddForm>
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
              showClassCodeField={showClassCodeField}
              fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
              validatedClassDetails={validatedClassDetails}
              resetClassDetails={resetClassDetails}
            />
            <Collapse accordion defaultActiveKey={keys} expandIcon={expandIcon} expandIconPosition="right">
              <Panel header={AdditionalDetailsHeader} key="additional">
                <AdditionalFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  isEdit={isEdit}
                  stds={stds}
                  showTtsField
                />
              </Panel>
            </Collapse>
          </AddForm>
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

export default connect(
  state => ({
    orgData: getUserOrgData(state),
    selectedClass: getValidatedClassDetails(state) || {}
  }),
  { loadStudents: fetchStudentsByIdAction }
)(AddStudentForm);
