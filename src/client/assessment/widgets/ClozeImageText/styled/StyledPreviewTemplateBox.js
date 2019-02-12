import styled from 'styled-components';

export const StyledPreviewTemplateBox = styled.div.attrs({
  className: props => `imagedropdown_template_box ${props.smallSize ? 'small' : ''}`
})`
  fontSize: ${props => (props.smallSize ? props.theme.widgets.clozeImageText.previewTemplateBoxSmallFontSize : props.fontSize)}px;
  overflow-y: ${props => props.smallSize && 'hidden'};
`;
