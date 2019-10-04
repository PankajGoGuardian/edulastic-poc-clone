import styled from "styled-components";
import { tabGrey, someGreyColor1 } from "@edulastic/colors";

const underline = `
  content: "";
  width: calc(100% + 10px);
  position: absolute;
  left: -5px;
  border-bottom: 2px ${tabGrey} solid;
`;

export const MultiChoiceContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-weight: ${props => props.theme.widgets.multipleChoice.multiChoiceContentFontWeight};
  font-size: ${props => props.fontSize || props.theme.widgets.multipleChoice.multiChoiceContentFontSize};

  .katex {
    font-size: ${props => props.fontSize || props.theme.widgets.multipleChoice.multiChoiceContentFontSize};
  }

  ${({ isCrossAction }) =>
    isCrossAction &&
    `
      position: relative;
      & * {
        color: ${someGreyColor1} !important;
      }
      &:after { ${underline} }
    `}
`;

export const MultipleChoiceLabelContainer = styled.div`
  display: block;
`;

MultiChoiceContent.displayName = "MultiChoiceContent";
