import styled, { css } from 'styled-components'
import {
  greyThemeLight,
  greyThemeLighter,
  smallDesktopWidth,
} from '@edulastic/colors'

export const NoneDiv = styled.div`
  position: absolute;
  opacity: 0;
`

export const BackgroundStyleWrapper = styled.div.attrs({
  className: 'froala-wrapper',
})`
  position: relative;
  width: 100%;
  display: block;
  font-size: ${(props) => props.fontSize || props.theme.fontSize};
  .fr-box.fr-basic .fr-wrapper {
    background: ${(props) => props.backgroundColor || 'rgb(255, 255, 255)'};
  }
  @media (max-width: ${smallDesktopWidth}) {
    font-size: 13px;
  }

  .fr-counter {
    display: none !important;
  }
  .fr-wrapper {
    ${({ centerContent }) => {
      if (centerContent) {
        return `.fr-element p,
	  &.show-placeholder .fr-placeholder{
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		overflow-wrap: break-word;
		img{
		  margin:auto;
		  display:block;
		}
	  }        
	  `
      }
    }}
    .fr-view {
      > p {
        padding: 0px !important;
        text-indent: 0pt !important;
      }
    }
  }

  ${({ border }) => {
    if (border === 'border') {
      return `
	  .fr {
		&-box {
		  background: ${greyThemeLighter};
		  min-height: 102px;
		  border-radius: 2px;
		  border: 1px solid ${greyThemeLight};
		  display: flex;
		}
		&-wrapper {
		  width: 100%;
		  min-height: 100%;
		  display: flex;
		}
		&-view {
		  width: 100%;
		  min-height: 100%;
		  padding: 8px 14px;
		  overflow: auto;
		}
	  }
	`
    }
    /**
     * need to show scroll if math content overflows
     * @see https://snapwiz.atlassian.net/browse/EV-10575
     */
    return `
	.fr-box {
		max-width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	  }
	`
  }}

  ${({ editorHeight }) => {
    if (editorHeight > 40) {
      return `
	  .fr {
		&-box {
		  height: ${editorHeight}px;
		  overflow-x: auto;
		  overflow-y: hidden;
		}
	  }
	`
    }
  }}

${({ unsetMaxWidth }) => {
    if (unsetMaxWidth) {
      return `
	  &.migrated-question {
		max-width: unset !important;
	  }
	`
    }
  }}
`

const toolbarInlineStyle = css`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 100%;
  z-index: 997;
`

export const ToolbarContainer = styled.div`
  ${({ toolbarInline }) => toolbarInline && toolbarInlineStyle}
  .fr-toolbar .fr-command.fr-btn {
    margin: 0 2px !important;
  }

  .fr-toolbar.fr-top {
    border-radius: 2px !important;
    border: 1px solid #cccccc !important;
    left: 0 !important;
    top: 0 !important;
  }
`

// if (border === "border") {
export const Placeholder = styled.div.attrs({
  className: 'froala-placeholder',
})`
  position: absolute;
  top: ${(props) =>
    `${
      (props.border === 'border' ? 20 : 0) + (props.toolbarExpanded ? 50 : 0)
    }px`};
  left: ${(props) => (props.border === 'border' ? '23px' : 0)};
  right: 0;
  opacity: 0.7;
  color: #cccccc;
  z-index: 1;
`
