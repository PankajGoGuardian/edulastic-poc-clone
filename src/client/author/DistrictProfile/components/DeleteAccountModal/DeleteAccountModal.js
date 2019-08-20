import React from "react";
import { compose } from "redux";
import { Button, Form, Input } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../author/src/components/common/ConfirmationModal";

import { borders, backgrounds, themeColor } from "@edulastic/colors";

const DeleteAccountModal = ({ visible, toggleModal, form, deleteProfile }) => {
  const handleResponse = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values && values.confirmationText && values.confirmationText.toUpperCase() === "DELETE") deleteProfile();
      }
    });
  };

  const Footer = [
    <Button ghost onClick={() => toggleModal("DELETE_ACCOUNT", false)}>
      No, Cancel
    </Button>,
    <Button onClick={handleResponse}>Yes, Delete</Button>
  ];

  const Title = [<Heading>Delete My Account</Heading>];

  const validateText = (rule, value, callback) => {
    if (value && value.toUpperCase() !== "DELETE") {
      callback("Please enter DELETE in the field.");
    } else {
      callback();
    }
  };

  return (
    <ConfirmationModal
      title={Title}
      centered
      textAlign="left"
      visible={visible}
      footer={Footer}
      textAlign={"center"}
      onCancel={() => toggleModal("DELETE_ACCOUNT", false)}
    >
      <ModalBody>
        <span>Are you sure want to delete this account?</span>
        <span>
          If sure, please type <span style={{ color: themeColor }}>DELETE</span> in the space below to proceed.
        </span>
        <FormItem>
          {form.getFieldDecorator("confirmationText", {
            rules: [
              {
                required: true,
                message: "Please type the required Text."
              },
              {
                validator: validateText
              }
            ]
          })(<Input type="text" />)}
        </FormItem>
      </ModalBody>
    </ConfirmationModal>
  );
};

const enhance = compose(Form.create());

export default enhance(DeleteAccountModal);

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const FormItem = styled(Form.Item)`
  width: 80%;
  display: inline-block;
  margin: 10px;
  .ant-input {
    height: 33px;
    background: ${backgrounds.primary};
    border: 1px solid ${borders.secondary};
    padding: 10px 24px;
  }
`;

const Heading = styled.h4`
  font-weight: 600;
`;
