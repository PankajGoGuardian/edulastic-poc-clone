import styled from "styled-components";
import { Checkbox } from "antd";

export const DragCrad = styled.div`
  display: flex;
  align-items: center;
`;

export const DragHandler = styled.div`
  width: 30px;
  cursor: move;
  text-align: center;
`;

export const ReviewItemWrapper = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  width: calc(100% - 30px);
  background: white;

  &:first-child {
    border-top: 1px solid #e8e8e8;
  }
`;

export const QuestionCheckbox = styled(Checkbox)`
  display: block;
  margin-top: 10px;
`;

export const QuestionIndex = styled.div``;
