import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: ${props => props.position};
  z-index: ${props => props.zIndex};
  right: ${props => (props.showPublishButton ? "208px" : "101px")};
  top: 13px;
`;

export const HeaderActionButton = styled.div``;

export const PreviewBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  position: relative;

  .ant-btn {
    margin-left: 5px;

    span {
      font-size: 0;
      margin: 0;
    }
  }
`;

export const LabelText = styled.label`
  font-size: 10px;
  cursor: pointer;
  margin-left: 5px;
`;
