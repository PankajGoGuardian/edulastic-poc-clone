import styled from "styled-components";

export const ResponseContainer = styled.div`
  height: 100%;
  padding: 10px;
  position: relative;
  display: block;
  overflow: auto;

  ${({ theme, imageUrl, direction, choiceWidth, imageOptions = { width: 0, height: 0 } }) => {
    let css = ``;
    if (imageUrl) {
      css += `
				background: url('${imageUrl}');
				background-repeat: no-repeat;
				background-size: ${imageOptions.width}px ${imageOptions.height}px;
				background-position: ${imageOptions.x}px ${imageOptions.y}px;
				zoom: ${theme.widgets.classification.imageZoom}
      `;
    } else {
      css += `
				background: inherit;
			`;
    }
    if (direction === "row" || direction === "row-reverse") {
      css += `
				width: calc(100% - ${choiceWidth + 16}px);
			`;
    } else {
      css += `
				width: 100%;
			`;
    }
    return css;
  }}
`;
