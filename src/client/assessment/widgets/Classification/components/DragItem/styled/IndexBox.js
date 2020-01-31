import styled from "styled-components";

const indexStyle = `
  position: absolute;
  left: 0px;
  top: 0px;
  height: 40px;
  width: 40px;
  border-radius: 0px;
  z-index: 10;
`;

export const IndexBox = styled.div`
  font-size: ${props => props.theme.widgets.classification.indexBoxFontSize};
  font-weight: ${props => props.theme.widgets.classification.indexBoxFontWeight};
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: ${props => props.theme.widgets.classification.indexBoxColor};
  background: ${({ preview, valid, theme }) =>
    valid && preview
      ? theme.widgets.classification.indexBoxValidBgColor
      : preview && valid !== undefined
      ? theme.widgets.classification.indexBoxNotValidBgColor
      : theme.widgets.classification.indexBoxBgColor};
  ${({ pos }) => pos === "absolute" && indexStyle}
`;
