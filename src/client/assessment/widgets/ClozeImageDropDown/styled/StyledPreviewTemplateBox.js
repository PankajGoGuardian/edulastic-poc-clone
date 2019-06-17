import styled from "styled-components";

export const StyledPreviewTemplateBox = styled.div.attrs({
  className: props => `imagedropdown_template_box ${props.smallSize ? "small" : ""}`
})`
  fontsize: ${props =>
    props.smallSize ? props.theme.widgets.clozeImageDropDown.previewTemplateBoxSmallFontSize : `${props.fontSize}px`};
  max-height: ${({ maxHeight }) => (!maxHeight ? null : `${maxHeight}px !important`)};
  height: ${({ height }) => (!height ? null : `${height}px`)};
`;
