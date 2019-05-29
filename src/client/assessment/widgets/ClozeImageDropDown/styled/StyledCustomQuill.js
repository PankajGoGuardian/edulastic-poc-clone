import styled from "styled-components";
import QuestionTextArea from "../../../components/QuestionTextArea";

export const StyledQuestionTextArea = styled(QuestionTextArea)`
  min-height: 134px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.widgets.clozeImageDropDown.customQuilBorderColor};
  padding: 18px 33px;
`;
