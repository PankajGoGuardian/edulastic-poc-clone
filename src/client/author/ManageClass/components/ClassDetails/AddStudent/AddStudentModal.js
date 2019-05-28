import React from "react";
import PropTypes from "prop-types";
import { Form, Icon, Collapse, Spin } from "antd";
import { IconUser } from "@edulastic/icons";
import { find } from "lodash";

import BasicFields from "./BasicFields";
import AdditionalFields from "./AdditionalFields";
import { StyledModal, Title, ActionButton, PanelHeader } from "./styled";

const { Panel } = Collapse;
// = ({ handleAdd, handleCancel, isOpen, form }) =>
class AddStudentModal extends React.Component {
  state = {
    keys: ["basic"]
  };

  render() {
    const { form, handleCancel, handleAdd, isOpen, submitted, stds, isEdit } = this.props;
    const { keys } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const std = isEdit ? stds[0] : {};

    const title = (
      <Title>
        <IconUser />
        <label>{isEdit ? "Update a User" : "Add Student to Class"}</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={handleCancel} ghost type="primary">
          No, Cancel
        </ActionButton>
        <ActionButton onClick={handleAdd} type="primary">
          {isEdit ? "Yes, Update Student" : "Yes, Add Student"}
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
      <StyledModal title={title} visible={isOpen} footer={footer}>
        <Spin spinning={submitted}>
          <Form>
            <Collapse accordion defaultActiveKey={keys} expandIcon={expandIcon} expandIconPosition="right">
              <Panel header={BasicDetailsHeader} key="basic">
                <BasicFields
                  getFieldDecorator={getFieldDecorator}
                  getFieldValue={getFieldValue}
                  std={std}
                  isEdit={isEdit}
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
  submitted: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool,
  stds: PropTypes.array,
  isEdit: PropTypes.bool
};

AddStudentModal.defaultProps = {
  isOpen: false,
  stds: [],
  isEdit: false
};

const AddStudentForm = Form.create({ name: "add_student_form" })(AddStudentModal);

export default AddStudentForm;
