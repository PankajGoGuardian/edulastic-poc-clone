import styled from "styled-components";

export const MigratedQuestion = styled.div.attrs({
  className: "mig"
})`
  display: inline-flex;
  /* width: 100%; */
  height: 100%;
  align-items: center;

  pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    word-break: break-all;
    word-wrap: break-word;
    color: #333;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  del {
    background-color: #ffc6c6;
  }
  table thead td {
    border-bottom: 3px solid #000 !important;
    font-weight: bold !important;
  }
`;
