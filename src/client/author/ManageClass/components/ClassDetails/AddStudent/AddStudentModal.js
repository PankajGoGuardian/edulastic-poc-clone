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

  setKeys = keys => this.setState({ keys });

  render() {
    const { form, handleCancel, handleAdd, isOpen, submitted } = this.props;
    const { keys } = this.state;
    const { getFieldDecorator, getFieldValue } = form;

    const title = (
      <Title>
        <IconUser />
        <label>Add Student to Class</label>
      </Title>
    );

    const footer = (
      <>
        <ActionButton onClick={handleCancel} ghost type="primary">
          No, Cancel
        </ActionButton>
        <ActionButton onClick={handleAdd} type="primary">
          Yes, Add Student <Icon type="right" />
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
        <label>Basic Details</label>
      </PanelHeader>
    );

    return (
      <StyledModal title={title} visible={isOpen} footer={footer} onCancel={handleCancel}>
        <Spin spinning={submitted}>
          <Form>
            <Collapse
              defaultActiveKey={keys}
              onChange={this.setKeys}
              expandIcon={expandIcon}
              expandIconPosition="right"
            >
              <Panel header={BasicDetailsHeader} key="basic">
                <BasicFields getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} />
              </Panel>
              <Panel header={AdditionalDetailsHeader} key="additional">
                {find(keys, key => key === "additional") && (
                  <AdditionalFields getFieldDecorator={getFieldDecorator} getFieldValue={getFieldValue} />
                )}
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
  isOpen: PropTypes.bool.isRequired,
  form: PropTypes.object.isRequired,
  submitted: PropTypes.bool.isRequired
};

AddStudentModal.defaultProps = {};

const AddStudentForm = Form.create({ name: "add_student_form" })(AddStudentModal);

export default AddStudentForm;
