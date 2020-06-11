import styled from "styled-components";
import { InputNumber, Select } from "antd";
import { Paper } from "@edulastic/common";
import { ModalTitle } from "../../common/Modal";
import { FormGroup } from "../QuestionEditModal/common/QuestionForm";

export const BulkTitle = styled(ModalTitle)`
  margin-left: 0;
`;

export const NumberInput = styled(InputNumber)`
  .ant-input-number-input {
    text-align: left;
  }
`;

export const TypeOfQuestion = styled(FormGroup)`
  margin-left: 17px;
`;

export const StartingIndexInput = styled(InputNumber)`
  width: 100%;

  .ant-input-number-input {
    text-align: left;
  }
`;

export const TypeOfQuestionSelect = styled(Select)`
  width: 550px;
`;

export const StandardSelectWrapper = styled(Paper)`
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
  padding: 15px;
  margin-top: 15px;
`;