import styled from "styled-components";

export const PrintPreviewBack = styled.div`
  width: 100%;
  background-color: #cccccc;
  display: block;
`;

export const PrintPreviewContainer = styled.div`
  padding: 0;
  width: 25cm;
  min-height: 29.7cm;
  margin: 0 auto;
  background-color: #fff;
  height: "";
  font-variant: normal !important;
  pointer-events: none;

  * {
    font-variant: normal !important;
    -webkit-print-color-adjust: exact !important;
  }

  .sc-ellAub {
    page-break-inside: avoid;
  }

  textarea.ant-input {
    display: none;
  }

  input[type="text"] {
    pointer-events: none;
  }

  .ant-card {
    max-width: 40%;
  }
  .question-wrapper {
    width: calc(100% - 10px)!important;
    max-width: 100%!important;
    padding: 35px 0;
  }
  .print-preview-score {
    width: 120px;
  }
  .drag-drop-values {
    width: 100px;
  }
  @page {
    margin-left: 0;
    margin-right: 0;
  }
  .graph-wrapper, .test-item-preview {
    overflow: unset!important;
  }
`;

export const StyledTitle = styled.p`
  font-size: 30px;
  text-align: left;
  font-weight: normal;
  padding: 15px 0 0 25px;
  margin: 0;
`;

export const PagePrinterHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 15px 25px 15px 25px;
`;

export const TestInfo = styled.div``;

export const InfoItem = styled.p`
  font-size: 1em;
  font-weight: bold;
`;

export const Color = styled.span`
  color: #58b294;
`;
