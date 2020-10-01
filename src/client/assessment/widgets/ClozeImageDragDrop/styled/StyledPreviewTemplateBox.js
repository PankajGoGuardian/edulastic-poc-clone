import styled from 'styled-components'

export const StyledPreviewTemplateBox = styled.div.attrs({
  className: 'imagedropdown_template_box',
})`
  font-size: ${(props) =>
    props.smallSize
      ? props.theme.widgets.clozeImageText.previewTemplateBoxSmallFontSize
      : props.fontSize};
  max-height: ${({ maxHeight, theme }) => {
    const calculatedMaxHeight = !maxHeight ? null : `${maxHeight}px`

    return theme.zoomLevel !== 'xs' ? 'auto' : calculatedMaxHeight
  }};
  max-width: ${({ maxWidth }) => (!maxWidth ? null : maxWidth)};
  height: ${({ height }) => (!height ? null : `${height}px`)};
  width: ${({ width }) => (!width ? null : `${width}px`)};
  margin: auto;

  zoom: ${(props) => props.theme.widgets.clozeImageDragDrop.imageZoom};
`
