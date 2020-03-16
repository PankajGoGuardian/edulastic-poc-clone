import styled from "styled-components";

export const ResponseContainer = styled.div`
  height: 100%;
  padding: 10px;
  position: relative;
  display: block;

  ${({ theme, imageUrl, direction, imageOptions = { width: 0, height: 0 }, disableResponse }) => {
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

    if ((direction === "row" || direction === "row-reverse") && !disableResponse) {
      // showing the choices container and container is horizontally aligned
      css += `
          width: auto;
        `;
    } else if (disableResponse) {
      css += `
          width: auto;
        `;
    } else {
      // not showing the choices container or container is at top/bottom
      // it should take up 100% of parent's width
      css += `
				width: 100%;
			`;
    }
    return css;
  }}
`;
