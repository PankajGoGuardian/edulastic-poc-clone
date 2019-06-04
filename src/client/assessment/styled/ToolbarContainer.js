import styled from "styled-components";

export const ToolbarContainer = styled.div.attrs({
  className: "froala-toolbar-container",
  toolbarId: props => props.toolbarId
})`
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  z-index: 1000;

  .fr-toolbar .fr-command.fr-btn {
    margin: 0 2px !important;
  }

  .fr-toolbar.fr-top {
    border-radius: 2px !important;
    border: 1px solid #cccccc !important;
  }
`;
