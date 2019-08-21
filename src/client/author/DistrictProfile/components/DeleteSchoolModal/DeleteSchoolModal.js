import React from "react";
import { compose } from "redux";
import { Button, Form, Input } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../author/src/components/common/ConfirmationModal";

import { borders, backgrounds, themeColor } from "@edulastic/colors";

const DeleteSchoolModal = ({ visible, toggleModal, form, removeSchool, selectedSchool }) => {
  const handleResponse = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values && values.confirmationText && values.confirmationText.toUpperCase() === "REMOVE") removeSchool();
      }
    });
  };

  const Footer = [
    <Button ghost onClick={() => toggleModal("REMOVE_SCHOOL", false)}>
      NO, CANCEL
    </Button>,
    <Button onClick={handleResponse}>YES, REMOVE</Button>
  ];

  const Title = [<Heading>Remove</Heading>];

  const validateText = (rule, value, callback) => {
    if (value && value.toUpperCase() !== "REMOVE") {
      callback("Please enter REMOVE in the field.");
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
      onCancel={() => toggleModal("REMOVE_SCHOOL", false)}
      width={700}
    >
      <ModalBody>
        <span>
          You are about to remove the school <strong>{selectedSchool.name}</strong>.
        </span>
        <span>All assessment and questions shared with {selectedSchool.name} would be moved to private Library.</span>
        <span>
          This action can NOT be undone, please type <span style={{ color: themeColor }}>REMOVE</span> in the space
          below to proceed.
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

export default enhance(DeleteSchoolModal);

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: auto;
  span {
    margin-bottom: 15px;
  }
`;

const FormItem = styled(Form.Item)`
  width: 100%;
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
