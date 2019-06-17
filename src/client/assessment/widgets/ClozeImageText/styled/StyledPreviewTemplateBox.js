import styled from "styled-components";

export const StyledPreviewTemplateBox = styled.div.attrs({
  className: props => `imagedropdown_template_box ${props.smallSize ? "small" : ""}`
})`
  fontsize: ${props =>
    props.smallSize ? props.theme.widgets.clozeImageText.previewTemplateBoxSmallFontSize : props.fontSize};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px`)};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : `${maxWidth}px`)};
  height: ${({ height }) => (!height ? null : `${height}px`)};
  width: ${({ width }) => (!width ? null : `${width}px`)};
  margin: auto;
`;
